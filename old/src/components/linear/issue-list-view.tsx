'use client';

import { useLinear } from '@/lib/linear-store';
import {
  projectMap, userMap, labelMap, relativeTime, formatDueDate,
  type Issue, type IssueStatus, type Priority,
} from '@/lib/linear-data';
import { StatusIcon, PriorityIcon, LabelChip } from './icons';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useMemo } from 'react';

export function IssueListView() {
  const visibleIssues = useLinear((s) => s.visibleIssues);
  const issues = useLinear((s) => s.issues);
  const projectId = useLinear((s) => s.projectId);
  const mainView = useLinear((s) => s.mainView);
  const sortBy = useLinear((s) => s.sortBy);
  const sortDir = useLinear((s) => s.sortDir);
  const setSortBy = useLinear((s) => s.setSortBy);
  const openIssue = useLinear((s) => s.openIssue);

  const list = useMemo(() => visibleIssues(), [visibleIssues, issues, projectId, mainView, sortBy, sortDir]);

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-4xl mb-3 opacity-30">∅</div>
        <h3 className="text-[oklch(0.18_0.005_250)] text-lg font-bold mb-1">No issues match</h3>
        <p className="text-[oklch(0.45_0.01_250)] text-sm">Try clearing your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6 py-3">
      <div className="hidden sm:grid grid-cols-[28px_60px_28px_minmax(0,1fr)_120px_80px_100px_60px] gap-3 px-3 py-2 mb-2 text-[10px] uppercase tracking-wider font-bold text-[oklch(0.45_0.01_250)] glass-subtle rounded-lg">
        <SortHeader field="status" cur={sortBy} dir={sortDir} onClick={setSortBy} className="text-center">ID</SortHeader>
        <SortHeader field="priority" cur={sortBy} dir={sortDir} onClick={setSortBy} className="text-center">Priority</SortHeader>
        <div />
        <SortHeader field="updatedAt" cur={sortBy} dir={sortDir} onClick={setSortBy}>Title</SortHeader>
        <SortHeader field="updatedAt" cur={sortBy} dir={sortDir} onClick={setSortBy}>Labels</SortHeader>
        <div>Assignee</div>
        <div>Updated</div>
        <div className="text-right">Due</div>
      </div>

      {/* Glass panel containing all rows */}
      <div className="glass rounded-xl p-1.5">
        <div className="flex flex-col">
          {list.map((issue) => (
            <IssueRow key={issue.id} issue={issue} onOpen={() => openIssue(issue.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SortHeader({ children, field, cur, dir, onClick, className }: {
  children: React.ReactNode;
  field: 'status' | 'priority' | 'updatedAt' | 'dueDate' | 'assignee';
  cur: string; dir: 'asc' | 'desc';
  onClick: (f: typeof field) => void;
  className?: string;
}) {
  const active = cur === field;
  return (
    <button
      onClick={() => onClick(field)}
      className={cn('flex items-center gap-1 hover:text-[oklch(0.18_0.005_250)] transition-colors text-left', active && 'text-[oklch(0.18_0.005_250)]', className)}
    >
      {children}
      {active && (dir === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />)}
    </button>
  );
}

function IssueRow({ issue, onOpen }: { issue: Issue; onOpen: () => void }) {
  const project = projectMap[issue.projectId];
  const assignee = issue.assigneeId ? userMap[issue.assigneeId] : null;
  const due = formatDueDate(issue.dueDate);
  const updated = relativeTime(issue.updatedAt);

  return (
    <button
      onClick={onOpen}
      className="row-hover group grid grid-cols-[28px_60px_28px_minmax(0,1fr)_120px_80px_100px_60px] gap-3 px-3 py-2 rounded-lg text-left items-center"
    >
      <div className="flex items-center justify-center">
        <StatusIcon status={issue.status} size={14} />
      </div>
      <div className="font-mono text-[11px] text-[oklch(0.5_0.01_250)] text-center">{issue.id}</div>
      <div className="flex items-center justify-center">
        <PriorityIcon priority={issue.priority} size={14} />
      </div>
      <div className="min-w-0 text-[oklch(0.18_0.005_250)] text-[13px] truncate font-medium">{issue.title}</div>
      <div className="flex items-center gap-1 overflow-hidden">
        {issue.labelIds.slice(0, 2).map((lid) => {
          const label = labelMap[lid];
          if (!label) return null;
          return <LabelChip key={lid} label={label} />;
        })}
        {issue.labelIds.length > 2 && <span className="text-[10px] text-[oklch(0.5_0.01_250)]">+{issue.labelIds.length - 2}</span>}
      </div>
      <div className="flex items-center justify-start">
        {assignee ? (
          <img src={assignee.avatar} alt={assignee.name} title={assignee.name} className="h-6 w-6 rounded-full ring-1 ring-white/50" />
        ) : (
          <div className="h-6 w-6 rounded-full border border-dashed border-black/15" title="Unassigned" />
        )}
      </div>
      <div className="text-[11px] text-[oklch(0.4_0.01_250)]">{updated}</div>
      <div
        className={cn(
          'text-[11px] text-right',
          due.tone === 'overdue' && 'text-[oklch(0.6_0.24_25)] font-medium',
          due.tone === 'soon' && 'text-[oklch(0.5_0.18_50)] font-medium',
          due.tone === 'normal' && 'text-[oklch(0.4_0.01_250)]',
          due.tone === 'none' && 'text-[oklch(0.55_0.01_250)]',
        )}
      >
        {due.label || '—'}
      </div>
    </button>
  );
}
