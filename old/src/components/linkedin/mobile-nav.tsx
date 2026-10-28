'use client';

import { useLinkedIn } from '@/lib/linkedin-store';
import { cn } from '@/lib/utils';
import { Home, Users, Briefcase, MessageSquare, Bell, Plus } from 'lucide-react';

export function MobileNav() {
  const view = useLinkedIn((s) => s.view);
  const setView = useLinkedIn((s) => s.setView);
  const unread = useLinkedIn((s) => s.unreadNotifications());
  const setComposerOpen = useLinkedIn((s) => s.setComposerOpen);

  const items: { id: typeof view; label: string; icon: React.ComponentType<{ size?: number }>; badge?: number }[] = [
    { id: 'home',          label: 'Home',     icon: Home },
    { id: 'network',       label: 'Network',   icon: Users },
    { id: 'jobs',          label: 'Jobs',       icon: Briefcase },
    { id: 'messaging',     label: 'Chat',       icon: MessageSquare },
    { id: 'notifications', label: 'Activity',   icon: Bell, badge: unread },
  ];

  return (
    <nav className="md:hidden h-16 shrink-0 mx-2 mb-2 glass-strong rounded-2xl border-t border-white/40 flex items-stretch z-30">
      {items.map((it) => {
        const Icon = it.icon;
        const active = view === it.id;
        return (
          <button key={it.id} onClick={() => setView(it.id)} className={cn('flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium', active ? 'text-[oklch(0.5_0.18_255)]' : 'text-[oklch(0.45_0.01_250)]')}>
            <div className="relative">
              <Icon size={20} />
              {it.badge && it.badge > 0 ? <span className="absolute -top-1 -right-2 bg-[oklch(0.6_0.24_25)] text-white text-[9px] font-bold rounded-full px-1 min-w-[14px] h-[14px] flex items-center justify-center">{it.badge}</span> : null}
            </div>
            <span>{it.label}</span>
          </button>
        );
      })}
      <button onClick={() => setComposerOpen(true)} className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-[oklch(0.5_0.18_255)]">
        <Plus size={20} />
        <span>Post</span>
      </button>
    </nav>
  );
}
