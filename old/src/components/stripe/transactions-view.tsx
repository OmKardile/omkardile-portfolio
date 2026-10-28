'use client';

import { useStripe } from '@/lib/stripe-store';
import { transactions, customerMap, formatCurrency, type Transaction } from '@/lib/stripe-data';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

export function TransactionsView() {
  const statusFilter = useStripe((s) => s.statusFilter);
  const setStatusFilter = useStripe((s) => s.setStatusFilter);
  const searchQuery = useStripe((s) => s.searchQuery);
  const setSearchQuery = useStripe((s) => s.setSearchQuery);
  const openTransaction = useStripe((s) => s.openTransaction);
  const openCustomer = useStripe((s) => s.openCustomer);

  const filtered = useMemo(() => {
    let list = transactions;
    if (statusFilter !== 'all') list = list.filter((t) => t.status === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((t) => {
        const c = customerMap[t.customerId];
        return c.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      });
    }
    return list;
  }, [statusFilter, searchQuery]);

  const statuses: ('all' | Transaction['status'])[] = ['all', 'succeeded', 'pending', 'failed', 'refunded'];

  return (
    <div className="px-4 lg:px-6 py-5 max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[oklch(0.18_0.005_270)]">Transactions</h1>
          <p className="text-[oklch(0.45_0.01_270)] text-sm mt-0.5">{filtered.length} of {transactions.length} shown</p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-none">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn('px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all', statusFilter === s ? 'glass-active text-[oklch(0.18_0.005_270)]' : 'glass-subtle text-[oklch(0.3_0.01_270)] hover:bg-black/[0.04]')}
          >
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_120px] gap-3 px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-[oklch(0.45_0.01_270)] border-b border-black/[0.06] glass-subtle">
          <span>Customer</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Date</span>
          <span className="text-right">ID</span>
        </div>
        <div className="flex flex-col">
          {filtered.length === 0 ? (
            <div className="px-4 py-12 text-center text-[oklch(0.45_0.01_270)] text-sm">No transactions match your filters.</div>
          ) : (
            filtered.map((t) => {
              const c = customerMap[t.customerId];
              return (
                <button
                  key={t.id}
                  onClick={() => openTransaction(t.id)}
                  className="row-hover grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_120px] gap-2 sm:gap-3 px-4 py-3 text-left items-center border-b border-black/[0.04] last:border-b-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={c.avatar} alt={c.name} className="h-9 w-9 rounded-full shrink-0 ring-1 ring-white/50" />
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-[oklch(0.18_0.005_270)] truncate">{c.name}</div>
                      <div className="text-[11px] text-[oklch(0.45_0.01_270)] truncate">{t.description}</div>
                      <button onClick={(e) => { e.stopPropagation(); openCustomer(c.id); }} className="sm:hidden text-[10px] text-[oklch(0.55_0.22_270)] hover:underline">{c.email}</button>
                    </div>
                  </div>
                  <div className="text-[13px] font-semibold text-[oklch(0.18_0.005_270)] tabular-nums">{formatCurrency(t.amount)}</div>
                  <div><StatusBadge status={t.status} /></div>
                  <div className="text-[11px] text-[oklch(0.45_0.01_270)]">{new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  <div className="hidden sm:block text-[10px] text-[oklch(0.45_0.01_270)] font-mono text-right truncate">{t.id.slice(-12)}</div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Transaction['status'] }) {
  const cfg: Record<Transaction['status'], { label: string; color: string; bg: string }> = {
    succeeded: { label: 'Succeeded', color: '#0a8754', bg: 'rgba(48, 209, 88, 0.12)' },
    pending:   { label: 'Pending',   color: '#a07000', bg: 'rgba(255, 159, 10, 0.12)' },
    failed:    { label: 'Failed',     color: '#a02020', bg: 'rgba(255, 59, 95, 0.12)' },
    refunded:  { label: 'Refunded',   color: '#5a4fb8', bg: 'rgba(99, 91, 255, 0.12)' },
  };
  const s = cfg[status];
  return <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ color: s.color, backgroundColor: s.bg }}>{s.label}</span>;
}
