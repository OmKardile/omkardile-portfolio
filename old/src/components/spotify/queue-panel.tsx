'use client';
import { useSpotify } from '@/lib/spotify-store';
import { formatDuration } from '@/lib/spotify-data';
import { X, ListMusic } from 'lucide-react';

export function QueuePanel() {
  const queueVisible = useSpotify((s) => s.queueVisible);
  const toggleQueue = useSpotify((s) => s.toggleQueue);
  const queue = useSpotify((s) => s.queue);
  const idx = useSpotify((s) => s.idx);
  const clearQueue = useSpotify((s) => s.clearQueue);
  const playTrack = useSpotify((s) => s.playTrack);
  if (!queueVisible) return null;
  const current = queue[idx]; const upcoming = queue.slice(idx + 1);
  return (
    <aside className="absolute right-0 top-0 bottom-0 z-40 w-full sm:w-[380px] bg-[#FAF8F5] border-l border-[#E3E0DA] flex flex-col slide-in-right">
      <header className="flex items-center justify-between px-5 py-3 border-b border-[#E3E0DA]">
        <div className="flex items-center gap-2 text-[#161616] font-bold text-[14px]"><ListMusic size={16} /> Queue</div>
        <div className="flex items-center gap-2">
          {queue.length > 0 && <button onClick={clearQueue} className="text-[11px] text-[#C0392B] hover:underline">Clear</button>}
          <button onClick={toggleQueue} className="h-7 w-7 rounded flex items-center justify-center text-[#6B6B6B] hover:text-[#161616] hover:bg-[#F0EEEA]"><X size={14} /></button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3">
        <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B6B6B] px-2 mb-2">Now Playing</div>
        {current ? <QueueRow title={current.title} artist={current.artist} cover={current.cover} duration={formatDuration(current.durationSec)} isCurrent /> : <div className="px-2 py-4 text-[12px] text-[#6B6B6B] text-center">Nothing playing.</div>}
        <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B6B6B] px-2 mt-4 mb-2">Next Up</div>
        {upcoming.length === 0 ? <div className="px-2 py-2 text-[12px] text-[#6B6B6B]">End of queue.</div> : upcoming.map((t, i) => <QueueRow key={`${t.id}-${i}`} title={t.title} artist={t.artist} cover={t.cover} duration={formatDuration(t.durationSec)} onClick={() => playTrack(t)} />)}
      </div>
    </aside>
  );
}

function QueueRow({ title, artist, cover, duration, isCurrent, onClick }: { title: string; artist: string; cover: string; duration: string; isCurrent?: boolean; onClick?: () => void }) {
  return (
    <div onClick={onClick} className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-[#F0EEEA] transition-colors cursor-pointer">
      <img src={cover} alt="" className="h-9 w-9 rounded shrink-0 object-cover" />
      <div className="min-w-0 flex-1">
        <div className={`text-[13px] font-medium truncate ${isCurrent ? 'text-[#1DB954]' : 'text-[#161616]'}`}>{title}</div>
        <div className="text-[11px] text-[#6B6B6B] truncate">{artist}</div>
      </div>
      <span className="text-[11px] text-[#6B6B6B] tabular-nums">{duration}</span>
    </div>
  );
}
