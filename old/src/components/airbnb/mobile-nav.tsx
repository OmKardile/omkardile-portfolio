'use client';

import { useAirbnb } from '@/lib/airbnb-store';
import { cn } from '@/lib/utils';
import { Search, Heart, User } from 'lucide-react';

export function MobileNav() {
  const view = useAirbnb((s) => s.view);
  const setView = useAirbnb((s) => s.setView);
  const wishlistedIds = useAirbnb((s) => s.wishlistedIds);
  const items = [
    { id: 'explore' as const,  label: 'Explore',   icon: Search },
    { id: 'wishlist' as const, label: 'Wishlist',   icon: Heart, badge: wishlistedIds.length },
    { id: 'trips' as const,    label: 'Trips',       icon: Heart },
    { id: 'inbox' as const,    label: 'Inbox',       icon: Heart },
    { id: 'profile' as const, label: 'Profile',    icon: User },
  ];
  return (
    <nav className="md:hidden h-16 shrink-0 mx-2 mb-2 glass-strong rounded-2xl border-t border-white/40 flex items-stretch z-30">
      {items.map((it) => {
        const Icon = it.icon;
        const active = view === it.id;
        return (
          <button key={it.id} onClick={() => setView(it.id)} className={cn('flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium relative', active ? 'text-[oklch(0.65_0.21_12)]' : 'text-[oklch(0.45_0.01_15)]')}>
            <Icon size={20} />
            <span>{it.label}</span>
            {it.badge && it.badge > 0 ? <span className="absolute top-1 right-1 bg-[oklch(0.65_0.21_12)] text-white text-[9px] font-bold rounded-full px-1 min-w-[14px] h-[14px] flex items-center justify-center">{it.badge}</span> : null}
          </button>
        );
      })}
    </nav>
  );
}
