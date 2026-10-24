'use client';

import { useStripe } from '@/lib/stripe-store';
import { customers, formatCurrency, type Customer } from '@/lib/stripe-data';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useState } from 'react';

export function CustomersView() {
  const openCustomer = useStripe((s) => s.openCustomer);
  const [filter, setFilter] = useState('');

  const filtered = customers.filter((c) => c.name.toLowerCase().includes(filter.toLowerCase()) || c.email.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="px-4 lg:px-6 py-5 max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[oklch(0.18_0.005_270)]">Customers</h1>
          <p className="text-[oklch(0.45_0.01_270)] text-sm mt-0.5">{customers.length} total</p>
        </div>
        <div className="relative w-full max-w-[280px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[oklch(0.45_0.01_270)]" />
          <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search customers" className="w-full h-9 pl-9 pr-3 rounded-lg glass-subtle border-white/40 text-[13px] text-[oklch(0.18_0.005_270)] placeholder:text-[oklch(0.45_0.01_270)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.55_0.22_270)]/40" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((c) => <CustomerCard key={c.id} customer={c} onClick={() => openCustomer(c.id)} />)}
      </div>
    </div>
  );
}

function CustomerCard({ customer, onClick }: { customer: Customer; onClick: () => void }) {
  return (
    <button onClick={onClick} className="glass-subtle rounded-2xl p-4 hover:bg-white/75 transition-colors text-left card-lift">
      <div className="flex items-center gap-3 mb-3">
        <img src={customer.avatar} alt={customer.name} className="h-11 w-11 rounded-full ring-1 ring-white/60" />
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-semibold text-[oklch(0.18_0.005_270)] truncate">{customer.name}</div>
          <div className="text-[11px] text-[oklch(0.45_0.01_270)] truncate">{customer.email}</div>
        </div>
        <span className={cn('inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize', customer.status === 'active' ? 'bg-[oklch(0.6_0.18_145/0.12)] text-[oklch(0.4_0.18_145)]' : customer.status === 'delinquent' ? 'bg-[oklch(0.6_0.24_25/0.12)] text-[oklch(0.5_0.24_25)]' : 'bg-[oklch(0.5_0.01_270/0.12)] text-[oklch(0.45_0.01_270)]')}>{customer.status}</span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-[oklch(0.45_0.01_270)]">
        <span>{customer.location}</span>
        <span className="font-semibold text-[oklch(0.18_0.005_270)] tabular-nums">{formatCurrency(customer.lifetimeValue)} LTV</span>
      </div>
    </button>
  );
}
