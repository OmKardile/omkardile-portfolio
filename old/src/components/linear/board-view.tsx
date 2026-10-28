'use client';

import { useLinear } from '@/lib/linear-store';
import { type IssueStatus, type Issue, projectMap, userMap, labelMap } from '@/lib/linear-data';
import { StatusIcon, PriorityIcon, LabelChip } from './icons';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

const COLUMNS: { status: IssueStatus; label: string; color: string }[] = [
  { status: 'unstarted',  label: 'Unstarted',   color: '#8E9197' },
  { status: 'started',    label: 'In Progress', color: '#F2C94C' },
  { status: 'in_review',  label: 'In Review',   color: '#5E6AD2' },
  { status: 'completed',  label: 'Completed',   color: '#4CB7A5' },
  { status: 'canceled',   label: 'Canceled',     color: '#6F6E72' },
];

export function BoardView() {
  const visibleIssues = useLinear((s) => s.visibleIssues);
  const issues = useLinear((s) => s.issues);
  const projectId = useLinear((s) => s.projectId);
  const mainView = useLinear((s) => s.mainView);
  const openIssue = useLinear((s) => s.openIssue);
  const setStatus = useLinear((s) => s.setStatus);
  const dragIssueId = useLinear.getState().setStatus;

  const list = useMemo(() => visibleIssues(), [visibleIssues, issues, projectId, mainView]);

  const grouped = COLUMNS.map((col) => ({
    ...col,
    items: list.filter((i) => i.status === col.status),
  }));

  return (
    <div className="px-4 lg:px-6 py-3 overflow-x-auto scrollbar-thin">
      <div className="flex gap-3 min-w-max">
        {grouped.map((col) => (
          <div key={col.status} className="w-72 shrink-0">
            {/* Column header */}
            <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
              <StatusIcon status={col.status} size={12} />
              <span className="text-[12px] font-semibold text-[oklch(0.18_0.005_250)]">{col.label}</span>
              <span className="text-[10px] font-mono text-[oklch(0.5_0.01_250)] ml-auto">{col.items.length}</span>
            </div>

            {/* Column body */}
            <div
              className="glass rounded-md p-1.5 min-h-[200px] flex flex-col gap-1.5"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const issueId = e.dataTransfer.getData('text/plain');
                if (issueId) {
                  setStatus(issueId, col.status);
                }
              }}
            >
              {col.items.length === 0 ? (
                <div className="text-[11px] text-[oklch(0.55_0.01_250)] text-center py-4">Drop here</div>
              ) : (
                col.items.map((issue) => (
                  <BoardCard key={issue.id} issue={issue} onClick={() => openIssue(issue.id)} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BoardCard({ issue, onClick }: { issue: Issue; onClick: () => void }) {
  const project = projectMap[issue.projectId];
  const assignee = issue.assigneeId ? userMap[issue.assigneeId] : null;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', issue.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onClick={onClick}
      className="group glass-subtle hover:glass-strong rounded-md p-3 cursor-pointer border border-black/[0.06] hover:border-black/[0.08] transition-colors"
    >
      {/* Top: priority + ID */}
      <div className="flex items-center gap-2 mb-2">
        <PriorityIcon priority={issue.priority} size={12} />
        <span className="font-mono text-[10px] text-[oklch(0.5_0.01_250)]">{issue.id}</span>
      </div>

      {/* Title */}
      <div className="text-[13px] text-[oklch(0.18_0.005_250)] font-medium leading-snug mb-2">
        {issue.title}
      </div>

      {/* Labels */}
      {issue.labelIds.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {issue.labelIds.slice(0, 3).map((lid) => {
            const label = labelMap[lid];
            if (!label) return null;
            return <LabelChip key={lid} label={label} />;
          })}
        </div>
      )}

      {/* Bottom: assignee */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-[oklch(0.5_0.01_250)]">{project.icon} {project.identifier}</span>
        {assignee ? (
          <img src={assignee.avatar} alt={assignee.name} title={assignee.name} className="h-5 w-5 rounded-full" />
        ) : (
          <div className="h-5 w-5 rounded-full border border-dashed border-white/20" />
        )}
      </div>
    </div>
  );
}
