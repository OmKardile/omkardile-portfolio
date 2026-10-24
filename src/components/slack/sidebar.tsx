'use client';

import { useSlack } from '@/lib/slack-store';
import { channels, userMap, CURRENT_USER_ID } from '@/lib/slack-data';
import { cn } from '@/lib/utils';
import { Hash, Lock, ChevronDown, Plus, Search, Settings, Square, MessageSquare, Users } from 'lucide-react';
import { useState } from 'react';

export function Sidebar() {
  const activeChannelId = useSlack((s) => s.activeChannelId);
  const setActiveChannel = useSlack((s) => s.setActiveChannel);
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [dmsOpen, setDmsOpen] = useState(true);

  const channelList = channels.filter((c) => c.type === 'channel');
  const dmList = channels.filter((c) => c.type === 'dm' || c.type === 'group-dm');

  return (
    <aside className="hidden md:flex md:flex-col w-[240px] shrink-0 m-2 mr-1 rounded-2xl glass overflow-hidden text-sm">
      {/* Workspace switcher */}
      <div className="px-3 pt-3 pb-2">
        <button className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-black/[0.04] transition-colors">
          <div className="h-7 w-7 rounded-md flex items-center justify-center text-xs font-bold text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #4A154B 0%, #8b5b8c 100%)' }}>N</div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-[oklch(0.18_0.005_320)] font-semibold text-[13px] truncate">Nimbus Labs</div>
            <div className="text-[10px] text-[oklch(0.45_0.01_320)] truncate">Aaroh Patel</div>
          </div>
          <ChevronDown size={14} className="text-[oklch(0.45_0.01_320)]" />
        </button>
      </div>

      {/* Search + threads + mentions */}
      <div className="px-2 pb-2">
        <button className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg glass-subtle hover:bg-black/[0.04] text-[oklch(0.45_0.01_320)] text-[12px] transition-colors">
          <Search size={13} /> Search
        </button>
        <div className="flex items-center gap-2 px-2 py-1.5 mt-1 rounded-lg hover:bg-black/[0.04] text-[oklch(0.3_0.01_320)] text-[12px] cursor-pointer">
          <MessageSquare size={14} /> Threads
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-black/[0.04] text-[oklch(0.3_0.01_320)] text-[12px] cursor-pointer">
          <Square size={14} /> Mentions
        </div>
      </div>

      {/* Channels */}
      <div className="px-2 flex-1 overflow-y-auto scrollbar-thin">
        <button onClick={() => setChannelsOpen((v) => !v)} className="flex items-center gap-1 w-full px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-[oklch(0.45_0.01_320)] hover:text-[oklch(0.18_0.005_320)] transition-colors">
          <ChevronDown size={10} className={cn('transition-transform', !channelsOpen && '-rotate-90')} />
          <span className="flex-1 text-left">Channels</span>
          <Plus size={12} />
        </button>
        {channelsOpen && channelList.map((c) => {
          const active = activeChannelId === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveChannel(c.id)}
              className={cn('group flex items-center gap-2 w-full px-2 py-1 rounded-lg transition-colors text-left', active ? 'glass-active text-[oklch(0.18_0.005_320)] font-semibold' : 'text-[oklch(0.3_0.01_320)] hover:bg-black/[0.04]')}
            >
              {c.isPrivate ? <Lock size={12} className="shrink-0 text-[oklch(0.45_0.01_320)]" /> : <Hash size={12} className="shrink-0 text-[oklch(0.45_0.01_320)]" />}
              <span className="flex-1 truncate text-[13px]">{c.name}</span>
              {c.mentions > 0 && <span className="bg-[oklch(0.35_0.08_320)] text-white text-[9px] font-bold rounded-full px-1.5 min-w-[16px] h-[16px] flex items-center justify-center">@</span>}
              {c.unreadCount > 0 && c.mentions === 0 && <span className="bg-[oklch(0.6_0.04_320)] text-[oklch(0.18_0.005_320)] text-[9px] font-bold rounded-full px-1.5 min-w-[16px] h-[16px] flex items-center justify-center">{c.unreadCount > 9 ? '9+' : c.unreadCount}</span>}
            </button>
          );
        })}

        <button onClick={() => setDmsOpen((v) => !v)} className="flex items-center gap-1 w-full px-2 py-1 mt-3 text-[10px] uppercase tracking-wider font-bold text-[oklch(0.45_0.01_320)] hover:text-[oklch(0.18_0.005_320)] transition-colors">
          <ChevronDown size={10} className={cn('transition-transform', !dmsOpen && '-rotate-90')} />
          <span className="flex-1 text-left">Direct messages</span>
          <Plus size={12} />
        </button>
        {dmsOpen && dmList.map((c) => {
          const active = activeChannelId === c.id;
          const isGroupDm = c.type === 'group-dm';
          return (
            <button
              key={c.id}
              onClick={() => setActiveChannel(c.id)}
              className={cn('group flex items-center gap-2 w-full px-2 py-1 rounded-lg transition-colors text-left', active ? 'glass-active text-[oklch(0.18_0.005_320)] font-semibold' : 'text-[oklch(0.3_0.01_320)] hover:bg-black/[0.04]')}
            >
              {isGroupDm ? <Users size={12} className="shrink-0 text-[oklch(0.45_0.01_320)]" /> : (
                <span className="relative shrink-0">
                  <span className="block h-2.5 w-2.5 rounded-full bg-[oklch(0.55_0.18_145)] ring-2 ring-white/70" />
                </span>
              )}
              <span className="flex-1 truncate text-[13px]">{c.name}</span>
              {c.unreadCount > 0 && <span className="bg-[oklch(0.6_0.04_320)] text-[oklch(0.18_0.005_320)] text-[9px] font-bold rounded-full px-1.5 min-w-[16px] h-[16px] flex items-center justify-center">{c.unreadCount}</span>}
            </button>
          );
        })}
      </div>

      {/* Bottom user + settings */}
      <div className="p-2 border-t border-black/[0.06] flex items-center gap-2">
        <img src={userMap[CURRENT_USER_ID].avatar} alt="" className="h-7 w-7 rounded-full ring-1 ring-white/60" />
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-semibold text-[oklch(0.18_0.005_320)] truncate">{userMap[CURRENT_USER_ID].name}</div>
          <div className="text-[10px] text-[oklch(0.45_0.01_320)] flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.55_0.18_145)]" /> Active</div>
        </div>
        <button className="h-7 w-7 rounded-md hover:bg-black/[0.04] flex items-center justify-center text-[oklch(0.45_0.01_320)] hover:text-[oklch(0.18_0.005_320)]"><Settings size={13} /></button>
      </div>
    </aside>
  );
}
