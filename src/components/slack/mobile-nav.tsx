'use client';

import { useSlack } from '@/lib/slack-store';
import { channels, userMap, CURRENT_USER_ID } from '@/lib/slack-data';
import { cn } from '@/lib/utils';
import { Hash, MessageSquare, Search, Users } from 'lucide-react';

export function MobileNav() {
  const setActiveChannel = useSlack((s) => s.setActiveChannel);
  // Mobile shows a quick channel switcher
  const topChannels = channels.slice(0, 4);
  const me = userMap[CURRENT_USER_ID];

  return (
    <nav className="md:hidden h-16 shrink-0 mx-2 mb-2 glass-strong rounded-2xl border-t border-white/40 flex items-stretch z-30">
      {topChannels.map((c) => (
        <button
          key={c.id}
          onClick={() => setActiveChannel(c.id)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-[oklch(0.3_0.01_320)] hover:text-[oklch(0.18_0.005_320)]"
        >
          {c.type === 'channel' ? <Hash size={18} /> : <Users size={18} />}
          <span className="truncate max-w-[60px]">{c.name.split(' ')[0]}</span>
        </button>
      ))}
      <button className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-[oklch(0.3_0.01_320)] hover:text-[oklch(0.18_0.005_320)]">
        <Search size={18} />
        <span>Search</span>
      </button>
      <button className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-[oklch(0.3_0.01_320)] hover:text-[oklch(0.18_0.005_320)]">
        <img src={me.avatar} alt={me.name} className="h-6 w-6 rounded-full ring-1 ring-white/60" />
        <span>Me</span>
      </button>
    </nav>
  );
}
