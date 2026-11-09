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
