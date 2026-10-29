# Omkar Kardile — Portfolio (`new/`)

Single Next.js 16 app hosting **three faces** of the same person, deployed as **one Vercel project**:

| Route | What it is | Accent |
|---|---|---|
| `/` | Developer portfolio (projects, skills, experience) | Blue |
| `/uiux` | UI/UX portfolio — editorial index (Taar / Ghar / Sutra, how I work, also shipped) | Per-project |
| `/uiux/taar` | Case study 01 — fashion e-commerce redesign | Taar navy `#1F2A44` |
| `/uiux/ghar` | Case study 02 — Pune tiffin app | Ghar terracotta `#A63D1F` |
| `/uiux/sutra` | Case study 03 — checkout + design system | Taar navy `#1F2A44` |
| `/uiux/relay/prototype` | Relay case study — live clickable React prototype (legacy stage) | Relay palette (pine/gold) |
| `/creative` | Slot for the creative version — navbar pill **hidden** while it's in dev | — |

Dark mode: toggle in the navbar, system preference by default, persisted in `localStorage`, no flash.

## Scripts (npm)

```bash
npm install        # install
npm run dev        # dev server (port 3000)
npm run build      # production build
npm start          # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

The project uses **npm** (`package-lock.json`). Vercel detects npm automatically — nothing to configure.

## Wiring the creative version — one Vercel project, two options

You have a separate creative portfolio build and want it reachable from the navbar here (and vice versa) **without a second Vercel project**. A `/creative` route is already reserved, and the **Creative** navbar pill is written and ready — but **hidden while the creative build is still in development**. To re-enable it, restore the pill block in `src/components/Header.tsx` (marked with a NOTE comment; its `.header-creative` styles are still in `globals.css`). Pick one option:

### Option A — port it into this app (recommended)

Best if the creative version is (or can be) a Next.js App Router project.

1. Copy its `app/` routes into `src/app/creative/` (its page/layout/components become `src/app/creative/page.tsx`, `src/app/creative/layout.tsx`, …).
   - Its own layout nests inside this app's root layout. Scope its fonts/CSS to `src/app/creative/`.
   - If it brings its own `globals.css`, import it from `src/app/creative/layout.tsx` — keep class names prefixed or in a layer so it can't clash with the base site.
2. Copy any assets it needs into `public/creative/…`.
3. Delete `src/app/creative/page.tsx` (this placeholder) when the real page lands.
4. In **its** navbar, add the vice-versa button:

```tsx
import Link from 'next/link';

<Link href="/" className="your-pill-class">Developer</Link>
```

5. `npm run build` — everything ships in one deployment at the repo's Vercel root.

Pros: shared theme toggle + analytics, native routing, one install, one build. This is the cleanest shape.

### Option B — static export dropped into `public/`

Best if the creative version is Vite/SPA or otherwise hard to port.

1. Export it statically (Vite: `npm run build` with `base: '/creative/'`; Next: `output: 'export'` with `basePath: '/creative'` and `trailingSlash: true`).
2. Copy the export into `public/creative/` so it contains `index.html` plus its hashed assets.
3. Serve the directory root cleanly with one rewrite in `next.config.ts`:

```ts
async rewrites() {
  return [
    { source: '/creative', destination: '/creative/index.html' },
    { source: '/creative/:path*', destination: '/creative/:path*' },
  ];
}
```

4. Add the vice-versa button in its own navbar: a plain `<a href="/">Developer</a>`.

Pros: zero porting. Cons: two build pipelines, its JS/SEO is whatever the export gives you.

### Either way

- The **Creative** pill in this app's header (`src/components/Header.tsx` — hidden until the creative build ships, see note above) and the **Developer** button in the creative build's header are the two-way pair. Keep the labels symmetrical so users always know where they are.
- Don't give the creative version its own Vercel project or subdomain unless you later want isolated analytics/deploys — the whole point of this setup is one project.

## Vercel deployment

1. Repo layout: root → `old/` (previous site) + `new/` (this project).
2. Vercel project → Settings → General → **Root Directory: `new`**.
3. Framework preset: Next.js (auto). Install command / build command: defaults (`npm install`, `npm run build`). No env vars needed.
4. Domain: `omkardile.is-a.dev` stays pointed at this project.

### Known external links

- The 6 interactive Liquid Glass apps are hosted by the **old** deployment. All their links derive from one constant — `liquidGlassAppBase` in `src/data/site.ts`. When the old apps move (different domain, or ported into `old/` under another deployment), update that single line.
- Case-study PDFs are local: `public/case-studies/*.pdf`, linked as `/case-studies/<app>-case-study.pdf`.

## Content

All text, projects, skills, experience and socials live in **`src/data/site.ts`** (split into the dev `projects`/`capabilities`/`experience`, the design-side `uiux` export, and the full `relay` case study #1). Edit there, not in the pages.

The UI/UX case studies (Taar, Ghar, Sutra) live separately in **`src/data/uiuxProjects.ts`** — see the next section.

### Development project cards (as of 2026-10-28)

| # | Project | Status | Links on card |
|---|---|---|---|
| 01 | SSShopee — Retail ERP + Storefront | Live (one project, two apps) | Management app · Customer storefront · GitHub (ERP) |
| 02 | ServePoint — Café Operations Platform | Live | Live app · GitHub |
| 03 | PatelNetworks — Client E-commerce Platform | Live (client project) | Live site |
| 04 | tech // site — Technology Web Platform | Live | Site · GitHub |
| 05 | HandOff | Live product · public beta v1 · maintained | GitHub · Release beta.v1 |
| 06 | Bandwidth Bandit | Live (Android) | GitHub |
| 07 | Aether Weather App | Live | App · GitHub |
| 08 | AI Recipe Generator | Live (Google Gemini) | App · GitHub |
| 09 | Online Car Service Station | Academic — PG-DMC major project | Admin panel |
| 10 | Full-Stack Food Ordering App | In development | — |
| 11 | Real-Time Chat App | In development | — |

Content rules enforced in `src/data/site.ts`: every status, stack and link is verified against the live deployment or the project's public repository before publishing. GoldDrip was removed from the portfolio (owner request); the old SSShopee Render URL (`shubhamsupershopee.onrender.com`) is retired everywhere in favor of the Vercel admin URL. Project facts and the reasoning behind each entry are documented in `decisions.md` and `technical-documentation.md`; maintainer workflows live in `help.md`.

A project card carries one or more labeled links via the `links` array (single-link cards keep the whole-card hit target; multi-link cards render one anchor per destination, e.g. SSShopee's two applications).

Relay case study assets: `public/work/relay/` (cover, diagrams, screens) — sourced from the owner's original upload (integrated into the site; the upload was removed from the repo afterwards). The live prototype is the owner's `relay-prototype.jsx` vendored as `src/components/RelayPrototype.jsx` (only change: `"use client"` directive).

## UI/UX case studies (`src/data/uiuxProjects.ts`)

`/uiux` is a data-driven editorial portfolio: one index page plus three case-study pages sharing a single template (`src/components/uiux/CaseStudyLayout.tsx`). Copy rule: **every sentence is ported verbatim from the project's own sources** — the coded apps' README/CHANGELOG (upload zips) and the approved case-study copy in `src/data/site.ts`. No invented numbers, no quoted metrics, no research results that don't exist yet.

### Add a project

1. Append an entry to `uiuxProjects` in `src/data/uiuxProjects.ts`: `slug`, `number`, `title`, `tagline`, `status` (`In progress` / `Complete`), `accent` + `accentDark` (AA-lightened for dark mode), `problem` (two lines for the index row), `role[]`, `tools[]`, the three URL fields, `tryIt`, and `sections` — nine of them, in order: The problem · Research · Who it's for · Flow · Wireframes · Design decisions · Visual system · Usability test · Build & next.
2. Create `src/app/uiux/<slug>/page.tsx` — copy one of the existing three; it only resolves the entry + per-route metadata (title, description, canonical, OG with a placeholder image path) and the prev/next neighbours.
3. Add the route to `src/app/sitemap.ts`.

Section content is a list of typed blocks the renderer already understands: `paragraph`, `list` (ordered/unordered), `hypotheses`, `table`, `personas`, `flow`, `wireframes` (inline SVG art — add a drawing to `WireframeArt.tsx`), `decisions` (title / rationale / trade-off), `swatches`, `typeSpecimen`, `rules`, `slot`.

### Wire the prototype / Figma / repo URLs

Deploy each app separately (Vite → Vercel, no config), then fill the placeholders at the top of its entry in `src/data/uiuxProjects.ts`:

```ts
prototypeUrl: '',  // Vercel URL of the deployed app — empty = the "Try it" section is hidden
figmaUrl: '',      // Figma share link — empty = the "Design file" section is hidden
repoUrl: '',       // GitHub — empty = the button is hidden
```

Empty means hidden — the site never renders "link pending". The "Try it" embed is a 390×844 `DeviceFrame` (aspect-ratio reserved, no layout shift, `sandbox`ed iframe that mounts only near the viewport on viewports ≥768px; phones get a poster + "Open prototype" button).

### Unfinished evidence

Sections whose evidence isn't collected yet stay honest: a `{ type: 'slot' }` block renders a dashed placeholder in development and disappears from the production build; a table with `filled: false` renders the dashed skeleton in development and one quiet "Research in progress" line in production. Keep the `In progress` status tag until the owner flips it.

## Design system notes (Apple UX web kit)

Applied from the owner's Apple UX Design System reference document — **the discipline, not the skin**:

- **Press feedback on touch-down**: `.btn`, nav pills and the theme toggle scale to `0.97` on `:active` (100ms ease-out), disabled under `prefers-reduced-motion`.
- **Motion tokens**: `--press-scale`, `--dur-micro` in `:root`.
- **Reduce Transparency**: the sticky header (the site's only glass element) drops its blur and goes opaque.
- **Increase Contrast**: separators and the header edge strengthen.
- **Hit targets**: 44px minimum on all pills, toggle and buttons.
- **Smooth scroll**: native `scroll-behavior: smooth` + `scroll-padding-top` so anchors land clear of the sticky header; fully disabled under `prefers-reduced-motion`. No scroll-hijack libraries.
- **Semantic colors + dark mode**: everything runs on CSS custom properties (`--bg/--fg/--muted/--line/--soft/--accent`), with `color-scheme` set per theme.
- **Dual accents**: `/` wears dev blue (`--accent-dev`, light `#2563eb` / dark `#60a5fa`). Site chrome keeps the classic orange for the /uiux switch pill, but the /uiux portfolio pages themselves run the editorial paper theme (`html.uiux` scope: paper `#F6F3EE` / ink `#1B1D22` / mute `#6B685F` / line `#DDD7CC`, dark `#141518` / `#ECE8DF` / `#A09C92` / `#2B2D33`) with **per-project accents** — pages set `--pa-light`/`--pa-dark` inline and `uiux.css` resolves them to `--pa` (Taar/Sutra navy, Ghar terracotta). Both portfolios share the same accent *patterns*, so recoloring a whole portfolio stays a one-line change. Status dots stay green on purpose — they mean live, not brand.
- Deliberately skipped: glass skins, spring gesture libraries, squircles — this site stays flat and fast on purpose.

## Structure

```
src/
  app/
    page.tsx                    # developer portfolio
    uiux/uiux.css               # editorial design system (scoped to .ux-shell)
    uiux/page.tsx               # UI/UX portfolio index (hero, work rows, principles, also shipped)
    uiux/taar|ghar|sutra/page.tsx  # case studies 01–03 (data-driven template)
    uiux/relay|taar|sutra/prototype/  # legacy live prototype stages (site chrome)
    creative/page.tsx           # placeholder slot for the creative version
    layout.tsx                  # root: metadata, JSON-LD, no-flash theme script, analytics
    sitemap.ts, robots.ts, not-found.tsx, icon.svg
  components/
    uiux/                       # UiuxShell (fonts + chrome), Nav, Footer, ProjectRow,
                                # CaseStudyLayout, blocks.tsx, DeviceFrame, WireframeArt
    Header (client, pathname-aware — hides on the four /uiux chrome routes),
    Footer, ThemeToggle, SmoothScroll, ScrollReveal, MotionCraft, RelayPrototype
  data/
    site.ts                     # dev portfolio + legacy uiux content
    uiuxProjects.ts             # Taar / Ghar / Sutra case-study data (typed block model)
public/
  work/relay/                   # Relay case study: cover, diagrams/, screens/
  case-studies/                 # 6 Liquid Glass case study PDFs
  og.png                        # + og/uiux-*.png placeholders for the case studies
```
