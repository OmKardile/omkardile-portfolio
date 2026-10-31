// AskOmkar — bank assembly.
//
// Combines two sources into the single FAQ bank the widget serves:
//   1. Derived entries — one per project in src/data/site.ts, generated here
//      so a project's answer can never drift from what the site publishes.
//   2. Hand-written entries — src/data/askomkar/hand.ts (the stories, the HR
//      classics, the meta entries about the bot itself).
//
// The embed script (scripts/askomkar-embed.ts) imports THIS file through tsx,
// so whatever ships in vectors.json is exactly what the widget serves.

import { projects } from '../site';
import { hand, type FaqEntry, type FaqLink } from './hand';

export type { FaqEntry, FaqLink };

const statusLabel = (s: 'live' | 'building') => (s === 'live' ? 'live' : 'in development');

/** "SSShopee — Retail ERP + Storefront" → "SSShopee"; "HandOff" → "HandOff". */
const shortName = (title: string) => title.split(' — ')[0];

/** One entry per site project, phrased and linked from the site's own data. */
const derived: FaqEntry[] = projects.map((p) => {
  const short = shortName(p.title);
  const links: FaqLink[] | undefined = p.links?.map(({ href, label, note }) => ({ href, label, note }));
  return {
    id: `proj-${p.slug}`,
    q: [
      `tell me about ${short}`,
      `what is ${short}?`,
      `how did Omkar build ${short}?`,
      `${short} project`,
      // Turned (passive / inverted) forms of the same questions — visitors ask
      // "what was X built with", not only "what did he build X with".
      `what does ${short} do?`,
      `how was ${short} built?`,
      `what was ${short} built with?`,
    ],
    a: `**${p.title}** — ${p.kind}, ${p.year}, ${statusLabel(p.status)}.\n\n${p.summary}\n\nStack: ${p.stack}.`,
    links,
  };
});

export const faqBank: FaqEntry[] = [...derived, ...hand];

/** Suggested-question chips: these map straight to entry ids — clicking one
    answers instantly, before the embedding model even finishes loading. */
export const suggestedIds = [
  'strongest-stack',
  'tell-me-about',
  'open-to-work',
  'ssshopee-deep',
  'design-process',
  'contact-hire',
];

/** Chip label = the entry's first phrasing, capitalized. */
export const chipLabel = (e: FaqEntry) => e.q[0].charAt(0).toUpperCase() + e.q[0].slice(1);
