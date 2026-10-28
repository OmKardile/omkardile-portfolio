// Content rules: every project fact (status, stack, link) is verified against
// the live deployment or the project's public repository before it goes in
// here. In-progress projects have no links. Multi-app projects use `links`
// (one labeled anchor per application) instead of a single `href`.

export type Project = {
  slug: string;
  index: string;
  title: string;
  kind: string;
  year: string;
  status: 'live' | 'building';
  summary: string;
  stack: string;
  /** One labeled link per destination (live app, storefront, GitHub, release). */
  links?: { href: string; label: string }[];
  cover: { alt: string; seed: number };
};

export const site = {
  name: 'Omkar Kardile',
  initials: 'OK',
  firstName: 'Omkar',
  lastName: 'Kardile',
  role: 'Developer & UI/UX Designer',
  location: 'Pune, India',
  url: 'https://omkardile.is-a.dev',
  description:
    'Portfolio of Omkar Kardile, designer and developer in Pune. Product and UI/UX design paired with the engineering to ship the result in code.',
  email: 'omkarkardileatwork@gmail.com',
  heroLine: 'Designer and developer in Pune. I design digital products and ship them in code.',
  statement:
    'I design and build thoughtful digital products that are simple, useful and human: product and UI/UX design paired with the engineering to ship the result in code.',
  statementContext:
    'One person, both ends of the work. The interface and the system behind it are designed together, so nothing gets lost in the handoff, because there is none.',
  socials: [
    { label: 'GitHub', href: 'https://github.com/OmKardile' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/omkar-kardile-49501b213/' },
    { label: 'Resume', href: 'https://drive.google.com/file/d/19PxUGcMTALOfNKFbVObd4E0xLKVGGWkZ/view?usp=sharing' },
  ],
  // Interactive Liquid Glass apps live in the old codebase. When they get a new
  // home, change this one constant — every app link derives from it.
  liquidGlassAppBase: 'https://omkardile.is-a.dev/uiux/apps/',
};

export const projects: Project[] = [
  {
    slug: 'ssshopee',
    index: '01',
    title: 'SSShopee — Retail ERP + Storefront',
    kind: 'Product · Retail management & e-commerce',
    year: '2025–26',
    status: 'live',
    summary:
      'One retail business, two applications: a Next.js ERP for the owner — POS with barcode scanning and GST receipts, inventory with restock, stock-take and expiry tracking, purchases, income and expenses, udhar (credit) ledgers, analytics and reports — plus a customer storefront with its own database, cookie cart and COD/UPI checkout. Products sync from the ERP to the shop.',
    stack: 'Next.js 16 · TypeScript · Prisma 6 · Supabase PostgreSQL · Tailwind CSS 4',
    links: [
      { href: 'https://shubhamsupershopee-admin.vercel.app/', label: 'Open management app' },
      { href: 'https://sss-ecomm.vercel.app/', label: 'Open customer storefront' },
      { href: 'https://github.com/OmKardile/sss-erp-hybrid', label: 'GitHub (ERP)' },
    ],
    cover: { alt: 'Signal pattern for the SSShopee retail ERP and storefront', seed: 3.1 },
  },
  {
    slug: 'servepoint',
    index: '02',
    title: 'ServePoint — Café Operations Platform',
    kind: 'Product · Café operations',
    year: '2026',
    status: 'live',
    summary:
      'A café operating system covering the full counter: ordering with GST checkout, a live kitchen queue, bill collection, end-of-day close-out, inventory with recipes, guest loyalty and floor management. Role-based access for superadmin, owner and staff, plus QR table-side ordering and live order tracking for guests. Installable PWA on Supabase.',
    stack: 'React 19 · TypeScript · Vite · Tailwind CSS 4 · Zustand · Supabase',
    links: [
      { href: 'https://servepoint-tsos.onrender.com/', label: 'Open live app' },
      { href: 'https://github.com/OmKardile/servepoint', label: 'GitHub' },
    ],
    cover: { alt: 'Signal pattern for the ServePoint café operations platform', seed: 7.7 },
  },
  {
    slug: 'patelnetworks',
    index: '03',
    title: 'PatelNetworks — Client E-commerce Platform',
    kind: 'Client project · E-commerce',
    year: '2026',
    status: 'live',
    summary:
      'A live storefront for a Surat-based surveillance and networking hardware business: categorized product catalog, exclusive CCTV kit bundles, Razorpay checkout with COD, GST invoicing with serial-tracked warranty, OTP customer accounts with order history and one-tap reorders, WhatsApp ordering and order tracking.',
    stack: 'E-commerce platform · Razorpay payments · GST invoicing',
    links: [{ href: 'https://patelnetworks-5ne3.onrender.com/', label: 'Open live site' }],
    cover: { alt: 'Signal pattern for the PatelNetworks client e-commerce platform', seed: 12.4 },
  },
  {
    slug: 'tech-site',
    index: '04',
    title: 'tech // site — Technology Web Platform',
    kind: 'Product · Publishing platform',
    year: '2025–26',
    status: 'live',
    summary:
      'A multi-niche technology publication with a split publishing model: one admin account with a Gemini-powered drafting tool, and open signup for writers who publish manually. Articles across 9 niches, a personal reading library, public author profiles with follows and comments, and a shopping layer with product comparisons and buying guides.',
    stack: 'Next.js 15 · React 19 · TypeScript · Supabase · Tailwind CSS',
    links: [
      { href: 'https://tech-site-new.vercel.app/', label: 'Open the site' },
      { href: 'https://github.com/jhonny-silverhand/tech-site', label: 'GitHub' },
    ],
    cover: { alt: 'Signal pattern for the tech // site publishing platform', seed: 18.9 },
  },
  {
    slug: 'handoff',
    index: '05',
    title: 'HandOff',
    kind: 'Product · Web + Android',
    year: '2026',
    status: 'live',
    summary:
      'A privacy-first digital business card app that generates offline vCard QR codes — no accounts, no servers, no tracking; everything stays on device. Card studio with 36 style presets, live scan-contrast scoring and multi-format export, shipped as a web app and an Android app. Public beta v1, actively maintained.',
    stack: 'Next.js 16 · TypeScript · Capacitor 8 · Tailwind CSS 4 · Zustand',
    links: [
      { href: 'https://github.com/OmKardile/handOff', label: 'GitHub' },
      { href: 'https://github.com/OmKardile/handOff/releases/tag/beta.v1', label: 'Release beta.v1' },
    ],
    cover: { alt: 'Signal pattern for the HandOff digital business card app', seed: 23.2 },
  },
  {
    slug: 'bandwidth-bandit',
    index: '06',
    title: 'Bandwidth Bandit',
    kind: 'App · Android',
    year: '2026',
    status: 'live',
    summary:
      'A lightweight Android network monitor: a persistent live-speed notification with separate download and upload rates, daily Wi-Fi/mobile usage totals, calendar-backed history and per-app traffic breakdowns — plus usage-threshold alerts, signal strength in dBm and a quick Cloudflare speed test.',
    stack: 'Kotlin · Android (foreground service · NetworkStatsManager)',
    links: [{ href: 'https://github.com/OmKardile/bandwidth-bandit', label: 'GitHub' }],
    cover: { alt: 'Signal pattern for the Bandwidth Bandit Android network monitor', seed: 27.5 },
  },
  {
    slug: 'aether-weather',
    index: '07',
    title: 'Aether Weather App',
    kind: 'App · Next.js',
    year: '2024–26',
    status: 'live',
    summary:
      'A weather-reactive PWA in a macOS-style Liquid Glass shell: live conditions, a 48-hour outlook, 7-day forecast and air quality over a full-viewport sky that follows the weather and time of day. Weather data is keyless from Open-Meteo behind server route handlers; an AI layer (briefing, chat, advisor, alert digest) degrades gracefully to rule-based text.',
    stack: 'Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Open-Meteo',
    links: [
      { href: 'https://weather-nextjs-omkarkardile.vercel.app/', label: 'Open app' },
      { href: 'https://github.com/OmKardile/weather-nextjs', label: 'GitHub' },
    ],
    cover: { alt: 'Signal pattern for the Aether Weather App', seed: 31.7 },
  },
  {
    slug: 'ai-recipe-generator',
    index: '08',
    title: 'AI Recipe Generator',
    kind: 'App · Google Gemini',
    year: '2024–26',
    status: 'live',
    summary:
      'Generates recipes from ingredient tags and dietary preferences, powered by Google Gemini (2.5 Flash) through a Next.js API route — migrated from OpenAI and verified in the deployed codebase.',
    stack: 'Next.js · React · Tailwind CSS · Google Gemini API',
    links: [
      { href: 'https://recipe-generator-omkardile.vercel.app/', label: 'Open app' },
      { href: 'https://github.com/OmKardile/recipe-generator', label: 'GitHub' },
    ],
    cover: { alt: 'Signal pattern for the AI Recipe Generator', seed: 35.9 },
  },
  {
    slug: 'car-service-station',
    index: '09',
    title: 'Online Car Service Station',
    kind: 'Academic project · PG-DMC major',
    year: '2025–26',
    status: 'live',
    summary:
      'Major project for the PG-DMC course (SunBeam Infotech, C-DAC ACTS): a hybrid car-service application for booking and tracking service jobs, paired with a React admin panel for managing operations.',
    stack: 'React.js · Hybrid mobile app · Admin panel',
    links: [{ href: 'https://cdacadminpanel.vercel.app/login', label: 'Open admin panel' }],
    cover: { alt: 'Signal pattern for the Online Car Service Station project', seed: 39.4 },
  },
  {
    slug: 'food-ordering',
    index: '10',
    title: 'Full-Stack Food Ordering App',
    kind: 'Product · In development',
    year: '2026',
    status: 'building',
    summary:
      'A food ordering platform in active development. Planned scope covers menu browsing, order placement and delivery tracking; implemented features and a live link land here as they ship.',
    stack: 'Next.js · MongoDB',
    cover: { alt: 'Signal pattern for the food ordering app, build in progress', seed: 34.8 },
  },
  {
    slug: 'realtime-chat',
    index: '11',
    title: 'Real-Time Chat App',
    kind: 'App · In development',
    year: '2026',
    status: 'building',
    summary:
      'A mobile chat app with authentication and real-time messaging across devices. In active development — verified functionality and a link land here as features ship.',
    stack: 'React Native · Tailwind CSS · Firebase',
    cover: { alt: 'Signal pattern for the real-time chat app, build in progress', seed: 41.3 },
  },
];

export const capabilities = {
  design: {
    label: 'Design',
    note: 'Product, interface and the research behind them.',
    items: [
      'UX Design',
      'UI Design',
      'Product Design',
      'Interaction Design',
      'Design Systems',
      'UX Research',
      'Usability & User Testing',
      'Prototyping',
      'Figma',
      'Framer',
    ],
  },
  build: {
    label: 'Build',
    note: 'The engineering that ships the design in code.',
    items: [
      'React.js',
      'Next.js',
      'TypeScript',
      'Node.js',
      'Express.js',
      'React Native',
      'Native Android',
      'Native iOS',
      'Tailwind CSS',
      'SQL',
      'Supabase',
      'Google Gemini APIs',
      'Kotlin',
    ],
  },
};

export const experience = [
  {
    title: 'Post Graduate Diploma in Mobile Computing (PG-DMC)',
    org: 'SunBeam Infotech, Pune. Authorized training centre of C-DAC ACTS',
    period: 'Completed Feb 2026',
    kind: 'Education',
  },
  {
    title: 'UI/UX Designer',
    org: 'SWAAS TECHNO, Khardi',
    period: "Jan 2024 to Jan 2025",
    kind: 'Role',
  },
  {
    title: 'Web Design Intern',
    org: 'Arrow Technologies, Nashik',
    period: "Jan 2023 to Jan 2024",
    kind: 'Role',
  },
  {
    title: 'Virtual Intern',
    org: 'Bharat Technologies',
    period: "Aug 2023 to Dec 2023",
    kind: 'Role',
  },
];

// ---------- Relay — UI/UX case study #1 (complete) ----------
// Content source: upload/relay-project-complete.zip case study document.
// Images live in public/work/relay/; the live prototype is a React component
// mounted at /uiux/relay/prototype.

export const relay = {
  index: '01',
  name: 'Relay',
  tagline: 'A trust-first agentic AI assistant for life admin',
  kind: 'Exploratory UX case study · Mobile app',
  date: 'October 2026',
  status: 'Complete',
  role: 'End-to-end UX: trend research, persona, information architecture, interaction flow, visual system, prototype',
  tools: ['Research', 'IA & flows', 'Visual system', 'React prototype'],
  cover: '/work/relay/cover.png',
  coverAlt: 'Relay signature screens — Home, Checkpoint and Delegate composed in one banner',
  overview: [
    'Relay is a mobile assistant that handles the multi-step errands people put off — cancelling a forgotten subscription, disputing a late fee, negotiating a bill, tracking a price. The idea itself isn’t the hard part; several real apps already do versions of it. The hard part, and the actual subject of this case study, is trust: how do you design an interface that lets someone hand off real tasks to an autonomous agent without ever feeling like they’ve lost the wheel.',
    'This case study walks through the process end to end: the context that made this worth designing, the research and persona behind it, the information architecture and core interaction flow, the visual design system, all four key screens, and the working prototype that came out of it.',
  ],
  whyNow:
    'Two things are true in design right now. First, agentic AI — software that quietly completes multi-step tasks on a person’s behalf — is the trend designers rank as most likely to define the year. Second, the interfaces getting real praise aren’t the ones running on full autopilot; they’re the ones that stay visible, stay optional, and check in before they act. Layered on top of that is a broader move away from gamified, attention-hungry UI toward calmer, lower-effort interactions, alongside accessibility and non-manipulative design becoming a baseline expectation rather than a differentiator. That combination — real appetite for delegation, paired with real wariness of losing control — is exactly the tension Relay is designed around.',
  competitors: [
    { name: 'Pine AI', text: 'an autonomous agent that places calls on a person’s behalf to negotiate bills, cancel subscriptions, and file complaints.' },
    { name: 'Kudos', text: 'recently added a comparable phone-based negotiation agent for premium users.' },
    { name: 'Rocket Money', text: 'negotiates bills and cancels subscriptions, but takes a cut of whatever it saves you.' },
    { name: 'Onepilot', text: 'audits subscriptions monthly and drafts cancellations in advance, but deliberately waits for the user to send the final action.' },
  ],
  gap: 'Every one of these tools solves the labor problem: something else does the boring task. Almost none of them solve the trust problem well. Full autonomy feels invasive the first time it surprises you. Full manual review defeats the purpose of delegating in the first place. The actual design work is the middle ground — making delegation feel safe by default, with just enough friction, in exactly the right spot, so it never feels like either extreme.',
  persona: {
    name: 'Maya, 34',
    meta: 'Marketing manager · generally comfortable with tech',
    facts: [
      'Has 4 forgotten subscriptions and a cable bill she knows is negotiable, but three months later still hasn’t dealt with it.',
      'Was burned once by an app that changed something on her account without telling her clearly first — now she’s wary of anything that acts “for” her.',
    ],
    quote:
      'When I have a task I know needs handling but keep avoiding because it’ll eat an afternoon, I want something else to do the legwork — but I want to approve the outcome before it’s real, not find out after.',
  },
  problem:
    'Maya wants to reclaim the hours she loses to phone holds and account admin — without ever waking up to a change she didn’t agree to. Relay’s entire product bet is that these two wants aren’t actually in conflict; they just need an interface that treats consent as a first-class moment, not an afterthought.',
  ia: {
    text: 'Four sections, deliberately shallow. Almost all of the interesting design work lives inside two of them: Delegate, where trust starts, and Approvals, where it’s either built or broken.',
    image: '/work/relay/diagrams/information-architecture.png',
    alt: 'Relay information architecture map: home, delegate, approvals and a combined activity/settings view',
    caption: 'Relay’s top-level structure — home, delegate, approvals, and a combined activity/settings view.',
  },
  checkpoint: {
    lead: 'This is the flow the entire app is built to protect. Everything upstream — research, IA, persona — exists to justify it, and everything downstream — visual design, prototype — exists to execute it well.',
    text: 'You delegate once. Relay works quietly in the background. It never proceeds past a decision point without presenting the options and waiting for you.',
    decline:
      'If Maya declines at the checkpoint, the task simply closes. Nothing executes, nothing is charged, and nothing changes on her accounts — the safest possible default for a system that’s allowed to act on her behalf.',
    image: '/work/relay/diagrams/checkpoint-flow.png',
    alt: 'Relay checkpoint interaction flow diagram',
    caption: 'Delegate once, review at the decision point, explicit yes or no.',
  },
  visual: {
    text: 'Everywhere in Relay should feel quiet by default — muted tones, generous whitespace, no gamified progress bars. The one place colour gets loud is exactly where it should: a checkpoint. If gold only ever means “this needs you,” Maya’s eye learns to trust the absence of colour just as much as its presence.',
    note:
      'One process note worth naming: the first pass at this palette used a warm cream background, which is one of the most common “this was AI-generated” visual tells in design right now. The palette below is the revised version — a cooler, quieter sage-white — kept after a deliberate second look rather than the first instinct.',
    tokens: [
      { name: 'Mist', hex: '#F0F3F0', use: 'Background' },
      { name: 'Pine', hex: '#0F6E56', use: 'Primary / brand' },
      { name: 'Ink', hex: '#1C2624', use: 'Text' },
      { name: 'Moss', hex: '#62726B', use: 'Secondary text' },
      { name: 'Gold border', hex: '#D9A84E', use: 'Checkpoint accent' },
      { name: 'Gold text', hex: '#7A5518', use: 'Checkpoint text' },
    ],
    image: '/work/relay/diagrams/color-palette.png',
    alt: 'Relay color palette reference sheet',
    caption: 'Mist (background), Pine (brand/primary), Ink (text), Moss (secondary text), and the Gold pairing reserved solely for checkpoints.',
  },
  screens: {
    text: 'Home is the screen Maya opens every morning: anything waiting on her sits at the top in gold, quiet in-progress work sits below it, and small wins are logged so the value of delegating stays visible. Checkpoint is the moment of consent itself. Delegate keeps handing off a task as low-effort as possible — a tap on a suggestion, or a sentence in her own words. Activity & Settings is where the log lives and where Maya tunes exactly how much autonomy Relay gets, category by category.',
    items: [
      { src: '/work/relay/screens/home.png', label: 'Home' },
      { src: '/work/relay/screens/checkpoint.png', label: 'Checkpoint' },
      { src: '/work/relay/screens/delegate.png', label: 'Delegate' },
      { src: '/work/relay/screens/activity.png', label: 'Activity & Settings' },
    ],
    caption: 'One consistent system across all four screens.',
  },
  prototype: {
    text: 'A working click-through prototype covers the full loop rather than static screens:',
    bullets: [
      'Delegate a task in your own words, or use a suggested one.',
      'Watch Relay move it into a real checkpoint after a short research delay.',
      'Compare options, then approve or decline — approving logs the outcome to Activity; declining closes it with no action taken.',
      'Adjust how much autonomy Relay gets per category in Settings.',
    ],
    href: '/uiux/relay/prototype',
    cta: 'Open the live prototype',
  },
  validate: {
    lead: 'A few honest open questions this exploration surfaced — the kind a real usability round would need to answer:',
    items: [
      'Does the checkpoint still feel meaningful after the 50th approval, or does familiarity turn it into a rubber stamp?',
      'Is two options the right number for every task, or does a more complex errand (a dispute, say) need a third “I’ll handle this myself” exit?',
      'How does trust hold up the first time Relay gets something wrong — and does the activity trail actually help recovery, or just document the mistake?',
    ],
    close: 'None of these have confident answers yet — which is exactly why they’d be the first round of user testing, not an afterthought.',
  },
};

// ---------- Taar — UI/UX case study #2 (coded prototype) ----------
// Content source: upload/taar-fashion-app.zip — a working React/Vite prototype
// (v0.1.0), ported 1:1 to src/components/TaarPrototype.jsx and running at
// /uiux/taar/prototype. Per its README, no tap-count or conversion numbers are
// claimed anywhere: the original app hasn't been measured.

export const taar = {
  index: '02',
  name: 'Taar',
  tagline: 'Fashion e-commerce discovery — fewer taps to narrow the catalogue',
  kind: 'Coded UX prototype · Mobile-first',
  date: 'v0.1.0',
  status: 'Working prototype',
  role: 'End-to-end: the UX decisions, the UI, and the working front-end build',
  tools: ['React 18', 'Vite', 'lucide-react'],
  cover: '/work/taar/grid.png',
  coverAlt: 'Taar prototype running in a browser — product grid under category tabs',
  overview: [
    'Taar is a mobile-first product discovery UI for a fictional fashion label — one Autumn Edit of ten pieces. It isn’t a deck or a set of static mockups; it’s a working React build, so every decision in it has to survive contact with real state: filters that actually filter, sizes that actually sell out, a grid that can actually end up empty.',
    'The brief I set for it: fewer taps to narrow a catalogue, with availability and price clarity up front. Everything below is in the prototype you can open on this site.',
  ],
  problem:
    'Fashion discovery usually makes the shopper do the work — filters buried screens deep, results that don’t move until you commit, sold-out sizes that only reveal themselves after you’ve picked one. Taar flips that: narrowing happens in one place, the count updates live, and availability is honest before you commit to anything.',
  filter: {
    text: 'Filtering is one bottom sheet — size, colour, price — not a stack of pages. Results update live behind the sheet, and the CTA carries the count: “Show 4 pieces.” Closing the sheet never costs a surprise.',
    chips:
      'Active filters don’t disappear back into the sheet — they stay visible as removable chips under the bar, so the grid’s state is always readable at a glance.',
    image: '/work/taar/filter-sheet.png',
    alt: 'Taar filter bottom sheet with size, colour and price controls and a live result count on the CTA',
    caption: 'One sheet, live count on the CTA — no “apply and pray.”',
  },
  availability:
    'Sold-out sizes are shown and struck through, not hidden. Hiding them reopens the question on every product; showing them answers it once — and explains why a piece can’t be added in your size before you try.',
  quickAdd: {
    text: 'Add from the grid: tap plus, pick a colour and a size in the sheet, done — no product-page detour. Sold-out sizes are disabled right there, and the bag counter confirms the add without ever leaving the flow.',
    image: '/work/taar/quick-add.png',
    alt: 'Taar quick-add sheet with colour options and struck-through sold-out sizes',
    caption: 'Colour, size, add — the whole loop inside one sheet.',
  },
  interface: {
    text: 'Editorial, not app-template: Fraunces for display type, Hanken Grotesk for UI, a warm-paper palette with a single navy accent. Product images sit in tonal slots, and the grid reveals with a quiet staggered entrance.',
    note:
      'The tonal slots are deliberate — the layout is designed around art-directed photography that hasn’t been shot yet, so the prototype doesn’t fake it with stock images.',
  },
  a11y: {
    lead: 'The prototype respects the boring rules — the ones that decide whether a design actually ships:',
    items: [
      '44px minimum touch targets everywhere, including the quick-add button on each card.',
      'The sheet is a real dialog: Esc closes it, the scrim closes it, background is inert and page scroll is locked.',
      'Pressed states are announced via aria-pressed; sold-out sizes read as “M, sold out”.',
      'prefers-reduced-motion turns off the entrance and sheet animation.',
    ],
  },
  next: {
    lead: 'Where this study goes next — and what it deliberately doesn’t claim:',
    items: [
      'Figma file backing these screens: research, flows, wireframes and hi-fi.',
      'Product detail and bag screens to complete the purchase loop.',
      'Real photography to replace the tonal slots.',
      'No metrics yet — the original app hasn’t been measured, so no tap-count or conversion claims until it is.',
    ],
  },
  prototype: {
    text: 'The real React build, running on this site:',
    bullets: [
      'Filter by size, colour and price — the result count updates live on the CTA.',
      'Watch active filters stack up as removable chips under the bar.',
      'Quick-add any piece: sold-out sizes are visible and struck through, in-stock ones go straight to the bag.',
      'Push the filters until nothing matches to see the empty state and its reset.',
    ],
    href: '/uiux/taar/prototype',
    cta: 'Open the live prototype',
  },
};

// ---------- UI/UX portfolio (/uiux) — design-side content, separate from the dev portfolio ----------

export const uiux = {
  kicker: 'UI/UX Portfolio · Pune · Open to remote',
  role: 'UI/UX Designer & Frontend Developer',
  tagline: 'I design interfaces that are honest. Then I build them.',
  description:
    'UI/UX portfolio of Omkar Kardile: product and interface design case studies, Liquid Glass redesign studies and design systems.',
  process: [
    { n: '01', title: 'Research first', text: 'Every decision starts with a real user problem.' },
    { n: '02', title: 'Design in systems', text: 'Components, not screens. Consistency at scale.' },
    { n: '03', title: 'Ship it', text: 'Figma files don’t ship. Code does.' },
  ],
  caseStudies: [
    {
      index: '03',
      title: 'Food Delivery App — 0 to 1',
      status: 'In progress',
      headline: 'Designing for Pune’s tiffin culture — local food, digital-first',
      problem:
        'Tiffin services in Pune and Nashik have no digital discovery layer. Designing the full app experience from user research to interactive Framer prototype.',
      role: 'UX Research · User Flows · Figma Design · Framer Prototype',
      tools: ['Figma', 'Framer', 'User Research'],
    },
    {
      index: '04',
      title: 'Checkout UX Redesign + Design System',
      status: 'In progress',
      headline: 'Building the component library I wish every junior designer had',
      problem:
        'Most e-commerce checkouts are broken — too many fields, no error recovery, no progress indicator. Redesigning the flow and documenting every component as a reusable design system.',
      role: 'UX Audit · Component Design · Design System · React Components',
      tools: ['Figma', 'React', 'Tailwind CSS'],
    },
  ],
  liquidGlass: [
    {
      app: 'linear',
      title: 'Linear — Liquid Glass redesign',
      summary: 'A focused issue-tracking workspace with list and board views, keyboard shortcuts and a command palette.',
      pages: '14-page case study',
    },
    {
      app: 'spotify',
      title: 'Spotify — Liquid Glass redesign',
      summary: 'A music discovery redesign with consistent navigation, richer search filters and a clearer playback queue.',
      pages: '9-page case study',
    },
    {
      app: 'linkedin',
      title: 'LinkedIn — Liquid Glass redesign',
      summary: 'A professional network concept spanning the feed, messaging, jobs, notifications and profile views.',
      pages: '14-page case study',
    },
    {
      app: 'stripe',
      title: 'Stripe — Liquid Glass redesign',
      summary: 'A payments workspace for balances, transactions, customer records and a revenue overview.',
      pages: '13-page case study',
    },
    {
      app: 'airbnb',
      title: 'Airbnb — Liquid Glass redesign',
      summary: 'A stay-discovery concept with clear pricing, category browsing, filters and listing details.',
      pages: '10-page case study',
    },
    {
      app: 'slack',
      title: 'Slack — Liquid Glass redesign',
      summary: 'A team-chat workspace with channel navigation, message reactions, composition and threaded replies.',
      pages: '13-page case study',
    },
  ],
  shipped: [
    {
      title: 'SSShopee ERP',
      stack: 'Next.js · TypeScript · Prisma',
      href: 'https://shubhamsupershopee-admin.vercel.app/',
    },
    {
      title: 'AI Recipe Generator',
      stack: 'Next.js · Google Gemini',
      href: 'https://recipe-generator-omkardile.vercel.app/',
    },
    {
      title: 'Car Service Admin Panel',
      stack: 'React · Hybrid App',
      href: 'https://cdacadminpanel.vercel.app/login',
    },
  ],
  aboutFacts: [
    'PG-DMC, SunBeam Infotech (C-DAC)',
    'B.Tech, D.Y. Patil Engineering',
    '1 year UI/UX at SWAAS TECHNO',
    'Hybrid developer + designer',
  ],
  quote: 'I’m a designer who codes — which means I design things that can actually be built, and I build things that were actually designed.',
};
