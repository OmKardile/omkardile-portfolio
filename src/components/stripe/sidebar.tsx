'use client';

import { useStripe } from '@/lib/stripe-store';
import type { View } from '@/lib/stripe-data';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Wallet, Receipt, Users, Banknote, BarChart3, Settings, LifeBuoy } from 'lucide-react';

export function Sidebar() {
  const view = useStripe((s) => s.view);
  const setView = useStripe((s) => s.setView);

  const items: { id: View; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
    { id: 'balances',      label: 'Balances',     icon: Wallet },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'customers',    label: 'Customers',    icon: Users },
    { id: 'payouts',       label: 'Payouts',       icon: Banknote },
    { id: 'reports',       label: 'Reports',       icon: BarChart3 },
  ];

  return (
    <aside className="hidden md:flex md:flex-col w-[220px] shrink-0 m-2 mr-1 rounded-2xl glass overflow-hidden text-sm">
      {/* Workspace switcher */}
      <div className="px-3 pt-3 pb-2">
        <button className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-black/[0.04] transition-colors">
          <div className="h-7 w-7 rounded-md flex items-center justify-center text-xs font-bold text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #635BFF 0%, #8a83ff 100%)' }}>S</div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-[oklch(0.18_0.005_270)] font-semibold text-[13px] truncate">Stripe Inc.</div>
            <div className="text-[10px] text-[oklch(0.45_0.01_270)] truncate">Production</div>
          </div>
        </button>
      </div>

      <nav className="px-2 flex-1">
        {items.map((it) => {
          const active = view === it.id;
          const Icon = it.icon;
          return (
            <button key={it.id} onClick={() => setView(it.id)} className={cn('flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all text-left', active ? 'glass-active text-[oklch(0.18_0.005_270)] font-semibold' : 'text-[oklch(0.3_0.01_270)] hover:bg-black/[0.04]')}>
              <Icon size={16} className="shrink-0" />
              <span className="text-[13px]">{it.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-2 border-t border-black/[0.06]">
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-black/[0.04] transition-colors text-left text-[oklch(0.3_0.01_270)]">
          <Settings size={16} /> <span className="text-[13px]">Settings</span>
        </button>
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-black/[0.04] transition-colors text-left text-[oklch(0.3_0.01_270)]">
          <LifeBuoy size={16} /> <span className="text-[13px]">Support</span>
        </button>
      </div>
    </aside>
  );
}
