'use client';
import { useSpotify } from '@/lib/spotify-store';
import { artistMap, trackMap, formatDuration } from '@/lib/spotify-data';
import { Play, Pause } from 'lucide-react';

export function ArtistView({ artistId }: { artistId: string }) {
  const a = artistMap[artistId];
  const playArtist = useSpotify((s) => s.playArtist);
  const togglePlay = useSpotify((s) => s.togglePlay);
  const currentTrack = useSpotify((s) => s.currentTrack);
  const isPlaying = useSpotify((s) => s.isPlaying);
  if (!a) return null;
  const topTracks = a.topTrackIds.map(id => trackMap[id]).filter(Boolean);
  const cur = currentTrack(); const playing = isPlaying && cur && cur.artistId === artistId;
  return (
    <div className="px-6 lg:px-8 py-6 max-w-[900px]">
      <div className="flex items-end gap-6 mb-6">
        <img src={a.cover} alt={a.name} className="h-32 w-32 rounded-full shadow-md shrink-0 object-cover" />
        <div><h1 className="text-4xl font-bold text-[#161616] mb-2">{a.name}</h1><p className="text-[13px] text-[#6B6B6B]">{a.monthlyListeners} monthly listeners</p></div>
      </div>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => playing ? togglePlay() : playArtist(a.id)} className="h-12 w-12 rounded-full bg-[#1DB954] hover:scale-105 transition-transform text-white flex items-center justify-center shadow-sm">{playing ? <Pause size={20} className="fill-white" /> : <Play size={20} className="fill-white ml-0.5" />}</button>
        <button className="text-[12px] font-bold uppercase tracking-wider text-[#6B6B6B] hover:text-[#161616] border border-[#E3E0DA] rounded-full px-4 py-1.5">Follow</button>
      </div>
      <h2 className="text-lg font-bold text-[#161616] mb-4">Popular</h2>
      <div className="border border-[#E3E0DA] rounded-lg overflow-hidden">
        {topTracks.map((t, i) => {
          const isCur = cur?.id === t.id; const isThis = isCur && isPlaying;
          return (
            <div key={t.id} onClick={() => isCur ? togglePlay() : playArtist(a.id, t.id)} className="row-hover grid grid-cols-[40px_1fr_60px] gap-3 px-4 py-2 items-center cursor-pointer border-b border-[#E3E0DA] last:border-b-0">
              <span className={cn('text-[13px] tabular-nums text-center', isCur ? 'text-[#1DB954]' : 'text-[#6B6B6B]')}>{i + 1}</span>
              <div className="flex items-center gap-3 min-w-0"><img src={t.cover} alt="" className="h-9 w-9 rounded shrink-0" /><div className="min-w-0"><div className={cn('text-[13px] font-medium truncate', isCur ? 'text-[#1DB954]' : 'text-[#161616]')}>{t.title}</div><div className="text-[11px] text-[#6B6B6B] truncate">{t.album}</div></div></div>
              <span className="text-[12px] text-[#6B6B6B] tabular-nums text-right">{formatDuration(t.durationSec)}</span>
            </div>
          );
        })}
      </div>
      <h2 className="text-lg font-bold text-[#161616] mt-8 mb-3">About</h2>
      <p className="text-[14px] text-[#2A2A2A] leading-relaxed">{a.bio}</p>
    </div>
  );
}

import { cn } from '@/lib/utils';
