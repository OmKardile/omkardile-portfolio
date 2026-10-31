// UI/UX portfolio — case-study data, one entry per project (see
// src/components/uiux/CaseStudyLayout.tsx for the renderer contract).
//
// COPY RULES (see README → "UI/UX case studies"):
//   - Every sentence is ported verbatim from the project's own sources: the
//     working apps' README/CHANGELOG (upload/*.zip) and the approved
//     case-study copy already in src/data/site.ts. No invented numbers, no
//     quoted metrics, no research results that don't exist yet.
//   - Evidence that isn't collected yet (interviews, usability rounds,
//     personas) is modelled honestly:
//       { type: 'slot' }                → dashed placeholder in development,
//                                         hidden in production.
//       { type: 'table', filled:false } → dashed placeholder in development,
//                                         one quiet "Research in progress"
//                                         line in production.
//   - prototypeUrl / figmaUrl / repoUrl stay empty until each app is
//     deployed; empty = the section is not rendered at all (never
//     "link pending").

export type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'hypotheses'; items: { bet: string; because: string }[] }
  | { type: 'table'; head: string[]; rows: string[][]; filled?: boolean; caption?: string }
  | { type: 'personas'; items: { name: string; meta: string; facts: string[]; quote?: string }[] }
  | { type: 'flow'; steps: string[] }
  | { type: 'wireframes'; items: { art: WireframeArt; label: string; alt: string }[] }
  | { type: 'decisions'; items: { title: string; rationale: string; tradeoff?: string }[] }
  | { type: 'swatches'; items: { name: string; hex: string; use: string }[] }
  | { type: 'typeSpecimen'; intro: string; rows: { role: string; face: string; sample: string }[] }
  | { type: 'rules'; items: { title: string; text: string }[] }
  | { type: 'slot'; label: string };

export type WireframeArt =
  | 'taar-grid'
  | 'taar-filter'
  | 'taar-quickadd'
  | 'ghar-list'
  | 'ghar-week'
  | 'ghar-today'
  | 'sutra-steps'
  | 'sutra-fees'
  | 'sutra-system';

export type UiuxSection = { n: string; title: string; blocks: Block[] };

export type UiuxProject = {
  slug: 'taar' | 'ghar' | 'sutra';
  number: string;
  title: string;
  tagline: string;
  status: 'In progress' | 'Complete';
  /** Per-project accent — light theme. Dark theme uses accentDark (AA on #141518). */
  accent: string;
  accentDark: string;
  /** The problem, stated in two lines, for the index row. */
  problem: string;
  role: string[];
  tools: string[];
  /** Vercel URL of the deployed app — empty = the "Try it" section is hidden. */
  prototypeUrl: string;
  /** Figma share link — empty = the "Design file" section is hidden. */
  figmaUrl: string;
  /** GitHub repository — empty = the button is hidden. */
  repoUrl: string;
  /** What to try, two lines, shown beside the embedded prototype. */
  tryIt: { lead: string; more: string };
  sections: UiuxSection[];
};

/* Shared neutrals — the Sutra design system unified them across both apps
   ("they had drifted by a shade or two between the two products and are now
   shared on purpose"). Only the accent is themed per project. */
const NEUTRAL_SWATCHES = [
  { name: 'Paper', hex: '#F6F3EE', use: 'Surface' },
  { name: 'Ink', hex: '#1B1D22', use: 'Text' },
  { name: 'Mute', hex: '#6B685F', use: 'Secondary text' },
  { name: 'Line', hex: '#DDD7CC', use: 'Dividers' },
];

const TYPE_SPECIMEN: { intro: string; rows: { role: string; face: string; sample: string }[] } = {
  intro: 'One serif for display, one grotesk for everything you touch — two families, no more.',
  rows: [
    { role: 'Display', face: 'Fraunces · light 300, italic for emphasis', sample: 'Fewer taps to narrow a catalogue' },
    { role: 'Interface', face: 'Hanken Grotesk · 400–600', sample: 'Size · Colour · Price — Show 4 pieces' },
  ],
};

/* Unfinished evidence: an empty usability table. Development renders it as a
   dashed placeholder; production collapses it to one quiet line (see
   CaseStudyLayout). The table shape is what the first real test round fills. */
const USABILITY_TABLE = {
  type: 'table' as const,
  head: ['Task', 'What people did', 'What changed'],
  rows: [
    ['—', '—', '—'],
    ['—', '—', '—'],
    ['—', '—', '—'],
  ],
  filled: false,
  caption: 'Five participants, moderated, think-aloud — filled after the first round.',
};

export const uiuxProjects: UiuxProject[] = [
  // ---------------------------------------------------------------- 01 Taar
  {
    slug: 'taar',
    number: '01',
    title: 'Taar',
    tagline: 'Fashion e-commerce discovery — fewer taps to narrow the catalogue',
    status: 'In progress',
    accent: '#1F2A44',
    accentDark: '#A8B7D4',
    problem:
      'Fashion discovery usually makes the shopper do the work — filters buried screens deep, results that don’t move until you commit. Taar flips that: narrowing happens in one place, the count updates live, and availability is honest before you commit to anything.',
    role: ['UX research', 'UI design', 'Front-end'],
    tools: ['React', 'Vite', 'lucide-react'],
    prototypeUrl: '',
    figmaUrl: '',
    repoUrl: '',
    tryIt: {
      lead: 'Open Filter, add a size.',
      more: 'Watch active filters stack up as removable chips under the bar.',
    },
    sections: [
      {
        n: '01',
        title: 'The problem',
        blocks: [
          {
            type: 'paragraph',
            text: 'Fashion discovery usually makes the shopper do the work — filters buried screens deep, results that don’t move until you commit, sold-out sizes that only reveal themselves after you’ve picked one. Taar flips that: narrowing happens in one place, the count updates live, and availability is honest before you commit to anything.',
          },
          {
            type: 'paragraph',
            text: 'Taar is a mobile-first product discovery UI for a fictional fashion label — one Autumn Edit of ten pieces. It isn’t a deck or a set of static mockups; it’s a working React build, so every decision in it has to survive contact with real state: filters that actually filter, sizes that actually sell out, a grid that can actually end up empty.',
          },
        ],
      },
      {
        n: '02',
        title: 'Research',
        blocks: [
          {
            type: 'hypotheses',
            items: [
              {
                bet: 'Narrowing happens in one place, and the count updates live behind the sheet.',
                because: 'Results that don’t move until you commit make the shopper do the work.',
              },
              {
                bet: 'Availability shown up front answers the question once, before commitment.',
                because: 'Sold-out sizes that only reveal themselves after you’ve picked one reopen it on every product.',
              },
              {
                bet: 'Quick add from the grid shortens the path to the bag.',
                because: 'A product-page detour for every add is the longest possible loop.',
              },
            ],
          },
          {
            type: 'slot',
            label: 'Add after research — interviews, a competitive scan, and the measured baseline. No tap-count or conversion claims until the original app is measured.',
          },
        ],
      },
      {
        n: '03',
        title: 'Who it’s for',
        blocks: [{ type: 'slot', label: 'Add after research — personas land here once the interviews are done.' }],
      },
      {
        n: '04',
        title: 'Flow',
        blocks: [
          {
            type: 'flow',
            steps: [
              'Browse the Autumn Edit — ten pieces under category tabs.',
              'Open Filter — one bottom sheet: size, colour, price.',
              'Results update live behind the sheet; the CTA carries the count — “Show 4 pieces.”',
              'Active filters stay visible as removable chips under the bar.',
              'Quick add from the grid — colour, size, done, no page change.',
              'The bag counter confirms the add without ever leaving the flow.',
            ],
          },
          {
            type: 'paragraph',
            text: 'Filtering is one bottom sheet — size, colour, price — not a stack of pages. Closing the sheet never costs a surprise.',
          },
        ],
      },
      {
        n: '05',
        title: 'Wireframes',
        blocks: [
          {
            type: 'wireframes',
            items: [
              { art: 'taar-grid', label: 'Catalogue', alt: 'Wireframe of the Taar catalogue: category tabs over a two-up product grid, a quick-add button on each card' },
              { art: 'taar-filter', label: 'Filter sheet', alt: 'Wireframe of the Taar filter: a bottom sheet over a dimmed grid with size, colour and price controls and a live count on the CTA' },
              { art: 'taar-quickadd', label: 'Quick add', alt: 'Wireframe of the Taar quick-add sheet: colour dots, a size row with sold-out sizes struck through, and an add button' },
            ],
          },
        ],
      },
      {
        n: '06',
        title: 'Design decisions',
        blocks: [
          {
            type: 'decisions',
            items: [
              {
                title: 'One sheet, live count on the CTA',
                rationale:
                  'Results update live behind the sheet, and the CTA carries the count: “Show 4 pieces.” Closing the sheet never costs a surprise — no “apply and pray.”',
              },
              {
                title: 'Filters stay visible as chips',
                rationale:
                  'Active filters don’t disappear back into the sheet — they stay visible as removable chips under the bar, so the grid’s state is always readable at a glance.',
              },
              {
                title: 'Sold-out sizes are shown and struck through, not hidden',
                rationale:
                  'Hiding them reopens the question on every product; showing them answers it once — and explains why a piece can’t be added in your size before you try.',
              },
              {
                title: 'Quick add from the grid',
                rationale:
                  'Tap plus, pick a colour and a size in the sheet, done — no product-page detour. Sold-out sizes are disabled right there, and the bag counter confirms the add without ever leaving the flow.',
              },
            ],
          },
          {
            type: 'paragraph',
            text: 'The prototype respects the boring rules — the ones that decide whether a design actually ships:',
          },
          {
            type: 'list',
            items: [
              '44px minimum touch targets everywhere, including the quick-add button on each card.',
              'The sheet is a real dialog: Esc closes it, the scrim closes it, background is inert and page scroll is locked.',
              'Pressed states are announced via aria-pressed; sold-out sizes read as “M, sold out”.',
              'prefers-reduced-motion turns off the entrance and sheet animation.',
            ],
          },
        ],
      },
      {
        n: '07',
        title: 'Visual system',
        blocks: [
          {
            type: 'paragraph',
            text: 'Editorial, not app-template: Fraunces for display type, Hanken Grotesk for UI, a warm-paper palette with a single navy accent. Product images sit in tonal slots, and the grid reveals with a quiet staggered entrance.',
          },
          {
            type: 'swatches',
            items: [...NEUTRAL_SWATCHES, { name: 'Taar navy', hex: '#1F2A44', use: 'Accent' }],
          },
          TYPE_SPECIMEN,
          {
            type: 'paragraph',
            text: 'The tonal slots are deliberate — the layout is designed around art-directed photography that hasn’t been shot yet, so the prototype doesn’t fake it with stock images.',
          },
        ],
      },
      {
        n: '08',
        title: 'Usability test',
        blocks: [USABILITY_TABLE],
      },
      {
        n: '09',
        title: 'Build & next',
        blocks: [
          {
            type: 'paragraph',
            text: 'The React build is the study’s evidence — filters that actually filter, sizes that actually sell out, a grid that can actually end up empty. It deploys separately and embeds on this page once its URL is set.',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Figma file backing these screens: research, flows, wireframes and hi-fi.',
              'Product detail and bag screens to complete the purchase loop.',
              'Real photography to replace the tonal slots.',
              'No metrics yet — the original app hasn’t been measured, so no tap-count or conversion claims until it is.',
            ],
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- 02 Ghar
  {
    slug: 'ghar',
    number: '02',
    title: 'Ghar',
    tagline: 'Home-cooked tiffin around Pimpri-Chinchwad — a three-step order flow and skip-a-day in one tap',
    status: 'In progress',
    accent: '#A63D1F',
    accentDark: '#D98B66',
    problem:
      'Tiffin services around Pimpri-Chinchwad have no digital discovery layer — kitchens live in word of mouth and paper calendars. Ghar designs the full experience: find a kitchen, subscribe to a week, skip a day in one tap.',
    role: ['UX research', 'UI design', 'Front-end'],
    tools: ['React', 'Vite', 'lucide-react'],
    prototypeUrl: '',
    figmaUrl: '',
    repoUrl: '',
    tryIt: {
      lead: 'Pick a kitchen, build a week, skip tomorrow.',
      more: 'The plan builder shows the weekly price live as you change meals and days.',
    },
    sections: [
      {
        n: '01',
        title: 'The problem',
        blocks: [
          {
            type: 'paragraph',
            text: 'Tiffin services around Pimpri-Chinchwad have no digital discovery layer. Finding, subscribing to and tracking home-cooked tiffins still runs on word of mouth and paper calendars.',
          },
          {
            type: 'paragraph',
            text: 'Ghar is a mobile-first app for that loop. The case-study focus: a three-step order flow and skip-a-day in one tap.',
          },
        ],
      },
      {
        n: '02',
        title: 'Research',
        blocks: [
          {
            type: 'paragraph',
            text: 'Every assumption in the app — the three-step flow, the skip mechanic, the cutoff logic — needs validation with real customers and kitchens before anything is quoted in this study.',
          },
          {
            type: 'slot',
            label: 'Add after research — kitchen visits and customer interviews land here.',
          },
        ],
      },
      {
        n: '03',
        title: 'Who it’s for',
        blocks: [{ type: 'slot', label: 'Add after research — personas land here once the interviews are done.' }],
      },
      {
        n: '04',
        title: 'Flow',
        blocks: [
          {
            type: 'flow',
            steps: [
              'Home — area and diet filters over the kitchen list.',
              'Pick a kitchen — menu, price and cutoff time scan in one glance.',
              'Step 1 of 3 · Provider — the menu and the cutoff.',
              'Step 2 · Order — build your week; the weekly price updates live.',
              'Step 3 · Confirm — UPI, mocked end to end.',
              'Today — the delivery tracker, and skip tomorrow in one tap with the credit stated up front.',
            ],
          },
        ],
      },
      {
        n: '05',
        title: 'Wireframes',
        blocks: [
          {
            type: 'wireframes',
            items: [
              { art: 'ghar-list', label: 'Kitchen list', alt: 'Wireframe of the Ghar home screen: area and diet filters over a list of kitchen rows showing menu, price and cutoff time' },
              { art: 'ghar-week', label: 'Plan builder', alt: 'Wireframe of the Ghar order step: a seven-day week builder with meal choices and a live weekly price' },
              { art: 'ghar-today', label: 'Today', alt: 'Wireframe of the Ghar today screen: a delivery tracker card with a skip-tomorrow action and the credit stated up front' },
            ],
          },
        ],
      },
      {
        n: '06',
        title: 'Design decisions',
        blocks: [
          {
            type: 'decisions',
            items: [
              {
                title: 'Kitchens are a list, not cards',
                rationale: 'Menu, price and cutoff time scan in one glance.',
              },
              {
                title: 'Diet is a first-level filter',
                rationale: 'Veg, Jain, non-veg and high protein sit at the top level — not buried.',
              },
              {
                title: 'Cutoff time is shown on every row',
                rationale: 'It decides whether you can order today.',
              },
              {
                title: 'The weekly price updates live',
                rationale: 'The plan builder shows the weekly price as you change meals and days.',
              },
              {
                title: 'Skip tomorrow is a first-class action',
                rationale: 'It lives on Today, with the credit stated up front.',
              },
              {
                title: 'Boring accessibility rules, in the build',
                rationale: 'Everything uses 44px targets, visible focus, reduced-motion support.',
              },
            ],
          },
        ],
      },
      {
        n: '07',
        title: 'Visual system',
        blocks: [
          {
            type: 'paragraph',
            text: 'The neutrals are shared with the other products on purpose — they had drifted by a shade or two between the two apps and are now unified. Only the accent is themed: Ghar terracotta.',
          },
          {
            type: 'swatches',
            items: [...NEUTRAL_SWATCHES, { name: 'Ghar terracotta', hex: '#A63D1F', use: 'Accent' }],
          },
          TYPE_SPECIMEN,
        ],
      },
      {
        n: '08',
        title: 'Usability test',
        blocks: [USABILITY_TABLE],
      },
      {
        n: '09',
        title: 'Build & next',
        blocks: [
          {
            type: 'paragraph',
            text: 'Honest limits, stated up front: the data is mock; payment and delivery status are simulated. Skipping needs a provider-side view to be real — that’s the next design problem.',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Figma file matching these screens.',
              'Framer prototype of the three-step flow and skip.',
              'Provider-side dashboard concept.',
              'Deploy separately; the embed lands here when the URL is set.',
            ],
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------- 03 Sutra
  {
    slug: 'sutra',
    number: '03',
    title: 'Sutra',
    tagline: 'A forgiving mobile checkout, on a design system two stores share',
    status: 'In progress',
    accent: '#1F2A44',
    accentDark: '#A8B7D4',
    problem:
      'A checkout is the one screen where friction converts directly into abandonment — and the usual failure modes are all self-inflicted: surprise fees shown after commitment, errors yelled mid-keystroke, a dead end for every mistake. Sutra’s bet: if every step is forgiving, reversible and priced up front, the flow survives contact with real people.',
    role: ['UX design', 'Design system', 'Front-end'],
    tools: ['React', 'Vite', 'lucide-react'],
    prototypeUrl: '',
    figmaUrl: '',
    repoUrl: '',
    tryIt: {
      lead: 'Fill the form with a mistake, then open the System tab and switch the accent.',
      more: 'Enter PIN 411001 — city and state fill in, and stay editable.',
    },
    sections: [
      {
        n: '01',
        title: 'The problem',
        blocks: [
          {
            type: 'paragraph',
            text: 'A checkout is the one screen where friction converts directly into abandonment — and the usual failure modes are all self-inflicted: surprise fees shown after commitment, errors yelled mid-keystroke, a dead end for every mistake. Sutra’s bet: if every step is forgiving, reversible and priced up front, the flow survives contact with real people.',
          },
          {
            type: 'paragraph',
            text: 'Sutra is a three-step mobile checkout — contact, delivery, payment — built for the Taar store, on top of a small design system extracted from two real products (Taar and Ghar). It is also a design-system study: the components on the checkout screen come from a token-driven library documented in a living System page, so the checkout and the system ship and age together.',
          },
        ],
      },
      {
        n: '02',
        title: 'Research',
        blocks: [
          {
            type: 'slot',
            label: 'Add after research — checkout drop-off notes and a competitive scan land here.',
          },
        ],
      },
      {
        n: '03',
        title: 'Who it’s for',
        blocks: [{ type: 'slot', label: 'Add after research — personas land here once the interviews are done.' }],
      },
      {
        n: '04',
        title: 'Flow',
        blocks: [
          {
            type: 'flow',
            steps: [
              'One page, three steps — contact, delivery, payment.',
              'Completed steps collapse into a summary with an Edit button.',
              'The PIN code fills city and state; the fields stay editable.',
              'Fees sit on the choice that causes them — delivery on the option, the COD fee on its option.',
              'UPI first, validated inline; card is visibly disabled and dated until v0.2.',
              'The live total is one tap away in the order summary at every step.',
            ],
          },
          {
            type: 'paragraph',
            text: 'Every form rule in the flow is built to be undone, not punished.',
          },
        ],
      },
      {
        n: '05',
        title: 'Wireframes',
        blocks: [
          {
            type: 'wireframes',
            items: [
              { art: 'sutra-steps', label: 'Three steps', alt: 'Wireframe of the Sutra checkout: three steps with completed ones collapsed into summaries with Edit buttons' },
              { art: 'sutra-fees', label: 'Fees on the choice', alt: 'Wireframe of the Sutra delivery and payment choices, each showing its fee, with a live total row' },
              { art: 'sutra-system', label: 'System page', alt: 'Wireframe of the Sutra System page: token rows and component states documented live' },
            ],
          },
        ],
      },
      {
        n: '06',
        title: 'Design decisions',
        blocks: [
          {
            type: 'decisions',
            items: [
              {
                title: 'Validation on blur, not on every keystroke',
                rationale: 'You’re never corrected mid-word.',
              },
              {
                title: 'Errors say what to fix',
                rationale: '“A UPI ID looks like name@bank” — not what went wrong.',
              },
              {
                title: 'A count on Continue, not a wall of red',
                rationale: 'Press Continue with problems and you get a count, not a wall of red.',
              },
              {
                title: 'Completed steps collapse into a summary with Edit',
                rationale: 'Going back never loses what you entered.',
              },
              {
                title: 'The PIN lookup assists, never overrides',
                rationale: 'City and state fill in, and the fields stay editable — autofill assists, it never overrides.',
              },
              {
                title: 'Fees before commitment',
                rationale:
                  'The delivery fee sits on the delivery option, the cash-on-delivery fee sits on the COD option, and the live total is one tap away in the order summary at every step. UPI is the default path with the ID validated inline — card is visibly disabled and dated, rather than hidden.',
                tradeoff: 'Card stays disabled until v0.2 — an honest gap on the screen instead of a hidden one.',
              },
            ],
          },
        ],
      },
      {
        n: '07',
        title: 'The design system',
        blocks: [
          {
            type: 'paragraph',
            text: 'The design system underneath has four rules, and the prototype enforces all of them:',
          },
          {
            type: 'rules',
            items: [
              {
                title: 'Tokens first',
                text: 'No raw hex or px in product code, only var(--…) references.',
              },
              {
                title: 'Only --accent is themed',
                text: 'One attribute swap re-skins the whole app from Taar navy to Ghar terracotta, because the neutrals had drifted by a shade or two between the two products and are now shared on purpose.',
              },
              {
                title: 'Components are small and boring',
                text: 'Each does one job and exposes every state — default, focus, error, disabled.',
              },
              {
                title: 'A living System page',
                text: 'It documents the tokens and every component state, with a changelog discipline for additions.',
              },
            ],
          },
          {
            type: 'swatches',
            items: [
              ...NEUTRAL_SWATCHES,
              { name: 'Taar navy', hex: '#1F2A44', use: '--accent · product A' },
              { name: 'Ghar terracotta', hex: '#A63D1F', use: '--accent · product B' },
              { name: 'Danger', hex: '#B42318', use: 'Errors' },
            ],
          },
          {
            type: 'paragraph',
            text: 'Accessibility lives in the component, not the screen — which is what makes it hold up under reuse: every field carries a real label, aria-invalid on error and aria-describedby to its message; errors are announced with role="alert"; 44px minimum tap targets everywhere, including the radio choices and the chips; visible focus rings on inputs, choices and buttons.',
          },
        ],
      },
      {
        n: '08',
        title: 'Usability test',
        blocks: [USABILITY_TABLE],
      },
      {
        n: '09',
        title: 'Build & next',
        blocks: [
          {
            type: 'paragraph',
            text: 'Honest limits, stated up front: the PIN table is a mock — five cities, not a postal API. No real payment; the card option is disabled until v0.2. Not yet tested with real users, so no completion or abandonment numbers are claimed.',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'A Figma library with variables for the tokens and components with variants.',
              'The card form — number, expiry, CVV — as the third payment method.',
              'A usability round with five people, focused on the error-recovery paths.',
              'Deploy separately; the embed lands here when the URL is set.',
            ],
          },
        ],
      },
    ],
  },
];

/* Index-page helpers ------------------------------------------------------ */

/* How I work — the three principles, from the case studies. */
export const uiuxPrinciples = [
  { n: '01', title: 'Research first', text: 'Every decision starts with a real user problem.' },
  { n: '02', title: 'Design in systems', text: 'Components, not screens. Consistency at scale.' },
  { n: '03', title: 'Ship it', text: 'Figma files don’t ship. Code does.' },
];

/* Also shipped — designs that made it to code, live URLs from the repo.
   `hint` feeds the /uiux cursor's hover guide (data-hint), not shown as copy. */
export const alsoShipped = [
  { title: 'PatelNetworks — Admin Panel', stack: 'E-commerce platform · Razorpay · GST invoicing', href: 'https://patelnetworks-5ne3.onrender.com/admin', hint: 'Admin dashboard · new tab' },
  { title: 'AI Recipe Generator', stack: 'Next.js · Google Gemini', href: 'https://recipe-generator-omkardile.vercel.app/', hint: 'Live app · new tab' },
];
