'use client';

import { useLinear } from '@/lib/linear-store';
import { X } from 'lucide-react';

const SHORTCUTS: { keys: string[]; label: string; group: string }[] = [
  // Navigation
  { keys: ['⌘', 'K'],             label: 'Open command palette',        group: 'Navigation' },
  { keys: ['/',],                  label: 'Focus issue filter',          group: 'Navigation' },
  { keys: ['G', 'A'],              label: 'Go to Active cycle issues',  group: 'Navigation' },
  { keys: ['G', 'B'],              label: 'Go to Backlog',              group: 'Navigation' },
  { keys: ['G', 'M'],              label: 'Go to My Issues',           group: 'Navigation' },
  { keys: ['G', 'L'],              label: 'Go to All Issues',          group: 'Navigation' },
  { keys: ['1'],                    label: 'Switch to List view',       group: 'Navigation' },
  { keys: ['2'],                    label: 'Switch to Board view',      group: 'Navigation' },
  { keys: ['Esc'],                  label: 'Close current panel',       group: 'Navigation' },
  // Issue actions
  { keys: ['N'],                    label: 'New issue (dialog)',        group: 'Issues' },
  { keys: ['C'],                    label: 'Compose a comment',         group: 'Issues' },
  { keys: ['?',],                  label: 'Show this dialog',           group: 'Issues' },
];

export function ShortcutsOverlay() {
  const open = useLinear((s) => s.shortcutsOpen);
  const setOpen = useLinear((s) => s.setShortcutsOpen);

  if (!open) return null;

  const grouped: Record<string, typeof SHORTCUTS> = {};
  for (const s of SHORTCUTS) {
    if (!grouped[s.group]) grouped[s.group] = [];
    grouped[s.group].push(s);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-fade-in"
      onClick={() => setOpen(false)}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div
        className="relative w-full max-w-[560px] glass-strong border border-black/[0.08] rounded-xl shadow-2xl overflow-hidden cmd-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-5 py-3.5 border-b border-black/[0.06]">
          <h2 className="text-[14px] font-semibold text-[oklch(0.18_0.005_250)]">Keyboard shortcuts</h2>
          <button
            onClick={() => setOpen(false)}
            className="h-7 w-7 rounded-md flex items-center justify-center text-[oklch(0.45_0.01_250)] hover:text-[oklch(0.18_0.005_250)] hover:bg-black/[0.03] transition-colors"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </header>

        <div className="p-5 space-y-5">
          {Object.entries(grouped).map(([group, items]) => (
            <section key={group}>
              <div className="text-[10px] uppercase tracking-wider font-bold text-[oklch(0.5_0.01_250)] mb-2.5">
                {group}
              </div>
              <div className="space-y-1.5">
                {items.map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-[13px] text-[oklch(0.18_0.005_250)]">{s.label}</span>
                    <div className="flex items-center gap-1">
                      {s.keys.map((k, i) => (
                        <kbd
                          key={i}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/[0.06] text-[oklch(0.25_0.005_250)] border border-black/[0.06]"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
