'use client';

import { useAirbnb } from '@/lib/airbnb-store';
import { categories } from '@/lib/airbnb-data';
import { cn } from '@/lib/utils';
import { Search, Globe, Menu, User, Heart, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export function Topbar() {
  const searchQuery = useAirbnb((s) => s.searchQuery);
  const setSearchQuery = useAirbnb((s) => s.setSearchQuery);
  const setView = useAirbnb((s) => s.setView);
  const wishlistedIds = useAirbnb((s) => s.wishlistedIds);
  const [expanded, setExpanded] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 px-4 lg:px-6 h-16 glass-subtle border-b border-black/[0.06]">
      {/* Logo */}
      <button onClick={() => setView('explore')} className="flex items-center gap-1 text-[oklch(0.65_0.21_12)] hover:opacity-80 transition-opacity">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor"><path d="M16 1C7.7 1 1 7.7 1 16s6.7 15 15 15 15-6.7 15-15S24.3 1 16 1zm0 4c2.4 0 4.4 1.9 4.4 4.4 0 2.9-2.6 5.9-4.4 8.0-1.8-2.1-4.4-5.1-4.4-8.0 0-2.5 2-4.4 4.4-4.4zm9.4 18.9c-1.3 1.4-3.1 2.3-5.0 2.6-1.4.2-2.8-.1-4.1-.6-1.0-.4-2.0-1.0-2.8-1.7 2.1-2.1 4.0-4.4 5.5-7.0 1.4-2.4 2.6-4.9 3.4-7.5 1.7 2.4 2.6 5.4 2.6 8.6 0 1.9-.5 3.7-1.6 5.6z"/></svg>
        <span className="hidden sm:block font-bold text-[15px] tracking-tight">airbnb</span>
      </button>

      {/* Center search bar */}
      <div className="flex-1 max-w-[520px] mx-auto">
        <button onClick={() => setExpanded((v) => !v)} className="hidden sm:flex items-center gap-3 h-14 px-2 rounded-full glass hover:shadow-md transition-all">
          <span className="px-4 text-[13px] font-semibold text-[oklch(0.18_0.005_15)] border-r border-black/[0.06] pr-4">Anywhere</span>
          <span className="px-4 text-[13px] font-semibold text-[oklch(0.18_0.005_15)] border-r border-black/[0.06] pr-4">Any week</span>
          <span className="px-4 text-[13px] text-[oklch(0.45_0.01_15)]">Add guests</span>
          <span className="h-9 w-9 rounded-full bg-[oklch(0.65_0.21_12)] text-white flex items-center justify-center ml-2">
            <Search size={14} />
          </span>
        </button>

        {/* Mobile search */}
        <div className="relative sm:hidden">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[oklch(0.45_0.01_15)]" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by city, country..." className="w-full h-10 pl-9 pr-3 rounded-full glass border-white/40 text-[13px] text-[oklch(0.18_0.005_15)] placeholder:text-[oklch(0.45_0.01_15)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.65_0.21_12)]/40" />
        </div>
      </div>

      {/* Right: nav */}
      <button className="hidden md:inline-block px-3 py-2 rounded-full text-[13px] font-semibold text-[oklch(0.18_0.005_15)] hover:bg-black/[0.04]">Become a host</button>
      <button className="hidden md:inline-flex h-9 w-9 rounded-full glass-subtle hover:bg-black/[0.04] items-center justify-center text-[oklch(0.18_0.005_15)]">
        <Globe size={16} />
      </button>
      <button className="flex items-center gap-2 h-9 pl-2 pr-1 rounded-full glass-subtle hover:shadow-md transition-all">
        <Menu size={14} className="text-[oklch(0.18_0.005_15)]" />
        <span className="h-7 w-7 rounded-full bg-[oklch(0.5_0.18_15)] text-white flex items-center justify-center text-[10px] font-bold">O</span>
      </button>
    </header>
  );
}

export function CategoryBar() {
  const categoryFilter = useAirbnb((s) => s.categoryFilter);
  const setCategoryFilter = useAirbnb((s) => s.setCategoryFilter);
  return (
    <div className="sticky top-16 z-10 px-4 lg:px-6 py-3 glass-subtle border-b border-black/[0.06]">
      <div className="flex gap-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setCategoryFilter('all')}
          className={cn('flex flex-col items-center gap-1 px-3 py-1 rounded-lg whitespace-nowrap transition-colors text-[11px] font-semibold', categoryFilter === 'all' ? 'text-[oklch(0.18_0.005_15)]' : 'text-[oklch(0.45_0.01_15)] hover:text-[oklch(0.18_0.005_15)]')}
        >
          <span className="text-lg">✨</span>
          <span>All</span>
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoryFilter(c.id === categoryFilter ? 'all' : c.id)}
            className={cn('flex flex-col items-center gap-1 px-3 py-1 rounded-lg whitespace-nowrap transition-colors text-[11px] font-semibold relative', categoryFilter === c.id ? 'text-[oklch(0.18_0.005_15)]' : 'text-[oklch(0.45_0.01_15)] hover:text-[oklch(0.18_0.005_15)]')}
          >
            <span className="text-lg">{c.icon}</span>
            <span>{c.label}</span>
            {categoryFilter === c.id && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-1 rounded-full bg-[oklch(0.18_0.005_15)]" />}
          </button>
        ))}
      </div>
    </div>
  );
}
