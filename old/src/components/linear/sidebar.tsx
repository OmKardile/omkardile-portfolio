'use client';

import { useLinear } from '@/lib/linear-store';
import { projects, cycles, CURRENT_USER_ID } from '@/lib/linear-data';
import { userMap } from '@/lib/linear-data';
import { cn } from '@/lib/utils';
import {
  Inbox,
  Repeat as CycleIcon,
  CheckSquare,
  SquareStack,
  Plus,
  ChevronDown,
  Search as SearchIcon,
  Settings,
  Star as Favorites,
  Box,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Sidebar() {
  const projectId = useLinear((s) => s.projectId);
  const setProjectId = useLinear((s) => s.setProjectId);
  const mainView = useLinear((s) => s.mainView);
  const setMainView = useLinear((s) => s.setMainView);
  const toggleCmd = useLinear((s) => s.toggleCmd);
  const issues = useLinear((s) => s.issues);
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [favoritesOpen, setFavoritesOpen] = useState(true);

  const myIssueCount = issues.filter(
    (i) => i.assigneeId === CURRENT_USER_ID && i.status !== 'backlog' && i.status !== 'completed' && i.status !== 'canceled',
  ).length;
  const activeCount = issues.filter(
    (i) => i.projectId === projectId && i.cycleId !== null && i.status !== 'completed' && i.status !== 'canceled',
  ).length;
  const backlogCount = issues.filter((i) => i.projectId === projectId && i.status === 'backlog').length;
  const allCount = issues.filter((i) => i.projectId === projectId).length;

  const navItems: { id: typeof mainView; label: string; icon: React.ComponentType<{ size?: number }>; count: number }[] = [
    { id: 'active',    label: 'Active',     icon: CycleIcon,   count: activeCount },
    { id: 'backlog',   label: 'Backlog',    icon: Inbox,        count: backlogCount },
    { id: 'my-issues', label: 'My Issues',  icon: CheckSquare, count: myIssueCount },
    { id: 'all',       label: 'All issues', icon: SquareStack, count: allCount },
  ];

  const me = userMap[CURRENT_USER_ID];

  return (
    <aside className="hidden md:flex md:flex-col w-[260px] shrink-0 m-2 mr-1 rounded-2xl glass overflow-hidden text-sm">
      {/* Workspace switcher */}
      <div className="px-3 pt-3 pb-2">
        <button className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-black/[0.04] transition-colors">
          <div className="h-6 w-6 rounded-md flex items-center justify-center text-xs font-bold text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #5E6AD2 0%, #8a93e8 100%)' }}>
            A
          </div>
          <span className="text-[oklch(0.18_0.005_250)] font-semibold text-sm flex-1 text-left truncate">Acme Engineering</span>
          <ChevronDown size={14} className="text-[oklch(0.45_0.01_250)]" />
        </button>
      </div>

      {/* Search / command */}
      <div className="px-3 pb-3">
        <button
          onClick={toggleCmd}
          className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg glass-subtle hover:bg-black/[0.04] text-[oklch(0.45_0.01_250)] text-xs transition-colors"
        >
          <SearchIcon size={13} />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/[0.06] text-[oklch(0.4_0.01_250)]">⌘K</kbd>
        </button>
      </div>

      {/* Nav */}
      <nav className="px-2 pb-3">
        {navItems.map((it) => {
          const Icon = it.icon;
          const active = mainView === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setMainView(it.id)}
              className={cn(
                'flex items-center gap-2 w-full px-2 py-1.5 rounded-lg transition-all text-left',
                active
                  ? 'glass-active text-[oklch(0.18_0.005_250)] font-semibold'
                  : 'text-[oklch(0.3_0.01_250)] hover:bg-black/[0.04]',
              )}
            >
              <Icon size={14} />
              <span className="flex-1 text-[13px]">{it.label}</span>
              <span className="text-[10px] tabular-nums text-[oklch(0.5_0.01_250)]">{it.count}</span>
            </button>
          );
        })}
      </nav>

      {/* Projects */}
      <div className="px-2 flex-1 min-h-0 overflow-y-auto scrollbar-thin">
        <button
          onClick={() => setProjectsOpen((v) => !v)}
          className="flex items-center gap-1 w-full px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-[oklch(0.5_0.01_250)] hover:text-[oklch(0.3_0.01_250)] transition-colors"
        >
          <ChevronDown size={10} className={cn('transition-transform', !projectsOpen && '-rotate-90')} />
          <span className="flex-1 text-left">Projects</span>
          <Plus size={12} />
        </button>
        {projectsOpen && (
          <div className="mb-3">
            {projects.map((p) => {
              const active = projectId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setProjectId(p.id)}
                  className={cn(
                    'group flex items-center gap-2 w-full px-2 py-1.5 rounded-lg transition-all text-left',
                    active ? 'glass-active' : 'hover:bg-black/[0.04]',
                  )}
                >
                  <span className="text-base leading-none">{p.icon}</span>
                  <span className="text-[13px] font-medium flex-1 truncate text-[oklch(0.18_0.005_250)]">{p.name}</span>
                  <span className="text-[10px] font-mono text-[oklch(0.5_0.01_250)]">{p.identifier}</span>
                </button>
              );
            })}
          </div>
        )}

        <button onClick={() => setFavoritesOpen((v) => !v)} className="flex items-center gap-1 w-full px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-[oklch(0.5_0.01_250)] hover:text-[oklch(0.3_0.01_250)] transition-colors">
          <ChevronDown size={10} className={cn('transition-transform', !favoritesOpen && '-rotate-90')} />
          <span className="flex-1 text-left">Favorites</span>
          <Plus size={12} />
        </button>
        {favoritesOpen && (
          <div className="mb-3">
            <FavRow icon={<CycleIcon size={14} />} label="Cycle 24" color="#5E6AD2" />
            <FavRow icon={<Inbox size={14} />} label="Inbox" color="#8E9197" />
            <FavRow icon={<Favorites size={14} />} label="Following" color="#F0739A" />
            <FavRow icon={<Box size={14} />} label="All initiatives" color="#4CB7A5" />
          </div>
        )}

        <button className="flex items-center gap-1 w-full px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-[oklch(0.5_0.01_250)] hover:text-[oklch(0.3_0.01_250)] transition-colors">
          <ChevronDown size={10} className="transition-transform" />
          <span className="flex-1 text-left">Cycles</span>
          <Plus size={12} />
        </button>
        <div className="mb-3">
          {cycles.map((c) => {
            const p = projects.find((p) => p.id === c.projectId);
            if (!p) return null;
            return (
              <div key={c.id} className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-[oklch(0.3_0.01_250)] hover:bg-black/[0.04] transition-colors cursor-pointer">
                <span className="text-base leading-none">{p.icon}</span>
                <span className="text-[13px] font-medium flex-1 truncate">{c.name}</span>
                <span className="text-[10px] font-mono text-[oklch(0.5_0.01_250)]">{Math.round(c.progress * 100)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom: user */}
      <div className="px-2 py-2 border-t border-black/[0.06] flex items-center gap-2">
        <button className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-black/[0.04] transition-colors text-left">
          <img src={me.avatar} alt="" className="h-6 w-6 rounded-full ring-1 ring-white/40" />
          <span className="text-[13px] text-[oklch(0.18_0.005_250)] font-medium flex-1 truncate">{me.name}</span>
          <Settings size={13} className="text-[oklch(0.5_0.01_250)]" />
        </button>
      </div>
    </aside>
  );
}

function FavRow({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <button className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-[oklch(0.3_0.01_250)] hover:bg-black/[0.04] transition-colors text-left">
      <span style={{ color }}>{icon}</span>
      <span className="text-[13px] font-medium flex-1 truncate">{label}</span>
    </button>
  );
}
