// AskOmkar — hand-written knowledge entries.
//
// This file is the bot's brain: every answer a visitor can receive was written
// here, by hand, in advance. There is NO language model at answer time — the
// widget only MATCHES a question to one of these entries (in-browser
// embeddings, see scripts/askomkar-embed.ts + src/lib/askomkar/matcher.ts).
// That makes the bot hallucination-proof and injection-proof by construction:
// it can only ever say what this file says.
//
// Rules for entries:
//   - Voice: third person ("Omkar built…"). First person is allowed ONLY in
//     the meta entries where the bot speaks about itself.
//   - Every factual claim must trace back to the live site (src/data/site.ts,
//     src/data/uiuxProjects.ts) or a link in `links`. If a recruiter could
//     follow up on it, the proof link must already be in the entry.
//   - Sensitive logistics (salary, notice period, relocation specifics) are
//     never invented — they deflect to Omkar by email on purpose.
//   - Answers use markdown-lite only: **bold**, [label](href), blank-line
//     paragraphs. The widget's renderer understands exactly that, nothing more.
//   - If you edit any `q` phrasing, re-run `npm run embed:askomkar` so the
//     vectors stay in sync (vectors.json is committed).

export type FaqLink = { href: string; label: string; note?: string };

export type FaqEntry = {
  id: string;
  /** Phrasings this entry should match. 2–5 per entry; the embed script turns each into a vector. */
  q: string[];
  /** Markdown-lite answer body. */
  a: string;
  /** Proof / action buttons rendered under the answer. */
  links?: FaqLink[];
};

/** Shared destinations, referenced by entries throughout the bank. */
const L = {
  email: { href: 'mailto:omkarkardileatwork@gmail.com', label: 'Email Omkar' },
  resume: {
    href: 'https://drive.google.com/file/d/19PxUGcMTALOfNKFbVObd4E0xLKVGGWkZ/view?usp=sharing',
    label: 'Open resume',
  },
  github: { href: 'https://github.com/OmKardile', label: 'GitHub profile' },
  linkedin: { href: 'https://www.linkedin.com/in/omkar-kardile-49501b213/', label: 'LinkedIn' },
  uiux: { href: '/uiux', label: 'Open the UI/UX portfolio' },
  work: { href: '/#work', label: 'See all projects' },
} satisfies Record<string, FaqLink>;

export const hand: FaqEntry[] = [
  // ---------- The bot itself (meta) ----------
  {
    id: 'who-are-you',
    q: [
      'who are you',
      'what are you',
      'what is this bot',
      'what is askomkar',
      'is this a chatbot',
    ],
    a: "I'm **AskOmkar** — the assistant built into Omkar Kardile's portfolio. I answer recruiter and interviewer questions about Omkar: his work, skills, experience and how he thinks.\n\nEvery answer about Omkar was written by Omkar in advance. Your question is matched to the closest pre-written answer here in your browser — no language model runs at answer time, so I can't drift off-script.",
    links: [L.work, L.uiux],
  },
  {
    id: 'how-do-you-work',
    q: [
      'how do you work',
      'how does this work',
      'how are answers generated',
      'do you use an llm',
      'how do you answer questions',
    ],
    a: "Under the hood: a hand-written bank of answers about Omkar, and a small embedding model (MiniLM, ~23 MB, downloaded once) that runs **locally in your browser** to match your question to the closest entry.\n\nThat's a deliberate trade-off — I never improvise, so I never invent. If nothing matches well, I say so and hand you to the human.",
    links: [L.email],
  },
  {
    id: 'can-i-trust-you',
    q: [
      'can i trust these answers',
      'do you hallucinate',
      'are these answers accurate',
      'can you make things up',
    ],
    a: "I can't invent facts — structurally. Every answer was pre-written by Omkar, and the site's own content rule requires each project fact to be verified against a live deployment or a public repository before it's allowed in.\n\nEvery claim I make links to its proof: the running app, the repo, or the release. If I don't know, I don't guess — I point you to Omkar.",
    links: [L.github],
  },
  {
    id: 'privacy',
    q: [
      'is my data private',
      'do you store my questions',
      'what happens to what i type',
      'privacy',
      'do you track me',
    ],
    a: '**Nothing you type leaves your browser.** The matching model runs on your device; the question bank is plain static data. No server, no API keys, no analytics on the conversation.\n\nThat is the point of building the bot this way — a portfolio that respects the people reading it.',
  },
  {
    id: 'why-no-llm',
    q: [
      'why not use chatgpt',
      'why is this not a real ai',
      'why no language model',
      'are you a real ai',
    ],
    a: "Deliberate choice, three reasons: it costs **nothing to run** (no API bills on a public page), it works on fully static hosting, and it's **impossible to jailbreak** — there are no instructions to hijack, only pre-approved answers.\n\nThe trade-off is honesty itself: I match rather than improvise. For a portfolio, that's the right side of the trade.",
  },

  // ---------- About Omkar ----------
  {
    id: 'who-is-omkar',
    q: [
      'who is omkar kardile',
      'who is omkar',
      'introduce omkar',
      'who built this site',
    ],
    a: "**Omkar Kardile** is a designer and developer based in Pune, India. He designs digital products and ships them in code — product and UI/UX design paired with the engineering to build the result, by one person, on both ends of the work.\n\nHis own line on it: \"I'm a designer who codes — which means I design things that can actually be built, and I build things that were actually designed.\"",
    links: [L.uiux, L.github, L.linkedin],
  },
  {
    id: 'tell-me-about',
    q: [
      'tell me about yourself',
      'tell me about omkar',
      'tell me about him',
      'give me a quick intro',
      'elevator pitch',
      'summary about omkar',
    ],
    a: "Omkar Kardile — Pune-based designer-developer, PG-DMC from C-DAC (SunBeam, Feb 2026), one year of professional UI/UX at SWAAS TECHNO, and a shelf of shipped products: a retail ERP with a live storefront, a café operations platform, a client e-commerce build, an Android network monitor, a privacy-first business-card app, and a set of documented UX case studies.\n\nThe through-line: he designs the interface and builds the system behind it, so nothing gets lost in a handoff — because there isn't one.",
    links: [L.resume, L.work],
  },
  {
    id: 'location',
    q: [
      'where is he based',
      'where does omkar live',
      'what city is omkar in',
      'location',
      'is he in pune',
    ],
    a: '**Pune, India** — that is what the site publishes, and the /uiux portfolio additionally says open to remote. For anything more specific about relocation or on-site preferences, Omkar answers directly.',
    links: [{ href: '/uiux', label: 'UI/UX portfolio (says: open to remote)' }, L.email],
  },
  {
    id: 'open-to-work',
    q: [
      'is he available for hire',
      'is omkar open to work',
      'is he looking for a job',
      'can we hire him',
      'availability',
      'is he available now',
    ],
    a: "**Yes — the site says open to work** on every page: open to UI/UX design and frontend development roles and collaborations. Email is the fastest way to start the conversation.\n\nThis bot itself doubles as the proof he can build the modern stack end to end — it ships on the same portfolio it answers for.",
    links: [L.email, L.resume],
  },
  {
    id: 'why-different',
    q: [
      'what makes him different',
      'why is omkar different from other designers',
      'what is his edge',
      'one person both ends',
      'designer and developer',
    ],
    a: "Most handoffs lose product quality twice — designer imagines what can't be built, developer ships what wasn't designed. Omkar is one person doing both: the interface and the system behind it are designed together.\n\nIt shows in the work: the Sutra checkout case study ships with the token-driven design system it runs on; the SSShopee ERP and its customer storefront were built as one business, not two contracts.",
    links: [{ href: '/uiux/sutra', label: 'Sutra case study' }, L.work],
  },
  {
    id: 'work-style',
    q: [
      'how does he work',
      'what is his work style',
      'how does omkar approach work',
      'working style',
    ],
    a: "End-to-end ownership. His stated process: **research first, design in systems, ship it** — Figma files don't ship, code does.\n\nIn practice that means decisions survive contact with reality: his coded prototypes (Taar, Sutra) run as real React builds on this site, and his case studies publish their open questions instead of hiding them.",
    links: [{ href: '/uiux/taar/prototype', label: 'Taar prototype' }, { href: '/uiux/sutra/prototype', label: 'Sutra prototype' }],
  },
  {
    id: 'how-learned',
    q: [
      'how did he learn',
      'is he self taught',
      'his education background',
      'how did omkar learn to code',
    ],
    a: "Both formally and by shipping. Formally: **B.Tech (D.Y. Patil Engineering)** and a **Post Graduate Diploma in Mobile Computing (PG-DMC)** from SunBeam Infotech, Pune — an authorized training centre of C-DAC ACTS — completed February 2026.\n\nPractically: a year of professional UI/UX, two internships, and ten projects that went all the way to live URLs. He learns by finishing things in public.",
    links: [L.resume],
  },
  {
    id: 'education-cdac',
    q: [
      'what is his cdac qualification',
      'tell me about his pg-dmc',
      'cdac course',
      'sunbeam infotech diploma',
      'what did he study',
      'mobile computing diploma',
    ],
    a: "**PG-DMC — Post Graduate Diploma in Mobile Computing**, completed Feb 2026 at SunBeam Infotech, Pune (authorized training centre of **C-DAC ACTS**, the government-backed IT training body).\n\nIt's a full-stack program — which lines up with what he ships: native Android (Kotlin), web frontends, and the backends behind them.",
    links: [L.work],
  },
  {
    id: 'education-btech',
    q: [
      'does he have a degree',
      'btech college',
      'engineering degree',
      'dy patil',
    ],
    a: '**B.Tech** from **D.Y. Patil Engineering** — listed on the site alongside the C-DAC PG-DMC diploma. Degree plus a government-recognized post-graduate diploma in mobile computing, on top of a year of professional design experience.',
    links: [L.resume],
  },

  // ---------- Career ----------
  {
    id: 'experience-timeline',
    q: [
      'what is his experience',
      'work history',
      'career timeline',
      'has he worked professionally',
      'professional experience',
      'what jobs has he had',
    ],
    a: "The published timeline:\n\n- **UI/UX Designer — SWAAS TECHNO**, Khardi · Jan 2024 – Jan 2025\n- **Web Design Intern — Arrow Technologies**, Nashik · Jan 2023 – Jan 2024\n- **Virtual Intern — Bharat Technologies** · Aug 2023 – Dec 2023\n- **PG-DMC, SunBeam (C-DAC ACTS)** · completed Feb 2026\n\nSince then: shipping products — including work delivered to a paying client.",
    links: [L.resume, L.work],
  },
  {
    id: 'experience-swaas',
    q: [
      'tell me about his swaas role',
      'swaas techno',
      'his ui ux job',
      'what did he do at swaas',
    ],
    a: 'One year as a **UI/UX Designer at SWAAS TECHNO** (Khardi), Jan 2024 – Jan 2025 — his full-time design role before going independent on product work.\n\nAsk about his case studies to see how he designs when he also controls the build: the /uiux portfolio is the deeper evidence.',
    links: [L.uiux, L.linkedin],
  },
  {
    id: 'experience-internships',
    q: [
      'tell me about his internships',
      'arrow technologies internship',
      'bharat technologies',
      'where did he intern',
    ],
    a: 'Two internships on the record: **Web Design Intern at Arrow Technologies** (Nashik, Jan 2023 – Jan 2024) and **Virtual Intern at Bharat Technologies** (Aug – Dec 2023).\n\nBoth predate his professional design role — the path ran intern → designer → shipping his own and client products.',
    links: [L.resume],
  },
  {
    id: 'client-work',
    q: [
      'has he done client work',
      'freelance clients',
      'has he worked with clients',
      'real clients',
    ],
    a: '**Yes — and it shipped.** PatelNetworks is a storefront built for a real Surat-based surveillance and networking hardware business: Razorpay checkout with COD, GST invoicing with serial-tracked warranty, OTP customer accounts, WhatsApp ordering. The demo and its admin dashboard are both live.\n\nSSShopee is the other real-world proof — the management app note on the site says the store runs on it in real time.',
    links: [
      { href: 'https://patelnetworks-5ne3.onrender.com/', label: 'PatelNetworks live demo' },
      { href: 'https://sss-ecomm.vercel.app/', label: 'SSShopee storefront' },
    ],
  },
  {
    id: 'experience-level',
    q: [
      'how experienced is he',
      'is he a fresher',
      'junior or senior',
      'experience level',
      'how many years of experience',
    ],
    a: "Early-career on paper, shipped-product deep in practice: one professional year of UI/UX plus two internships and the C-DAC PG-DMC — and **eight live products** across web, Android and AI integrations, including client delivery.\n\nThe honest framing his own site uses: the portfolio's rule is that every link must point to something verified and running. Depth is demonstrated, not claimed.",
    links: [L.work, L.resume],
  },
  {
    id: 'role-looking-for',
    q: [
      'what role is he looking for',
      'what kind of job',
      'what positions does he want',
      'roles he is interested in',
      'is he looking for design or development',
    ],
    a: 'Per the site: **UI/UX design and frontend development roles and collaborations** — he is deliberately hybrid.\n\nStrongest fit: product-minded teams where design and code sit close together — product designer who ships, or frontend engineer who designs. The /uiux and main portfolios are two views of the same person.',
    links: [L.uiux, L.email],
  },

  // ---------- Skills ----------
  {
    id: 'strongest-stack',
    q: [
      'what is his strongest stack',
      'main tech stack',
      'what does he work with most',
      'core technologies',
      'tech stack',
      'what can he build with',
      'typescript',
      'nextjs',
    ],
    a: '**Next.js / React + TypeScript** is the core, with **Tailwind CSS**, **Prisma** and **Supabase PostgreSQL** behind it — that exact stack runs the SSShopee ERP and this portfolio.\n\nAround it: React Native and native Kotlin for mobile, Node/Express for services, Figma and Framer on the design side.',
    links: [
      { href: 'https://github.com/OmKardile/sss-erp-hybrid', label: 'SSShopee ERP (that stack)' },
      { href: 'https://github.com/OmKardile/servepoint', label: 'ServePoint (React 19 + Supabase)' },
    ],
  },
  {
    id: 'design-skills',
    q: [
      'what are his design skills',
      'is he a good designer',
      'design capabilities',
      'what design does he do',
      'ux ui skills',
      'wireframes',
      'user research',
      'personas',
      'usability testing',
    ],
    a: 'The published design skill set: **UX, UI and product design, interaction design, design systems, UX research, usability and user testing, prototyping** — in Figma and Framer.\n\nProof over lists: five full written case studies (Relay, Taar, Sutra, Lethe, Stoop) plus a coded checkout with a living design-system page.',
    links: [L.uiux, { href: '/uiux/sutra', label: 'Sutra — checkout + design system' }],
  },
  {
    id: 'frontend-skills',
    q: [
      'frontend skills',
      'react experience',
      'nextjs experience',
      'how strong is his frontend',
      'does he know react',
      'javascript',
      'tailwind css',
      'state management',
    ],
    a: 'Frontend is home ground: **React 19 / Next.js 15–16, TypeScript, Tailwind CSS 4, Zustand**, PWAs (ServePoint, Aether Weather), and the accessibility habits his own prototypes document — 44px targets, real dialogs, announced errors, reduced-motion support.\n\nThis portfolio itself is a Next.js 16 App Router build with hand-rolled motion — no UI kit doing the work for him.',
    links: [L.github, L.work],
  },
  {
    id: 'mobile-skills',
    q: [
      'mobile development skills',
      'android development',
      'does he build mobile apps',
      'react native experience',
      'kotlin experience',
      'capacitor',
      'ios development',
    ],
    a: 'All three mobile routes, with shipped evidence:\n\n- **Native Android (Kotlin)** — Bandwidth Bandit: foreground service, NetworkStatsManager, live-speed notification\n- **React Native** — a real-time chat app currently in development\n- **Capacitor 8** — HandOff, a web app shipped to Android\n\nPlus the formal credential: the C-DAC PG-DMC is a mobile-computing program.',
    links: [
      { href: 'https://github.com/OmKardile/bandwidth-bandit/releases/tag/v1.0.0', label: 'Bandwidth Bandit v1.0.0' },
      { href: 'https://github.com/OmKardile/handOff/releases/tag/beta.v1', label: 'HandOff beta' },
    ],
  },
  {
    id: 'backend-skills',
    q: [
      'backend skills',
      'database experience',
      'does he do backend',
      'node express experience',
      'sql and databases',
      'prisma',
      'supabase',
      'postgresql',
      'mongodb',
      'firebase',
      'nodejs',
    ],
    a: 'Yes — the ERP proves it: **Node.js / Express**, **Next.js route handlers**, **Prisma 6**, **Supabase PostgreSQL**, SQL; Firebase in the in-development chat app, MongoDB in the in-development food ordering platform.\n\nThe SSShopee build is the deep proof: two applications, separate databases, products syncing from the ERP to the storefront, cookie cart, COD/UPI checkout.',
    links: [{ href: 'https://github.com/OmKardile/sss-erp-hybrid', label: 'SSShopee ERP repo' }],
  },
  {
    id: 'ai-experience',
    q: [
      'ai experience',
      'has he worked with ai or llms',
      'machine learning experience',
      'genai experience',
      'does he integrate ai',
      'gemini api',
      'openai',
      'prompt engineering',
      'llm integration',
    ],
    a: "Hands-on with **Google Gemini in two shipped products**: the AI Recipe Generator (migrated from OpenAI to Gemini 2.5 Flash) and the drafting tool inside tech // site. Aether Weather adds an AI layer that **degrades gracefully** to rule-based text when the model isn't available.\n\nDesign-side: the Relay case study is a trust-first agentic-AI assistant — he thinks about AI products, not just calls their APIs.",
    links: [
      { href: 'https://recipe-generator-omkardile.vercel.app/', label: 'AI Recipe Generator' },
      { href: '/uiux/relay', label: 'Relay — agentic AI case study' },
    ],
  },
  {
    id: 'design-tools',
    q: [
      'does he use figma',
      'design tools',
      'framer experience',
      'prototyping tools',
    ],
    a: '**Figma and Framer** are the published design tools, plus a habit most designers skip: when a flow matters, he codes the prototype in React and ships it on this site — Taar and Sutra are working builds, not slides.\n\nThe one in-progress case study (Food Delivery, 0 to 1) is explicitly a Figma → Framer research-to-prototype pipeline.',
    links: [{ href: '/uiux/taar/prototype', label: 'Coded prototype: Taar' }],
  },
  // ---------- Projects: deep dives (the derived one-card-per-project entries
  // are generated from site.ts in bank.ts; these are the stories behind them) ----------
  {
    id: 'all-projects',
    q: [
      'what are all his projects',
      'list his projects',
      'what has he built',
      'show me his work',
      'what projects does omkar have',
      'everything he has built',
    ],
    a: "Eight live, two in active development — every fact verified against a running deployment or a public repo:\n\n- **SSShopee** — retail ERP + customer storefront, live in real use\n- **ServePoint** — café operations platform (PWA)\n- **PatelNetworks** — client e-commerce, shipped to client\n- **tech // site** — multi-niche publishing platform with a Gemini drafting tool\n- **HandOff** — privacy-first digital business card, web + Android\n- **Bandwidth Bandit** — native Android network monitor\n- **Aether Weather** — weather-reactive PWA in a Liquid Glass shell\n- **AI Recipe Generator** — Gemini-powered cooking assistant\n- *In development:* a food ordering platform and a real-time chat app",
    links: [L.work, L.uiux],
  },
  {
    id: 'proudest-project',
    q: [
      'what is he most proud of',
      'favorite project',
      'which project is his best',
      'best work',
      'proudest project',
    ],
    a: "If pressed: **SSShopee**. It is the hardest and the most real — two applications run one retail business: an owner-facing ERP (POS with barcode scanning, GST receipts, inventory with expiry tracking, udhar/credit ledgers, analytics) and a customer storefront that syncs its products.\n\nThe site's own management-app note says it plainly: *locked down under authentication — the store runs on it in real time.*",
    links: [
      { href: 'https://github.com/OmKardile/sss-erp-hybrid', label: 'SSShopee ERP repo' },
      { href: 'https://sss-ecomm.vercel.app/', label: 'Open storefront' },
    ],
  },
  {
    id: 'ssshopee-deep',
    q: [
      'tell me about the retail erp',
      'ssshopee details',
      'what can the ssshopee erp do',
      'how does ssshopee work',
      'pos system he built',
    ],
    a: "**SSShopee — one retail business, two applications.** The owner's side is a Next.js ERP: POS with barcode scanning and GST receipts, inventory with restock, stock-take and expiry tracking, purchases, income and expense tracking, udhar (credit) ledgers, and analytics.\n\nThe customer side is a storefront with its own database, cookie cart and COD/UPI checkout. Products sync from the ERP to the shop — the owner edits once, the store updates.",
    links: [
      {
        href: 'https://shubhamsupershopee-admin.vercel.app/',
        label: 'Management app',
        note: 'Locked down under authentication — the store runs on it in real time.',
      },
      { href: 'https://sss-ecomm.vercel.app/', label: 'Customer storefront' },
      { href: 'https://github.com/OmKardile/sss-erp-hybrid', label: 'GitHub (ERP)' },
    ],
  },
  {
    id: 'servepoint-deep',
    q: [
      'tell me about servepoint',
      'cafe platform details',
      'what does servepoint do',
      'restaurant software he built',
    ],
    a: "**ServePoint is a café operating system covering the full counter**: ordering with GST checkout, a live kitchen queue, bill collection, end-of-day close-out, inventory with recipes, guest loyalty and floor management.\n\nAccess is role-based (superadmin, owner, staff), guests get QR table-side ordering with live order tracking, and the whole thing installs as a PWA on Supabase.",
    links: [
      { href: 'https://servepoint-tsos.onrender.com/', label: 'Open live app' },
      { href: 'https://github.com/OmKardile/servepoint', label: 'GitHub' },
    ],
  },
  {
    id: 'patel-deep',
    q: [
      'tell me about the patel networks project',
      'client ecommerce project',
      'patelnetworks details',
      'the surat client project',
    ],
    a: "**PatelNetworks — shipped to client.** A storefront for a Surat-based surveillance and networking hardware business: categorized catalog with exclusive CCTV kit bundles, Razorpay checkout with COD, GST invoicing with serial-tracked warranty, OTP customer accounts with order history and one-tap reorders, and WhatsApp ordering.\n\nThe demo is live, and so is the admin dashboard he built for the owner.",
    links: [
      { href: 'https://patelnetworks-5ne3.onrender.com/', label: 'Open live demo' },
      { href: 'https://patelnetworks-5ne3.onrender.com/admin', label: 'Open admin dashboard' },
    ],
  },
  {
    id: 'handoff-deep',
    q: [
      'tell me about handoff',
      'digital business card app',
      'the vcard qr app',
      'handoff details',
    ],
    a: "**HandOff is a privacy-first digital business card.** It generates offline vCard QR codes — no accounts, no servers, no tracking; everything stays on device.\n\nThe card studio has 36 style presets with live scan-contrast scoring and multi-format export, shipped as both a web app and an Android app (Capacitor 8). Public beta v1 is out and maintained.",
    links: [
      { href: 'https://github.com/OmKardile/handOff', label: 'GitHub' },
      { href: 'https://github.com/OmKardile/handOff/releases/tag/beta.v1', label: 'Release beta.v1' },
    ],
  },
  {
    id: 'bandit-deep',
    q: [
      'tell me about bandwidth bandit',
      'android network monitor',
      'the data usage app',
      'bandwidth bandit details',
    ],
    a: "**Bandwidth Bandit is a lightweight native Android network monitor** — Kotlin, no frameworks. A persistent live-speed notification shows separate download and upload rates; daily Wi-Fi/mobile totals, calendar-backed history and per-app traffic come from NetworkStatsManager.\n\nIt also does usage-threshold alerts, signal strength in dBm, and a quick Cloudflare speed test. Version 1.0.0 is released.",
    links: [
      { href: 'https://github.com/OmKardile/bandwidth-bandit', label: 'GitHub' },
      { href: 'https://github.com/OmKardile/bandwidth-bandit/releases/tag/v1.0.0', label: 'Release v1.0.0' },
    ],
  },
  {
    id: 'aether-deep',
    q: [
      'tell me about the weather app',
      'aether weather',
      'liquid glass weather app',
      'weather app details',
    ],
    a: "**Aether is a weather-reactive PWA in a macOS-style Liquid Glass shell** — live conditions, 48-hour outlook, 7-day forecast and air quality over a full-viewport sky that follows the weather and time of day.\n\nTwo engineering choices worth noting: weather data is **keyless** (Open-Meteo behind server route handlers, so no API key ever reaches the client), and the AI layer **degrades gracefully** to rule-based text when the model is unavailable.",
    links: [
      { href: 'https://weather-nextjs-omkarkardile.vercel.app/', label: 'Open app' },
      { href: 'https://github.com/OmKardile/weather-nextjs', label: 'GitHub' },
    ],
  },

  // ---------- UI/UX portfolio ----------
  {
    id: 'uiux-overview',
    q: [
      'show me his design work',
      'what ux case studies does he have',
      'ui ux portfolio',
      'design portfolio',
      'case studies',
    ],
    a: 'The /uiux portfolio holds **five complete case studies** (Relay, Taar, Sutra, Lethe, Stoop), one in progress (a Food Delivery 0-to-1), and six **Liquid Glass redesign studies** (Linear, Spotify, LinkedIn, Stripe, Airbnb, Slack).\n\nTwo of the case studies ship as working coded prototypes, runnable right on the site.',
    links: [L.uiux],
  },
  {
    id: 'relay-study',
    q: [
      'tell me about the relay case study',
      'agentic ai design',
      'relay ux study',
      'the ai assistant case study',
    ],
    a: "**Relay — a trust-first agentic AI assistant for life admin.** An exploratory case study about the hard part of AI agents: how do you let someone hand off real tasks (cancelling a subscription, disputing a fee) without them feeling they lost the wheel.\n\nThe answer is the **checkpoint** — Relay never proceeds past a decision point without presenting options and waiting for an explicit yes or no. Full write-up with research, persona, IA, visual system, and a live React prototype on the site.",
    links: [{ href: '/uiux/relay', label: 'Read the Relay case study' }, { href: '/uiux/relay/prototype', label: 'Open the prototype' }],
  },
  {
    id: 'taar-study',
    q: [
      'tell me about the taar case study',
      'fashion app design',
      'taar ux study',
      'the fashion ecommerce study',
    ],
    a: "**Taar — fashion e-commerce discovery with fewer taps.** A coded prototype, not a mockup: one bottom sheet filters size, colour and price with the result count updating live on the CTA; sold-out sizes are shown and struck through rather than hidden; quick-add keeps the whole loop inside one sheet.\n\nIt's a working React build on this site — filters really filter, the grid can really empty out.",
    links: [{ href: '/uiux/taar', label: 'Read the Taar case study' }, { href: '/uiux/taar/prototype', label: 'Open the prototype' }],
  },
  {
    id: 'sutra-study',
    q: [
      'tell me about the sutra case study',
      'checkout design',
      'sutra design system',
      'the checkout case study',
    ],
    a: "**Sutra — a forgiving mobile checkout on a shared design system.** Validation on blur, not mid-keystroke; errors say what to fix; fees attach to the choice that causes them before commitment; completed steps collapse into editable summaries.\n\nUnder it sits a token-driven design system: one `--accent` swap re-themes the entire app from Taar navy to Ghar terracotta, and a living System page documents every component state.",
    links: [{ href: '/uiux/sutra', label: 'Read the Sutra case study' }, { href: '/uiux/sutra/prototype', label: 'Open the prototype' }],
  },
  {
    id: 'lethe-study',
    q: [
      'tell me about the lethe case study',
      'notes app that forgets',
      'lethe ux study',
      'the forgetting app',
    ],
    a: "**Lethe — notes that forget on purpose.** A concept case study that takes a contrarian position against the total-recall wave of AI tools: untouched notes dim daily, a nightly \"Last light\" review is the single moment to keep or release what's fading, and a released note leaves a one-line residue instead of vanishing.\n\nMemory as curation, not accumulation — nothing disappears without a last look.",
    links: [{ href: '/uiux/lethe', label: 'Read the Lethe case study' }],
  },
  {
    id: 'stoop-study',
    q: [
      'tell me about the stoop case study',
      'meetup app design',
      'stoop ux study',
      'the hangout app concept',
    ],
    a: "**Stoop — spontaneous meetups, safely.** A concept for same-day, low-commitment plans with people nearby, designed around the tension that kills every spontaneity app: effortless to say yes, safe to meet at all.\n\nTrust signals (public venue by default, mutual friends, the host's track record) sit directly on the join decision screen, and a visible streak makes flaking cost what it costs offline.",
    links: [{ href: '/uiux/stoop', label: 'Read the Stoop case study' }],
  },
  {
    id: 'ghar-study',
    q: [
      'tell me about the ghar case study',
      'tiffin app design',
      'ghar ux study',
      'home cooked food app',
    ],
    a: '**Ghar — home-cooked tiffin around Pimpri-Chinchwad.** A three-step order flow with skip-a-day in one tap, designed for the home-tiffin business model. Part of the coded case-study trio on /uiux (Taar, Ghar, Sutra), sharing the token-driven design system Sutra documents.',
    links: [{ href: '/uiux/ghar', label: 'Read the Ghar case study' }],
  },
  {
    id: 'liquid-glass',
    q: [
      'liquid glass redesigns',
      'the ios redesign studies',
      'linear spotify redesign',
      'what are the liquid glass studies',
    ],
    a: 'A series of **six Liquid Glass redesign studies**: Linear (14 pages), LinkedIn (14), Slack (13), Stripe (13), Airbnb (10) and Spotify (9) — each re-imagining a real product in Apple\'s Liquid Glass language with consistent navigation, clearer flows and focused workspaces.',
    links: [{ href: '/uiux', label: 'Browse the studies' }],
  },
  {
    id: 'design-process',
    q: [
      'what is his design process',
      'how does he design',
      'his ux process',
      'design methodology',
    ],
    a: 'Three published steps: **research first** (every decision starts with a real user problem), **design in systems** (components, not screens — consistency at scale), **ship it** (Figma files don\'t ship, code does).\n\nThe case studies walk the process honestly — including publishing what isn\'t answered yet, like Lethe\'s open questions about whether daily dimming soothes or anxieties.',
    links: [L.uiux],
  },

  // ---------- HR classics ----------
  {
    id: 'why-hire',
    q: [
      'why should we hire him',
      'why hire omkar',
      'what does he bring to a team',
      'why is he a good hire',
      'convince me to hire him',
    ],
    a: "Four reasons the evidence supports:\n\n1. **No handoff loss** — he designs and builds, so specs never get diluted in translation\n2. **Shipped breadth** — ERP, e-commerce, PWA, native Android, AI integrations: all live, all linked\n3. **Systems discipline** — design tokens, accessibility rules and honest case studies, not just screens\n4. **Client-proof** — PatelNetworks shipped to a real business; SSShopee runs a real store in real time",
    links: [L.resume, L.work],
  },
  {
    id: 'over-others',
    q: [
      'why him over other candidates',
      'what separates him from others',
      'compared to other designers',
      'why choose him',
    ],
    a: "Most candidates show screens; Omkar shows **running URLs**. The portfolio's own rule — every fact verified against a live deployment or public repo before it's allowed on the site — is the same standard he'd bring to your product.\n\nAnd as a designer who codes, one hire covers two functions without the usual coordination cost.",
    links: [L.work, L.uiux],
  },
  {
    id: 'weaknesses',
    q: [
      'what are his weaknesses',
      'his biggest weakness',
      'weaknesses as a candidate',
      'what should he improve',
    ],
    a: "The honest self-read his work implies: he defaults to **operating solo** — designing, building and shipping alone — which can under-use a team's review loops.\n\nHis working counter-habit is visible in the portfolio itself: ship publicly and early (beta releases, live demos, working prototypes), and write open questions into case studies instead of hiding them.",
    links: [L.uiux],
  },
  {
    id: 'salary',
    q: [
      'salary expectations',
      'what are his salary expectations',
      'compensation',
      'expected ctc',
      'how much does he cost',
      'notice period',
      'when can he join',
    ],
    a: "Compensation and joining logistics are **deliberately kept off this bot** — those are conversations Omkar wants to have with the actual human on the other side, in context.\n\nHe replies fast; email is the fastest channel.",
    links: [L.email],
  },
  {
    id: 'relocation',
    q: [
      'is he willing to relocate',
      'relocation',
      'would he move cities',
      'does he work onsite',
      'remote or office',
    ],
    a: 'What the site publishes: based in **Pune**, and the /uiux portfolio says **open to remote**. Anything beyond that — relocation, hybrid arrangements, on-site specifics — Omkar answers directly, because it depends on the role.',
    links: [L.email],
  },
  {
    id: 'interview-tip',
    q: [
      'what should i ask him in an interview',
      'good interview questions for him',
      'how to interview him',
      'what is he best at answering',
    ],
    a: "Ask about **decisions he owns end to end**: why Relay's checkpoint requires an explicit yes, why Sutra's validation waits for blur, how the SSShopee udhar ledger models real credit, or what a foreground service taught him about Android battery politics.\n\nHe's strongest on product-judgment questions — the where design meets constraints kind.",
    links: [L.uiux, L.work],
  },
  {
    id: 'contact-hire',
    q: [
      'how do i contact him',
      'how to reach omkar',
      'contact details',
      'how do we start a conversation',
      'i want to hire him',
      'email address',
    ],
    a: '**Email is the fastest way** — that is what the site itself recommends for starting a conversation. LinkedIn works too, and the resume is one click away.\n\nHe keeps contact details human-owned; this bot deliberately does not speak for his inbox.',
    links: [L.email, L.linkedin, L.resume],
  },

  // ---------- Fun ----------
  {
    id: 'fun-fact',
    q: [
      'fun fact',
      'something interesting about him',
      'tell me something cool',
      'surprise me',
    ],
    a: "He built a notes app about **forgetting** (Lethe) and this bot about **remembering** — same portfolio, opposite philosophies.\n\nAlso: Bandwidth Bandit watches every byte on an Android phone while HandOff refuses to touch the network at all. He ships both sides of an argument.",
    links: [{ href: '/uiux/lethe', label: 'Lethe — notes that forget' }],
  },
  {
    id: 'site-tech',
    q: [
      'what is this site built with',
      'how was this portfolio built',
      'what framework is this site',
      'was this site made with ai',
    ],
    a: "**Next.js 16 (App Router) + React 19 + TypeScript**, plain CSS with design tokens, hand-rolled motion — no UI kit, no animation library doing the work. It builds to fully static routes.\n\nAnd yes — the bot you're talking to is part of the build: pre-written answers, in-browser embedding matching, zero server. Omkar documented every constraint in the repo.",
    links: [L.github],
  },

  // ---------- Deep cuts: stories, decisions, war stories ----------
  // Interview batch (Oct 2026) — the depth the site pages don't show. Every
  // claim traces to a repo doc or live link; undocumented gaps stay honest
  // on purpose rather than being filled with a success story.
  {
    id: 'story-ssshopee-origin',
    q: [
      'why did he build ssshopee',
      'who uses ssshopee',
      'shop erp origin',
      'project for family shop',
    ],
    a: "SSShopee was built for a real user: Omkar's brother's retail shop. It's a paired system — an ERP for the counter and stock side, plus a separate customer storefront.\n\nThe ERP covers barcode/SKU POS, GST and receipts, inventory and expiry tracking, purchases, expenses, udhar, customer and supplier ledgers, and analytics. The storefront adds search, a cart, COD/UPI checkout and order tracking.",
    links: [
      { href: 'https://github.com/OmKardile/sss-erp-hybrid', label: 'Source repo' },
      { href: 'https://sss-ecomm.vercel.app/', label: 'Storefront' },
      { href: 'https://shubhamsupershopee-admin.vercel.app/', label: 'ERP admin' },
    ],
  },
  {
    id: 'decision-ssshopee-data-flow',
    q: [
      'how is ssshopee structured',
      'why separate shop databases',
      'how do orders sync',
      'sss erp architecture',
    ],
    a: "SSShopee started as a React/Vite app on browser localStorage and was rebuilt as a Next.js 16 full-stack app on Prisma and Supabase PostgreSQL. The ERP and the storefront run on separate databases.\n\nProducts sync from the ERP to the storefront through a token-protected API, and storefront orders sync back into the ERP as income entries. So keeping two systems consistent is a real engineering problem here, not an afterthought.",
    links: [
      { href: 'https://github.com/OmKardile/sss-erp-hybrid', label: 'Source repo' },
      { href: 'https://github.com/OmKardile/sss-erp-hybrid/blob/main/CHANGELOG.md', label: 'Change history' },
    ],
  },
  {
    id: 'challenge-ssshopee-product-sync',
    q: [
      'tell me a real bug he fixed',
      'sss shop image sync bug',
      'hard bug in ssshopee',
      'how did he debug sync',
    ],
    a: "A real SSShopee bug: when an ERP product had no photo, the sync overwrote the storefront's existing image with null, so every \"Sync Now\" wiped good images.\n\nThe fix keeps the storefront image whenever the ERP record has no replacement. Small bug, useful lesson: a missing value in one system shouldn't erase valid data owned by another.",
    links: [
      { href: 'https://github.com/OmKardile/sss-erp-hybrid/blob/main/CHANGELOG.md', label: 'Fix record' },
      { href: 'https://sss-ecomm.vercel.app/', label: 'Storefront' },
    ],
  },
  {
    id: 'story-patel-client-brief',
    q: [
      'how did he work with patel',
      'patel networks client story',
      'is patel networks a real project or a demo',
      'how did he win the client',
      'how long did the patel networks project take',
    ],
    a: "PatelNetworks was a real client engagement, not a practice build: a Surat-based surveillance and networking hardware business. The work came through a single introduction — no marketplace, no cold outreach — and ran from first call to handover in about two months.\n\nIn those two months Omkar shipped the full commerce scope: categorized catalog with exclusive CCTV kit bundles, Razorpay checkout with COD, GST invoicing with serial-tracked warranty, OTP customer accounts with order history and one-tap reorders, and WhatsApp ordering.\n\nAfter handover the client took over deployment — the storefront runs on his own server — so this one is a delivered product, not a hosted demo. The links below are the demo deployment and the owner-side admin dashboard.",
    links: [
      { href: 'https://patelnetworks-5ne3.onrender.com/', label: 'Open live demo' },
      { href: 'https://patelnetworks-5ne3.onrender.com/admin', label: 'Open admin dashboard' },
    ],
  },
  {
    id: 'decision-servepoint-qr-sessions',
    q: [
      'how is servepoint qr secured',
      'can customers change table qr',
      'servepoint qr security',
      'how does table verification work',
    ],
    a: "ServePoint treats a table QR code as a permission, not just a URL. Scanning the physical sticker makes the server issue a signed HMAC-SHA256 session that expires after 10 minutes. Orders must carry that session; expired, spoofed or settled-table sessions are rejected.\n\nThe reason: with static QR links, a bookmarked table URL could be reopened at home and place an accidental order in the kitchen. The trade-off is that a diner who takes more than 10 minutes to decide has to scan the table again.",
    links: [
      { href: 'https://github.com/OmKardile/servepoint/blob/main/docs/decisions/0005-ephemeral-table-qr-session-security.md', label: 'Decision record' },
      { href: 'https://servepoint-tsos.onrender.com/', label: 'Live app' },
    ],
  },
  {
    id: 'story-servepoint-operations',
    q: [
      'what does servepoint actually do',
      'how does servepoint help cafes',
      'servepoint kitchen workflow',
      'what is a cafe operating system',
    ],
    a: "ServePoint brings several cafe workflows into one operating system. Its staff workspace covers ordering and GST checkout, a live kitchen queue, bill collection, end-of-day close-out, reports, stock and recipes, guest loyalty, table/floor management, menu management, staff messages, notifications, and support. It also has a SuperAdmin console and guest-facing QR menu, ordering, and order-tracking surfaces.\n\nThe important design distinction is that it models the whole operating loop — from order to kitchen to payment and inventory — not only the customer's menu screen. The repository documents the intended workflows and security model; it does not publish quantified operating results from a deployed cafe.",
    links: [
      { href: 'https://servepoint-tsos.onrender.com/', label: 'Live app' },
      { href: 'https://github.com/OmKardile/servepoint', label: 'Source repo' },
    ],
  },
  {
    id: 'decision-servepoint-navigation',
    q: [
      'why does servepoint use one route',
      'servepoint routing architecture',
      'how are screens navigated',
    ],
    a: "ServePoint's staff workspace uses a single user-facing / route; its screens are app state rather than separate page routes. It still supports deep links into named screens, while public guest surfaces such as table QR, menu, and order tracking have dedicated paths.\n\nThe repository records this as an implementation constraint for the current app, not a claim that a single-route architecture is always superior. It keeps the staff shell consistent while allowing selected screens to be opened directly from bookmarks or staff shortcuts.",
    links: [
      { href: 'https://github.com/OmKardile/servepoint', label: 'Source repo' },
      { href: 'https://github.com/OmKardile/servepoint/blob/main/docs/TABLE_SIDE_ORDERING_AND_QR_CLIENT_SPEC.md', label: 'Guest flows' },
    ],
  },
  {
    id: 'challenge-servepoint-cross-browser-printing',
    q: [
      'tell me another engineering bug',
      'servepoint printing issue',
      'how did he handle browser differences',
      'cross browser print bug',
    ],
    a: "A ServePoint printing bug: receipts, end-of-day reports and QR sticker sheets printed through a hidden iframe that was removed after a blind 1.5-second timer. In Firefox, print() doesn't block, so the document could vanish mid-print and give blank or aborted jobs.\n\nThe fix is one shared print helper that cleans up on the browser's afterprint event, with a 60-second fallback and handling for a thrown print call. Lesson: lifecycle events beat arbitrary delays.",
    links: [{ href: 'https://github.com/OmKardile/servepoint/blob/main/src/lib/printFrame.ts', label: 'Fix code' }],
  },
  {
    id: 'decision-handoff-local-privacy',
    q: [
      'how does handoff protect privacy',
      'does handoff upload contacts',
      'why is handoff offline',
      'where is handoff data stored',
    ],
    a: "HandOff is local-first: no accounts, no servers, no analytics, no cloud backup. The web app stores cards in IndexedDB and the Android build uses device preferences, behind one storage adapter. Contact details leave the phone only when the user shares or exports them.\n\nThe promise is enforced, not just written: a **check:privacy** script in the repo statically audits the app code for network calls.",
    links: [{ href: 'https://github.com/OmKardile/handOff', label: 'Source repo' }],
  },
  {
    id: 'decision-handoff-capacitor-tradeoff',
    q: [
      'why capacitor instead of react native',
      'capacitor vs react native choice',
      'how is handoff built for android',
      'why not fully native',
    ],
    a: "HandOff is a Next.js web app wrapped with Capacitor for Android, so one codebase serves the web and the phone. Going fully native kept producing more bugs than it was worth, so Omkar reused the web stack and added native bits only where needed: storage, back button, file export, status bar and haptics.\n\nThe trade-off is web-first reuse instead of a fully native UI, so platform-specific behaviour still needs explicit work.",
    links: [{ href: 'https://github.com/OmKardile/handOff', label: 'Source repo' }],
  },
  {
    id: 'story-bandwidth-android-monitoring',
    q: [
      'how does bandwidth bandit work',
      'why did he use kotlin android',
      'how does it track app data',
      'bandwidth bandit technical details',
    ],
    a: "Bandwidth Bandit is an Android network monitor built in Kotlin. A foreground service keeps live download/upload speed visible in a persistent notification; NetworkStatsManager powers daily Wi-Fi/mobile history and per-app traffic breakdowns. It also includes usage-threshold alerts, signal strength in dBm, and a lightweight Cloudflare-based speed test.\n\nThe implementation has to work with Android's permission model: accurate usage history requires Usage Access, signal reporting can use phone-state permission, and Android 13+ requires notification permission for the visible monitor. That platform integration is a core part of the project, not just a chart on top of network data.",
    links: [{ href: 'https://github.com/OmKardile/bandwidth-bandit', label: 'Source repo' }],
  },
];
