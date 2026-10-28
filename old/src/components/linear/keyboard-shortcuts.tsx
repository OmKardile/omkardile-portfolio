'use client';

import { useEffect } from 'react';
import { useLinear } from '@/lib/linear-store';

/**
 * Global keyboard shortcuts (Linear parity):
 *   ⌘K / Ctrl+K   Open command palette
 *   /             Focus issue filter (topbar search)
 *   N             New issue (demo)
 *   ?             Show keyboard shortcuts overlay
 *   C             Create new comment (when issue open)
 *   Esc           Close command palette / issue slide-over / shortcuts overlay
 *   G then A      Go to Active
 *   G then B      Go to Backlog
 *   G then M      Go to My Issues
 *   G then L      Go to All Issues
 *   1             List layout
 *   2             Board layout
 */
export function KeyboardShortcuts() {
  useEffect(() => {
    let gPending = false;
    let gTimeout: ReturnType<typeof setTimeout> | null = null;

    function isFormField(el: EventTarget | null): boolean {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName.toLowerCase();
      return tag === 'input' || tag === 'textarea' || el.isContentEditable;
    }

    function handler(e: KeyboardEvent) {
      const s = useLinear.getState();

      // ⌘K / Ctrl+K — always works
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        s.toggleCmd();
        return;
      }

      // Escape — always closes things in priority order
      if (e.key === 'Escape') {
        if (s.cmdOpen) { s.setCmdOpen(false); e.preventDefault(); return; }
        if (s.selectedIssueId) { s.closeIssue(); e.preventDefault(); return; }
        if (s.shortcutsOpen) { s.setShortcutsOpen(false); e.preventDefault(); return; }
        return;
      }

      // Block further shortcuts when typing in a form field
      if (isFieldTypeAhead(e.target)) return;
      // Block if a Popover or other overlay might be open (heuristic — check if focus is in a button)
      if (isFormField(e.target)) return;

      // Two-key 'g' then letter — for navigation
      if (e.key === 'g' && !gPending) {
        gPending = true;
        if (gTimeout) clearTimeout(gTimeout);
        gTimeout = setTimeout(() => { gPending = false; }, 800);
        return;
      }
      if (gPending) {
        gPending = false;
        if (gTimeout) clearTimeout(gTimeout);
        const lk = e.key.toLowerCase();
        if (lk === 'a') { e.preventDefault(); s.setMainView('active'); return; }
        if (lk === 'b') { e.preventDefault(); s.setMainView('backlog'); return; }
        if (lk === 'm') { e.preventDefault(); s.setMainView('my-issues'); return; }
        if (lk === 'l') { e.preventDefault(); s.setMainView('all'); return; }
        return;
      }

      switch (e.key) {
        case '?':
          e.preventDefault();
          s.setShortcutsOpen(!s.shortcutsOpen);
          break;
        case '/': {
          e.preventDefault();
          const inp = document.querySelector<HTMLInputElement>('input[placeholder="Filter issues..."]');
          inp?.focus();
          break;
        }
        case 'n':
        case 'N':
          e.preventDefault();
          s.toast('New issue dialog not implemented in this demo');
          break;
        case '1':
          e.preventDefault();
          s.setLayout('list');
          break;
        case '2':
          e.preventDefault();
          s.setLayout('board');
          break;
        case 'c':
        case 'C': {
          if (!s.selectedIssueId) return;
          e.preventDefault();
          const ta = document.querySelector<HTMLTextAreaElement>('textarea[placeholder^="Add a comment"]');
          ta?.focus();
          break;
        }
      }
    }

    function isFieldTypeAhead(el: EventTarget | null): boolean {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName.toLowerCase();
      return tag === 'input' || tag === 'textarea' || el.isContentEditable;
    }

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return null;
}
