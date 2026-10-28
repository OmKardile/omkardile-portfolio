'use client';

import { useLinear } from '@/lib/linear-store';
import { cycleMap, projects, STATUS_DISPLAY } from '@/lib/linear-data';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  started:    '#F2C94C',
  in_review: '#5E6AD2',
  unstarted:  '#8E9197',
  completed:  '#4CB7A5',
  canceled:   '#6F6E72',
  backlog:    '#8E9197',
};

export function CycleHeader() {
  const mainView = useLinear((s) => s.mainView);
  const projectId = useLinear((s) => s.projectId);
  const issues = useLinear((s) => s.issues);
  if (mainView !== 'active') return null;

  const cycle = Object.values(cycleMap).find((c) => c.projectId === projectId);
  if (!cycle) return null;

  const cycleIssues = issues.filter((i) => i.cycleId === cycle.id);
  const total = cycleIssues.length;
  const done = cycleIssues.filter((i) => i.status === 'completed').length;
  const canceled = cycleIssues.filter((i) => i.status === 'canceled').length;
  const inProgress = cycleIssues.filter((i) => i.status === 'started' || i.status === 'in_review').length;
  const unstarted = cycleIssues.filter((i) => i.status === 'unstarted' || i.status === 'backlog').length;
  const progress = total > 0 ? (done + canceled) / total : 0;

  const project = projects.find((p) => p.id === projectId)!;
  const startDate = new Date(cycle.startsAt);
  const endDate = new Date(cycle.endsAt);
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / 86400000));
  const totalDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000));
  const dayProgress = Math.min(1, Math.max(0, 1 - daysLeft / totalDays));

  return (
    <div className="px-4 lg:px-6 pt-5 pb-3">
      {/* Title */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-bold text-[oklch(0.5_0.01_250)] mb-1 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.62_0.18_280)] pulse-dot" />
            Active cycle
          </div>
          <h2 className="text-[20px] font-bold text-[oklch(0.18_0.005_250)] leading-tight">{cycle.name}</h2>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-[oklch(0.5_0.01_250)]">{daysLeft}d left</div>
          <div className="text-[11px] text-[oklch(0.45_0.01_250)]">
            {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            {' – '}
            {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Time progress bar */}
      <div className="mb-1 flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-black/[0.03] rounded-full overflow-hidden relative">
          <div
            className="absolute inset-y-0 left-0 bg-[oklch(0.4_0.05_280)] rounded-full"
            style={{ width: `${dayProgress * 100}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-[oklch(0.5_0.01_250)] w-9 text-right">{Math.round(dayProgress * 100)}%</span>
      </div>
      <div className="text-[10px] text-[oklch(0.5_0.01_250)] mb-3">Time elapsed</div>

      {/* Status breakdown bar */}
      <div className="flex items-stretch gap-0.5 h-2 mb-3 rounded-full overflow-hidden bg-black/[0.03]">
        {[
          { color: STATUS_COLORS.completed, count: done },
          { color: STATUS_COLORS.started, count: inProgress },
          { color: STATUS_COLORS.unstarted, count: unstarted },
          { color: STATUS_COLORS.canceled, count: canceled },
        ].map((seg, i) => (
          <div
            key={i}
            className="h-full"
            style={{
              backgroundColor: seg.color,
              width: total > 0 ? `${(seg.count / total) * 100}%` : '0%',
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-[11px]">
        <Legend color={STATUS_COLORS.completed} count={done} label="Done" />
        <Legend color={STATUS_COLORS.started} count={inProgress} label="In progress" />
        <Legend color={STATUS_COLORS.unstarted} count={unstarted} label="Unstarted" />
        <Legend color={STATUS_COLORS.canceled} count={canceled} label="Canceled" />
        <div className="ml-auto text-[oklch(0.5_0.01_250)] font-mono">
          {done + canceled} / {total} issues · {Math.round(progress * 100)}%
        </div>
      </div>
    </div>
  );
}

function Legend({ color, count, label }: { color: string; count: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[oklch(0.45_0.01_250)]">{label}</span>
      <span className="text-[oklch(0.18_0.005_250)] font-mono">{count}</span>
    </div>
  );
}
