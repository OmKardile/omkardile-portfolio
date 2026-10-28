# Changelog

Notable content and infrastructure changes to the portfolio site. The site predates this file; older iterations live in git history only — nothing here is reconstructed retroactively.

## 2026-10-28 — Liquid Glass studies: Open app links removed

Scope: `/uiux` Liquid Glass section only.

- Each expanded study row now offers a single link — "Case study PDF" — instead of two; the external "Open app" button (and the only usage of `liquidGlassAppBase`) is gone. Section note reworded from "expand a row for both links" to "expand a row to open it" so the copy matches. The six apps themselves and their PDFs are untouched.

## 2026-10-28 — Interaction polish (mobile nav redesign, button animations, loading states)

Scope: presentation and interaction only. No content or data changes.

### Mobile navigation — redesigned

- The Task-18 two-row header is replaced by a standard single-row pattern: a round burger button on the left, the portfolio switch pill and theme toggle on the right (~58px bar). The name stays hidden, and section links plus Resume/email move into a drop sheet that slides from under the sticky header with staggered rows.
- Sheet closes on link tap, scrim tap (portal — the header's backdrop-filter would otherwise contain `position:fixed`) and Escape. Touch targets remain ≥44px; anchor scroll-padding returns to the desktop 4.5rem now that the bar is one row.

### Animations

- Buttons lift on hover with a soft shadow (new `--lift-shadow` and `--ease-out` tokens), and their arrow glyphs nudge in their own direction (↓ sinks, → slides, ↗ climbs); card links, header Resume, Liquid Glass actions and the theme-toggle icon get the same treatment. Everything collapses under `prefers-reduced-motion`.
- Route transitions: new root `loading.tsx` (indeterminate top progress bar + centered spinner) and a pending spinner inside the switch pill via `useLinkStatus` — feedback whenever a portfolio switch streams in.

### Work cards on mobile

- Project summaries clamp to three lines below 40rem with a `…more` / `less` toggle that only appears when the text actually overflows (measured post-hydration and after fonts load). Cards are plain containers now — the whole-card anchor was removed so the toggle keeps valid HTML; labeled links at the card foot are unchanged.

## 2026-10-28 — Repo cleanup (scaffolding + old-project artifacts)

Scope: repository hygiene only. No page content, data or styling touched.

### Removed

- **Old-project artifacts**: `scripts/old-portfolio.html` (archived pre-redesign page backup, never rendered) and `scripts/splice-projects.py` (one-off script that spliced the Task-13 project array from `.research/new-projects.ts` into `site.ts` — already executed). `scripts/` now contains only `make-og.cjs`, the current og.png regeneration utility.
- **Unused template scaffolding**: the full shadcn/ui kit (`src/components/ui/`, `components.json`), `src/hooks/` (use-mobile, use-toast), `src/lib/` (utils, db), the Prisma stack (`prisma/`, `db/custom.db`, `.env` DATABASE_URL) and Tailwind config files (`tailwind.config.ts`, `postcss.config.mjs`) — none of it was imported anywhere; the site runs on plain CSS custom properties (verified: zero `@tailwind`/`@apply` in `globals.css`, zero imports of `@/lib` or `@/components/ui` outside the kit itself).
- **Task artifacts**: `.research/` (Task-13 verification evidence; conclusions live in `decisions.md`), `.shots/` (verification screenshots, regenerable), `tool-results/` (tool output dumps).
- **Sandbox template leftovers**: `examples/websocket/`, `tests/` (runtime container tests), `mini-services/`, `upload/` contents (Relay + Taar source zips, extracts and the Apple UX reference doc — all fully integrated into the site before removal).
- **Dependencies pruned** from 78 to 10 (lockfile: ~941 → 392 packages): everything the app never imported. Kept: `next`, `react`, `react-dom`, `lucide-react` (prototypes), `@vercel/analytics`; dev: TypeScript, ESLint (+ next config), type packages.

### Kept on purpose

- `.zscripts/` and `Caddyfile` — sandbox build/deploy infrastructure (guarded conditionals elsewhere expect them).
- `public/case-studies/*.pdf` — linked from the `/uiux` Liquid Glass studies.

### Verification

- `npm run lint`, `npm run typecheck`, `npm run build` all green after cleanup; all 9 routes still prerender static.

## 2026-10-28 — Development portfolio content overhaul

Scope: developer-portfolio project cards only. UI/UX page content untouched.

### Changed

- **SSShopee** consolidated into **one project** ("SSShopee — Retail ERP + Storefront") with two clearly labeled links: the management/owner app (`shubhamsupershopee-admin.vercel.app`) and the customer storefront (`sss-ecomm.vercel.app`), plus the ERP GitHub repo. Previously the card described only the ERP and pointed at the retired Render URL.
- **SSShopee stack corrected** from `React 19 · Vite 6 · Capacitor · Electron` (web/Android/Windows claim) to `Next.js 16 · TypeScript · Prisma 6 · Supabase PostgreSQL · Tailwind CSS 4`, verified against the repo's `package.json` and file tree — no Capacitor/Electron/Vite remain in the current codebase, so the old platform claim was dropped.
- **ServePoint added** as a live café operations platform (`servepoint-tsos.onrender.com`), described only from verified repo facts: role-based access (superadmin/owner/staff), ordering with GST checkout, kitchen queue, bills, end-of-day close-out, inventory with recipes, guest loyalty, floor/booking, QR table-side ordering and order tracking; React 19 + TypeScript + Vite + Tailwind 4 + Zustand + Supabase, installable PWA.
- **PatelNetworks added** as a live client e-commerce project (`patelnetworks-5ne3.onrender.com`), described only from what the deployed site shows: catalog, kit bundles, Razorpay checkout with COD, GST invoicing with serial-tracked warranty, OTP trade accounts, WhatsApp ordering, order tracking. No source code, metrics or revenue figures claimed.
- **tech // site added** from its repo README/structure: multi-niche technology publication, split publishing model (admin with Gemini drafting + open-signup manual writers), library, profiles/follows/comments, product comparison layer; Next.js 15 + React 19 + TypeScript + Supabase. Links: `tech-site-new.vercel.app` + GitHub.
- **HandOff added**: privacy-first offline vCard QR business-card app (web + Android via Capacitor 8), public beta.v1 release, actively maintained; described from repo README and release tag.
- **Bandwidth Bandit added**: Kotlin Android network monitor (persistent live-speed notification, daily Wi-Fi/mobile usage, per-app breakdowns via NetworkStatsManager, threshold alerts, Cloudflare speed test), described from its README.
- **Weather App entry renamed in place to Aether Weather App** and rewritten to the rebuilt product the repo now describes (Next.js 16, keyless Open-Meteo via server route handlers, 48-hour outlook, 7-day forecast, air quality, Liquid Glass shell, AI layer with graceful fallbacks). Same live URL as before — no duplicate card.
- **AI Recipe Generator updated from OpenAI to Google Gemini (2.5 Flash)** after verifying the migration in the repo: `@google/generative-ai` is the only AI dependency, no `openai` package, `GEMINI_API_KEY` configuration documented in the README.
- **Online Car Service Station** reframed as the PG-DMC major project (SunBeam Infotech, C-DAC ACTS) with a tightened description.
- **Full-Stack Food Ordering App / Real-Time Chat App** reworded to clearly mark planned scope as planned; no features claimed beyond the owner's own brief, since no public repo is available to inspect.
- Skills list: `OpenAI APIs` → `Google Gemini APIs`; added `Supabase` and `Kotlin` (all three now verified across shipped projects).
- `/uiux` "Also shipped" links: SSShopee now points at the Vercel admin URL (was the dead Render URL) with a corrected stack line; AI Recipe Generator stack line updated to Gemini.

### Removed

- **GoldDrip card and portfolio entry** (owner request — excluded from the development portfolio entirely; no unrelated files touched).
- **`shubhamsupershopee.onrender.com`** from all project data (confirmed returning 503; replaced by the Vercel admin URL).
- Stale stack claims: OpenWeatherMap/Axios on the weather card, Vite/Capacitor/Electron on SSShopee, `Product · Web, Android, Windows` kind.

### Infrastructure (code, not content)

- `Project` type: `href`/`hrefLabel` replaced by an optional `links` array (one labeled anchor per destination). Card renderer in `src/app/page.tsx` keeps the whole-card anchor for single-link cards and renders per-destination anchors for multi-link cards (SSShopee needs two app links on one card).
- Work-section note updated (no longer references the removed market-intelligence dashboard).
- Verification at edit time: `npm run lint`, `npm run typecheck`, `npm run build` all green; all card URLs HTTP-checked (statuses recorded in `decisions.md`).

### Known issue (flagged, not fixable from here)

- The Online Car Service Station admin panel (`cdacadminpanel.vercel.app/login`) returned `404 DEPLOYMENT_NOT_FOUND` on two independent checks while this update was made. The link stays on the card per the owner's instruction; the deployment needs a redeploy on the owner's Vercel account. See `help.md`.
