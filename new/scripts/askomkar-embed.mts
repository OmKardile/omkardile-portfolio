// AskOmkar — build-time embedder.
//
// Embeds every phrasing in the FAQ bank with the SAME model the browser uses
// (Xenova/all-MiniLM-L6-v2) and writes src/data/askomkar/vectors.json, which
// is committed. At runtime the widget only has to embed the visitor's question
// and take cosine similarities — the bank itself never re-embeds.
//
// Run:  npm run embed:askomkar
// Re-run whenever any `q` phrasing in the bank changes.

import { pipeline } from '@xenova/transformers';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { faqBank } from '../src/data/askomkar/bank';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(here, '../src/data/askomkar/vectors.json');

const MODEL = 'Xenova/all-MiniLM-L6-v2';

console.log(`Embedding ${faqBank.length} entries…`);
const extractor = await pipeline('feature-extraction', MODEL);

let count = 0;
const entries: { id: string; vectors: number[][] }[] = [];
for (const e of faqBank) {
  const vectors: number[][] = [];
  for (const text of e.q) {
    const out = await extractor(text, { pooling: 'mean', normalize: true });
    // Round to 5 decimals — keeps the JSON compact, error is negligible for cosine.
    vectors.push(Array.from(out.data as Float32Array, (v) => Math.round(v * 1e5) / 1e5));
    count++;
  }
  entries.push({ id: e.id, vectors });
}

const payload = { model: MODEL, dim: 384, entries };
writeFileSync(OUT, JSON.stringify(payload));
console.log(`Wrote ${count} vectors for ${entries.length} entries → ${path.relative(process.cwd(), OUT)}`);

// ---- Calibration samples: print top matches for realistic recruiter questions
// so match thresholds in src/lib/askomkar/matcher.ts stay honest. ----
const byId = new Map(faqBank.map((e) => [e.id, e]));
const allVecs: { id: string; v: number[] }[] = entries.flatMap((en) => en.vectors.map((v) => ({ id: en.id, v })));
const cosine = (a: number[], b: number[]) => {
  let d = 0;
  for (let i = 0; i < a.length; i++) d += a[i] * b[i];
  return d;
};

const samples = [
  "What's his strongest stack?",
  'Does he know Prisma?',
  'Tell me about the retail ERP',
  'Has he done real client work?',
  'How did he win the Patel client?',
  'Is PatelNetworks a real project or a demo?',
  'Is he open to relocation?',
  'What are his salary expectations?',
  'Do you store my questions?',
  'Why should we hire him?',
  'what is the checkout case study about',
  'does he build android apps',
  'how much experience does he have',
  'can you roast omkar', // adversarial — should NOT match anything well
  "what's his favourite ice cream", // nonsense — should fall back
];

console.log('\nCalibration:');
for (const s of samples) {
  const qv = Array.from((await extractor(s, { pooling: 'mean', normalize: true })).data as Float32Array);
  const scored = allVecs
    .map(({ id, v }) => ({ id, score: cosine(qv, v) }))
    .reduce<{ id: string; score: number }[]>((acc, x) => {
      const prev = acc.find((a) => a.id === x.id);
      if (!prev) acc.push(x);
      else if (x.score > prev.score) prev.score = x.score;
      return acc;
    }, [])
    .sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 3).map((x) => `${x.id}:${x.score.toFixed(3)}`).join('  ');
  console.log(`  "${s}"\n    → ${top}  [${byId.get(scored[0].id)?.q[0]}]`);
}
