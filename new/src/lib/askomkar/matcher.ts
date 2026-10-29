// AskOmkar — matching.
//
// Two rankers, one contract:
//   - rankByVector: cosine similarity between the visitor's question vector
//     (computed in-browser) and the build-time bank vectors. Primary path.
//   - rankByKeywords: token-overlap scorer used only if the embedding model
//     fails to load (offline, CDN blocked). Weaker, but never silent.
//
// Tiers are calibrated against the sample table printed by
// scripts/askomkar-embed.mts — clean hits score ≥ 0.69, adversarial or
// unrelated input stays under ~0.62, nonsense under ~0.45.

import { faqBank, type FaqEntry } from '@/data/askomkar/bank';

export type VectorsFile = {
  model: string;
  dim: number;
  entries: { id: string; vectors: number[][] }[];
};

export const DIRECT_THRESHOLD = 0.62;
export const RELATED_THRESHOLD = 0.45;

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

function finish(cands: Candidate[]): MatchResult {
  const ranked = cands.sort((x, y) => y.score - x.score);
  const best = ranked[0] ?? { entry: faqBank[0], score: 0 };
  const tier =
    best.score >= DIRECT_THRESHOLD ? 'direct' : best.score >= RELATED_THRESHOLD ? 'related' : 'fallback';
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
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'he', 'him', 'his', 'omkar',
  'what', 'how', 'why', 'when', 'where', 'can', 'i', 'you', 'your', 'my', 'me', 'we', 'of', 'to',
  'in', 'on', 'for', 'with', 'about', 'and', 'or', 'it', 'this', 'that', 'tell', 'know', 'want',
]);

const tokenize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s+#.-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));

export function rankByKeywords(query: string): MatchResult {
  const qTokens = tokenize(query);
  const qSet = new Set(qTokens);
  const cands: Candidate[] = faqBank.map((entry) => {
    let weight = 0;
    // Phrasing hits count double — they are the intended questions.
    for (const ph of entry.q) {
      const pTokens = new Set(tokenize(ph));
      for (const t of qSet) if (pTokens.has(t)) weight += 2;
    }
    // Answer-body hits count single — rescues tech nouns ("prisma", "kotlin").
    const aTokens = new Set(tokenize(entry.a));
    for (const t of qSet) if (aTokens.has(t)) weight += 1;
    // Normalize against query length so short and long questions compare fairly.
    const score = qTokens.length ? Math.min(1, weight / (qTokens.length * 2)) : 0;
    return { entry, score };
  });
  return finish(cands);
}
