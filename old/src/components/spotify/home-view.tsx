'use client';
import { useSpotify } from '@/lib/spotify-store';
import { playlists, artists, trackMap, type Playlist } from '@/lib/spotify-data';
import { Play, Heart } from 'lucide-react';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function HomeView() {
  const playPlaylist = useSpotify((s) => s.playPlaylist);
  const playTrack = useSpotify((s) => s.playTrack);
  const recentIds = useSpotify((s) => s.recentIds);
  const likedIds = useSpotify((s) => s.likedIds);

  // UX IMPROVEMENT: max 6 items per shelf, real whitespace between shelves.
  // Research: "UI is cluttered, messy" → fix: fewer items, more breathing room.
  const quickPicks = playlists.slice(0, 6);
  const fresh = playlists.find(p => p.type === 'fresh'); // Fresh Finds — rotates
  const recent = recentIds.map(id => trackMap[id]).filter(Boolean).slice(0, 6);

  return (
    <div className="px-6 lg:px-8 py-6 max-w-[900px]">
      <h1 className="text-2xl font-bold text-[#161616] mb-6">{greeting()}</h1>

      {/* Quick picks — 2-column grid, not 3, for less visual clutter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-10">
        {quickPicks.map(p => (
          <div key={p.id} onClick={() => useSpotify.getState().openPlaylist(p.id)} className="group flex items-center gap-3 p-2 rounded-lg hover:bg-[#F0EEEA] transition-colors cursor-pointer">
            <img src={p.cover} alt="" className="h-12 w-12 rounded shrink-0 object-cover" />
            <span className="text-[13px] font-medium text-[#161616] truncate flex-1">{p.title}</span>
            <button onClick={(e) => { e.stopPropagation(); playPlaylist(p); }} className="h-9 w-9 rounded-full bg-[#1DB954] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Play size={14} className="fill-white ml-0.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Fresh Finds — THE UX IMPROVEMENT */}
      {/* Research: "recommendations feel stale" → fix: weekly rotating shelf, not recycled */}
      {fresh && (
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#161616]">Fresh Finds</h2>
              <p className="text-[12px] text-[#6B6B6B] mt-0.5">Updated weekly. New discoveries, not recycled.</p>
            </div>
            <button onClick={() => useSpotify.getState().openPlaylist(fresh.id)} className="text-[12px] text-[#6B6B6B] hover:text-[#161616]">Show all</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {fresh.tracks.slice(0, 4).map(tid => {
              const t = trackMap[tid]; if (!t) return null;
              return (
                <div key={tid} onClick={() => playTrack(t)} className="group cursor-pointer">
                  <div className="relative aspect-square mb-2">
                    <img src={t.cover} alt={t.title} className="rounded-lg w-full h-full object-cover" />
                    <button onClick={(e) => { e.stopPropagation(); playTrack(t); }} className="absolute bottom-2 right-2 h-10 w-10 rounded-full bg-[#1DB954] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                      <Play size={16} className="fill-white ml-0.5" />
                    </button>
                  </div>
                  <div className="text-[13px] font-medium text-[#161616] truncate">{t.title}</div>
                  <button onClick={(e) => { e.stopPropagation(); useSpotify.getState().openArtist(t.artistId); }} className="text-[12px] text-[#6B6B6B] hover:underline hover:text-[#161616]">{t.artist}</button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Recently played — only shows if user has played something */}
      {recent.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#161616] mb-4">Recently played</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recent.map(t => (
              <div key={t.id} onClick={() => playTrack(t)} className="group cursor-pointer">
                <div className="relative aspect-square mb-2">
                  <img src={t.cover} alt={t.title} className="rounded-lg w-full h-full object-cover" />
                  <button onClick={(e) => { e.stopPropagation(); playTrack(t); }} className="absolute bottom-2 right-2 h-10 w-10 rounded-full bg-[#1DB954] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                    <Play size={16} className="fill-white ml-0.5" />
                  </button>
                </div>
                <div className="text-[13px] font-medium text-[#161616] truncate">{t.title}</div>
                <div className="text-[12px] text-[#6B6B6B] truncate">{t.artist}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Popular artists — circular covers, Lucide icons, no emoji */}
      <section>
        <h2 className="text-lg font-bold text-[#161616] mb-4">Popular artists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {artists.slice(0, 4).map(a => (
            <div key={a.id} onClick={() => useSpotify.getState().openArtist(a.id)} className="group cursor-pointer">
              <div className="relative aspect-square mb-2">
                <img src={a.cover} alt={a.name} className="rounded-full w-full h-full object-cover" />
                <button onClick={(e) => { e.stopPropagation(); useSpotify.getState().playArtist(a.id); }} className="absolute bottom-2 right-2 h-10 w-10 rounded-full bg-[#1DB954] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                  <Play size={16} className="fill-white ml-0.5" />
                </button>
              </div>
              <div className="text-[13px] font-medium text-[#161616] truncate">{a.name}</div>
              <div className="text-[12px] text-[#6B6B6B]">Artist</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
