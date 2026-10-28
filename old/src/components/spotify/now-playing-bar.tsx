'use client';
import { useSpotify } from '@/lib/spotify-store';
import { formatDuration } from '@/lib/spotify-data';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, ListMusic, X, Volume2, VolumeX, Heart } from 'lucide-react';
import { useEffect } from 'react';

export function NowPlayingBar() {
  const { currentTrack, isPlaying, progressSec, volume, shuffle, repeat, togglePlay, next, prev, seek, setVolume, toggleShuffle, cycleRepeat, tick, toggleQueue, queueVisible, clearQueue, toggleLike, likedIds, openArtist } = useSpotify();

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => tick(), 1000);
    return () => clearInterval(id);
  }, [isPlaying, tick]);

  const t = currentTrack();
  const dur = t?.durationSec ?? 0;
  const pct = dur ? (progressSec / dur) * 100 : 0;
  const liked = t ? likedIds.includes(t.id) : false;

  return (
    <footer className="h-[72px] px-4 flex items-center justify-between gap-4 bg-[#FAF8F5] border-t border-[#E3E0DA]">
      {/* Left: track */}
      <div className="flex items-center gap-3 min-w-0 w-[30%]">
        {t ? (
          <>
            <img src={t.cover} alt="" className="h-11 w-11 rounded shrink-0 object-cover" />
            <div className="min-w-0">
              <div className="text-[13px] font-medium text-[#161616] truncate">{t.title}</div>
              <button onClick={() => openArtist(t.artistId)} className="text-[11px] text-[#6B6B6B] hover:underline truncate text-left">{t.artist}</button>
            </div>
            <button onClick={() => toggleLike(t.id)} className="hidden sm:flex h-8 w-8 items-center justify-center text-[#6B6B6B] hover:text-[#161616]">
              <Heart size={15} className={liked ? 'fill-[#1DB954] text-[#1DB954]' : ''} />
            </button>
          </>
        ) : <span className="text-[12px] text-[#6B6B6B]">Select a song</span>}
      </div>

      {/* Center: controls + progress */}
      <div className="flex flex-col items-center gap-1 w-[40%]">
        <div className="flex items-center gap-4">
          <button onClick={toggleShuffle} className={`transition-colors ${shuffle ? 'text-[#1DB954]' : 'text-[#6B6B6B] hover:text-[#161616]'}`} aria-label="Shuffle"><Shuffle size={16} /></button>
          <button onClick={prev} className="text-[#161616] hover:scale-105 transition-transform" aria-label="Previous"><SkipBack size={18} className="fill-[#161616]" /></button>
          <button onClick={togglePlay} className="h-9 w-9 rounded-full bg-[#161616] text-white flex items-center justify-center hover:scale-105 transition-transform" aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={16} className="fill-white" /> : <Play size={16} className="fill-white ml-0.5" />}
          </button>
          <button onClick={next} className="text-[#161616] hover:scale-105 transition-transform" aria-label="Next"><SkipForward size={18} className="fill-[#161616]" /></button>
          <button onClick={cycleRepeat} className={`transition-colors ${repeat !== 'off' ? 'text-[#1DB954]' : 'text-[#6B6B6B] hover:text-[#161616]'}`} aria-label="Repeat">{repeat === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}</button>
        </div>
        <div className="hidden sm:flex items-center gap-2 w-full max-w-[400px]">
          <span className="text-[10px] tabular-nums text-[#6B6B6B] w-8 text-right">{formatDuration(progressSec)}</span>
          <input type="range" min={0} max={100} value={pct} onChange={(e) => seek((Number(e.target.value) / 100) * dur)} className="flex-1 h-1 rounded-full appearance-none bg-[#E3E0DA] accent-[#1DB954]" />
          <span className="text-[10px] tabular-nums text-[#6B6B6B] w-8">{formatDuration(dur)}</span>
        </div>
      </div>

      {/* Right: queue toggle + volume */}
      <div className="hidden sm:flex items-center gap-2 justify-end w-[30%]">
        {/* THE UX IMPROVEMENT: visible queue toggle + clear button */}
        {/* Research: "Non-discoverable Queue Clear" → fix: queue button is always visible */}
        <button onClick={toggleQueue} className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition-colors ${queueVisible ? 'text-[#1DB954] bg-[#1DB954]/10' : 'text-[#6B6B6B] hover:text-[#161616]'}`}>
          <ListMusic size={14} /> Queue
        </button>
        {queueVisible && (
          <button onClick={clearQueue} className="text-[11px] text-[#6B6B6B] hover:text-[#C0392B] flex items-center gap-1">
            <X size={12} /> Clear
          </button>
        )}
        <button onClick={() => setVolume(volume === 0 ? 0.7 : 0)} className="text-[#6B6B6B] hover:text-[#161616]">
          {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input type="range" min={0} max={100} value={volume * 100} onChange={(e) => setVolume(Number(e.target.value) / 100)} className="w-20 h-1 rounded-full appearance-none bg-[#E3E0DA] accent-[#1DB954]" />
      </div>
    </footer>
  );
}
