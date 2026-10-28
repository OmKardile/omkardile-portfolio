'use client';

import { create } from 'zustand';
import type { Issue, IssueStatus, Priority } from '@/lib/linear-data';
import { issues as allIssues, projects, CURRENT_USER_ID } from '@/lib/linear-data';

export type MainView = 'active' | 'backlog' | 'my-issues' | 'all';
export type Layout = 'list' | 'board';

export type SortKey = 'status' | 'priority' | 'assignee' | 'updatedAt' | 'dueDate';

type Toast = {
  id: string;
  message: string;
  actionLabel?: string;
  undoAction?: () => void;
};

type LinearState = {
  // Project + view navigation
  projectId: string;
  mainView: MainView;
  layout: Layout;
  setProjectId: (id: string) => void;
  setMainView: (v: MainView) => void;
  setLayout: (l: Layout) => void;

  // Selected issue (slide-over)
  selectedIssueId: string | null;
  openIssue: (id: string) => void;
  closeIssue: () => void;

  // Command palette
  cmdOpen: boolean;
  setCmdOpen: (v: boolean) => void;
  toggleCmd: () => void;

  // Filters
  statusFilter: IssueStatus | 'all';
  priorityFilter: Priority | 'all';
  assigneeFilter: string | 'all' | 'me';
  labelFilter: string | 'all';
  searchQuery: string;
  setStatusFilter: (f: IssueStatus | 'all') => void;
  setPriorityFilter: (f: Priority | 'all') => void;
  setAssigneeFilter: (f: string | 'all' | 'me') => void;
  setLabelFilter: (f: string | 'all') => void;
  setSearchQuery: (q: string) => void;
  clearFilters: () => void;

  // Sorting
  sortBy: SortKey;
  sortDir: 'asc' | 'desc';
  setSortBy: (k: SortKey) => void;
  toggleSortDir: () => void;

  // Status transitions (writeable local state — we keep issues in store)
  issues: Issue[];
  setStatus: (issueId: string, status: IssueStatus) => void;
  setPriority: (issueId: string, priority: Priority) => void;
  setAssignee: (issueId: string, assigneeId: string | null) => void;

  // Computed selector helpers (stable references)
  visibleIssues: () => Issue[];
  activeCycleIssueIds: () => string[];

  // Toasts
  toasts: Toast[];
  toast: (message: string, opts?: { actionLabel?: string; undoAction?: () => void }) => void;
  dismissToast: (id: string) => void;

  // Keyboard shortcut overlay
  shortcutsOpen: boolean;
  setShortcutsOpen: (v: boolean) => void;
};

const initialFilters = {
  statusFilter: 'all' as const,
  priorityFilter: 'all' as const,
  assigneeFilter: 'all' as const,
  labelFilter: 'all' as const,
  searchQuery: '',
};

export const useLinear = create<LinearState>((set, get) => ({
  projectId: 'web',
  mainView: 'active',
  layout: 'list',
  setProjectId: (id) => set({ projectId: id, selectedIssueId: null }),
  setMainView: (v) => set({ mainView: v, selectedIssueId: null }),
  setLayout: (l) => set({ layout: l }),

  selectedIssueId: null,
  openIssue: (id) => set({ selectedIssueId: id }),
  closeIssue: () => set({ selectedIssueId: null }),

  cmdOpen: false,
  setCmdOpen: (v) => set({ cmdOpen: v }),
  toggleCmd: () => set({ cmdOpen: !get().cmdOpen }),

  ...initialFilters,
  setStatusFilter: (f) => set({ statusFilter: f }),
  setPriorityFilter: (f) => set({ priorityFilter: f }),
  setAssigneeFilter: (f) => set({ assigneeFilter: f }),
  setLabelFilter: (f) => set({ labelFilter: f }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  clearFilters: () => set(initialFilters),

  sortBy: 'status',
  sortDir: 'asc',
  setSortBy: (k) => {
    const cur = get().sortBy;
    if (cur === k) {
      set({ sortDir: get().sortDir === 'asc' ? 'desc' : 'asc' });
    } else {
      set({ sortBy: k, sortDir: 'asc' });
    }
  },
  toggleSortDir: () => set({ sortDir: get().sortDir === 'asc' ? 'desc' : 'asc' }),

  issues: allIssues,
  setStatus: (issueId, status) => {
    const cur = get().issues.find((i) => i.id === issueId);
    if (!cur) return;
    set({
      issues: get().issues.map((i) =>
        i.id === issueId
          ? {
              ...i,
              status,
              updatedAt: new Date().toISOString(),
              activity: [
                ...i.activity,
                {
                  id: `act-${Math.random().toString(36).slice(2, 8)}`,
                  actorId: CURRENT_USER_ID,
                  verb: 'status_changed',
                  from: i.status,
                  to: status,
                  at: new Date().toISOString(),
                },
              ],
            }
          : i,
      ),
    });
    get().toast(`Status set to ${labelForStatus(status)}`);
  },
  setPriority: (issueId, priority) => {
    set({
      issues: get().issues.map((i) =>
        i.id === issueId
          ? { ...i, priority, updatedAt: new Date().toISOString() }
          : i,
      ),
    });
    get().toast(`Priority set to ${labelForPriority(priority)}`);
  },
  setAssignee: (issueId, assigneeId) => {
    set({
      issues: get().issues.map((i) =>
        i.id === issueId
          ? { ...i, assigneeId, updatedAt: new Date().toISOString() }
          : i,
      ),
    });
    get().toast(assigneeId ? 'Assignee updated' : 'Assignee cleared');
  },

  // Derived helpers (callers must call inside useMemo with stable deps to avoid React 18 infinite-loop warning)
  visibleIssues: () => {
    const s = get();
    let list = s.issues.filter((i) => i.projectId === s.projectId);

    // View filtering
    if (s.mainView === 'active') {
      list = list.filter((i) => i.cycleId !== null);
    } else if (s.mainView === 'backlog') {
      list = list.filter((i) => i.status === 'backlog');
    } else if (s.mainView === 'my-issues') {
      list = list.filter((i) => i.assigneeId === CURRENT_USER_ID);
    }
    // 'all' = no extra filter

    // Search
    if (s.searchQuery.trim()) {
      const q = s.searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q),
      );
    }

    // Status filter
    if (s.statusFilter !== 'all') {
      list = list.filter((i) => i.status === s.statusFilter);
    }

    // Priority filter
    if (s.priorityFilter !== 'all') {
      list = list.filter((i) => i.priority === s.priorityFilter);
    }

    // Assignee filter
    if (s.assigneeFilter === 'me') {
      list = list.filter((i) => i.assigneeId === CURRENT_USER_ID);
    } else if (s.assigneeFilter !== 'all') {
      list = list.filter((i) => i.assigneeId === s.assigneeFilter);
    }

    // Label filter
    if (s.labelFilter !== 'all') {
      list = list.filter((i) => i.labelIds.includes(s.labelFilter));
    }

    // Sort
    const dir = s.sortDir === 'asc' ? 1 : -1;
    list = [...list].sort((a, b) => {
      const k = s.sortBy;
      if (k === 'status') {
        return (statusOrder[a.status] - statusOrder[b.status]) * dir;
      }
      if (k === 'priority') {
        return (a.priority - b.priority) * dir;
      }
      if (k === 'assignee') {
        const an = a.assigneeId ?? 'zzz';
        const bn = b.assigneeId ?? 'zzz';
        return an.localeCompare(bn) * dir;
      }
      if (k === 'updatedAt') {
        return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * dir;
      }
      if (k === 'dueDate') {
        const ad = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        const bd = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        return (ad - bd) * dir;
      }
      return 0;
    });

    return list;
  },
  activeCycleIssueIds: () => {
    const s = get();
    return s.issues
      .filter((i) => i.projectId === s.projectId && i.cycleId !== null)
      .map((i) => i.id);
  },

  // Toasts
  toasts: [],
  toast: (message, opts) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const t: Toast = {
      id,
      message,
      actionLabel: opts?.actionLabel,
      undoAction: opts?.undoAction,
    };
    set({ toasts: [...get().toasts, t] });
    window.setTimeout(() => get().dismissToast(id), 3500);
  },
  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),

  shortcutsOpen: false,
  setShortcutsOpen: (v) => set({ shortcutsOpen: v }),
}));

const statusOrder: Record<IssueStatus, number> = {
  started: 0,
  in_review: 1,
  unstarted: 2,
  backlog: 3,
  completed: 4,
  canceled: 5,
};

function labelForStatus(s: IssueStatus): string {
  return s === 'in_review' ? 'In Review' : s.charAt(0).toUpperCase() + s.slice(1);
}
function labelForPriority(p: Priority): string {
  return ['Urgent', 'High', 'Medium', 'Low'][p];
}
