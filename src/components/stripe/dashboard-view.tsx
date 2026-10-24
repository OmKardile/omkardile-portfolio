'use client';

import { useStripe } from '@/lib/stripe-store';
import { kpis, balance, revenueSeries, transactions, customerMap, formatCurrency, formatCompact, type Kpi, type Transaction } from '@/lib/stripe-data';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export function DashboardView() {
  const openCustomer = useStripe((s) => s.openCustomer);
  const openTransaction = useStripe((s) => s.openTransaction);
  const setView = useStripe((s) => s.setView);
  const recentTxns = transactions.slice(0, 5);

  return (
    <div className="px-4 lg:px-6 py-5 max-w-[1100px] mx-auto">
      {/* Balance banner */}
      <div className="glass rounded-2xl p-5 mb-5 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-bold text-[oklch(0.45_0.01_270)] mb-1">Available balance</div>
          <div className="text-3xl font-bold text-[oklch(0.18_0.005_270)]">{formatCurrency(balance.available)}</div>
          <div className="text-[12px] text-[oklch(0.45_0.01_270)] mt-1">+ {formatCurrency(balance.pending)} pending</div>
        </div>
        <button onClick={() => setView('payouts')} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-subtle hover:bg-black/[0.04] text-[oklch(0.18_0.005_270)] text-[12px] font-semibold">
          Payouts <ArrowUpRight size={12} />
        </button>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {kpis.map((k) => <KpiCard key={k.id} kpi={k} />)}
      </div>

      {/* Revenue chart */}
      <div className="glass rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[15px] font-semibold text-[oklch(0.18_0.005_270)]">Gross volume</h2>
            <p className="text-[11px] text-[oklch(0.45_0.01_270)]">Last 30 days</p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-[oklch(0.3_0.01_270)]">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#635BFF' }} />
              Gross
            </span>
            <span className="flex items-center gap-1.5 text-[oklch(0.3_0.01_270)]">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#a8c8ff' }} />
              Net
            </span>
          </div>
        </div>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueSeries} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
              <defs>
                <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#635BFF" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#635BFF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a8c8ff" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#a8c8ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6e6e73' }} tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} interval={4} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#6e6e73' }} tickFormatter={(v) => formatCompact(v)} axisLine={false} tickLine={false} width={45} />
              <Tooltip
                contentStyle={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, fontSize: 11, boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12)' }}
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(l: string) => new Date(l).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              />
              <Area type="monotone" dataKey="gross" stroke="#635BFF" strokeWidth={2} fill="url(#grossGrad)" />
              <Area type="monotone" dataKey="net" stroke="#a8c8ff" strokeWidth={1.5} fill="url(#netGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-[oklch(0.18_0.005_270)]">Recent transactions</h2>
          <button onClick={() => setView('transactions')} className="text-[11px] font-semibold text-[oklch(0.55_0.22_270)] hover:underline">View all →</button>
        </div>
        <div className="flex flex-col">
          {recentTxns.map((t) => {
            const c = customerMap[t.customerId];
            return (
              <button key={t.id} onClick={() => openTransaction(t.id)} className="row-hover flex items-center gap-3 px-3 py-2.5 rounded-lg text-left">
                <img src={c.avatar} alt={c.name} className="h-9 w-9 rounded-full shrink-0 ring-1 ring-white/50" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-[oklch(0.18_0.005_270)] truncate">{c.name}</div>
                  <div className="text-[11px] text-[oklch(0.45_0.01_270)] truncate">{t.description}</div>
                </div>
                <div className="hidden sm:block text-[11px] text-[oklch(0.45_0.01_270)] font-mono">{t.id.slice(-12)}</div>
                <StatusBadge status={t.status} />
                <div className="text-[13px] font-semibold text-[oklch(0.18_0.005_270)] tabular-nums w-20 text-right">{formatCurrency(t.amount)}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : null;
  return (
    <div className="glass-subtle rounded-xl p-4 break-inside-avoid">
      <div className="text-[11px] text-[oklch(0.45_0.01_270)] mb-1">{kpi.label}</div>
      <div className="text-2xl font-bold text-[oklch(0.18_0.005_270)] mb-1 tabular-nums">{kpi.value}</div>
      <div className="flex items-center gap-1.5 text-[11px]">
        {TrendIcon && (
          <span className={cn('inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-semibold', kpi.trend === 'up' ? 'text-[oklch(0.4_0.18_145)] bg-[oklch(0.6_0.18_145/0.1)]' : 'text-[oklch(0.5_0.24_25)] bg-[oklch(0.6_0.24_25/0.1)]')}>
            <TrendIcon size={11} />
            {kpi.delta > 0 ? '+' : ''}{kpi.delta}%
          </span>
        )}
        <span className="text-[oklch(0.45_0.01_270)]">vs last period</span>
      </div>
      {/* Sparkline */}
      <div className="mt-2 h-6 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={kpi.spark.map((v, i) => ({ i, v }))}>
            <Line type="monotone" dataKey="v" stroke="#635BFF" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Transaction['status'] }) {
  const cfg: Record<Transaction['status'], { label: string; color: string; bg: string }> = {
    succeeded: { label: 'Succeeded', color: '#0a8754', bg: 'rgba(48, 209, 88, 0.12)' },
    pending:   { label: 'Pending',   color: '#a07000', bg: 'rgba(255, 159, 10, 0.12)' },
    failed:    { label: 'Failed',      color: '#a02020', bg: 'rgba(255, 59, 95, 0.12)' },
    refunded:  { label: 'Refunded',   color: '#5a4fb8', bg: 'rgba(99, 91, 255, 0.12)' },
  };
  const s = cfg[status];
  return (
    <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ color: s.color, backgroundColor: s.bg }}>
      {s.label}
    </span>
  );
}
