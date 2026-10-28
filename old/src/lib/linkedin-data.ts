// LinkedIn data model — Liquid Glass redesign case study.
// All users, posts, companies are fictional. Avatars use picsum.photos.

export type User = {
  id: string;
  name: string;
  headline: string;
  avatar: string;
  avatarUrl: string;
  mutuals?: number;
};

export type Company = {
  id: string;
  name: string;
  logo: string;
  industry: string;
  followers: string;
};

export type PostEngagement = {
  likes: number;
  comments: number;
  reposts: number;
  impressions?: number;
};

export type Comment = {
  id: string;
  authorId: string;
  body: string;
  timestamp: string;
  likes: number;
};

export type Post = {
  id: string;
  authorId: string;
  body: string;
  timestamp: string;
  image?: string;
  likes: number;
  comments: Comment[];
  reposts: number;
  hasLiked?: boolean;
};

export type Job = {
  id: string;
  title: string;
  company: string;
  companyId: string;
  location: string;
  remote: 'Remote' | 'Hybrid' | 'On-site';
  posted: string;
  applicants: number;
  salary?: string;
  description: string;
  logo: string;
};

export type Conversation = {
  id: string;
  userId: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
};

export type Message = {
  id: string;
  authorId: 'me' | string;
  body: string;
  timestamp: string;
};

export type Notification = {
  id: string;
  type: 'like' | 'comment' | 'connection' | 'job' | 'mention' | 'view';
  actorId: string;
  text: string;
  timestamp: string;
  read: boolean;
};

const avatar = (seed: string, size = 200) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/${size}/${size}`;

export const currentUser: User = {
  id: 'me',
  name: 'Aaroh Patel',
  headline: 'Senior Product Designer at Nimbus Labs · Design systems & no-code tooling',
  avatar: 'AP',
  avatarUrl: avatar('aaroh-me'),
};

export const users: User[] = [
  { id: 'u1', name: 'Mira Saito',     headline: 'Design Lead at Stripe · Previously Figma',         avatar: 'MS', avatarUrl: avatar('mira-saito'), mutuals: 24 },
  { id: 'u2', name: 'Diego Roca',     headline: 'Staff Engineer @ Linear · Ex-Notion',              avatar: 'DR', avatarUrl: avatar('diego-roca'), mutuals: 18 },
  { id: 'u3', name: 'Nadia Müller',    headline: 'Engineering Manager @ Vercel · TypeScript',        avatar: 'NM', avatarUrl: avatar('nadia-mueller'), mutuals: 12 },
  { id: 'u4', name: 'Theo Liang',      headline: 'Founder @ Tilt · ex-Stripe PM',                    avatar: 'TL', avatarUrl: avatar('theo-liang'), mutuals: 31 },
  { id: 'u5', name: 'Priya Raman',     headline: 'Product Designer @ Airbnb · Design + Research',   avatar: 'PR', avatarUrl: avatar('priya-raman'), mutuals: 9 },
  { id: 'u6', name: 'Camille Dubois',  headline: 'Senior Engineering Manager @ GitHub',              avatar: 'CD', avatarUrl: avatar('camille-dubois'), mutuals: 6 },
  { id: 'u7', name: 'Rashid Karim',    headline: 'VP Engineering @ Datadog · Scale infra',          avatar: 'RK', avatarUrl: avatar('rashid-karim'), mutuals: 15 },
  { id: 'u8', name: 'Sofia Petrova',   headline: 'Head of Design @ Webflow · Ex-IDEO',              avatar: 'SP', avatarUrl: avatar('sofia-petrova'), mutuals: 22 },
];

export const userMap: Record<string, User> = Object.fromEntries([currentUser, ...users].map((u) => [u.id, u]));

export const companies: Company[] = [
  { id: 'c1', name: 'Nimbus Labs', logo: 'https://picsum.photos/seed/nimbus-logo/100', industry: 'Software', followers: '12,847' },
  { id: 'c2', name: 'Stripe',       logo: 'https://picsum.photos/seed/stripe-logo/100', industry: 'Fintech', followers: '2.4M' },
  { id: 'c3', name: 'Linear',       logo: 'https://picsum.photos/seed/linear-logo/100', industry: 'Software', followers: '184K' },
  { id: 'c4', name: 'Vercel',       logo: 'https://picsum.photos/seed/vercel-logo/100', industry: 'Software', followers: '187K' },
];

export const posts: Post[] = [
  {
    id: 'p1',
    authorId: 'u1',
    body: "After 6 months of work, our team just shipped a complete redesign of our design system using Apple's Liquid Glass design language. Real backdrop-filter everywhere, real specular highlights, real vibrancy. The dashboard feels 10 years younger. Designers, what would you redesign in Liquid Glass? Drop your hot takes below 👇",
    timestamp: '2h',
    image: 'https://picsum.photos/seed/post-system-redesign/800/500',
    likes: 847,
    reposts: 64,
    hasLiked: false,
    comments: [
      { id: 'cm1', authorId: 'u3', body: "Huge congrats! How did you handle backdrop-filter performance with multiple panels stacked?", timestamp: '1h', likes: 24 },
      { id: 'cm2', authorId: 'u5', body: "This is gorgeous. The wallpaper gradient mesh behind it is doing a lot of work. 🤌", timestamp: '45m', likes: 12 },
      { id: 'cm3', authorId: 'u8', body: "We tried this last year — couldn't get over the GPU hit on older devices. Would love to know your approach.", timestamp: '30m', likes: 8 },
    ],
  },
  {
    id: 'p2',
    authorId: 'u4',
    body: "Founders: stop designing your onboarding flow like a feature tour. Treat it like a 4-step conversation. 1) Acknowledge the user's first moment 2) Ask one question 3) Show one result 4) Get out of the way. The faster they hit value, the more likely they come back. What's your onboarding philosophy?",
    timestamp: '5h',
    likes: 421,
    reposts: 38,
    hasLiked: true,
    comments: [
      { id: 'cm4', authorId: 'u2', body: "100%. We cut our onboarding from 7 steps to 3 and activation rate jumped 23%.", timestamp: '4h', likes: 17 },
      { id: 'cm5', authorId: 'u6', body: "The 'get out of the way' part is the hardest for most teams to internalize.", timestamp: '3h', likes: 11 },
    ],
  },
  {
    id: 'p3',
    authorId: 'u2',
    body: "Reminder: a 200ms delay in your interactive UI is the difference between 'feels instant' and 'feels slow'. People can't articulate it, but they feel it. Measure your P75 interaction latency, not just your P50.",
    timestamp: '8h',
    likes: 1283,
    reposts: 89,
    hasLiked: false,
    comments: [
      { id: 'cm6', authorId: 'u7', body: "We instrument every interaction with RUM. The gap between P50 and P95 tells you where your edge cases live.", timestamp: '7h', likes: 31 },
    ],
  },
  {
    id: 'p4',
    authorId: 'u5',
    body: "Hiring is design work. Every step of your interview process signals something about how your team works. If your take-home is a 12-hour Figma exercise with unrealistic constraints, you're telling senior candidates: we don't respect your time. Re-read your own job ads — would YOU apply?",
    timestamp: '1d',
    likes: 2154,
    reposts: 187,
    hasLiked: false,
    comments: [
      { id: 'cm7', authorId: 'u8', body: "This. We replaced our 8-hour take-home with a 90-minute paired session. Senior applications tripled.", timestamp: '22h', likes: 48 },
    ],
  },
  {
    id: 'p5',
    authorId: 'u8',
    body: "Things I've learned after 12 years in design: 1) Pixel-perfect is a trap 2) Accessibility is a feature, not a checklist 3) Users don't read, they scan — design for scanning 4) The best design decisions come from constraints, not freedom 5) Your portfolio should show your thinking, not just your outputs. What did I miss?",
    timestamp: '2d',
    likes: 4271,
    reposts: 412,
    hasLiked: false,
    comments: [
      { id: 'cm8', authorId: 'u1', body: "6) The best designers I know write well. Communication is half the job.", timestamp: '2d', likes: 92 },
    ],
  },
];

export const jobs: Job[] = [
  { id: 'j1', title: 'Senior Product Designer, Design Systems', company: 'Stripe', companyId: 'c2', location: 'New York, NY', remote: 'Hybrid', posted: '2 days ago', applicants: 47, salary: '$180K–$220K', description: "Lead the next iteration of Stripe's design system. Own the component library, the design tokens, and the documentation. Partner closely with engineering on the React implementation.", logo: 'https://picsum.photos/seed/stripe-logo/100' },
  { id: 'j2', title: 'Staff Software Engineer, Frontend Platform', company: 'Linear', companyId: 'c3', location: 'San Francisco, CA', remote: 'Remote', posted: '1 week ago', applicants: 124, salary: '$220K–$280K', description: "Build the frontend platform that powers Linear's issue tracker. Performance, accessibility, and keyboard-first interactions are non-negotiable.", logo: 'https://picsum.photos/seed/linear-logo/100' },
  { id: 'j3', title: 'Engineering Manager, Developer Experience', company: 'Vercel', companyId: 'c4', location: 'Remote', remote: 'Remote', posted: '3 days ago', applicants: 89, salary: '$240K–$290K', description: "Lead a team of 6 engineers building the next generation of Vercel's developer tools. Focus on DX, build performance, and observability.", logo: 'https://picsum.photos/seed/vercel-logo/100' },
  { id: 'j4', title: 'Product Designer, Onboarding & Activation', company: 'Nimbus Labs', companyId: 'c1', location: 'Remote', remote: 'Remote', posted: '5 days ago', applicants: 32, salary: '$140K–$180K', description: "Own the first 7 days of every new user's experience. Design the onboarding flow, the activation milestones, and the empty states. Partner with growth on experimentation.", logo: 'https://picsum.photos/seed/nimbus-logo/100' },
];

export const conversations: Conversation[] = [
  { id: 'conv1', userId: 'u1',  lastMessage: "Sounds great — let me know when you push the spec!", timestamp: '2m', unread: 2 },
  { id: 'conv2', userId: 'u4',  lastMessage: "Sent the offer letter to your email. Excited to have you onboard.", timestamp: '1h', unread: 0 },
  { id: 'conv3', userId: 'u3',  lastMessage: "Did you see the new Tailwind 4 release? The OKLCH support is huge.", timestamp: '3h', unread: 0 },
  { id: 'conv4', userId: 'u8',  lastMessage: "Congrats on the redesign! The glass treatment looks incredible.", timestamp: '5h', unread: 1 },
  { id: 'conv5', userId: 'u2',  lastMessage: "Mind if I share your case study in our design channel?", timestamp: '1d', unread: 0 },
];

export const messagesByConversation: Record<string, Message[]> = {
  conv1: [
    { id: 'm1', authorId: 'u1', body: "Hey! I saw your Liquid Glass redesign of Linear — incredible work.", timestamp: '9:14 AM' },
    { id: 'm2', authorId: 'me', body: "Thanks Mira! Means a lot coming from you.", timestamp: '9:18 AM' },
    { id: 'm3', authorId: 'u1', body: "I'm thinking of doing the same for our dashboard. Would you be open to sharing your CSS approach?", timestamp: '9:20 AM' },
    { id: 'm4', authorId: 'me', body: "Of course! The four glass utility classes are the key — let me write up the spec.", timestamp: '9:24 AM' },
    { id: 'm5', authorId: 'u1', body: "Sounds great — let me know when you push the spec!", timestamp: '9:26 AM' },
  ],
  conv2: [
    { id: 'm6', authorId: 'u4', body: "Aaroh — we'd love to bring you in as Design Lead. The comp package is finalized.", timestamp: 'Yesterday' },
    { id: 'm7', authorId: 'me', body: "Theo, this is amazing. Reading through the offer now.", timestamp: 'Yesterday' },
    { id: 'm8', authorId: 'u4', body: "Sent the offer letter to your email. Excited to have you onboard.", timestamp: '2h ago' },
  ],
};

export const notifications: Notification[] = [
  { id: 'n1', type: 'like',    actorId: 'u1', text: 'liked your post about the Liquid Glass redesign',  timestamp: '5m', read: false },
  { id: 'n2', type: 'comment', actorId: 'u3', text: 'commented on your post: "How did you handle backdrop-filter..."', timestamp: '15m', read: false },
  { id: 'n3', type: 'connection', actorId: 'u8', text: 'accepted your connection request', timestamp: '1h', read: false },
  { id: 'n4', type: 'job',     actorId: 'u4', text: 'posted a job you might be interested in: Design Lead at Tilt', timestamp: '3h', read: true },
  { id: 'n5', type: 'like',    actorId: 'u2', text: 'and 47 others liked your post', timestamp: '6h', read: true },
  { id: 'n6', type: 'view',    actorId: 'u7', text: 'viewed your profile', timestamp: '1d', read: true },
  { id: 'n7', type: 'mention', actorId: 'u5', text: 'mentioned you in a comment', timestamp: '1d', read: true },
];
