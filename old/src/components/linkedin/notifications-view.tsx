'use client';

import { useLinkedIn } from '@/lib/linkedin-store';
import { userMap, notifications as allNotifications } from '@/lib/linkedin-data';
import { Heart, MessageSquare, UserPlus, Briefcase, AtSign, Eye, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICON_BY_TYPE: Record<string, { icon: React.ComponentType<{ size?: number }>; color: string }> = {
  like:        { icon: Heart,        color: '#FF375F' },
  comment:     { icon: MessageSquare, color: '#007AFF' },
  connection:  { icon: UserPlus,     color: '#5E6AD2' },
  job:         { icon: Briefcase,    color: '#30D158' },
  mention:     { icon: AtSign,       color: '#FF9F0A' },
  view:        { icon: Eye,          color: '#8E8E93' },
};

export function NotificationsView() {
  const notifications = useLinkedIn((s) => s.notifications);
  const markAll = useLinkedIn((s) => s.markAllNotificationsRead);
  const toast = useLinkedIn((s) => s.toast);

  return (
    <div className="px-4 lg:px-6 py-4 max-w-[640px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-[oklch(0.18_0.005_250)]">Notifications</h1>
        <button onClick={() => { markAll(); toast('All notifications marked as read'); }} className="inline-flex items-center gap-1 px-3 py-1 rounded-full glass-subtle text-[oklch(0.3_0.01_250)] text-[11px] font-semibold hover:bg-black/[0.04]">
          <CheckCheck size={12} /> Mark all read
        </button>
      </div>

      <div className="space-y-2">
        {notifications.map((n) => {
          const actor = userMap[n.actorId];
          const cfg = ICON_BY_TYPE[n.type];
          const Icon = cfg.icon;
          return (
            <div key={n.id} className={cn('glass-subtle rounded-2xl p-3 flex items-center gap-3 hover:bg-black/[0.04] transition-colors', !n.read && 'glass-active')}>
              <div className="relative shrink-0">
                <img src={actor.avatarUrl} alt="" className="h-11 w-11 rounded-full ring-1 ring-white/60" />
                <span className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full flex items-center justify-center ring-2 ring-white" style={{ backgroundColor: cfg.color }}>
                  <Icon size={11} />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[oklch(0.3_0.01_250)] leading-snug">
                  <span className="font-semibold text-[oklch(0.18_0.005_250)]">{actor.name}</span> {n.text}
                </p>
                <div className="text-[11px] text-[oklch(0.45_0.01_250)] mt-0.5">{n.timestamp} ago</div>
              </div>
              {!n.read && <span className="h-2 w-2 rounded-full bg-[oklch(0.5_0.18_255)] shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
