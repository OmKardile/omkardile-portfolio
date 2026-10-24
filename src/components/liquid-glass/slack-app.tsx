'use client';

import { MessageInput } from '@/components/slack/message-input';
import { MessageList } from '@/components/slack/message-list';
import { MobileNav } from '@/components/slack/mobile-nav';
import { Sidebar } from '@/components/slack/sidebar';
import { ThreadSlideOver } from '@/components/slack/thread-slide-over';
import { ToastHost } from '@/components/slack/toast-host';
import { Topbar } from '@/components/slack/topbar';

export default function SlackLiquidGlassApp() {
  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <Sidebar />
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar />
        <MessageList />
        <MessageInput />
        <MobileNav />
        <ThreadSlideOver />
        <ToastHost />
      </main>
    </div>
  );
}