// AskOmkar — matching.
//
// Two rankers, one contract:
//   - rankByVector: cosine similarity between the visitor's question vector
//         (computed in-browser) and the build-time bank vectors. Primary path.
//   - rankByKeywords: token-overlap scorer used only if the embedding model
//     fails to load (offline, CDN blocked). Weaker, but never silent.
//
// Tiers are calibrated against scripts/askomkar-audit.mts (a battery of
// clean, ambiguous and adversarial questions run through the real model):
// clean hits score ≥ 0.70, the strongest wrong answer in the battery sits
// at 0.65, and recruiter questions that two bank entries both answer land
// within 0.03 of each other. Three guards keep wrong answers from being
// spoken with confidence:
//   - DIRECT_THRESHOLD 0.66 — above the strongest wrong answer (0.65),
//     below the weakest clean hit (0.70); the old 0.62 answered three
//     adversarial questions outright.
//   - TIE_MARGIN — when the top two entries finish within 0.05 of each
//     other the question is ambiguous, so the best guess is demoted to
//     "related" (same answer, plus the honest caption and alternative
//     chips) instead of a confident single pick.
//   - keyword single-token cap — on the fallback ranker one shared token
//     with a phrasing scores 1.0 ("weather" once answered a weather
//     question with the Aether project, confidently). A direct verdict
//     there now requires ≥ 2 distinct phrasing tokens; anything weaker
//     degrades to "related", which still answers but with the caption.

import { faqBank, type FaqEntry } from '@/data/askomkar/bank';

export type VectorsFile = {
  model: string;
  dim: number;
  entries: { id: string; vectors: number[][] }[];
};

export const DIRECT_THRESHOLD = 0.66;
export const RELATED_THRESHOLD = 0.45;
export const TIE_MARGIN = 0.05;

export type Candidate = { entry: FaqEntry; score: number };

export type MatchResult = {
  tier: 'direct' | 'related' | 'fallback';
  best: Candidate;
  /** Next-best entries (≤ 3), offered as chips when the match is not direct. */
  alternatives: Candidate[];
};

const byId = new Map(faqBank.map((e) => [e.id, e]));

function cosine(a: number[], b: number[]) {
  let d = 0;
  for (let i = 0; i < a.length; i++) d += a[i] * b[i];
  return d;
}

/** `directHits`: how many distinct phrasing tokens backed the best keyword
 *  candidate — a single shared word must never earn a confident verdict. */
function finish(cands: Candidate[], directHits = Infinity): MatchResult {
  const ranked = cands.sort((x, y) => y.score - x.score);
  const best = ranked[0] ?? { entry: faqBank[0], score: 0 };
  const second = ranked[1]?.score ?? 0;
  let tier: MatchResult['tier'] =
    best.score >= DIRECT_THRESHOLD ? 'direct' : best.score >= RELATED_THRESHOLD ? 'related' : 'fallback';
  // A near-tie means the question sits between two answers — say so instead
  // of picking one with confidence (the answer text is unchanged; it just
  // gains the honest caption and the runner-up chips).
  if (tier === 'direct' && (best.score - second < TIE_MARGIN || directHits < 2)) tier = 'related';
  return { tier, best, alternatives: ranked.slice(1, 4) };
}

export function rankByVector(qvec: number[], vectors: VectorsFile): MatchResult {
  const bestPerEntry = new Map<string, number>();
  for (const { id, vectors: vecs } of vectors.entries) {
    let m = 0;
    for (const v of vecs) {
      const s = cosine(qvec, v);
      if (s > m) m = s;
    }
    bestPerEntry.set(id, m);
  }
  const cands: Candidate[] = [];
  for (const [id, score] of bestPerEntry) {
    const entry = byId.get(id);
    if (entry) cands.push({ entry, score });
  }
  return finish(cands);
}

// ---------- Keyword fallback ----------

const STOP = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'am', 'do', 'does', 'did',
  'has', 'have', 'had', 'he', 'him', 'his', 'omkar', 'who', 'what', 'how', 'why', 'when', 'where',
  'can', 'could', 'would', 'should', 'will', 'i', 'you', 'your', 'my', 'me', 'we', 'of', 'to',
  'in', 'on', 'for', 'with', 'about', 'and', 'or', 'it', 'this', 'that', 'tell', 'know', 'want',
  'done', 'get', 'got',
]);

const tokenize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s+#.-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map(stem);

/** Light morphological folding — the keyword fallback has no embeddings to
 *  bridge inflected forms, so "rates" must meet "rate", "shipped" must meet
 *  "ship", "companies" must meet "company". Applied identically to query,
 *  phrasing and answer tokens (see tokenize) so both sides land in the same
 *  space. Conservative on purpose: no suffix is stripped that could change a
 *  tech noun ("supabase", "express", "ios" survive untouched). */
function stem(t: string): string {
  if (t.length > 4 && t.endsWith('ies')) return `${t.slice(0, -3)}y`; // companies → company
  if (t.length > 5 && t.endsWith('ing')) {
    const s = t.slice(0, -3);
    return s.at(-1) === s.at(-2) ? s.slice(0, -1) : s; // tracking → track, shipping → ship
  }
  if (t.length > 5 && t.endsWith('ed')) {
    const s = t.slice(0, -2);
    return s.at(-1) === s.at(-2) ? s.slice(0, -1) : s; // shipped → ship
  }
  if (t.length > 3 && t.endsWith('s') && !t.endsWith('ss')) return t.slice(0, -1); // rates → rate
  return t;
}

export function rankByKeywords(query: string): MatchResult {
  const qTokens = tokenize(query);
  const qSet = new Set(qTokens);
  const cands = faqBank.map((entry) => {
    let weight = 0;
    let phraseHits = 0;
    // Phrasing hits count double — they are the intended questions. The union
    // of the entry's phrasing tokens, so a word repeated across phrasings of
    // the same entry counts once.
    const phTokens = new Set(entry.q.flatMap((ph) => tokenize(ph)));
    for (const t of qSet)
      if (phTokens.has(t)) {
        weight += 2;
        phraseHits++;
      }
    // Answer-body hits count single — rescues tech nouns ("prisma", "kotlin").
    const aTokens = new Set(tokenize(entry.a));
    for (const t of qSet) if (aTokens.has(t)) weight += 1;
    // Normalize against query length so short and long questions compare fairly.
    const score = qTokens.length ? Math.min(1, weight / (qTokens.length * 2)) : 0;
    return { entry, score, phraseHits };
  });
  // The direct-verdict gate reads the WINNER's own phrasing support — a
  // runner-up with more token hits must not launder confidence upward.
  cands.sort((a, b) => b.score - a.score);
  const bestHits = cands[0]?.phraseHits ?? 0;
  return finish(
    cands.map(({ entry, score }) => ({ entry, score })),
    bestHits,
  );
}
