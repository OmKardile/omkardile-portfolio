'use client';

import { useStripe } from '@/lib/stripe-store';
import { BalancesView } from '@/components/stripe/balances-view';
import { CustomerDetail, TransactionDetail } from '@/components/stripe/customer-detail';
import { CustomersView } from '@/components/stripe/customers-view';
import { DashboardView } from '@/components/stripe/dashboard-view';
import { MobileNav } from '@/components/stripe/mobile-nav';
import { Sidebar } from '@/components/stripe/sidebar';
import { ToastHost } from '@/components/stripe/toast-host';
import { Topbar } from '@/components/stripe/topbar';
import { TransactionsView } from '@/components/stripe/transactions-view';

export default function StripeLiquidGlassApp() {
  const view = useStripe((state) => state.view);
  let content;

  if (view === 'transactions') content = <TransactionsView />;
  else if (view === 'balances' || view === 'payouts') content = <BalancesView />;
  else if (view === 'customers') content = <CustomersView />;
  else content = <DashboardView />;

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <Sidebar />
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar />
        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin px-3 py-4 lg:px-6">
          {content}
        </div>
        <MobileNav />
        <CustomerDetail />
        <TransactionDetail />
        <ToastHost />
      </main>
    </div>
  );
}