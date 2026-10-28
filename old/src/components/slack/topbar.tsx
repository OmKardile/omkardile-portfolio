'use client';

import { useSlack } from '@/lib/slack-store';
import { channelMap } from '@/lib/slack-data';
import { cn } from '@/lib/utils';
import { Hash, Lock, Users, Phone, Video, Info, MoreHorizontal, Search, BellOff } from 'lucide-react';

export function Topbar() {
  const activeChannelId = useSlack((s) => s.activeChannelId);
  const channel = channelMap[activeChannelId];
  const Icon = channel.type === 'channel' ? Hash : channel.type === 'group-dm' ? Users : Lock;

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 px-4 lg:px-6 h-14 glass-subtle border-b border-black/[0.06]">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Icon size={18} className="text-[oklch(0.45_0.01_320)] shrink-0" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-bold text-[oklch(0.18_0.005_320)] truncate">{channel.name}</h1>
            <span className="hidden sm:inline-block text-[11px] text-[oklch(0.45_0.01_320)] truncate">· {channel.memberCount} members</span>
          </div>
          {channel.topic && (
            <p className="text-[11px] text-[oklch(0.45_0.01_320)] truncate hidden sm:block">{channel.topic}</p>
          )}
        </div>
      </div>
      {/* Right actions */}
      <div className="flex items-center gap-1">
        <button className="h-8 w-8 rounded-md hover:bg-black/[0.04] flex items-center justify-center text-[oklch(0.45_0.01_320)] hover:text-[oklch(0.18_0.005_320)]" aria-label="Call"><Phone size={15} /></button>
        <button className="h-8 w-8 rounded-md hover:bg-black/[0.04] flex items-center justify-center text-[oklch(0.45_0.01_320)] hover:text-[oklch(0.18_0.005_320)]" aria-label="Video"><Video size={15} /></button>
        <button className="h-8 w-8 rounded-md hover:bg-black/[0.04] flex items-center justify-center text-[oklch(0.45_0.01_320)] hover:text-[oklch(0.18_0.005_320)]" aria-label="Info"><Info size={15} /></button>
        <button className="h-8 w-8 rounded-md hover:bg-black/[0.04] flex items-center justify-center text-[oklch(0.45_0.01_320)] hover:text-[oklch(0.18_0.005_320)]" aria-label="Notifications"><BellOff size={15} /></button>
        <button className="hidden sm:flex h-8 w-8 rounded-md hover:bg-black/[0.04] items-center justify-center text-[oklch(0.45_0.01_320)] hover:text-[oklch(0.18_0.005_320)]" aria-label="Search"><Search size={15} /></button>
        <button className="h-8 w-8 rounded-md hover:bg-black/[0.04] flex items-center justify-center text-[oklch(0.45_0.01_320)] hover:text-[oklch(0.18_0.005_320)]" aria-label="More"><MoreHorizontal size={15} /></button>
      </div>
    </header>
  );
}
