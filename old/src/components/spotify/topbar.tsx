'use client';
import { useSpotify } from '@/lib/spotify-store';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Search as SearchIcon, Bell } from 'lucide-react';

export function Topbar() {
  const back = useSpotify((s) => s.back);
  const canBack = useSpotify((s) => s.history.length > 0);
  const go = useSpotify((s) => s.go);
  const view = useSpotify((s) => s.view);

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 px-4 lg:px-6 h-14 bg-[#FAF8F5] border-b border-[#E3E0DA]">
      <div className="flex items-center gap-1">
        <button onClick={back} disabled={!canBack} className="h-8 w-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-30 hover:bg-[#F0EEEA]" aria-label="Back">
          <ChevronLeft size={18} className="text-[#161616]" />
        </button>
        <button disabled className="h-8 w-8 rounded-full flex items-center justify-center opacity-30" aria-label="Forward">
          <ChevronRight size={18} className="text-[#161616]" />
        </button>
      </div>

      {/* Search trigger — always visible, always in same spot */}
      {/* UX IMPROVEMENT: Research found "navigation inconsistency across platforms" */}
      {/* Fix: search is always in the topbar, same position on every view */}
      <button onClick={() => go('search')} className="flex items-center gap-2 h-9 px-3 rounded-full border border-[#E3E0DA] hover:border-[#C0BCB4] transition-colors w-full max-w-[400px]">
        <SearchIcon size={14} className="text-[#6B6B6B]" />
        <span className="text-[13px] text-[#6B6B6B]">What do you want to play?</span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button className="h-8 w-8 rounded-full hover:bg-[#F0EEEA] flex items-center justify-center" aria-label="Notifications">
          <Bell size={16} className="text-[#6B6B6B]" />
        </button>
        <button className="h-8 w-8 rounded-full bg-[#161616] text-white flex items-center justify-center text-[10px] font-bold">O</button>
      </div>
    </header>
  );
}
