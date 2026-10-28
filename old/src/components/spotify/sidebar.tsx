'use client';
import { useSpotify } from '@/lib/spotify-store';
import { playlists } from '@/lib/spotify-data';
import { cn } from '@/lib/utils';
import { Home, Search, Library, Heart, Plus } from 'lucide-react';

export function Sidebar() {
  const view = useSpotify((s) => s.view);
  const go = useSpotify((s) => s.go);
  const likedIds = useSpotify((s) => s.likedIds);

  // UX IMPROVEMENT: 3 fixed sections, consistent order, never changes.
  // Research finding: "sidebar keeps changing, features moved around frequently"
  // Fix: sidebar sections are static. Only the content within each section updates.
  const editorial = playlists.filter(p => p.type === 'editorial');
  const personal = playlists.filter(p => p.type === 'personal');
  const fresh = playlists.filter(p => p.type === 'fresh');

  return (
    <aside className="hidden md:flex md:flex-col w-[240px] shrink-0 border-r border-[#E3E0DA] text-sm">
      {/* Nav — fixed, never reorders */}
      <nav className="p-3 border-b border-[#E3E0DA]">
        <button onClick={() => go('home')} className={cn('flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors', view === 'home' ? 'bg-[#F0EEEA] text-[#161616] font-semibold' : 'text-[#6B6B6B] hover:text-[#161616]')}>
          <Home size={18} /> <span className="text-[13px]">Home</span>
        </button>
        <button onClick={() => go('search')} className={cn('flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors', view === 'search' ? 'bg-[#F0EEEA] text-[#161616] font-semibold' : 'text-[#6B6B6B] hover:text-[#161616]')}>
          <Search size={18} /> <span className="text-[13px]">Search</span>
        </button>
        <button onClick={() => go('library')} className={cn('flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors', view === 'library' ? 'bg-[#F0EEEA] text-[#161616] font-semibold' : 'text-[#6B6B6B] hover:text-[#161616]')}>
          <Library size={18} /> <span className="text-[13px]">Your Library</span>
        </button>
      </nav>

      {/* Section 1: Liked + Fresh — always at top */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-2">
        <button onClick={() => go('liked')} className="flex items-center gap-3 w-full px-2 py-1.5 rounded-md hover:bg-[#F0EEEA] transition-colors text-left">
          <div className="h-10 w-10 rounded flex items-center justify-center bg-[#161616] text-white shrink-0">
            <Heart size={16} className="fill-white" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-[#161616] truncate">Liked Songs</div>
            <div className="text-[11px] text-[#6B6B6B]">{likedIds.length} songs</div>
          </div>
        </button>

        {fresh.map(p => (
          <PlaylistRow key={p.id} playlist={p} />
        ))}

        <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B6B6B] px-2 pt-4 pb-1">Made For You</div>
        {personal.map(p => <PlaylistRow key={p.id} playlist={p} />)}

        <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B6B6B] px-2 pt-4 pb-1">Browse</div>
        {editorial.map(p => <PlaylistRow key={p.id} playlist={p} />)}
      </div>

      <div className="p-3 border-t border-[#E3E0DA]">
        <button className="flex items-center gap-2 text-[12px] text-[#6B6B6B] hover:text-[#161616] transition-colors">
          <Plus size={14} /> Create Playlist
        </button>
      </div>
    </aside>
  );
}

function PlaylistRow({ playlist }: { playlist: any }) {
  const go = useSpotify((s) => s.go);
  const openPlaylist = useSpotify((s) => s.openPlaylist);
  return (
    <button onClick={() => openPlaylist(playlist.id)} className="group flex items-center gap-3 w-full px-2 py-1.5 rounded-md hover:bg-[#F0EEEA] transition-colors text-left">
      <img src={playlist.cover} alt="" className="h-10 w-10 rounded shrink-0 object-cover" />
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-[#161616] truncate">{playlist.title}</div>
        <div className="text-[11px] text-[#6B6B6B] truncate">{playlist.type === 'fresh' ? 'Updated weekly' : `Playlist · ${playlist.owner}`}</div>
      </div>
    </button>
  );
}
