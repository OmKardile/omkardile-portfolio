'use client';

import { useStripe } from '@/lib/stripe-store';
import { transactions, customerMap, payouts, balance, formatCurrency, type Transaction } from '@/lib/stripe-data';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { Banknote, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export function BalancesView() {
  const totalBalance = balance.available + balance.pending;

  return (
    <div className="px-4 lg:px-6 py-5 max-w-[1100px] mx-auto">
      <h1 className="text-2xl font-bold text-[oklch(0.18_0.005_270)] mb-4">Balances</h1>

      {/* Big balance card */}
      <div className="glass rounded-2xl p-6 mb-5">
        <div className="text-[10px] uppercase tracking-wider font-bold text-[oklch(0.45_0.01_270)] mb-1">Total balance</div>
        <div className="text-4xl font-bold text-[oklch(0.18_0.005_270)] tabular-nums mb-4">{formatCurrency(totalBalance)}</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-subtle rounded-xl p-4">
            <div className="text-[11px] text-[oklch(0.45_0.01_270)] mb-1">Available</div>
            <div className="text-2xl font-bold text-[oklch(0.18_0.005_270)] tabular-nums">{formatCurrency(balance.available)}</div>
            <p className="text-[11px] text-[oklch(0.45_0.01_270)] mt-2 leading-relaxed">Funds available for immediate payout. Net of Stripe fees.</p>
          </div>
          <div className="glass-subtle rounded-xl p-4">
            <div className="text-[11px] text-[oklch(0.45_0.01_270)] mb-1">Pending</div>
            <div className="text-2xl font-bold text-[oklch(0.18_0.005_270)] tabular-nums">{formatCurrency(balance.pending)}</div>
            <p className="text-[11px] text-[oklch(0.45_0.01_270)] mt-2 leading-relaxed">Funds in transit. Typically available in 2-7 business days depending on the payment method.</p>
          </div>
        </div>
      </div>

      {/* Payouts */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-[oklch(0.18_0.005_270)]">Payouts</h2>
          <Banknote size={16} className="text-[oklch(0.55_0.22_270)]" />
        </div>
        <div className="flex flex-col">
          {payouts.map((p) => {
            const cfg = payoutStatusConfig(p.status);
            return (
              <div key={p.id} className="row-hover flex items-center gap-3 px-3 py-3 rounded-lg border-b border-black/[0.04] last:border-b-0">
                <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: cfg.bg }}>
                  {p.status === 'paid' ? <ArrowUpRight size={14} className="text-[oklch(0.4_0.18_145)]" /> : <ArrowDownLeft size={14} className="text-[oklch(0.45_0.01_270)]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-[oklch(0.18_0.005_270)] tabular-nums">{formatCurrency(p.amount)}</div>
                  <div className="text-[11px] text-[oklch(0.45_0.01_270)]">{p.bank}</div>
                </div>
                <div className="text-right">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ color: cfg.color, backgroundColor: cfg.bg }}>{cfg.label}</span>
                  <div className="text-[10px] text-[oklch(0.45_0.01_270)] mt-1">{new Date(p.expectedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function payoutStatusConfig(s: string): { label: string; color: string; bg: string } {
  switch (s) {
    case 'paid':       return { label: 'Paid',        color: '#0a8754', bg: 'rgba(48, 209, 88, 0.12)' };
    case 'in_transit': return { label: 'In transit', color: '#a07000', bg: 'rgba(255, 159, 10, 0.12)' };
    case 'pending':    return { label: 'Pending',     color: '#5a4fb8', bg: 'rgba(99, 91, 255, 0.12)' };
    case 'failed':     return { label: 'Failed',       color: '#a02020', bg: 'rgba(255, 59, 95, 0.12)' };
    default:           return { label: s, color: '#6e6e73', bg: 'rgba(0, 0, 0, 0.05)' };
  }
}
