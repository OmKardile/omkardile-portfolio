'use client';
import { useSpotify } from '@/lib/spotify-store';
import { playlists } from '@/lib/spotify-data';
import { Play } from 'lucide-react';

export function LibraryView() {
  const openPlaylist = useSpotify((s) => s.openPlaylist);
  const go = useSpotify((s) => s.go);
  const likedIds = useSpotify((s) => s.likedIds);
  const searchQuery = useSpotify((s) => s.searchQuery);

  return (
    <div className="px-6 lg:px-8 py-6 max-w-[900px]">
      <h1 className="text-2xl font-bold text-[#161616] mb-4">Your Library</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <button onClick={() => go('liked' as any)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F0EEEA] transition-colors text-left">
          <div className="h-12 w-12 rounded flex items-center justify-center bg-[#161616] text-white shrink-0"><Play size={16} className="fill-white ml-0.5" /></div>
          <div><div className="text-[13px] font-medium text-[#161616]">Liked Songs</div><div className="text-[11px] text-[#6B6B6B]">{likedIds.length} songs</div></div>
        </button>
        {playlists.map(p => (
          <button key={p.id} onClick={() => openPlaylist(p.id)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F0EEEA] transition-colors text-left">
            <img src={p.cover} alt="" className="h-12 w-12 rounded shrink-0 object-cover" />
            <div className="min-w-0"><div className="text-[13px] font-medium text-[#161616] truncate">{p.title}</div><div className="text-[11px] text-[#6B6B6B] truncate">{p.owner}</div></div>
          </button>
        ))}
      </div>
    </div>
  );
}
