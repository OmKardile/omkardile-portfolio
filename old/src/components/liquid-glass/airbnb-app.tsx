'use client';

import { ExploreView } from '@/components/airbnb/explore-view';
import { ListingDetail } from '@/components/airbnb/listing-detail';
import { MobileNav } from '@/components/airbnb/mobile-nav';
import { ToastHost } from '@/components/airbnb/toast-host';
import { CategoryBar, Topbar } from '@/components/airbnb/topbar';

export default function AirbnbLiquidGlassApp() {
  return (
    <main className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <Topbar />
      <CategoryBar />
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
        <ExploreView />
      </div>
      <MobileNav />
      <ListingDetail />
      <ToastHost />
    </main>
  );
}
