'use client';
import { useSpotify } from '@/lib/spotify-store';
import { trackMap, formatDuration } from '@/lib/spotify-data';
import { Play, Heart } from 'lucide-react';

export function LikedView() {
  const likedIds = useSpotify((s) => s.likedIds);
  const playTrack = useSpotify((s) => s.playTrack);
  const toggleLike = useSpotify((s) => s.toggleLike);
  const currentTrack = useSpotify((s) => s.currentTrack);
  const isPlaying = useSpotify((s) => s.isPlaying);
  const togglePlay = useSpotify((s) => s.togglePlay);
  const likedTracks = likedIds.map(id => trackMap[id]).filter(Boolean);
  const cur = currentTrack(); const playing = isPlaying && cur && likedIds.includes(cur.id);

  return (
    <div className="px-6 lg:px-8 py-6 max-w-[900px]">
      <div className="flex items-end gap-6 mb-6">
        <div className="h-40 w-40 rounded flex items-center justify-center bg-[#161616] text-white shrink-0"><Heart size={48} className="fill-white" /></div>
        <div>
          <div className="text-[11px] uppercase tracking-wider font-bold text-[#6B6B6B] mb-2">Playlist</div>
          <h1 className="text-4xl font-bold text-[#161616] mb-2">Liked Songs</h1>
          <p className="text-[12px] text-[#6B6B6B]">{likedTracks.length} songs</p>
        </div>
      </div>
      {likedTracks.length > 0 && (
        <button onClick={() => playing ? togglePlay() : playTrack(likedTracks[0])} className="h-12 w-12 rounded-full bg-[#1DB954] hover:scale-105 transition-transform text-white flex items-center justify-center shadow-sm mb-4">
          <Play size={20} className="fill-white ml-0.5" />
        </button>
      )}
      {likedTracks.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-[15px] text-[#6B6B6B]">Songs you like will appear here.</p>
          <p className="text-[13px] text-[#6B6B6B] mt-1">Tap the heart on any song to save it.</p>
        </div>
      ) : (
        <div className="border border-[#E3E0DA] rounded-lg overflow-hidden">
          {likedTracks.map((t, i) => {
            const isCur = cur?.id === t.id;
            return (
              <div key={`${t.id}-${i}`} onClick={() => isCur ? togglePlay() : playTrack(t)} className="row-hover grid grid-cols-[40px_1fr_120px_60px] gap-3 px-4 py-2 items-center cursor-pointer border-b border-[#E3E0DA] last:border-b-0">
                <span className={cn('text-[13px] tabular-nums text-center', isCur ? 'text-[#1DB954]' : 'text-[#6B6B6B]')}>{i + 1}</span>
                <div className="flex items-center gap-3 min-w-0"><img src={t.cover} alt="" className="h-9 w-9 rounded shrink-0" /><div className="min-w-0"><div className={cn('text-[13px] font-medium truncate', isCur ? 'text-[#1DB954]' : 'text-[#161616]')}>{t.title}</div><div className="text-[11px] text-[#6B6B6B] truncate">{t.artist}</div></div></div>
                <span className="text-[11px] text-[#6B6B6B] truncate">{t.album}</span>
                <div className="flex items-center gap-2 justify-end">
                  <button onClick={(e) => { e.stopPropagation(); toggleLike(t.id); }} className="text-[#1DB954]"><Heart size={14} className="fill-[#1DB954]" /></button>
                  <span className="text-[12px] text-[#6B6B6B] tabular-nums">{formatDuration(t.durationSec)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { cn } from '@/lib/utils';
