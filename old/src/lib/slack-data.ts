// Slack data model — Liquid Glass redesign case study.
// All users, channels, messages are fictional.

export type User = {
  id: string;
  name: string;
  avatar: string;
  color: string;     // accent color for mentions
  status: 'active' | 'away' | 'dnd' | 'offline';
  title: string;
};

export type Channel = {
  id: string;
  name: string;
  type: 'channel' | 'dm' | 'group-dm';
  topic?: string;
  memberCount: number;
  unreadCount: number;
  mentions: number;
  isPrivate: boolean;
};

export type Reaction = {
  emoji: string;
  count: number;
  reactorIds: string[];
};

export type Message = {
  id: string;
  authorId: string;
  body: string;
  timestamp: string;       // ISO
  reactions: Reaction[];
  threadReplies?: number;   // count of thread replies
  edited?: boolean;
  pinned?: boolean;
  files?: { name: string; size: string; type: string }[];
};

export type ThreadReply = {
  id: string;
  authorId: string;
  body: string;
  timestamp: string;
  reactions: Reaction[];
};

export type Thread = {
  parentMessageId: string;
  replies: ThreadReply[];
  participantIds: string[];
};

const avatar = (seed: string, size = 200) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/${size}/${size}`;

export const users: User[] = [
  { id: 'u1', name: 'Aaroh Patel',      avatar: avatar('aaroh-slack'),    color: '#635BFF', status: 'active', title: 'Senior Product Designer' },
  { id: 'u2', name: 'Mira Saito',       avatar: avatar('mira-slack'),     color: '#F0739A', status: 'active', title: 'Design Lead' },
  { id: 'u3', name: 'Diego Roca',       avatar: avatar('diego-slack'),    color: '#4CB7A5', status: 'active', title: 'Staff Engineer' },
  { id: 'u4', name: 'Nadia Müller',      avatar: avatar('nadia-slack'),    color: '#F2C94C', status: 'away',   title: 'Engineering Manager' },
  { id: 'u5', name: 'Theo Liang',        avatar: avatar('theo-slack'),     color: '#E06C6C', status: 'dnd',     title: 'Founder' },
  { id: 'u6', name: 'Priya Raman',       avatar: avatar('priya-slack'),    color: '#5E6AD2', status: 'offline', title: 'Product Designer' },
  { id: 'u7', name: 'Camille Dubois',    avatar: avatar('camille-slack'),  color: '#7d4cdb', status: 'active', title: 'Engineering Manager' },
];

export const userMap: Record<string, User> = Object.fromEntries(users.map((u) => [u.id, u]));
export const CURRENT_USER_ID = 'u1';

export const channels: Channel[] = [
  { id: 'ch1', name: 'general',         type: 'channel',  topic: 'Company-wide chatter',                      memberCount: 47,  unreadCount: 12, mentions: 2, isPrivate: false },
  { id: 'ch2', name: 'design',           type: 'channel',  topic: 'Design system + UI critique',              memberCount: 12,  unreadCount: 4,  mentions: 0, isPrivate: false },
  { id: 'ch3', name: 'engineering',      type: 'channel',  topic: 'Dev chatter + deploys',                    memberCount: 24,  unreadCount: 0,  mentions: 0, isPrivate: false },
  { id: 'ch4', name: 'product',          type: 'channel',  topic: 'Roadmap, specs, and decisions',             memberCount: 18,  unreadCount: 7,  mentions: 1, isPrivate: false },
  { id: 'ch5', name: 'random',           type: 'channel',  topic: 'Off-topic, memes, friday vibes',            memberCount: 47,  unreadCount: 0,  mentions: 0, isPrivate: false },
  { id: 'ch6', name: 'leadership',       type: 'channel',  topic: 'C-suite + managers',                        memberCount: 6,   unreadCount: 2,  mentions: 0, isPrivate: true  },
  { id: 'dm1', name: 'Mira Saito',       type: 'dm',                                                          memberCount: 2,   unreadCount: 3,  mentions: 0, isPrivate: true  },
  { id: 'dm2', name: 'Diego Roca',       type: 'dm',                                                          memberCount: 2,   unreadCount: 0,  mentions: 0, isPrivate: true  },
  { id: 'dm3', name: 'Theo Liang',       type: 'dm',                                                          memberCount: 2,   unreadCount: 1,  mentions: 0, isPrivate: true  },
  { id: 'dm4', name: 'Design squad',     type: 'group-dm', memberCount: 4, unreadCount: 0, mentions: 0, isPrivate: true },
];

export const channelMap: Record<string, Channel> = Object.fromEntries(channels.map((c) => [c.id, c]));

export const messagesByChannel: Record<string, Message[]> = {
  ch1: [
    { id: 'm1', authorId: 'u3', body: "morning everyone! deploying the auth fix at 10am — heads up", timestamp: '2024-10-21T09:02:00Z', reactions: [{ emoji: '👍', count: 4, reactorIds: ['u1','u2','u4','u7'] }], threadReplies: 2 },
    { id: 'm2', authorId: 'u5', body: "Reminder: all-hands at 11. The roadmap deck is in #product — please skim beforehand.", timestamp: '2024-10-21T09:14:00Z', reactions: [{ emoji: '👀', count: 8, reactorIds: ['u1','u2','u3','u4','u6','u7'] }] },
    { id: 'm3', authorId: 'u4', body: "Anyone got the recording of yesterday's customer interview? I missed it 😭", timestamp: '2024-10-21T09:18:00Z', reactions: [{ emoji: '🥺', count: 3, reactorIds: ['u1','u2','u6'] }] },
    { id: 'm4', authorId: 'u2', body: "I'll post the recording in <#ch2|design> after I scrub the customer name out. ~30 mins.", timestamp: '2024-10-21T09:21:00Z', reactions: [{ emoji: '🙏', count: 5, reactorIds: ['u1','u3','u4','u6','u7'] }], threadReplies: 1 },
    { id: 'm5', authorId: 'u1', body: "heads up — I'm OOO thursday afternoon. ping me in <#ch2|design> if anything urgent comes up before then", timestamp: '2024-10-21T09:24:00Z', reactions: [{ emoji: '👍', count: 2, reactorIds: ['u2','u4'] }] },
  ],
  ch2: [
    { id: 'm6', authorId: 'u2', body: "ok team — the liquid glass redesign goes live friday. here's the case study PDF: https://your-name-linkedin-glass.vercel.app/case-study.pdf — would love feedback before we ship", timestamp: '2024-10-21T08:32:00Z', reactions: [{ emoji: '🔥', count: 6, reactorIds: ['u1','u3','u4','u5','u6','u7'] }, { emoji: '✨', count: 3, reactorIds: ['u1','u4','u6'] }], threadReplies: 5 },
    { id: 'm7', authorId: 'u3', body: "wow. the slide-over pattern is super clean. how did you get backdrop-filter to stay 60fps on a list that long?", timestamp: '2024-10-21T08:42:00Z', reactions: [{ emoji: '🤔', count: 2, reactorIds: ['u1','u4'] }] },
    { id: 'm8', authorId: 'u1', body: "slice selectors — only subscribe to what changes. the sidebar never re-renders when you type in search.", timestamp: '2024-10-21T08:44:00Z', reactions: [{ emoji: '🧠', count: 4, reactorIds: ['u2','u3','u4','u7'] }], threadReplies: 3 },
    { id: 'm9', authorId: 'u6', body: "the wallpaper gradient mesh is doing a LOT of work here. bold move for a B2B product 👀", timestamp: '2024-10-21T08:48:00Z', reactions: [{ emoji: '💯', count: 3, reactorIds: ['u1','u2','u4'] }] },
    { id: 'm10', authorId: 'u2', body: "@here — final review at 2pm today in this channel. bring your hot takes.", timestamp: '2024-10-21T09:00:00Z', reactions: [{ emoji: '🙌', count: 5, reactorIds: ['u1','u3','u4','u6','u7'] }] },
  ],
  ch3: [
    { id: 'm11', authorId: 'u3', body: "deploying v2.4.1 — includes the auth fix + the new kbd shortcut overlay. should land by 10:15am.", timestamp: '2024-10-21T09:55:00Z', reactions: [{ emoji: '🚀', count: 8, reactorIds: ['u1','u2','u4','u5','u6','u7'] }] },
    { id: 'm12', authorId: 'u7', body: "reminder: code freeze at 5pm for the long weekend. anything not on `main` by then waits until tuesday.", timestamp: '2024-10-21T09:58:00Z', reactions: [{ emoji: '⚠️', count: 4, reactorIds: ['u1','u2','u3','u4'] }] },
  ],
  ch4: [
    { id: 'm13', authorId: 'u5', body: "Q1 roadmap draft is in the drive — please leave comments by EOD friday.", timestamp: '2024-10-21T09:30:00Z', reactions: [{ emoji: '👀', count: 6, reactorIds: ['u1','u2','u3','u4','u6','u7'] }], threadReplies: 12 },
  ],
  ch5: [
    { id: 'm14', authorId: 'u6', body: "happy friday-eve everyone 🎉", timestamp: '2024-10-21T09:42:00Z', reactions: [{ emoji: '🎉', count: 9, reactorIds: ['u1','u2','u3','u4','u5','u7'] }] },
  ],
  ch6: [
    { id: 'm15', authorId: 'u4', body: "hiring update: 2 final-round candidates for the senior PM role. both strong. decision by monday.", timestamp: '2024-10-21T08:00:00Z', reactions: [{ emoji: '👍', count: 3, reactorIds: ['u1','u5','u7'] }] },
  ],
  dm1: [
    { id: 'm16', authorId: 'u2', body: "hey! can you take a look at the case study PDF before 2pm? want to ship it today", timestamp: '2024-10-21T08:50:00Z', reactions: [] },
    { id: 'm17', authorId: 'u1', body: "yes — reading now. give me 15 min", timestamp: '2024-10-21T08:52:00Z', reactions: [] },
    { id: 'm18', authorId: 'u2', body: "👍", timestamp: '2024-10-21T08:53:00Z', reactions: [] },
    { id: 'm19', authorId: 'u2', body: "actually one thing — should we add a chapter on accessibility? feels like the Liquid Glass aesthetic might raise contrast concerns", timestamp: '2024-10-21T09:14:00Z', reactions: [] },
  ],
  dm2: [
    { id: 'm20', authorId: 'u3', body: "deploy went smooth 👍", timestamp: '2024-10-21T10:15:00Z', reactions: [] },
  ],
  dm3: [
    { id: 'm21', authorId: 'u5', body: "ship it. case study looks great.", timestamp: '2024-10-21T09:00:00Z', reactions: [] },
  ],
  dm4: [
    { id: 'm22', authorId: 'u2', body: "ok squad — 2pm review. be ready.", timestamp: '2024-10-21T09:01:00Z', reactions: [] },
  ],
};

export const threadsByMessage: Record<string, Thread> = {
  m4: { parentMessageId: 'm4', participantIds: ['u1', 'u2', 'u4'], replies: [
    { id: 'tr1', authorId: 'u1', body: 'yes please — the customer name reveal was a bit awkward', timestamp: '2024-10-21T09:22:00Z', reactions: [{ emoji: '👍', count: 1, reactorIds: ['u2'] }] },
    { id: 'tr2', authorId: 'u2', body: 'on it. ~30 min.', timestamp: '2024-10-21T09:23:00Z', reactions: [] },
  ]},
  m6: { parentMessageId: 'm6', participantIds: ['u1','u3','u4','u6'], replies: [
    { id: 'tr3', authorId: 'u4', body: "I'd love a section on performance — the 60fps stuff is the most interesting part imo", timestamp: '2024-10-21T08:34:00Z', reactions: [{ emoji: '💯', count: 2, reactorIds: ['u1','u3'] }] },
    { id: 'tr4', authorId: 'u6', body: "yes +1 on performance. also — the wallpaper gradient is risky. i'd justify it more.", timestamp: '2024-10-21T08:38:00Z', reactions: [] },
    { id: 'tr5', authorId: 'u2', body: "noted — adding a 'why wallpaper' note to the design system chapter", timestamp: '2024-10-21T08:40:00Z', reactions: [{ emoji: '🙏', count: 2, reactorIds: ['u4','u6'] }] },
  ]},
  m8: { parentMessageId: 'm8', participantIds: ['u3','u4','u7'], replies: [
    { id: 'tr6', authorId: 'u3', body: 'makes sense. zustand stores are wild for this', timestamp: '2024-10-21T08:45:00Z', reactions: [{ emoji: '🧠', count: 1, reactorIds: ['u4'] }] },
  ]},
};

export function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffSec = Math.floor((now - then) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function shortTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}
