'use client';

import { useLinear } from '@/lib/linear-store';
import { cn } from '@/lib/utils';
import { Inbox, Repeat as CycleIcon, CheckSquare, Search } from 'lucide-react';

export function MobileNav() {
  const mainView = useLinear((s) => s.mainView);
  const setMainView = useLinear((s) => s.setMainView);
  const toggleCmd = useLinear((s) => s.toggleCmd);

  const items: { id: typeof mainView; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: 'active',    label: 'Active',  icon: CycleIcon },
    { id: 'backlog',   label: 'Backlog', icon: Inbox },
    { id: 'my-issues', label: 'Mine',     icon: CheckSquare },
  ];

  return (
    <nav className="md:hidden h-14 shrink-0 glass border-t border-black/[0.06] flex items-stretch">
      {items.map((it) => {
        const Icon = it.icon;
        const active = mainView === it.id;
        return (
          <button
            key={it.id}
            onClick={() => setMainView(it.id)}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium',
              active ? 'text-[oklch(0.18_0.005_250)]' : 'text-[oklch(0.45_0.01_250)]',
            )}
          >
            <Icon size={18} />
            <span>{it.label}</span>
          </button>
        );
      })}
      <button
        onClick={toggleCmd}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-[oklch(0.45_0.01_250)]"
      >
        <Search size={18} />
        <span>Search</span>
      </button>
    </nav>
  );
}
