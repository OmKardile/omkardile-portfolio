'use client';

import { useLinear } from '@/lib/linear-store';
import { BoardView } from '@/components/linear/board-view';
import { CommandPalette } from '@/components/linear/command-palette';
import { CycleHeader } from '@/components/linear/cycle-header';
import { IssueDetail } from '@/components/linear/issue-detail';
import { IssueListView } from '@/components/linear/issue-list-view';
import { KeyboardShortcuts } from '@/components/linear/keyboard-shortcuts';
import { MobileNav } from '@/components/linear/mobile-nav';
import { ShortcutsOverlay } from '@/components/linear/shortcuts-overlay';
import { Sidebar } from '@/components/linear/sidebar';
import { ToastHost } from '@/components/linear/toast-host';
import { Topbar } from '@/components/linear/topbar';

export default function LinearLiquidGlassApp() {
  const layout = useLinear((state) => state.layout);
  const mainView = useLinear((state) => state.mainView);

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <Sidebar />
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar />
        {mainView === 'active' && <CycleHeader />}
        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
          {layout === 'board' ? <BoardView /> : <IssueListView />}
        </div>
        <MobileNav />
        <IssueDetail />
        <CommandPalette />
        <ShortcutsOverlay />
        <ToastHost />
      </main>
      <KeyboardShortcuts />
    </div>
  );
}