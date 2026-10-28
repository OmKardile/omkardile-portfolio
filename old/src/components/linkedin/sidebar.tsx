'use client';

import { useLinkedIn } from '@/lib/linkedin-store';
import { currentUser } from '@/lib/linkedin-data';
import { cn } from '@/lib/utils';
import { Home, Users, Briefcase, MessageSquare, Bell, User, Plus, Search } from 'lucide-react';

export function Sidebar() {
  const view = useLinkedIn((s) => s.view);
  const setView = useLinkedIn((s) => s.setView);
  const unreadNotifications = useLinkedIn((s) => s.unreadNotifications);
  const unread = unreadNotifications();

  const items: { id: typeof view; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; badge?: number }[] = [
    { id: 'home',         label: 'Home',         icon: Home },
    { id: 'network',      label: 'My Network',   icon: Users },
    { id: 'jobs',         label: 'Jobs',          icon: Briefcase },
    { id: 'messaging',    label: 'Messaging',    icon: MessageSquare },
    { id: 'notifications',label: 'Notifications',icon: Bell, badge: unread },
    { id: 'profile',      label: 'Profile',       icon: User },
  ];

  return (
    <aside className="hidden md:flex md:flex-col w-[220px] shrink-0 m-2 mr-1 rounded-2xl glass overflow-hidden text-sm">
      {/* Profile mini-card */}
      <button onClick={() => setView('profile')} className="flex flex-col items-center gap-2 p-4 hover:bg-black/[0.04] transition-colors border-b border-black/[0.06]">
        <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-14 w-14 rounded-full ring-2 ring-white/60 shadow-sm" />
        <div className="text-center">
          <div className="font-bold text-[oklch(0.18_0.005_250)] text-sm">{currentUser.name}</div>
          <div className="text-[oklch(0.45_0.01_250)] text-xs mt-0.5 line-clamp-2 leading-tight">{currentUser.headline}</div>
        </div>
      </button>

      <nav className="p-2 flex flex-col gap-0.5">
        {items.map((it) => {
          const active = view === it.id;
          const Icon = it.icon;
          return (
            <button key={it.id} onClick={() => setView(it.id)} className={cn('flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all text-left', active ? 'glass-active text-[oklch(0.18_0.005_250)] font-semibold' : 'text-[oklch(0.3_0.01_250)] hover:bg-black/[0.04]')}>
              <Icon size={20} className="shrink-0" />
              <span className="flex-1 text-[13px]">{it.label}</span>
              {it.badge && it.badge > 0 ? (
                <span className="bg-[oklch(0.5_0.18_255)] text-white text-[10px] font-bold rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center">{it.badge}</span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="flex-1" />

      {/* Create post button */}
      <div className="p-2 border-t border-black/[0.06]">
        <button onClick={() => useLinkedIn.getState().setComposerOpen(true)} className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-[oklch(0.5_0.18_255)] hover:bg-[oklch(0.55_0.18_255)] text-white text-[13px] font-semibold shadow-sm transition-colors">
          <Plus size={16} /> Create post
        </button>
      </div>
    </aside>
  );
}
