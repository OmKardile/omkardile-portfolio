'use client';

import { useLinear } from '@/lib/linear-store';
import { projects } from '@/lib/linear-data';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  LayoutList,
  Columns3,
  Plus,
  Search as SearchIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Topbar() {
  const projectId = useLinear((s) => s.projectId);
  const mainView = useLinear((s) => s.mainView);
  const layout = useLinear((s) => s.layout);
  const setLayout = useLinear((s) => s.setLayout);
  const toggleCmd = useLinear((s) => s.toggleCmd);
  const searchQuery = useLinear((s) => s.searchQuery);
  const setSearchQuery = useLinear((s) => s.setSearchQuery);

  const project = projects.find((p) => p.id === projectId)!;
  const viewLabel = mainView === 'my-issues' ? 'My Issues' : mainView === 'all' ? 'All Issues' : mainView.charAt(0).toUpperCase() + mainView.slice(1);

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 px-4 lg:px-6 h-14 glass-subtle border-b border-black/[0.06]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-base leading-none">{project.icon}</span>
        <span className="text-sm font-semibold text-[oklch(0.18_0.005_250)] truncate">{project.name}</span>
        <span className="text-[oklch(0.5_0.01_250)]">/</span>
        <span className="text-sm text-[oklch(0.3_0.01_250)]">{viewLabel}</span>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="hidden sm:flex relative">
        <SearchIcon size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[oklch(0.5_0.01_250)]" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter issues..."
          className="w-[180px] lg:w-[260px] h-8 pl-8 pr-3 rounded-lg glass-subtle hover:bg-black/[0.04] text-[13px] text-[oklch(0.18_0.005_250)] placeholder:text-[oklch(0.5_0.01_250)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.55_0.2_250)]/40 transition-colors"
        />
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={toggleCmd}
        className="h-8 px-2.5 text-[12px] text-[oklch(0.3_0.01_250)] hover:text-[oklch(0.18_0.005_250)] hover:bg-black/[0.04]"
      >
        <SearchIcon size={14} className="mr-1.5" />
        <span className="hidden lg:inline">Search</span>
        <kbd className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/[0.06]">⌘K</kbd>
      </Button>

      {/* Layout switcher */}
      <div className="flex items-center glass-subtle rounded-lg p-0.5">
        <button
          onClick={() => setLayout('list')}
          className={cn(
            'flex items-center gap-1 px-2 h-7 rounded text-[11px] font-medium transition-all',
            layout === 'list' ? 'glass-active text-[oklch(0.18_0.005_250)]' : 'text-[oklch(0.45_0.01_250)] hover:text-[oklch(0.18_0.005_250)]',
          )}
          aria-label="List view"
        >
          <LayoutList size={13} />
        </button>
        <button
          onClick={() => setLayout('board')}
          className={cn(
            'flex items-center gap-1 px-2 h-7 rounded text-[11px] font-medium transition-all',
            layout === 'board' ? 'glass-active text-[oklch(0.18_0.005_250)]' : 'text-[oklch(0.45_0.01_250)] hover:text-[oklch(0.18_0.005_250)]',
          )}
          aria-label="Board view"
        >
          <Columns3 size={13} />
        </button>
      </div>

      {/* New issue button — Apple-style filled accent */}
      <Button
        size="sm"
        className="h-8 bg-[oklch(0.55_0.2_250)] hover:bg-[oklch(0.6_0.2_250)] text-white text-[12px] font-semibold shadow-sm"
        onClick={() => useLinear.getState().toast('New issue dialog not implemented in this demo')}
      >
        <Plus size={14} className="mr-1" />
        <span className="hidden lg:inline">New issue</span>
      </Button>
    </header>
  );
}
