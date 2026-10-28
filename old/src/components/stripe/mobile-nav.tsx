'use client';

import { useStripe } from '@/lib/stripe-store';
import { Banknote, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const view = useStripe((s) => s.view);
  const setView = useStripe((s) => s.setView);
  const items = [
    { id: 'dashboard' as const, label: 'Home', icon: BarChart3 },
    { id: 'transactions' as const, label: 'Txns', icon: Banknote },
    { id: 'customers' as const, label: 'Customers', icon: Banknote },
    { id: 'balances' as const, label: 'Balances', icon: Banknote },
  ];
  return (
    <nav className="md:hidden h-16 shrink-0 mx-2 mb-2 glass-strong rounded-2xl border-t border-white/40 flex items-stretch z-30">
      {items.map((it) => {
        const Icon = it.icon;
        const active = view === it.id;
        return (
          <button key={it.id} onClick={() => setView(it.id)} className={cn('flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium', active ? 'text-[oklch(0.55_0.22_270)]' : 'text-[oklch(0.45_0.01_270)]')}>
            <Icon size={20} />
            <span>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
