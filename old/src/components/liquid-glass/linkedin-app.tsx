'use client';

import { useLinkedIn } from '@/lib/linkedin-store';
import { CreatePostComposer } from '@/components/linkedin/create-post-modal';
import { FeedView } from '@/components/linkedin/feed-view';
import { JobsView } from '@/components/linkedin/jobs-view';
import { MessagingView } from '@/components/linkedin/messaging-view';
import { MobileNav } from '@/components/linkedin/mobile-nav';
import { NetworkView } from '@/components/linkedin/network-view';
import { NotificationsView } from '@/components/linkedin/notifications-view';
import { ProfileView } from '@/components/linkedin/profile-view';
import { Sidebar } from '@/components/linkedin/sidebar';
import { ToastHost } from '@/components/linkedin/toast-host';
import { Topbar } from '@/components/linkedin/topbar';

export default function LinkedInLiquidGlassApp() {
  const view = useLinkedIn((state) => state.view);
  let content;

  if (view === 'network') content = <NetworkView />;
  else if (view === 'jobs') content = <JobsView />;
  else if (view === 'messaging') content = <MessagingView />;
  else if (view === 'notifications') content = <NotificationsView />;
  else if (view === 'profile') content = <ProfileView />;
  else content = <FeedView />;

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <Sidebar />
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar />
        <div className={`min-h-0 flex-1 ${view === 'messaging' ? 'overflow-hidden' : 'overflow-y-auto scrollbar-thin px-3 py-4 lg:px-6'}`}>
          {content}
        </div>
        <MobileNav />
        <CreatePostComposer />
        <ToastHost />
      </main>
    </div>
  );
}