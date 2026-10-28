'use client';
import { create } from 'zustand';
import type { Track, Playlist } from '@/lib/spotify-data';
import { tracks as allTracks, playlists } from '@/lib/spotify-data';

type View = 'home' | 'search' | 'library' | 'playlist' | 'artist' | 'liked';
type SortOption = 'relevance' | 'recent' | 'popularity' | 'duration';
type Filter = { genre: string; mood: string; decade: string; sort: SortOption };

type SpotifyState = {
  view: View; history: View[];
  go: (v: View) => void; back: () => void;
  activePlaylistId: string | null;
  openPlaylist: (id: string) => void;
  activeArtistId: string | null;
  openArtist: (id: string) => void;
  // Playback
  queue: Track[]; idx: number; isPlaying: boolean; progressSec: number;
  volume: number; shuffle: boolean; repeat: 'off' | 'all' | 'one';
  togglePlay: () => void; next: () => void; prev: () => void;
  seek: (s: number) => void; setVolume: (v: number) => void;
  playPlaylist: (p: Playlist, startId?: string) => void;
  playArtist: (id: string, startId?: string) => void;
  playTrack: (t: Track) => void;
  toggleShuffle: () => void; cycleRepeat: () => void; tick: () => void;
  currentTrack: () => Track | null;
  // Search — THE UX IMPROVEMENT: sorting + filtering
  searchQuery: string; setSearchQuery: (q: string) => void;
  filter: Filter; setFilter: (f: Partial<Filter>) => void; clearFilters: () => void;
  // Liked
  likedIds: string[]; toggleLike: (id: string) => void;
  // Queue visibility — THE UX IMPROVEMENT: always-visible queue with clear
  queueVisible: boolean; toggleQueue: () => void; clearQueue: () => void;
  // Recent
  recentIds: string[]; pushRecent: (id: string) => void;
  // Toasts
  toasts: { id: string; message: string }[];
  toast: (m: string) => void; dismissToast: (id: string) => void;
};

export const useSpotify = create<SpotifyState>((set, get) => ({
  view: 'home', history: [],
  go: (v) => { const c = get().view; if (c !== v) set({ view: v, history: [...get().history, c].slice(-30) }); },
  back: () => { const h = [...get().history]; if (h.length) { const p = h.pop()!; set({ view: p, history: h }); } },
  activePlaylistId: null, openPlaylist: (id) => set({ activePlaylistId: id, view: 'playlist' }),
  activeArtistId: null, openArtist: (id) => set({ activeArtistId: id, view: 'artist' }),

  queue: [], idx: 0, isPlaying: false, progressSec: 0, volume: 0.7, shuffle: false, repeat: 'off',
  togglePlay: () => { if (!get().queue.length) { const firstPlaylist = playlists[0]; if (firstPlaylist) get().playPlaylist(firstPlaylist); return; } set({ isPlaying: !get().isPlaying }); },
  next: () => { const { queue, idx, repeat } = get(); if (!queue.length) return; if (repeat === 'one') { set({ progressSec: 0, isPlaying: true }); return; } let n = idx + 1; if (n >= queue.length) { if (repeat === 'all') n = 0; else { set({ isPlaying: false }); return; } } set({ idx: n, progressSec: 0, isPlaying: true }); if (queue[n]) get().pushRecent(queue[n].id); },
  prev: () => { const { progressSec, idx } = get(); if (progressSec > 3) { set({ progressSec: 0 }); return; } set({ idx: Math.max(0, idx - 1), progressSec: 0, isPlaying: true }); },
  seek: (s) => set({ progressSec: Math.max(0, s) }),
  setVolume: (v) => set({ volume: Math.max(0, Math.min(1, v)) }),
  playPlaylist: (p, startId) => { let q = p.tracks.map(id => allTracks.find(t => t.id === id)!).filter(Boolean); if (!q.length) return; let i = 0; if (startId) { const f = q.findIndex(t => t.id === startId); if (f >= 0) i = f; } set({ queue: q, idx: i, isPlaying: true, progressSec: 0 }); if (q[i]) get().pushRecent(q[i].id); },
  playArtist: (id, startId) => { let q = allTracks.filter(t => t.artistId === id); if (!q.length) return; let i = 0; if (startId) { const f = q.findIndex(t => t.id === startId); if (f >= 0) i = f; } set({ queue: q, idx: i, isPlaying: true, progressSec: 0 }); if (q[i]) get().pushRecent(q[i].id); },
  playTrack: (t) => { set({ queue: [t], idx: 0, isPlaying: true, progressSec: 0 }); get().pushRecent(t.id); },
  toggleShuffle: () => set({ shuffle: !get().shuffle }),
  cycleRepeat: () => { const o = ['off','all','one'] as const; set({ repeat: o[(o.indexOf(get().repeat) + 1) % 3] }); },
  tick: () => { const { isPlaying, queue, idx, progressSec, repeat } = get(); if (!isPlaying) return; const t = queue[idx]; if (!t) return; const n = progressSec + 1; if (n >= t.durationSec) { if (repeat === 'one') set({ progressSec: 0, isPlaying: true }); else get().next(); } else set({ progressSec: n }); },
  currentTrack: () => { const { queue, idx } = get(); return queue[idx] ?? null; },

  searchQuery: '', setSearchQuery: (q) => set({ searchQuery: q }),
  filter: { genre: 'All', mood: 'All', decade: 'All', sort: 'relevance' },
  setFilter: (f) => set({ filter: { ...get().filter, ...f } }),
  clearFilters: () => set({ filter: { genre: 'All', mood: 'All', decade: 'All', sort: 'relevance' }, searchQuery: '' }),

  likedIds: [], toggleLike: (id) => { const l = get().likedIds; set({ likedIds: l.includes(id) ? l.filter(x => x !== id) : [id, ...l] }); get().toast(l.includes(id) ? 'Removed from Liked' : 'Added to Liked'); },

  queueVisible: false, toggleQueue: () => set({ queueVisible: !get().queueVisible }), clearQueue: () => set({ queue: [], idx: 0, isPlaying: false, progressSec: 0, queueVisible: false }),

  recentIds: [], pushRecent: (id) => { const r = get().recentIds.filter(x => x !== id); set({ recentIds: [id, ...r].slice(0, 8) }); },

  toasts: [], toast: (m) => { const id = `t-${Date.now()}-${Math.random().toString(36).slice(2,6)}`; set({ toasts: [...get().toasts, { id, message: m }] }); setTimeout(() => get().dismissToast(id), 3000); },
  dismissToast: (id) => set({ toasts: get().toasts.filter(t => t.id !== id) }),
}));
