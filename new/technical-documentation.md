# Technical Documentation — Portfolio Site

How this site is built, where content lives, and how project facts are verified. Written for maintainers; reflects the codebase as of 2026-10-28.

## Stack (this website)

- **Next.js 16** (App Router) + **React 19** + **TypeScript**, run with **npm** (`package-lock.json`; no bun lockfile).
- Styling is plain CSS custom properties in `src/app/globals.css` (Tailwind is installed for the vendored `components/ui` kit but the portfolio surfaces don't depend on it).
- Fonts: Archivo (display/body) + Fragment Mono (mono labels), self-hosted via `src/app/fonts.ts`.
- Dark mode: no-flash inline script in `src/app/layout.tsx`, `localStorage` persistence, system preference default, `.dark` class on `<html>`; the ThemeToggle component uses no React state.
- Analytics: `@vercel/analytics`. No other runtime dependencies on the two portfolio routes.

## Routes

| Route | Purpose |
|---|---|
| `/` | Developer portfolio (single page: hero → work → skills → experience → contact), wrapped in `.page-dev` which flips `--accent` to the dev blue token |
| `/uiux` | UI/UX portfolio (Relay case study #1, Liquid Glass studies, PDFs, "Also shipped" links) |
| `/uiux/relay/prototype` | Live clickable React prototype for the Relay case study |
| `/creative` | `noindex` placeholder; reserved slot for the future creative version (navbar pill hidden until it ships — see README) |

SEO: root metadata + JSON-LD Person schema in `layout.tsx`, `sitemap.ts` and `robots.ts` derive from `site.url`. Page metadata doesn't hardcode project facts, so content edits in the data file can't drift from the metadata.

## Content architecture — single source of truth

**All** portfolio content lives in `src/data/site.ts`. Pages are pure renderers.

### `Project` type

```ts
export type Project = {
  slug: string;
  index: string;          // display order "01"…"11"
  title: string;
  kind: string;           // category shown on the card, e.g. "Client project · E-commerce"
  year: string;
  status: 'live' | 'building';   // green "Live" dot vs muted "In development" dot
  summary: string;
  stack: string;          // mono tech line on the card
  links?: { href: string; label: string }[];  // one labeled anchor per destination
  cover: { alt: string; seed: number };       // deterministic SVG cover pattern
};
```

Design rules the type encodes:

- **Status is binary** (`live` / `building`). Finer distinctions — client work, academic project, maintained product, beta — are carried by the `kind` string so the UI keeps exactly two visual states.
- **`links` replaces the old single `href`/`hrefLabel`.** A card may carry several destinations (SSShopee = management app + storefront + GitHub; HandOff = GitHub + release). Renderer behavior in `src/app/page.tsx`:
  - 0 links → muted "Link to come" line, non-linked card (in-development projects).
  - 1 link → whole-card `<a>` hit target (unchanged legacy behavior).
  - 2+ links → plain card body with one labeled `.card-link` anchor per destination (avoids nested anchors).
- All external links render with `target="_blank" rel="noopener noreferrer"` and an sr-only "(opens in a new tab)" suffix.

### Other exports in `site.ts`

- `site` — identity, socials, and `liquidGlassAppBase` (single constant all old-site Liquid Glass app links derive from).
- `capabilities` — Design/Build skill chips. Build currently includes Supabase, Google Gemini APIs and Kotlin because shipped projects verify them.
- `experience` — education + roles.
- `relay` — full case study #1 content (assets in `public/work/relay/`).
- `uiux` — design-portfolio content. Its `shipped` array repeats a few dev-project links; when a project URL changes, update **both** `projects` and `uiux.shipped`.

## Project data verification (methodology used 2026-10-28)

Every card fact is checked before publishing; nothing is inferred from names alone:

1. **Live deployments** — HTTP GET each demo/admin URL (curl, real statuses recorded in `decisions.md`). Render free-tier hosts are retried with a long timeout for cold starts before being judged.
2. **Public repos** — README fetched from raw.githubusercontent.com; claims cross-checked against actual code where it matters:
   - SSShopee: `package.json` dependencies + repo file tree (no `capacitor.config`, no `electron/`, no Vite) → old stack claims dropped, Next.js/Prisma/Supabase published.
   - AI Recipe Generator: dependency list (`@google/generative-ai`, no `openai`) → Gemini migration confirmed complete.
   - ServePoint/HandOff/Bandwidth Bandit/tech // site: features taken from each repo's README/structure.
3. **Client projects without public code** (PatelNetworks) — described only from what the deployed site itself shows; no metrics, revenue or business outcomes claimed.
4. **No public repo found** (food ordering, real-time chat) — card stays minimal, planned scope labeled as planned, no link.

## Build & checks

```bash
npm run dev        # local dev on :3000
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run build      # production build
```

All three checks are required green after any content change (the `links` model is type-checked, so a malformed card fails `typecheck`).

## Related docs

`README.md` (deployment + creative-version wiring) · `CHANGELOG.md` (what changed, when) · `decisions.md` (why each content decision was made) · `business-documentation.md` (what the portfolio communicates and to whom) · `help.md` (maintainer how-tos and known issues) · `compact.md` (one-page summary).
