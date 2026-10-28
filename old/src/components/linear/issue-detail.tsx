'use client';

import { useLinear } from '@/lib/linear-store';
import {
  issueMap, projectMap, userMap, labelMap, cycleMap,
  relativeTime, formatDueDate, CURRENT_USER_ID,
  type Issue, type IssueStatus, type Priority,
  STATUS_DISPLAY, PRIORITY_DISPLAY, users,
} from '@/lib/linear-data';
import { StatusIcon, PriorityIcon, LabelChip } from './icons';
import { cn } from '@/lib/utils';
import {
  X, ChevronDown, Check, Calendar, User as UserIcon, Tag,
  Repeat as Cycle, MessageSquare, Activity, Trash2,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';

export function IssueDetail() {
  const selectedIssueId = useLinear((s) => s.selectedIssueId);
  const closeIssue = useLinear((s) => s.closeIssue);
  const issueFromStore = useLinear((s) =>
    s.selectedIssueId ? s.issues.find((i) => i.id === s.selectedIssueId) ?? null : null,
  );

  if (!selectedIssueId || !issueFromStore) return null;

  return (
    <>
      {/* Backdrop — Apple-style blur dimmer */}
      <div className="absolute inset-0 bg-black/20 z-30 backdrop-fade-in" onClick={closeIssue} />

      {/* Slide-over — Liquid Glass strong */}
      <aside className="absolute right-0 top-0 bottom-0 z-40 w-full sm:w-[560px] glass-strong border-l border-white/40 slide-in-right flex flex-col">
        <IssueDetailInner issue={issueFromStore} onClose={closeIssue} />
      </aside>
    </>
  );
}

function IssueDetailInner({ issue, onClose }: { issue: Issue; onClose: () => void }) {
  const project = projectMap[issue.projectId];
  const assignee = issue.assigneeId ? userMap[issue.assigneeId] : null;
  const cycle = issue.cycleId ? cycleMap[issue.cycleId] : null;
  const due = formatDueDate(issue.dueDate);

  const setStatus = useLinear((s) => s.setStatus);
  const setPriority = useLinear((s) => s.setPriority);
  const setAssignee = useLinear((s) => s.setAssignee);
  const [commentDraft, setCommentDraft] = useState('');

  function submitComment() {
    if (!commentDraft.trim()) return;
    useLinear.getState().toast('Comment posted (demo)');
    setCommentDraft('');
  }

  return (
    <>
      <header className="flex items-center justify-between px-5 py-3 border-b border-black/[0.06]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base leading-none">{project.icon}</span>
          <span className="font-mono text-[12px] text-[oklch(0.18_0.005_250)] font-semibold">{issue.id}</span>
          <span className="text-[oklch(0.5_0.01_250)]">/</span>
          <span className="text-[12px] text-[oklch(0.3_0.01_250)] truncate">{project.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => useLinear.getState().toast('Copied link to clipboard')}
            className="text-[11px] font-mono text-[oklch(0.4_0.01_250)] hover:text-[oklch(0.18_0.005_250)] px-2 py-1 rounded hover:bg-black/[0.04] transition-colors"
          >
            Copy link
          </button>
          <button onClick={onClose} className="h-7 w-7 rounded-md flex items-center justify-center text-[oklch(0.4_0.01_250)] hover:text-[oklch(0.18_0.005_250)] hover:bg-black/[0.04] transition-colors" aria-label="Close panel">
            <X size={16} />
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
        <div className="px-5 pt-5 pb-3">
          <h1 className="text-[22px] font-bold text-[oklch(0.18_0.005_250)] leading-tight">{issue.title}</h1>
        </div>
        <div className="px-5 pb-5">
          <p className="text-[13px] text-[oklch(0.3_0.01_250)] leading-relaxed">{issue.description}</p>
        </div>

        {/* Properties — glass-subtle card */}
        <div className="mx-5 my-3 p-4 glass-subtle rounded-xl">
          <div className="text-[10px] uppercase tracking-wider font-bold text-[oklch(0.5_0.01_250)] mb-3">Properties</div>
          <div className="grid grid-cols-[120px_1fr] gap-y-2 gap-x-4 text-[13px]">
            <PropLabel icon={<StatusIcon status={issue.status} size={11} />} label="Status" />
            <SelectField
              value={issue.status}
              onChange={(v) => setStatus(issue.id, v as IssueStatus)}
              options={(Object.keys(STATUS_DISPLAY) as IssueStatus[]).map((s) => ({
                value: s, label: STATUS_DISPLAY[s].label, icon: <StatusIcon status={s} size={12} />,
              }))}
              currentLabel={<span className="flex items-center gap-2"><StatusIcon status={issue.status} size={12} />{STATUS_DISPLAY[issue.status].label}</span>}
            />

            <PropLabel icon={<PriorityIcon priority={issue.priority} size={11} />} label="Priority" />
            <SelectField
              value={String(issue.priority)}
              onChange={(v) => setPriority(issue.id, Number(v) as Priority)}
              options={([3, 2, 1, 0] as Priority[]).map((p) => ({
                value: String(p), label: PRIORITY_DISPLAY[p].label, icon: <PriorityIcon priority={p} size={12} />,
              }))}
              currentLabel={<span className="flex items-center gap-2"><PriorityIcon priority={issue.priority} size={12} />{PRIORITY_DISPLAY[issue.priority].label}</span>}
            />

            <PropLabel icon={<UserIcon size={11} />} label="Assignee" />
            <SelectField
              value={issue.assigneeId ?? 'unassigned'}
              onChange={(v) => setAssignee(issue.id, v === 'unassigned' ? null : v)}
              options={[
                { value: 'unassigned', label: 'Unassigned', icon: <div className="h-3 w-3 rounded-full border border-dashed border-black/30" /> },
                ...users.map((u) => ({ value: u.id, label: u.name, icon: <img src={u.avatar} alt="" className="h-3 w-3 rounded-full" /> })),
              ]}
              currentLabel={assignee ? (
                <span className="flex items-center gap-2"><img src={assignee.avatar} alt="" className="h-3 w-3 rounded-full" />{assignee.name}</span>
              ) : <span className="text-[oklch(0.5_0.01_250)]">Unassigned</span>}
            />

            <PropLabel icon={<Tag size={11} />} label="Labels" />
            <div className="flex flex-wrap gap-1.5 items-center">
              {issue.labelIds.length === 0 ? <span className="text-[oklch(0.5_0.01_250)] text-[12px]">None</span> : issue.labelIds.map((lid) => {
                const label = labelMap[lid];
                if (!label) return null;
                return <LabelChip key={lid} label={label} size="md" />;
              })}
            </div>

            <PropLabel icon={<Cycle size={11} />} label="Cycle" />
            <div className="text-[13px] text-[oklch(0.18_0.005_250)]">
              {cycle ? (
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.55_0.2_250)] pulse-dot" />
                  {cycle.name}
                  <span className="text-[10px] font-mono text-[oklch(0.5_0.01_250)]">{Math.round(cycle.progress * 100)}%</span>
                </span>
              ) : <span className="text-[oklch(0.5_0.01_250)]">No cycle</span>}
            </div>

            <PropLabel icon={<Calendar size={11} />} label="Due" />
            <div className={cn('text-[13px]', due.tone === 'overdue' ? 'text-[oklch(0.6_0.24_25)] font-medium' : 'text-[oklch(0.18_0.005_250)]')}>
              {due.tone === 'none' ? '—' : due.label}
            </div>
          </div>
        </div>

        {/* Activity */}
        {issue.activity.length > 0 && (
          <div className="px-5 py-4">
            <div className="text-[10px] uppercase tracking-wider font-bold text-[oklch(0.5_0.01_250)] mb-3 flex items-center gap-1.5">
              <Activity size={11} /> Activity
            </div>
            <div className="space-y-2.5">
              {issue.activity.slice().reverse().map((act) => {
                const actor = userMap[act.actorId];
                return (
                  <div key={act.id} className="flex items-start gap-2 text-[12px]">
                    <img src={actor.avatar} alt="" className="h-5 w-5 rounded-full mt-0.5 shrink-0 ring-1 ring-white/40" />
                    <div className="min-w-0">
                      <span className="text-[oklch(0.18_0.005_250)] font-medium">{actor.name}</span>{' '}
                      <span className="text-[oklch(0.4_0.01_250)]">{verbDescription(act.verb)}</span>
                      {act.from && act.to && (
                        <span className="text-[oklch(0.4_0.01_250)]"> — <span className="line-through">{act.from}</span> → <span className="text-[oklch(0.18_0.005_250)]">{act.to}</span></span>
                      )}
                      <div className="text-[10px] text-[oklch(0.55_0.01_250)] mt-0.5">{relativeTime(act.at)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="px-5 py-4">
          <div className="text-[10px] uppercase tracking-wider font-bold text-[oklch(0.5_0.01_250)] mb-3 flex items-center gap-1.5">
            <MessageSquare size={11} /> Comments ({issue.comments.length})
          </div>
          {issue.comments.length === 0 ? (
            <div className="text-[12px] text-[oklch(0.5_0.01_250)] mb-3">No comments yet.</div>
          ) : (
            <div className="space-y-3 mb-3">
              {issue.comments.map((c) => {
                const author = userMap[c.authorId];
                return (
                  <div key={c.id} className="flex items-start gap-2">
                    <img src={author.avatar} alt="" className="h-6 w-6 rounded-full mt-0.5 shrink-0 ring-1 ring-white/40" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[12px] text-[oklch(0.18_0.005_250)] font-medium">{author.name}</span>
                        <span className="text-[10px] text-[oklch(0.5_0.01_250)]">{relativeTime(c.createdAt)}</span>
                      </div>
                      <div className="text-[12.5px] text-[oklch(0.3_0.01_250)] leading-relaxed mt-0.5">{c.body}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-start gap-2 mt-3">
            <img src={userMap[CURRENT_USER_ID].avatar} alt="" className="h-6 w-6 rounded-full mt-1 shrink-0 ring-1 ring-white/40" />
            <div className="flex-1 min-w-0">
              <textarea
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); submitComment(); } }}
                placeholder="Add a comment... (Cmd+Enter to submit)"
                rows={2}
                className="w-full glass-subtle rounded-lg px-3 py-2 text-[12.5px] text-[oklch(0.18_0.005_250)] placeholder:text-[oklch(0.5_0.01_250)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.55_0.2_250)]/40 resize-none"
              />
              <div className="flex justify-end mt-1">
                <button onClick={submitComment} disabled={!commentDraft.trim()} className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[oklch(0.55_0.2_250)] hover:bg-[oklch(0.6_0.2_250)] text-white disabled:opacity-40 transition-colors shadow-sm">
                  Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="px-5 py-2.5 border-t border-black/[0.06] flex items-center justify-between">
        <span className="text-[10px] text-[oklch(0.5_0.01_250)]">Updated {relativeTime(issue.updatedAt)}</span>
        <button onClick={() => useLinear.getState().toast('Delete not implemented in this demo')} className="text-[10px] text-[oklch(0.5_0.01_250)] hover:text-[oklch(0.6_0.24_25)] flex items-center gap-1">
          <Trash2 size={11} /> Delete
        </button>
      </footer>
    </>
  );
}

function PropLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[oklch(0.5_0.01_250)] text-[12px] py-1.5">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function SelectField<T extends string>({ value, onChange, options, currentLabel }: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; icon?: React.ReactNode }[];
  currentLabel: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="text-[13px] text-[oklch(0.18_0.005_250)] hover:bg-black/[0.04] rounded px-1.5 py-1.5 -ml-1.5 transition-colors text-left w-fit flex items-center gap-1.5">
          {currentLabel}
          <ChevronDown size={11} className="text-[oklch(0.5_0.01_250)]" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="glass-strong border-white/40 p-1 w-[180px]">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => { onChange(opt.value); setOpen(false); }}
            className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-[12.5px] text-[oklch(0.18_0.005_250)] hover:bg-black/[0.06] transition-colors text-left"
          >
            {opt.icon}
            <span className="flex-1">{opt.label}</span>
            {opt.value === value && <Check size={12} className="text-[oklch(0.55_0.2_250)]" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

function verbDescription(verb: string): string {
  switch (verb) {
    case 'created':          return 'created this issue';
    case 'status_changed':   return 'changed the status';
    case 'priority_changed': return 'changed the priority';
    case 'assignee_changed': return 'changed the assignee';
    case 'labeled':          return 'added a label';
    case 'commented':        return 'commented';
    case 'cycle_changed':    return 'moved this issue to a new cycle';
    default:                 return verb;
  }
}
