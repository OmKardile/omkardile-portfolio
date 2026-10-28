'use client';

import { useStripe } from '@/lib/stripe-store';
import { cn } from '@/lib/utils';
import { ChevronDown, Search, Bell, Plus } from 'lucide-react';
import { useState } from 'react';

const RANGES = [
  { id: '7d' as const, label: '7 days' },
  { id: '30d' as const, label: '30 days' },
  { id: '90d' as const, label: '90 days' },
  { id: '1y' as const, label: '1 year' },
  { id: 'all' as const, label: 'All time' },
];

export function Topbar() {
  const dateRange = useStripe((s) => s.dateRange);
  const setDateRange = useStripe((s) => s.setDateRange);
  const searchQuery = useStripe((s) => s.searchQuery);
  const setSearchQuery = useStripe((s) => s.setSearchQuery);
  const [rangeOpen, setRangeOpen] = useState(false);
  const currentRange = RANGES.find((r) => r.id === dateRange);

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 px-4 lg:px-6 h-14 glass-subtle border-b border-black/[0.06]">
      {/* Date range selector */}
      <div className="relative">
        <button onClick={() => setRangeOpen((v) => !v)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-subtle hover:bg-black/[0.04] text-[oklch(0.3_0.01_270)] text-[12px] font-medium transition-colors">
          {currentRange?.label}
          <ChevronDown size={14} className={cn('transition-transform', rangeOpen && 'rotate-180')} />
        </button>
        {rangeOpen && (
          <div className="absolute top-full left-0 mt-1 glass-strong rounded-lg p-1 w-[140px] z-30">
            {RANGES.map((r) => (
              <button key={r.id} onClick={() => { setDateRange(r.id); setRangeOpen(false); }} className={cn('block w-full px-3 py-1.5 rounded-md text-[12px] text-left transition-colors', r.id === dateRange ? 'glass-active text-[oklch(0.18_0.005_270)] font-semibold' : 'text-[oklch(0.3_0.01_270)] hover:bg-black/[0.04]')}>
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="hidden sm:flex relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[oklch(0.45_0.01_270)]" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search transactions, customers..."
          className="w-[200px] lg:w-[280px] h-8 pl-8 pr-3 rounded-lg glass-subtle hover:bg-black/[0.04] text-[13px] text-[oklch(0.18_0.005_270)] placeholder:text-[oklch(0.45_0.01_270)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.55_0.22_270)]/40 transition-colors"
        />
      </div>

      <button className="h-8 w-8 rounded-full glass-subtle flex items-center justify-center text-[oklch(0.3_0.01_270)] hover:bg-black/[0.04]" aria-label="Notifications">
        <Bell size={16} />
      </button>

      <button onClick={() => useStripe.getState().toast('Create payment modal not implemented in this demo')} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[oklch(0.55_0.22_270)] hover:bg-[oklch(0.6_0.22_270)] text-white text-[12px] font-semibold shadow-sm">
        <Plus size={14} /> Create
      </button>
    </header>
  );
}
