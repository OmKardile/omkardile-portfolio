'use client';
import { useSpotify } from '@/lib/spotify-store';
import { Home, Search, Library } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const view = useSpotify((s) => s.view);
  const go = useSpotify((s) => s.go);
  const items = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'search' as const, label: 'Search', icon: Search },
    { id: 'library' as const, label: 'Library', icon: Library },
  ];
  return (
    <nav className="md:hidden h-14 shrink-0 bg-[#FAF8F5] border-t border-[#E3E0DA] flex items-stretch">
      {items.map(it => {
        const Icon = it.icon; const active = view === it.id;
        return <button key={it.id} onClick={() => go(it.id)} className={cn('flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium', active ? 'text-[#161616]' : 'text-[#6B6B6B]')}><Icon size={18} /><span>{it.label}</span></button>;
      })}
    </nav>
  );
}
