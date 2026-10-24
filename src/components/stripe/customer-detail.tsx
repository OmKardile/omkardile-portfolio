'use client';

import { useStripe } from '@/lib/stripe-store';
import { customers, transactions, formatCurrency, relativeTime, customerMap, type Customer, type Transaction } from '@/lib/stripe-data';
import { X, Mail, MapPin, Calendar, ArrowUpRight, ArrowDownLeft, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

export function CustomerDetail() {
  const selectedCustomerId = useStripe((s) => s.selectedCustomerId);
  const closeCustomer = useStripe((s) => s.closeCustomer);
  const customerFromStore = useStripe((s) => s.selectedCustomerId ? customers.find((c) => c.id === s.selectedCustomerId) ?? null : null);

  if (!selectedCustomerId || !customerFromStore) return null;

  return (
    <>
      <div className="absolute inset-0 bg-black/20 z-30 backdrop-fade-in" onClick={closeCustomer} />
      <aside className="absolute right-0 top-0 bottom-0 z-40 w-full sm:w-[480px] glass-strong border-l border-white/40 slide-in-right flex flex-col">
        <CustomerDetailInner customer={customerFromStore} onClose={closeCustomer} />
      </aside>
    </>
  );
}

export function TransactionDetail() {
  const selectedTransactionId = useStripe((s) => s.selectedTransactionId);
  const closeTransaction = useStripe((s) => s.closeTransaction);
  const txnFromStore = useStripe((s) => s.selectedTransactionId ? transactions.find((t) => t.id === s.selectedTransactionId) ?? null : null);
  const openCustomer = useStripe((s) => s.openCustomer);

  if (!selectedTransactionId || !txnFromStore) return null;
  const c = customerMap[txnFromStore.customerId];

  return (
    <>
      <div className="absolute inset-0 bg-black/20 z-30 backdrop-fade-in" onClick={closeTransaction} />
      <aside className="absolute right-0 top-0 bottom-0 z-40 w-full sm:w-[480px] glass-strong border-l border-white/40 slide-in-right flex flex-col">
        <header className="flex items-center justify-between px-5 py-3 border-b border-black/[0.06]">
          <div className="text-[13px] font-semibold text-[oklch(0.18_0.005_270)] truncate">Transaction</div>
          <button onClick={closeTransaction} className="h-7 w-7 rounded-md flex items-center justify-center text-[oklch(0.45_0.01_270)] hover:text-[oklch(0.18_0.005_270)] hover:bg-black/[0.04]" aria-label="Close panel">
            <X size={16} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-5">
          <div className="text-center mb-5">
            <div className={cn('inline-flex h-14 w-14 rounded-full items-center justify-center mb-3', txnFromStore.type === 'refund' ? 'bg-[oklch(0.6_0.24_25/0.12)] text-[oklch(0.5_0.24_25)]' : 'bg-[oklch(0.55_0.22_270/0.12)] text-[oklch(0.55_0.22_270)]')}>
              {txnFromStore.type === 'refund' ? <ArrowDownLeft size={22} /> : <ArrowUpRight size={22} />}
            </div>
            <div className="text-3xl font-bold text-[oklch(0.18_0.005_270)] tabular-nums">{formatCurrency(txnFromStore.amount)}</div>
            <div className="text-[12px] text-[oklch(0.45_0.01_270)] mt-1 capitalize">{txnFromStore.status} · {txnFromStore.type}</div>
          </div>

          {/* Customer block */}
          <button onClick={() => openCustomer(c.id)} className="w-full glass-subtle rounded-xl p-3 flex items-center gap-3 hover:bg-black/[0.04] transition-colors text-left mb-4">
            <img src={c.avatar} alt={c.name} className="h-10 w-10 rounded-full ring-1 ring-white/50" />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-[oklch(0.18_0.005_270)] truncate">{c.name}</div>
              <div className="text-[11px] text-[oklch(0.45_0.01_270)] truncate">{c.email}</div>
            </div>
            <ArrowUpRight size={14} className="text-[oklch(0.45_0.01_270)]" />
          </button>

          {/* Properties */}
          <div className="glass-subtle rounded-xl p-4 mb-4">
            <div className="text-[10px] uppercase tracking-wider font-bold text-[oklch(0.45_0.01_270)] mb-3">Properties</div>
            <div className="space-y-2.5 text-[12px]">
              <PropRow label="Description" value={txnFromStore.description} />
              <PropRow label="Method" value={txnFromStore.method.replace('_', ' ').toUpperCase()} />
              <PropRow label="Currency" value={txnFromStore.currency} />
              <PropRow label="Date" value={new Date(txnFromStore.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} />
              <PropRow label="Transaction ID" value={txnFromStore.id} mono />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button onClick={() => useStripe.getState().toast('Refund initiated (demo)')} className="flex-1 px-3 py-2 rounded-lg glass-subtle hover:bg-black/[0.04] text-[oklch(0.5_0.24_25)] text-[12px] font-semibold">Refund</button>
            <button onClick={() => useStripe.getState().toast('Opened in Stripe (demo)')} className="flex-1 px-3 py-2 rounded-lg glass-subtle hover:bg-black/[0.04] text-[oklch(0.3_0.01_270)] text-[12px] font-semibold">View in Stripe</button>
          </div>
        </div>
      </aside>
    </>
  );
}

function CustomerDetailInner({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const openTransaction = useStripe((s) => s.openTransaction);
  const customerTxns = useMemo(() => transactions.filter((t) => t.customerId === customer.id), [customer.id]);

  return (
    <>
      <header className="flex items-center justify-between px-5 py-3 border-b border-black/[0.06]">
        <div className="text-[13px] font-semibold text-[oklch(0.18_0.005_270)] truncate">Customer</div>
        <button onClick={onClose} className="h-7 w-7 rounded-md flex items-center justify-center text-[oklch(0.45_0.01_270)] hover:text-[oklch(0.18_0.005_270)] hover:bg-black/[0.04]" aria-label="Close panel">
          <X size={16} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <img src={customer.avatar} alt={customer.name} className="h-14 w-14 rounded-full ring-2 ring-white/60" />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-[oklch(0.18_0.005_270)] truncate">{customer.name}</h1>
            <div className="text-[12px] text-[oklch(0.45_0.01_270)] mt-0.5">{customer.email}</div>
          </div>
          <button className="h-8 w-8 rounded-full hover:bg-black/[0.04] flex items-center justify-center text-[oklch(0.45_0.01_270)] hover:text-[oklch(0.18_0.005_270)]">
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Stat label="Lifetime value" value={formatCurrency(customer.lifetimeValue)} />
          <Stat label="Status" value={<span className={cn('capitalize', customer.status === 'active' ? 'text-[oklch(0.4_0.18_145)]' : customer.status === 'delinquent' ? 'text-[oklch(0.5_0.24_25)]' : 'text-[oklch(0.45_0.01_270)]')}>{customer.status}</span>} />
          <Stat label="Since" value={new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} />
        </div>

        {/* Properties */}
        <div className="glass-subtle rounded-xl p-4 mb-4">
          <div className="text-[10px] uppercase tracking-wider font-bold text-[oklch(0.45_0.01_270)] mb-3">Properties</div>
          <div className="space-y-2.5 text-[12px]">
            <PropRow label="Email" value={customer.email} icon={<Mail size={11} />} />
            <PropRow label="Location" value={customer.location} icon={<MapPin size={11} />} />
            <PropRow label="Customer since" value={new Date(customer.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} icon={<Calendar size={11} />} />
            <PropRow label="Customer ID" value={customer.id} icon={<MoreHorizontal size={11} />} mono />
          </div>
        </div>

        {/* Transactions */}
        <div className="mb-3">
          <div className="text-[10px] uppercase tracking-wider font-bold text-[oklch(0.45_0.01_270)] mb-2">Recent transactions ({customerTxns.length})</div>
          {customerTxns.length === 0 ? (
            <div className="text-[12px] text-[oklch(0.45_0.01_270)] py-2">No transactions yet.</div>
          ) : (
            <div className="space-y-1">
              {customerTxns.slice(0, 5).map((t) => (
                <button key={t.id} onClick={() => openTransaction(t.id)} className="w-full glass-subtle rounded-lg px-3 py-2 flex items-center gap-3 hover:bg-black/[0.04] transition-colors text-left">
                  <div className={cn('h-7 w-7 rounded-full flex items-center justify-center shrink-0', t.type === 'refund' ? 'bg-[oklch(0.6_0.24_25/0.12)] text-[oklch(0.5_0.24_25)]' : 'bg-[oklch(0.55_0.22_270/0.12)] text-[oklch(0.55_0.22_270)]')}>
                    {t.type === 'refund' ? <ArrowDownLeft size={11} /> : <ArrowUpRight size={11} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-[oklch(0.18_0.005_270)] truncate">{t.description}</div>
                    <div className="text-[10px] text-[oklch(0.45_0.01_270)]">{relativeTime(t.createdAt)}</div>
                  </div>
                  <div className="text-[12px] font-semibold text-[oklch(0.18_0.005_270)] tabular-nums">{formatCurrency(t.amount)}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button onClick={() => useStripe.getState().toast('Email composed (demo)')} className="flex-1 px-3 py-2 rounded-lg glass-subtle hover:bg-black/[0.04] text-[oklch(0.3_0.01_270)] text-[12px] font-semibold">Email customer</button>
          <button onClick={() => useStripe.getState().toast('Refund issued (demo)')} className="flex-1 px-3 py-2 rounded-lg glass-subtle hover:bg-black/[0.04] text-[oklch(0.5_0.24_25)] text-[12px] font-semibold">Issue refund</button>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="glass-subtle rounded-xl p-3 text-center">
      <div className="text-[10px] text-[oklch(0.45_0.01_270)] mb-1">{label}</div>
      <div className="text-[13px] font-semibold text-[oklch(0.18_0.005_270)]">{value}</div>
    </div>
  );
}

function PropRow({ label, value, icon, mono }: { label: string; value: string; icon?: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-1.5 text-[oklch(0.45_0.01_270)] shrink-0">
        {icon}
        <span>{label}</span>
      </div>
      <div className={cn('text-[oklch(0.18_0.005_270)] text-right truncate', mono && 'font-mono text-[11px]')}>{value}</div>
    </div>
  );
}
