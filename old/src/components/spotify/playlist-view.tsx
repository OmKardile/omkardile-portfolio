'use client';
import { useSpotify } from '@/lib/spotify-store';
import { playlistMap, trackMap, formatDuration, type Track } from '@/lib/spotify-data';
import { Play, Pause, Heart, Clock, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PlaylistView({ playlistId }: { playlistId: string }) {
  const p = playlistMap[playlistId];
  const playPlaylist = useSpotify((s) => s.playPlaylist);
  const togglePlay = useSpotify((s) => s.togglePlay);
  const currentTrack = useSpotify((s) => s.currentTrack);
  const isPlaying = useSpotify((s) => s.isPlaying);
  const toggleLike = useSpotify((s) => s.toggleLike);
  const likedIds = useSpotify((s) => s.likedIds);
  if (!p) return null;
  const tracksList = p.tracks.map(id => trackMap[id]).filter(Boolean);
  const cur = currentTrack(); const playing = isPlaying && cur && p.tracks.includes(cur.id);

  return (
    <div className="px-6 lg:px-8 py-6 max-w-[900px]">
      <div className="flex items-end gap-6 mb-6">
        <img src={p.cover} alt={p.title} className="h-40 w-40 rounded shadow-md shrink-0 object-cover" />
        <div>
          <div className="text-[11px] uppercase tracking-wider font-bold text-[#6B6B6B] mb-2">{p.type === 'fresh' ? 'Fresh · Updated weekly' : 'Playlist'}</div>
          <h1 className="text-4xl font-bold text-[#161616] mb-2">{p.title}</h1>
          <p className="text-[13px] text-[#6B6B6B]">{p.description}</p>
          <p className="text-[12px] text-[#6B6B6B] mt-1">{p.owner} · {tracksList.length} songs</p>
        </div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => playing ? togglePlay() : playPlaylist(p)} className="h-12 w-12 rounded-full bg-[#1DB954] hover:scale-105 transition-transform text-white flex items-center justify-center shadow-sm">
          {playing ? <Pause size={20} className="fill-white" /> : <Play size={20} className="fill-white ml-0.5" />}
        </button>
        <button className="text-[#6B6B6B] hover:text-[#161616]"><Heart size={24} /></button>
      </div>
      <div className="border border-[#E3E0DA] rounded-lg overflow-hidden">
        <div className="hidden sm:grid grid-cols-[40px_1fr_120px_60px] gap-3 px-4 py-2 bg-[#F0EEEA] text-[10px] uppercase tracking-wider font-bold text-[#6B6B6B] border-b border-[#E3E0DA]">
          <span className="text-center">#</span><span>Title</span><span>Album</span><span className="text-right"><Clock size={12} className="inline" /></span>
        </div>
        {tracksList.map((t, i) => {
          const isCur = cur?.id === t.id; const isThis = isCur && isPlaying;
          const liked = likedIds.includes(t.id);
          return (
            <div key={`${t.id}-${i}`} onClick={() => isCur ? togglePlay() : playPlaylist(p, t.id)} className="row-hover grid grid-cols-[40px_1fr_120px_60px] gap-3 px-4 py-2 items-center cursor-pointer border-b border-[#E3E0DA] last:border-b-0">
              <span className={cn('text-[13px] tabular-nums text-center', isCur ? 'text-[#1DB954]' : 'text-[#6B6B6B]')}>{i + 1}</span>
              <div className="flex items-center gap-3 min-w-0">
                <img src={t.cover} alt="" className="h-9 w-9 rounded shrink-0" />
                <div className="min-w-0"><div className={cn('text-[13px] font-medium truncate', isCur ? 'text-[#1DB954]' : 'text-[#161616]')}>{t.title}</div><div className="text-[11px] text-[#6B6B6B] truncate">{t.artist}</div></div>
              </div>
              <span className="text-[11px] text-[#6B6B6B] truncate">{t.album}</span>
              <div className="flex items-center gap-2 justify-end">
                <button onClick={(e) => { e.stopPropagation(); toggleLike(t.id); }} className={cn(liked ? 'text-[#1DB954]' : 'text-[#6B6B6B] opacity-0 group-hover:opacity-100')}><Heart size={14} className={liked ? 'fill-[#1DB954]' : ''} /></button>
                <span className="text-[12px] text-[#6B6B6B] tabular-nums">{formatDuration(t.durationSec)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
