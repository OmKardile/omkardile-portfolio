'use client';

import { useLinear } from '@/lib/linear-store';
import { issues, projects, userMap, projectMap } from '@/lib/linear-data';
import type { MainView } from '@/lib/linear-store';
import { StatusIcon, PriorityIcon } from './icons';
import { cn } from '@/lib/utils';
import {
  Search, CornerDownLeft, ArrowUp, ArrowDown, LayoutList, Columns3,
  Plus, Hash, Inbox, CheckSquare, SquareStack, Keyboard,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export function CommandPalette() {
  const cmdOpen = useLinear((s) => s.cmdOpen);
  const setCmdOpen = useLinear((s) => s.setCmdOpen);
  const openIssue = useLinear((s) => s.openIssue);
  const setProjectId = useLinear((s) => s.setProjectId);
  const setMainView = useLinear((s) => s.setMainView);
  const setLayout = useLinear((s) => s.setLayout);
  const setShortcutsOpen = useLinear((s) => s.setShortcutsOpen);
  const projectId = useLinear((s) => s.projectId);

  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cmdOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [cmdOpen]);

  const items = useMemo(() => {
    type Item = { id: string; label: string; hint?: string; icon: React.ReactNode; onSelect: () => void; group: string };
    const result: Item[] = [];

    const issueResults = issues
      .filter((i) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return i.title.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) || i.description.toLowerCase().includes(q);
      })
      .slice(0, 6);
    for (const issue of issueResults) {
      result.push({
        id: `issue-${issue.id}`,
        group: 'Issues',
        label: issue.title,
        hint: issue.id,
        icon: <StatusIcon status={issue.status} size={12} />,
        onSelect: () => { setProjectId(issue.projectId); openIssue(issue.id); setCmdOpen(false); },
      });
    }

    const views: { id: MainView; label: string; icon: React.ReactNode }[] = [
      { id: 'active',    label: 'Go to Active',      icon: <Hash size={12} /> },
      { id: 'backlog',   label: 'Go to Backlog',      icon: <Inbox size={12} /> },
      { id: 'my-issues', label: 'Go to My Issues',   icon: <CheckSquare size={12} /> },
      { id: 'all',       label: 'Go to All Issues',  icon: <SquareStack size={12} /> },
    ];
    for (const v of views) {
      if (query.trim() && !v.label.toLowerCase().includes(query.toLowerCase())) continue;
      result.push({ id: `view-${v.id}`, group: 'Navigation', label: v.label, icon: v.icon, onSelect: () => { setMainView(v.id); setCmdOpen(false); } });
    }

    if (!query.trim() || 'list board'.includes(query.toLowerCase())) {
      result.push({ id: 'layout-list', group: 'Layout', label: 'Switch to List view', icon: <LayoutList size={12} />, onSelect: () => { setLayout('list'); setCmdOpen(false); } });
      result.push({ id: 'layout-board', group: 'Layout', label: 'Switch to Board view', icon: <Columns3 size={12} />, onSelect: () => { setLayout('board'); setCmdOpen(false); } });
    }

    for (const p of projects) {
      if (query.trim() && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.identifier.toLowerCase().includes(query.toLowerCase())) continue;
      if (p.id === projectId) continue;
      result.push({ id: `project-${p.id}`, group: 'Switch project', label: `Switch to ${p.name}`, hint: p.identifier, icon: <span className="text-base leading-none">{p.icon}</span>, onSelect: () => { setProjectId(p.id); setCmdOpen(false); } });
    }

    result.push({ id: 'show-shortcuts', group: 'Help', label: 'Show keyboard shortcuts', icon: <Keyboard size={12} />, onSelect: () => { setShortcutsOpen(true); setCmdOpen(false); } });

    if (!query.trim() || 'new issue create'.includes(query.toLowerCase())) {
      result.push({ id: 'new-issue', group: 'Create', label: 'Create new issue', icon: <Plus size={12} />, onSelect: () => { useLinear.getState().toast('New issue dialog not implemented in this demo'); setCmdOpen(false); } });
    }

    return result;
  }, [query, projectId, openIssue, setProjectId, setMainView, setLayout, setCmdOpen, setShortcutsOpen]);

  const flatItems = items;
  const totalCommands = flatItems.length;

  const grouped = useMemo(() => {
    const map = new Map<string, typeof items>();
    for (const it of items) {
      if (!map.has(it.group)) map.set(it.group, []);
      map.get(it.group)!.push(it);
    }
    return Array.from(map.entries());
  }, [items]);

  // Esc/arrow/enter keyboard handler
  useEffect(() => {
    if (!cmdOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { e.preventDefault(); setCmdOpen(false); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, items.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
      else if (e.key === 'Enter') { e.preventDefault(); const item = items[activeIdx]; if (item) item.onSelect(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cmdOpen, items, activeIdx, setCmdOpen]);

  if (!cmdOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 backdrop-fade-in" onClick={() => setCmdOpen(false)}>
      <div className="absolute inset-0 bg-black/25" />
      <div
        className="relative w-full max-w-[640px] glass-strong border-white/50 rounded-2xl overflow-hidden cmd-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-black/[0.06]">
          <Search size={16} className="text-[oklch(0.45_0.01_250)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-[14px] text-[oklch(0.18_0.005_250)] placeholder:text-[oklch(0.5_0.01_250)] focus:outline-none"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded glass-subtle text-[oklch(0.4_0.01_250)]">esc</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin p-1.5">
          {flatItems.length === 0 ? (
            <div className="px-4 py-8 text-center text-[13px] text-[oklch(0.5_0.01_250)]">No results for &ldquo;{query}&rdquo;</div>
          ) : (
            grouped.map(([groupName, groupItems]) => (
              <div key={groupName} className="mb-1">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-[oklch(0.5_0.01_250)]">{groupName}</div>
                {groupItems.map((it) => {
                  const idx = flatItems.indexOf(it);
                  const active = idx === activeIdx;
                  return (
                    <button
                      key={it.id}
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={() => it.onSelect()}
                      className={cn(
                        'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left transition-colors',
                        active ? 'glass-active text-[oklch(0.18_0.005_250)]' : 'text-[oklch(0.25_0.005_250)] hover:bg-black/[0.04]',
                      )}
                    >
                      <span className={cn('flex items-center justify-center w-5', active ? 'text-[oklch(0.55_0.2_250)]' : 'text-[oklch(0.5_0.01_250)]')}>{it.icon}</span>
                      <span className="flex-1 text-[13px] font-medium truncate">{it.label}</span>
                      {it.hint && <span className={cn('text-[10px] font-mono', active ? 'text-[oklch(0.4_0.01_250)]' : 'text-[oklch(0.5_0.01_250)]')}>{it.hint}</span>}
                      {active && <CornerDownLeft size={11} className="text-[oklch(0.55_0.2_250)]" />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-black/[0.06] text-[10px] text-[oklch(0.5_0.01_250)]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><ArrowUp size={10} /><ArrowDown size={10} /> navigate</span>
            <span className="flex items-center gap-1"><CornerDownLeft size={10} /> select</span>
            <span>esc to close</span>
          </div>
          <span className="font-mono">{totalCommands} commands</span>
        </div>
      </div>
    </div>
  );
}
