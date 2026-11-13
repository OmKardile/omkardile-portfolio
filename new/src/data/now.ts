/* /now's personal sections — the rotation, the shelf, the sharpening.
   The page reads everything from this module, so keeping /now honest is a
   one-file edit: swap the entries when the rotation changes, and the
   "Updated" stamp on the page is the date that vouches for them.

   The listening entries below are the November 2026 rotation. */

export type Track = { title: string; artist: string; note: string };
export type Book = { title: string; author: string; note: string };
export type Topic = { topic: string; note: string };
export type NowPlaying = Track & { status: 'playing' | 'paused' };
export type PlaylistLink = { name: string; platform: string; href: string; note: string };

/** The track with the status dot right now — status is 'playing' for the
    green dot + NOW PLAYING label, 'paused' for the hollow ring + PAUSED. */
export const nowPlaying: NowPlaying = {
  title: 'cold/mess',
  artist: 'Prateek Kuhad',
  note: 'the late-night build soundtrack',
  status: 'playing',
};

/** The proper playlists — links verified live before shipping. */
export const playlists: PlaylistLink[] = [
  {
    name: "Vibin' in Classroom",
    platform: 'Apple Music',
    href: 'https://music.apple.com/in/playlist/vibin-in-classroom/pl.u-aZb0N5vC17LZqva',
    note: '69 tracks · embedded below',
  },
  {
    name: '🎶🎧📺 mixtape',
    platform: 'YouTube Music',
    href: 'https://music.youtube.com/playlist?list=PLObPPiklR9no',
    note: 'the other tab',
  },
];

/** The Apple Music embed of the first playlist, as shared. */
export const appleMusicEmbed =
  'https://embed.music.apple.com/in/playlist/vibin-in-classroom/pl.u-aZb0N5vC17LZqva';

/** The current rotation, roughly in order of plays. */
export const playlist: Track[] = [
  { title: 'Holocene', artist: 'Bon Iver', note: 'for the long render waits' },
  { title: 'The Less I Know the Better', artist: 'Tame Impala', note: 'UI polish pace' },
  { title: 'Alright', artist: 'Kendrick Lamar', note: 'deadline fuel' },
  { title: 'Something About Us', artist: 'Daft Punk', note: 'slow commits, deep focus' },
  { title: 'Space Song', artist: 'Beach House', note: 'cleanup and changelogs' },
];

/** Off the clock — the shelf. */
export const reading: Book[] = [
  { title: 'The Design of Everyday Things', author: 'Don Norman', note: 'the classic, re-read' },
  { title: 'Refactoring UI', author: 'Wathan & Schoger', note: 'the practical half of the job' },
  { title: 'Shape Up', author: 'Ryan Singer', note: 'how to size the bench' },
];

/** What is being sharpened next. */
export const learning: Topic[] = [
  { topic: 'WebGL & GLSL shaders', note: 'the wave hero opened the door' },
  { topic: 'Variable font axes', note: "Archivo's wdth as a design material" },
];

/* The ledger — an udhar book for my own promises, in the spirit of the one
   SSShopee built for a real shop. Two pages: OWED holds open promises with
   the date each was logged; SETTLED holds closed ones, stamped with the
   version in the CHANGELOG that closed them (corrections included — the
   times the site itself was wrong and got fixed count double).

   The honesty contract, enforced by scripts/verify-ledger.py:
   - at most FIVE open entries — a stale ledger is worse than none;
   - every `logged` date is a real ISO date;
   - every `closedIn` stamp must exist as a `## [version]` heading in the
     CHANGELOG, or the verifier fails the build;
   - closed entries don't get deleted: they are the receipts. */

export type LedgerOwed = { item: string; detail: string; logged: string };
export type LedgerSettled = {
  item: string;
  detail: string;
  closedIn: string;
  kind: 'promise' | 'correction';
};

/** Open promises — five lines, maximum. */
export const ledgerOwed: LedgerOwed[] = [
  {
    item: 'Sutra usability test, five people',
    detail:
      'real sessions, findings on the case study — retires the "· learning" mark on the research chips',
    logged: '2026-11-10',
  },
  {
    item: 'Resume cut to one page',
    detail:
      '/resume.pdf runs six pages — a 1–2 page cut replaces it, because six pages reads as padding',
    logged: '2026-11-11',
  },
  {
    item: 'Figma view-links on the case studies',
    detail: 'the high-fidelity wires, linkable frame by frame, next to the live prototypes',
    logged: '2026-11-13',
  },
  {
    item: 'SSShopee + PatelNetworks card screenshots',
    detail:
      'the two work items with no pictures — real screens, with customer names, phones and udhar balances blurred or seeded first',
    logged: '2026-11-11',
  },
  {
    item: 'Liquid Glass apps: rehost or retire',
    detail:
      'the interactive apps live in the old codebase and the site says so — either they get the new home or the entries are written off, not left hanging',
    logged: '2026-11-10',
  },
];

/** Settled — promises kept and corrections made, each stamp a real version. */
export const ledgerSettled: LedgerSettled[] = [
  {
    item: 'The colophon said 82 answers; /library said 72',
    detail:
      'both were real numbers describing different banks — the colophon now imports the bank and renders the split (82 = 72 hand-written + 10 derived), so the pages cannot drift again',
    closedIn: '1.5.4',
    kind: 'correction',
  },
  {
    item: 'The library count leaned on a fork',
    detail:
      'the FMHY mirror was 186 of the 423 markdown docs — the fork left the index and the stats line computes honestly: 7 of 29 public repos · 237 documents',
    closedIn: '1.5.4',
    kind: 'correction',
  },
  {
    item: 'The assistant claimed things the site does not say',
    detail:
      '"five complete case studies" when /uiux publishes three written ones — every pre-written answer reworded to what the site actually publishes',
    closedIn: '1.4.5',
    kind: 'correction',
  },
  {
    item: 'The prototypes lived behind a separate deploy',
    detail: 'Taar and Sutra now embed live on their case studies, chrome-free, no second URL',
    closedIn: '1.5.4',
    kind: 'promise',
  },
  {
    item: 'AskOmkar downloaded ~23 MB just by opening',
    detail:
      'opening the drawer is free; the model warms only when you actually ask — and never on a metered connection',
    closedIn: '1.5.4',
    kind: 'promise',
  },
  {
    item: 'Hover states went stale under inertial scroll',
    detail:
      'the View chip and hints stayed painted over content that had scrolled away — every state now re-derives per frame from one hit test',
    closedIn: '1.4.6',
    kind: 'promise',
  },
  {
    item: 'The native pointer popped back over global chrome',
    detail: 'the custom cursor replaced it on every route, hints riding beside the pointer',
    closedIn: '1.4.6',
    kind: 'promise',
  },
  {
    item: 'The cursor edges stair-stepped',
    detail:
      'the ink dot and the wireframe ring raster at twice their visual size and scale back down — smooth at every fractional offset, geometry unchanged',
    closedIn: '1.5.5',
    kind: 'promise',
  },
];
