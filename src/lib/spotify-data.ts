// Spotify data — redesigned with real UX improvements.
// Key changes from research:
// - Simplified playlist set (less clutter, max 6 per shelf)
// - Added sort/filter metadata for search
// - Added "Fresh Finds" shelf (rotates weekly, not recycled)

export type Track = {
  id: string; title: string; artist: string; artistId: string;
  album: string; albumId: string; cover: string; durationSec: number;
  genre: string; mood: string; decade: string;
};

export type Playlist = {
  id: string; title: string; description: string; cover: string;
  owner: string; tracks: string[]; type: 'editorial' | 'personal' | 'fresh';
};

export type Artist = {
  id: string; name: string; cover: string; bio: string;
  monthlyListeners: string; topTrackIds: string[];
};

export type SortOption = 'relevance' | 'recent' | 'popularity' | 'duration';

const cover = (seed: string, size = 400) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/${size}/${size}`;

export const tracks: Track[] = [
  { id: 't1', title: 'Midnight Drive', artist: 'Lunar Echo', artistId: 'ar1', album: 'Neon Atlas', albumId: 'al1', cover: cover('midnight-drive'), durationSec: 224, genre: 'Electronic', mood: 'Energetic', decade: '2020s' },
  { id: 't2', title: 'Velvet Skyline', artist: 'Lunar Echo', artistId: 'ar1', album: 'Neon Atlas', albumId: 'al1', cover: cover('velvet-skyline'), durationSec: 198, genre: 'Electronic', mood: 'Chill', decade: '2020s' },
  { id: 't3', title: 'Paper Planes', artist: 'Aria Vale', artistId: 'ar2', album: 'Paperweight', albumId: 'al2', cover: cover('paper-planes'), durationSec: 211, genre: 'Indie', mood: 'Melancholic', decade: '2020s' },
  { id: 't4', title: 'Glasshouse', artist: 'Aria Vale', artistId: 'ar2', album: 'Paperweight', albumId: 'al2', cover: cover('glasshouse'), durationSec: 245, genre: 'Indie', mood: 'Reflective', decade: '2020s' },
  { id: 't5', title: 'Tidal', artist: 'The Coastline', artistId: 'ar3', album: 'Saltwater', albumId: 'al3', cover: cover('tidal'), durationSec: 263, genre: 'Rock', mood: 'Energetic', decade: '2020s' },
  { id: 't6', title: 'Harbor Lights', artist: 'The Coastline', artistId: 'ar3', album: 'Saltwater', albumId: 'al3', cover: cover('harbor-lights'), durationSec: 201, genre: 'Rock', mood: 'Chill', decade: '2020s' },
  { id: 't7', title: 'After Hours', artist: 'Mara Bloom', artistId: 'ar4', album: 'Nightshift', albumId: 'al4', cover: cover('after-hours'), durationSec: 192, genre: 'Electronic', mood: 'Dark', decade: '2020s' },
  { id: 't8', title: 'Neon Vandal', artist: 'Mara Bloom', artistId: 'ar4', album: 'Nightshift', albumId: 'al4', cover: cover('neon-vandal'), durationSec: 178, genre: 'Electronic', mood: 'Energetic', decade: '2020s' },
  { id: 't9', title: 'Echo Park', artist: 'Saint Monday', artistId: 'ar5', album: 'Long Way Home', albumId: 'al5', cover: cover('echo-park'), durationSec: 220, genre: 'Indie', mood: 'Reflective', decade: '2010s' },
  { id: 't10', title: 'Cassette Sun', artist: 'Honeyforest', artistId: 'ar6', album: 'Glow', albumId: 'al6', cover: cover('cassette-sun'), durationSec: 195, genre: 'Lo-fi', mood: 'Chill', decade: '2020s' },
  { id: 't11', title: 'Saturn Rings', artist: 'Atlas Park', artistId: 'ar7', album: 'OuterBounds', albumId: 'al7', cover: cover('saturn-rings'), durationSec: 224, genre: 'Electronic', mood: 'Dark', decade: '2020s' },
  { id: 't12', title: 'Telegraph Hill', artist: 'Ola Norr', artistId: 'ar8', album: 'Coastal', albumId: 'al8', cover: cover('telegraph-hill'), durationSec: 213, genre: 'Folk', mood: 'Reflective', decade: '2010s' },
];

export const artists: Artist[] = [
  { id: 'ar1', name: 'Lunar Echo', cover: cover('lunar-echo-portrait', 400), bio: 'Dream-pop duo from the rainy coast.', monthlyListeners: '1.2M', topTrackIds: ['t1','t2'] },
  { id: 'ar2', name: 'Aria Vale', cover: cover('aria-vale-portrait', 400), bio: 'Singer-songwriter. Quiet songs about loud feelings.', monthlyListeners: '3.0M', topTrackIds: ['t3','t4'] },
  { id: 'ar3', name: 'The Coastline', cover: cover('coastline-portrait', 400), bio: 'Four-piece that writes about water.', monthlyListeners: '2.5M', topTrackIds: ['t5','t6'] },
  { id: 'ar4', name: 'Mara Bloom', cover: cover('mara-bloom-portrait', 400), bio: 'Producer, vocalist, lighting designer.', monthlyListeners: '4.8M', topTrackIds: ['t7','t8'] },
  { id: 'ar5', name: 'Saint Monday', cover: cover('saint-monday-portrait', 400), bio: 'Three siblings, one van, many songs.', monthlyListeners: '1.9M', topTrackIds: ['t9'] },
  { id: 'ar6', name: 'Honeyforest', cover: cover('honeyforest-portrait', 400), bio: 'Lo-fi bedroom producer from the hills.', monthlyListeners: '2.0M', topTrackIds: ['t10'] },
];

export const artistMap: Record<string, Artist> = Object.fromEntries(artists.map((a) => [a.id, a]));
export const trackMap: Record<string, Track> = Object.fromEntries(tracks.map((t) => [t.id, t]));

export const playlists: Playlist[] = [
  { id: 'p1', title: "Today's Top Hits", description: 'The biggest songs right now.', cover: cover('todays-top-hits', 600), owner: 'Spotify', tracks: ['t3','t1','t7','t9','t10','t11'], type: 'editorial' },
  { id: 'p2', title: 'Chill Vibes', description: 'Loose and mellow tracks.', cover: cover('chill-vibes', 600), owner: 'Spotify', tracks: ['t2','t10','t12'], type: 'editorial' },
  { id: 'p3', title: 'Fresh Finds', description: 'Updated weekly. New discoveries, not recycled.', cover: cover('fresh-finds', 600), owner: 'Spotify', tracks: ['t11','t4','t8','t12'], type: 'fresh' },
  { id: 'p4', title: 'Indie Folk', description: 'Acoustic guitars and distant campfires.', cover: cover('indie-folk', 600), owner: 'Spotify', tracks: ['t9','t12','t3'], type: 'editorial' },
  { id: 'p5', title: 'Late Night Drive', description: 'Synth anthems after midnight.', cover: cover('late-night-drive', 600), owner: 'Spotify', tracks: ['t1','t7','t11','t8'], type: 'editorial' },
  { id: 'p6', title: 'Discover Weekly', description: 'Your weekly mixtape.', cover: cover('discover-weekly', 600), owner: 'Spotify', tracks: ['t2','t5','t10','t4'], type: 'personal' },
];

export const playlistMap: Record<string, Playlist> = Object.fromEntries(playlists.map((p) => [p.id, p]));

export const genres = ['All', 'Electronic', 'Indie', 'Rock', 'Lo-fi', 'Folk'];
export const moods = ['All', 'Energetic', 'Chill', 'Dark', 'Reflective', 'Melancholic'];
export const decades = ['All', '2020s', '2010s'];

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60); const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
