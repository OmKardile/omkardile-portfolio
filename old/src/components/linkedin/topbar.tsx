'use client';

import { useLinkedIn } from '@/lib/linkedin-store';
import { Search, Bell, MessageSquare } from 'lucide-react';

export function Topbar() {
  const setView = useLinkedIn((s) => s.setView);
  const setComposerOpen = useLinkedIn((s) => s.setComposerOpen);
  const unread = useLinkedIn((s) => s.unreadNotifications());

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 px-4 lg:px-6 h-14 glass-subtle border-b border-black/[0.06]">
      {/* Logo + search */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-8 w-8 rounded-md bg-[oklch(0.5_0.18_255)] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">in</div>
        <div className="relative hidden sm:block w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[oklch(0.5_0.01_250)]" />
          <input placeholder="Search people, jobs, posts..." className="w-full h-9 pl-9 pr-3 rounded-full glass-subtle border-white/40 text-[13px] text-[oklch(0.18_0.005_250)] placeholder:text-[oklch(0.5_0.01_250)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.5_0.18_255)]/40" />
        </div>
      </div>

      <div className="flex-1" />

      {/* Quick actions */}
      <button onClick={() => setView('messaging')} className="md:hidden h-9 w-9 rounded-full glass-subtle flex items-center justify-center text-[oklch(0.3_0.01_250)] hover:text-[oklch(0.18_0.005_250)]" aria-label="Messages">
        <MessageSquare size={18} />
      </button>
      <button onClick={() => setView('notifications')} className="relative h-9 w-9 rounded-full glass-subtle flex items-center justify-center text-[oklch(0.3_0.01_250)] hover:text-[oklch(0.18_0.005_250)]" aria-label="Notifications">
        <Bell size={18} />
        {unread > 0 && <span className="absolute -top-0.5 -right-0.5 bg-[oklch(0.6_0.24_25)] text-white text-[10px] font-bold rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center">{unread}</span>}
      </button>
      <button onClick={() => setComposerOpen(true)} className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[oklch(0.5_0.18_255)] hover:bg-[oklch(0.55_0.18_255)] text-white text-[13px] font-semibold shadow-sm">
        Create post
      </button>
    </header>
  );
}
