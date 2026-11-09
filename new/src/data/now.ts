/* /now's personal sections — the rotation, the shelf, the sharpening.
   The page reads everything from this module, so keeping /now honest is a
   one-file edit: swap the entries when the rotation changes, and the
   "Updated" stamp on the page is the date that vouches for them.

   The listening entries below are the November 2026 rotation. */

export type Track = { title: string; artist: string; note: string };
export type Book = { title: string; author: string; note: string };
export type Topic = { topic: string; note: string };

/** The track with the green dot right now. */
export const nowPlaying: Track = {
  title: 'cold/mess',
  artist: 'Prateek Kuhad',
  note: 'the late-night build soundtrack',
};

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
