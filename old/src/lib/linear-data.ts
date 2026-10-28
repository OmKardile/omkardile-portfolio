// Linear data model — a Linearr-inspired issue tracker.
// All data is fictional. User avatars use picsum.photos seeded URLs.

export type IssueStatus = 'backlog' | 'unstarted' | 'started' | 'in_review' | 'completed' | 'canceled';
export type Priority = 0 | 1 | 2 | 3;  // 0 = urgent, 1 = high, 2 = medium, 3 = low
// (Linearr also has "no priority" represented by null, but for demo simplicity we always assign)

export type User = {
  id: string;
  name: string;
  initials: string;
  avatar: string;
  color: string;  // hex
};

export type Label = {
  id: string;
  name: string;
  color: string;  // hex
  group: 'type' | 'scope' | 'priority';
};

export type Project = {
  id: string;
  name: string;
  identifier: string;     // e.g. "WEB", "MOB"
  icon: string;           // emoji
  color: string;
  description: string;
};

export type Cycle = {
  id: string;
  name: string;       // e.g. "Cycle 24"
  projectId: string;
  startsAt: string;   // ISO date
  endsAt: string;     // ISO date
  progress: number;   // 0..1
  issueIds: string[];
};

export type Comment = {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;  // ISO
};

export type Activity = {
  id: string;
  actorId: string;
  verb: 'created' | 'status_changed' | 'priority_changed' | 'assignee_changed' | 'labeled' | 'commented' | 'cycle_changed';
  from?: string;
  to?: string;
  at: string; // ISO
};

export type Issue = {
  id: string;            // e.g. "WEB-12"
  seqId: number;         // 12
  projectId: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: Priority;
  assigneeId: string | null;
  labelIds: string[];
  cycleId: string | null;
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
  comments: Comment[];
  activity: Activity[];
};

export type View =
  | 'active'        // Active cycle issues
  | 'backlog'       // Backlog (no cycle, status=backlog)
  | 'my-issues'     // Issues assigned to current user
  | 'all';          // All issues for this project

export const projects: Project[] = [
  { id: 'web',  name: 'Web App',         identifier: 'WEB',  icon: '🌐', color: '#5E6AD2', description: 'The main web application — marketing site + dashboard.' },
  { id: 'mob',  name: 'Mobile',          identifier: 'MOB',  icon: '📱', color: '#F0739A', description: 'iOS and Android apps.' },
  { id: 'api',  name: 'API & Services',   identifier: 'API',  icon: '🔌', color: '#4CB7A5', description: 'Public API, webhooks, internal services.' },
  { id: 'ds',   name: 'Design System',   identifier: 'DSN',  icon: '🎨', color: '#F2C94C', description: 'Components, tokens, documentation.' },
];

export const users: User[] = [
  { id: 'u1', name: 'Aaroh Patel',    initials: 'AP', avatar: 'https://picsum.photos/seed/aaroh/100', color: '#5E6AD2' },
  { id: 'u2', name: 'Mira Saito',     initials: 'MS', avatar: 'https://picsum.photos/seed/mira/100',  color: '#F0739A' },
  { id: 'u3', name: 'Diego Roca',     initials: 'DR', avatar: 'https://picsum.photos/seed/diego/100', color: '#4CB7A5' },
  { id: 'u4', name: 'Nadia Müller',    initials: 'NM', avatar: 'https://picsum.photos/seed/nadia/100', color: '#F2C94C' },
  { id: 'u5', name: 'Theo Liang',      initials: 'TL', avatar: 'https://picsum.photos/seed/theo/100',  color: '#E06C6C' },
];

export const labels: Label[] = [
  { id: 'l1', name: 'bug',         color: '#E5484D', group: 'type' },
  { id: 'l2', name: 'feature',     color: '#5E6AD2', group: 'type' },
  { id: 'l3', name: 'improvement', color: '#F2C94C', group: 'type' },
  { id: 'l4', name: 'research',    color: '#4CB7A5', group: 'type' },
  { id: 'l5', name: 'auth',        color: '#F0739A', group: 'scope' },
  { id: 'l6', name: 'onboarding',  color: '#F0739A', group: 'scope' },
  { id: 'l7', name: 'billing',     color: '#F0739A', group: 'scope' },
  { id: 'l8', name: 'search',      color: '#F0739A', group: 'scope' },
  { id: 'l9', name: 'editor',      color: '#F0739A', group: 'scope' },
  { id: 'l10', name: 'design-tokens', color: '#7DD3FC', group: 'scope' },
];

export const cycles: Cycle[] = [
  { id: 'c1', name: 'Cycle 24', projectId: 'web', startsAt: '2024-10-07', endsAt: '2024-10-21', progress: 0.45, issueIds: ['WEB-1','WEB-2','WEB-3','WEB-4','WEB-5'] },
  { id: 'c2', name: 'Cycle 24', projectId: 'mob', startsAt: '2024-10-07', endsAt: '2024-10-21', progress: 0.62, issueIds: ['MOB-1','MOB-2','MOB-3'] },
  { id: 'c3', name: 'Cycle 24', projectId: 'api', startsAt: '2024-10-07', endsAt: '2024-10-21', progress: 0.28, issueIds: ['API-1','API-2','API-3','API-4'] },
];

// Helper: status display
export const STATUS_DISPLAY: Record<IssueStatus, { label: string; icon: 'square' | 'circle' | 'triangle' | 'square-dashed' | 'check' | 'ban'; color: string }> = {
  backlog:    { label: 'Backlog',    icon: 'square-dashed', color: '#8E9197' },
  unstarted:  { label: 'Unstarted',  icon: 'circle',        color: '#8E9197' },
  started:    { label: 'In Progress',icon: 'triangle',      color: '#F2C94C' },
  in_review: { label: 'In Review',  icon: 'triangle',      color: '#5E6AD2' },
  completed:  { label: 'Completed',  icon: 'check',         color: '#4CB7A5' },
  canceled:   { label: 'Canceled',   icon: 'ban',           color: '#6F6E72' },
};

export const PRIORITY_DISPLAY: Record<Priority, { label: string; icon: string; color: string }> = {
  0: { label: 'Urgent',    icon: '◼', color: '#EB5757' },  // red square
  1: { label: 'High',      icon: '▲', color: '#F2994A' },  // orange triangle
  2: { label: 'Medium',    icon: '◆', color: '#F2C94C' },  // yellow diamond
  3: { label: 'Low',       icon: '●', color: '#8E9197' },  // gray circle
};

function makeActivity(actorId: string, verb: Activity['verb'], from?: string, to?: string, at?: string): Activity {
  return {
    id: `act-${Math.random().toString(36).slice(2, 8)}`,
    actorId,
    verb,
    from,
    to,
    at: at ?? new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)).toISOString(),
  };
}

function makeComment(authorId: string, body: string, daysAgo: number): Comment {
  return {
    id: `cmt-${Math.random().toString(36).slice(2, 8)}`,
    authorId,
    body,
    createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
  };
}

export const issues: Issue[] = [
  // WEB project — Cycle 24 (5 issues)
  {
    id: 'WEB-1', seqId: 1, projectId: 'web',
    title: 'Add empty state to dashboard when no projects exist',
    description: 'When a new workspace is created, the dashboard shows a blank page. Add a friendly empty state with a CTA to create the first project. Match the design system spacing tokens.',
    status: 'started', priority: 2, assigneeId: 'u1', labelIds: ['l2','l6'], cycleId: 'c1',
    createdAt: '2024-10-08T10:00:00Z', updatedAt: '2024-10-12T14:30:00Z', dueDate: '2024-10-20',
    comments: [
      makeComment('u2', 'I started mocking this in Figma. Will share the spec by EOD.', 4),
      makeComment('u1', 'Looks great — I have the dashboard layout wired up. Just need to slot in the copy.', 2),
    ],
    activity: [
      makeActivity('u1', 'created', undefined, undefined, '2024-10-08T10:00:00Z'),
      makeActivity('u2', 'assignee_changed', undefined, 'Mira Saito'),
      makeActivity('u1', 'status_changed', 'Backlog', 'In Progress'),
    ],
  },
  {
    id: 'WEB-2', seqId: 2, projectId: 'web',
    title: 'Search results page should highlight matched query',
    description: 'On the search results page, when a user searches for a term, the matched query in the result title and snippet should be bold or highlighted. Currently matches are returned but not visually distinguished.',
    status: 'in_review', priority: 1, assigneeId: 'u2', labelIds: ['l3','l8'], cycleId: 'c1',
    createdAt: '2024-10-09T09:15:00Z', updatedAt: '2024-10-13T11:00:00Z', dueDate: '2024-10-18',
    comments: [
      makeComment('u2', 'PR is up. Used a regex to wrap matches in <mark>. Tests passing.', 1),
      makeComment('u3', 'Left one comment on the regex escaping. Otherwise, ship it.', 0),
    ],
    activity: [
      makeActivity('u2', 'created', undefined, undefined, '2024-10-09T09:15:00Z'),
      makeActivity('u2', 'status_changed', 'In Progress', 'In Review'),
    ],
  },
  {
    id: 'WEB-3', seqId: 3, projectId: 'web',
    title: 'Billing page fails to load when subscription is canceled',
    description: 'When a customer cancels their subscription, the billing page throws a 500 because the `current_period_end` is null. Need to handle the canceled state gracefully and show the right CTA (reactivate).',
    status: 'unstarted', priority: 0, assigneeId: 'u3', labelIds: ['l1','l7'], cycleId: 'c1',
    createdAt: '2024-10-10T16:00:00Z', updatedAt: '2024-10-10T16:00:00Z', dueDate: '2024-10-19',
    comments: [],
    activity: [
      makeActivity('u3', 'created', undefined, undefined, '2024-10-10T16:00:00Z'),
      makeActivity('u3', 'priority_changed', 'High', 'Urgent'),
    ],
  },
  {
    id: 'WEB-4', seqId: 4, projectId: 'web',
    title: 'Onboarding flow — collect team size and use case',
    description: 'Add two new fields to the onboarding form: team size (1-5, 6-20, 21-100, 100+) and primary use case (engineering, design, product, operations). Persist to the user profile.',
    status: 'completed', priority: 2, assigneeId: 'u1', labelIds: ['l2','l6'], cycleId: 'c1',
    createdAt: '2024-10-07T08:00:00Z', updatedAt: '2024-10-12T15:00:00Z', dueDate: '2024-10-17',
    comments: [
      makeComment('u1', 'Shipped. Will monitor analytics for completion rate drop.', 1),
    ],
    activity: [
      makeActivity('u1', 'created', undefined, undefined, '2024-10-07T08:00:00Z'),
      makeActivity('u1', 'status_changed', 'In Progress', 'Completed'),
    ],
  },
  {
    id: 'WEB-5', seqId: 5, projectId: 'web',
    title: 'Keyboard shortcuts overlay (press ?)',
    description: 'Press ? to open a modal that lists all keyboard shortcuts. Same pattern as GitHub. Helps discoverability for power users.',
    status: 'started', priority: 3, assigneeId: 'u4', labelIds: ['l2'], cycleId: 'c1',
    createdAt: '2024-10-11T12:00:00Z', updatedAt: '2024-10-13T09:00:00Z', dueDate: '2024-10-21',
    comments: [
      makeComment('u4', 'Modal is built. Just need to enumerate the shortcuts — there are 14.', 1),
    ],
    activity: [
      makeActivity('u4', 'created', undefined, undefined, '2024-10-11T12:00:00Z'),
    ],
  },

  // WEB project — Backlog (no cycle, status=backlog)
  {
    id: 'WEB-6', seqId: 6, projectId: 'web',
    title: 'Add Slack integration for cycle-start notifications',
    description: 'When a new cycle starts, post a message to the configured Slack channel with a list of issues in the cycle.',
    status: 'backlog', priority: 2, assigneeId: null, labelIds: ['l2'], cycleId: null,
    createdAt: '2024-10-05T10:00:00Z', updatedAt: '2024-10-05T10:00:00Z', dueDate: null,
    comments: [],
    activity: [
      makeActivity('u1', 'created', undefined, undefined, '2024-10-05T10:00:00Z'),
    ],
  },
  {
    id: 'WEB-7', seqId: 7, projectId: 'web',
    title: 'Migrate auth from JWT to session cookies',
    description: 'Move authentication from JWTs in localStorage to httpOnly session cookies for security. Document the migration for the API consumers.',
    status: 'backlog', priority: 1, assigneeId: 'u3', labelIds: ['l3','l5'], cycleId: null,
    createdAt: '2024-10-04T14:00:00Z', updatedAt: '2024-10-04T14:00:00Z', dueDate: null,
    comments: [],
    activity: [
      makeActivity('u3', 'created', undefined, undefined, '2024-10-04T14:00:00Z'),
    ],
  },
  {
    id: 'WEB-8', seqId: 8, projectId: 'web',
    title: 'Rich-text editor for issue descriptions',
    description: 'Replace the current plain-text issue description with a rich-text editor. Support headings, lists, code blocks, and inline mentions.',
    status: 'backlog', priority: 3, assigneeId: 'u4', labelIds: ['l2','l9'], cycleId: null,
    createdAt: '2024-10-03T09:00:00Z', updatedAt: '2024-10-03T09:00:00Z', dueDate: null,
    comments: [],
    activity: [
      makeActivity('u4', 'created', undefined, undefined, '2024-10-03T09:00:00Z'),
    ],
  },

  // MOB project — Cycle 24 (3 issues)
  {
    id: 'MOB-1', seqId: 1, projectId: 'mob',
    title: 'iOS — Add biometric auth for app unlock',
    description: 'Add Face ID / Touch ID prompt when the app is brought to foreground. Allow user to disable in settings. Track opt-in rate.',
    status: 'completed', priority: 1, assigneeId: 'u5', labelIds: ['l2','l5'], cycleId: 'c2',
    createdAt: '2024-10-07T11:00:00Z', updatedAt: '2024-10-14T16:00:00Z', dueDate: '2024-10-18',
    comments: [],
    activity: [
      makeActivity('u5', 'created', undefined, undefined, '2024-10-07T11:00:00Z'),
      makeActivity('u5', 'status_changed', 'In Progress', 'Completed'),
    ],
  },
  {
    id: 'MOB-2', seqId: 2, projectId: 'mob',
    title: 'Android — Pull-to-refresh on the issues list',
    description: 'Implement pull-to-refresh on the issues list using the standard Material pattern. Show a spinner while fetching.',
    status: 'started', priority: 2, assigneeId: 'u5', labelIds: ['l3'], cycleId: 'c2',
    createdAt: '2024-10-09T13:00:00Z', updatedAt: '2024-10-12T10:00:00Z', dueDate: '2024-10-19',
    comments: [],
    activity: [],
  },
  {
    id: 'MOB-3', seqId: 3, projectId: 'mob',
    title: 'Shared — Onboarding flow parity with web',
    description: 'Match the onboarding flow we shipped on web (team size + use case) on both iOS and Android.',
    status: 'unstarted', priority: 2, assigneeId: 'u4', labelIds: ['l2','l6'], cycleId: 'c2',
    createdAt: '2024-10-11T15:00:00Z', updatedAt: '2024-10-11T15:00:00Z', dueDate: '2024-10-21',
    comments: [],
    activity: [],
  },

  // API project — Cycle 24 (4 issues)
  {
    id: 'API-1', seqId: 1, projectId: 'api',
    title: 'Rate-limit the public webhook endpoint',
    description: 'The public webhook endpoint has no rate limit. Add a per-workspace limit of 100 req/min. Return 429 with Retry-After.',
    status: 'started', priority: 0, assigneeId: 'u3', labelIds: ['l1','l7'], cycleId: 'c3',
    createdAt: '2024-10-08T09:00:00Z', updatedAt: '2024-10-13T11:00:00Z', dueDate: '2024-10-18',
    comments: [
      makeComment('u3', 'Using Redis token bucket. Will dry-run on staging before prod.', 1),
    ],
    activity: [],
  },
  {
    id: 'API-2', seqId: 2, projectId: 'api',
    title: 'GraphQL — expose labels connection on Project',
    description: 'Add a `labels` field to the Project type in the GraphQL schema so consumers can list project labels without a separate query.',
    status: 'in_review', priority: 2, assigneeId: 'u1', labelIds: ['l2'], cycleId: 'c3',
    createdAt: '2024-10-09T11:00:00Z', updatedAt: '2024-10-12T16:00:00Z', dueDate: '2024-10-19',
    comments: [],
    activity: [],
  },
  {
    id: 'API-3', seqId: 3, projectId: 'api',
    title: 'OpenAPI spec is missing the new webhook endpoints',
    description: 'The openapi.yaml file was not updated when we shipped the new webhook endpoints. Update it and regenerate the docs site.',
    status: 'completed', priority: 3, assigneeId: 'u2', labelIds: ['l3'], cycleId: 'c3',
    createdAt: '2024-10-10T13:00:00Z', updatedAt: '2024-10-13T15:00:00Z', dueDate: '2024-10-17',
    comments: [],
    activity: [],
  },
  {
    id: 'API-4', seqId: 4, projectId: 'api',
    title: 'Add deprecation header for the v1 issues endpoint',
    description: 'The v1 issues endpoint is being replaced by v2 in 60 days. Add a Sunset header to v1 responses so consumers can detect deprecation.',
    status: 'unstarted', priority: 1, assigneeId: 'u3', labelIds: ['l3'], cycleId: 'c3',
    createdAt: '2024-10-12T10:00:00Z', updatedAt: '2024-10-12T10:00:00Z', dueDate: '2024-10-20',
    comments: [],
    activity: [],
  },

  // DSN project — backlog
  {
    id: 'DSN-1', seqId: 1, projectId: 'ds',
    title: 'Document the spacing ladder in Storybook',
    description: 'The 4/8/12/16/24/32 spacing ladder is only in code comments. Add a Storybook story that visualizes each step.',
    status: 'backlog', priority: 3, assigneeId: 'u4', labelIds: ['l3','l10'], cycleId: null,
    createdAt: '2024-10-04T09:00:00Z', updatedAt: '2024-10-04T09:00:00Z', dueDate: null,
    comments: [],
    activity: [],
  },
  {
    id: 'DSN-2', seqId: 2, projectId: 'ds',
    title: 'Add a Table component to the system',
    description: 'We do not have a Table component yet. The issue list on web uses raw HTML. Add a Table + TableRow + TableCell to the system.',
    status: 'started', priority: 2, assigneeId: 'u4', labelIds: ['l2','l10'], cycleId: null,
    createdAt: '2024-10-10T11:00:00Z', updatedAt: '2024-10-13T13:00:00Z', dueDate: null,
    comments: [],
    activity: [],
  },
];

// Lookup maps
export const userMap: Record<string, User> = Object.fromEntries(users.map((u) => [u.id, u]));
export const labelMap: Record<string, Label> = Object.fromEntries(labels.map((l) => [l.id, l]));
export const projectMap: Record<string, Project> = Object.fromEntries(projects.map((p) => [p.id, p]));
export const cycleMap: Record<string, Cycle> = Object.fromEntries(cycles.map((c) => [c.id, c]));
export const issueMap: Record<string, Issue> = Object.fromEntries(issues.map((i) => [i.id, i]));

export const CURRENT_USER_ID = 'u1';  // Aaroh Patel — "you"

// Date helpers
export function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffSec = Math.floor((now - then) / 1000);
  if (diffSec < 60) return 'just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 86400 * 7) return `${Math.floor(diffSec / 86400)}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDueDate(iso: string | null): { label: string; tone: 'normal' | 'soon' | 'overdue' | 'none' } {
  if (!iso) return { label: '', tone: 'none' };
  const due = new Date(iso + 'T23:59:59Z').getTime();
  const now = Date.now();
  const days = Math.floor((due - now) / 86400000);
  if (days < 0) return { label: `${Math.abs(days)}d overdue`, tone: 'overdue' };
  if (days === 0) return { label: 'Today', tone: 'soon' };
  if (days === 1) return { label: 'Tomorrow', tone: 'soon' };
  if (days < 7) return { label: `${days}d`, tone: 'soon' };
  return { label: new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), tone: 'normal' };
}
