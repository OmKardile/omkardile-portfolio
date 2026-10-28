// Stripe data model — Liquid Glass redesign case study.
// All customers, transactions, balances are fictional.

export type Customer = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  location: string;
  lifetimeValue: number;
  createdAt: string;
  status: 'active' | 'inactive' | 'delinquent';
};

export type Transaction = {
  id: string;
  customerId: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  type: 'payment' | 'refund' | 'payout' | 'fee';
  description: string;
  createdAt: string;
  method: 'card' | 'ach' | 'wire' | 'apple_pay';
};

export type Payout = {
  id: string;
  amount: number;
  status: 'paid' | 'in_transit' | 'pending' | 'failed';
  expectedAt: string;
  bank: string;
};

export type Balance = {
  available: number;
  pending: number;
  currency: string;
};

export type Kpi = {
  id: string;
  label: string;
  value: string;
  delta: number;
  trend: 'up' | 'down' | 'flat';
  spark: number[];
};

export type View = 'dashboard' | 'balances' | 'transactions' | 'customers' | 'payouts' | 'reports';

const avatar = (seed: string, size = 200) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/${size}/${size}`;

export const balance: Balance = {
  available: 47820.43,
  pending: 18342.18,
  currency: 'USD',
};

export const kpis: Kpi[] = [
  { id: 'k1', label: 'Gross volume',   value: '$284,419', delta: 12.4, trend: 'up',   spark: [42, 48, 45, 52, 58, 61, 68, 72] },
  { id: 'k2', label: 'Net revenue',    value: '$268,932', delta: 8.2,  trend: 'up',   spark: [38, 42, 41, 46, 52, 55, 62, 66] },
  { id: 'k3', label: 'New customers',  value: '1,847',    delta: 23.1, trend: 'up',   spark: [12, 18, 22, 28, 35, 42, 55, 68] },
  { id: 'k4', label: 'Payouts',        value: '$48,210',  delta: -3.1, trend: 'down', spark: [62, 58, 55, 52, 50, 48, 45, 42] },
];

// Revenue chart — last 30 days, time series
export const revenueSeries: { date: string; gross: number; net: number }[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  const gross = Math.round(8000 + Math.sin(i * 0.4) * 2000 + i * 180 + (Math.random() - 0.5) * 1200);
  const net = Math.round(gross * 0.94);
  return { date: d.toISOString().slice(0, 10), gross, net };
});

export const customers: Customer[] = [
  { id: 'c1', name: 'Acme Corp',          email: 'billing@acme.com',       avatar: avatar('acme-corp'),       location: 'San Francisco, CA', lifetimeValue: 42840,  createdAt: '2023-04-12', status: 'active' },
  { id: 'c2', name: 'Globex Industries',  email: 'ap@globex.io',            avatar: avatar('globex'),          location: 'Austin, TX',         lifetimeValue: 28190,  createdAt: '2023-07-22', status: 'active' },
  { id: 'c3', name: 'Initech LLC',         email: 'finance@initech.com',    avatar: avatar('initech'),          location: 'Remote',             lifetimeValue: 18420,  createdAt: '2024-01-08', status: 'active' },
  { id: 'c4', name: 'Umbrella Co',         email: 'pay@umbrella.dev',       avatar: avatar('umbrella'),        location: 'New York, NY',        lifetimeValue: 67420,  createdAt: '2022-11-03', status: 'active' },
  { id: 'c5', name: 'Stark Resolutions',  email: 'ops@starkres.com',        avatar: avatar('stark'),           location: 'Boston, MA',         lifetimeValue: 12840,  createdAt: '2024-03-15', status: 'delinquent' },
  { id: 'c6', name: 'Wayne Industries',    email: 'ar@wayne.io',             avatar: avatar('wayne'),           location: 'Chicago, IL',        lifetimeValue: 92180,  createdAt: '2023-09-29', status: 'active' },
  { id: 'c7', name: 'Cyberdyne Labs',      email: 'billing@cyberdyne.ai',   avatar: avatar('cyberdyne'),       location: 'Seattle, WA',        lifetimeValue: 35280,  createdAt: '2023-12-04', status: 'active' },
  { id: 'c8', name: 'Tilt Studios',        email: 'pay@tilt.dev',            avatar: avatar('tilt-studios'),    location: 'Remote',             lifetimeValue: 8420,   createdAt: '2024-06-18', status: 'inactive' },
];

export const customerMap: Record<string, Customer> = Object.fromEntries(customers.map((c) => [c.id, c]));

export const transactions: Transaction[] = [
  { id: 'txn_3PqZ1aB2c3D4e5F6', customerId: 'c1', amount: 4280.00, currency: 'USD', status: 'succeeded', type: 'payment', description: 'Monthly subscription — Pro plan',           createdAt: '2024-10-21T09:14:00Z', method: 'card' },
  { id: 'txn_3PqY9cC4d5E6f7G8', customerId: 'c2', amount: 1240.50, currency: 'USD', status: 'succeeded', type: 'payment', description: 'Invoice #2841 — Design services',         createdAt: '2024-10-21T08:42:00Z', method: 'ach' },
  { id: 'txn_3PqX8eD5f6G7h8I9', customerId: 'c4', amount: 8240.00, currency: 'USD', status: 'pending',   type: 'payment', description: 'Annual renewal — Enterprise',          createdAt: '2024-10-21T07:18:00Z', method: 'wire' },
  { id: 'txn_3PqW7fE6g7H8i9J0', customerId: 'c6', amount: 324.18,  currency: 'USD', status: 'succeeded', type: 'refund',  description: 'Refund — Duplicate charge',              createdAt: '2024-10-21T06:02:00Z', method: 'card' },
  { id: 'txn_3PqV6gF7h8I9j0K1', customerId: 'c7', amount: 1820.00, currency: 'USD', status: 'succeeded', type: 'payment', description: 'API usage — Q4 billing',                 createdAt: '2024-10-20T22:14:00Z', method: 'card' },
  { id: 'txn_3PqU5hG8i9J0k1L2', customerId: 'c1', amount: 4280.00, currency: 'USD', status: 'succeeded', type: 'payment', description: 'Monthly subscription — Pro plan',           createdAt: '2024-10-20T09:14:00Z', method: 'card' },
  { id: 'txn_3PqT4iH9j0K1l2M3', customerId: 'c5', amount: 240.00,  currency: 'USD', status: 'failed',    type: 'payment', description: 'Monthly subscription — Starter',          createdAt: '2024-10-20T04:32:00Z', method: 'card' },
  { id: 'txn_3PqS3jI0k1L2m3N4', customerId: 'c3', amount: 980.00,   currency: 'USD', status: 'succeeded', type: 'payment', description: 'One-time — Onboarding package',          createdAt: '2024-10-19T18:42:00Z', method: 'apple_pay' },
  { id: 'txn_3PqR2kJ1l2M3n4O5', customerId: 'c2', amount: 1240.50, currency: 'USD', status: 'succeeded', type: 'payment', description: 'Invoice #2840 — Design services',         createdAt: '2024-10-19T08:42:00Z', method: 'ach' },
  { id: 'txn_3PqQ1lK2m3N4o5P6', customerId: 'c4', amount: 1240.00, currency: 'USD', status: 'refunded',  type: 'refund',  description: 'Refund — Service cancellation',           createdAt: '2024-10-18T14:18:00Z', method: 'card' },
  { id: 'txn_3PqP0mL3n4O5p6Q7', customerId: 'c6', amount: 2840.00, currency: 'USD', status: 'succeeded', type: 'payment', description: 'Monthly subscription — Enterprise',       createdAt: '2024-10-18T09:14:00Z', method: 'wire' },
  { id: 'txn_3PqO9nM4o5P6q7R8', customerId: 'c7', amount: 1820.00, currency: 'USD', status: 'succeeded', type: 'payment', description: 'API usage — Q3 billing',                   createdAt: '2024-10-17T22:14:00Z', method: 'card' },
  { id: 'txn_3PqN8oN5p6Q7r8S9', customerId: 'c1', amount: 4280.00, currency: 'USD', status: 'succeeded', type: 'payment', description: 'Monthly subscription — Pro plan',           createdAt: '2024-10-17T09:14:00Z', method: 'card' },
  { id: 'txn_3PqM7pO6q7R8s9T0', customerId: 'c8', amount: 240.00,  currency: 'USD', status: 'succeeded', type: 'payment', description: 'Monthly subscription — Starter',          createdAt: '2024-10-16T09:14:00Z', method: 'card' },
];

export const payouts: Payout[] = [
  { id: 'po_1', amount: 32480.18, status: 'paid',      expectedAt: '2024-10-18', bank: 'Chase •••• 4821' },
  { id: 'po_2', amount: 24180.42, status: 'in_transit', expectedAt: '2024-10-25', bank: 'Chase •••• 4821' },
  { id: 'po_3', amount: 18342.18, status: 'pending',   expectedAt: '2024-11-01', bank: 'Chase •••• 4821' },
];

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);
}

export function formatCompact(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`;
  if (Math.abs(amount) >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
  return `$${amount.toFixed(0)}`;
}

export function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffSec = Math.floor((now - then) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 86400 * 7) return `${Math.floor(diffSec / 86400)}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
