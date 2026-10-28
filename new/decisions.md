# Decisions — Development Portfolio Content

A decision log for the 2026-10-28 portfolio content overhaul. Each entry states the decision, the evidence behind it, and the alternative rejected. No reconstructed history — decisions from before this date live in git.

## Evidence base collected first

HTTP status checks (2026-10-28, curl; Render cold-start retried with a 90 s budget):

| URL | Result | Note |
|---|---|---|
| `servepoint-tsos.onrender.com` | 200 | title "ServePoint — smartPOS" |
| `patelnetworks-5ne3.onrender.com` | 200 (after cold start) | CCTV & networking hardware storefront, Surat |
| `sss-ecomm.vercel.app` | 200 | "Shubham Super Shopee — Fresh groceries delivered in Pune" |
| `shubhamsupershopee-admin.vercel.app` | 307 → login | "Shubham Super Shopee ERP — Retail Operations Suite" |
| `cdacadminpanel.vercel.app/login` | **404 DEPLOYMENT_NOT_FOUND** | confirmed twice, incl. one independent re-check; flagged, not silently kept or dropped |
| `weather-nextjs-omkardile.vercel.app` | 200 | "Aether — Weather, elevated." |
| `recipe-generator-omkardile.vercel.app` | 200 | "AI Recipe Generator" |
| `tech-site-new.vercel.app` | 200 | "tech/site — practical guides across AI, code, and gadgets" |
| `shubhamsupershopee.onrender.com` (old) | **503** | dead — removed everywhere |

Repo inspections: raw READMEs pulled for `OmKardile/servepoint`, `OmKardile/sss-erp-hybrid`, `OmKardile/handOff`, `OmKardile/bandwidth-bandit`, `OmKardile/weather-nextjs`, `OmKardile/recipe-generator`, `jhonny-silverhand/tech-site`; `sss-erp-hybrid` additionally verified via `package.json` and repo file tree; HandOff release checked via the releases atom feed; GitHub profile scanned for repos of the two in-development apps (none found public).

## D1 — SSShopee is one project, two labeled links

**Decision:** single card "SSShopee — Retail ERP + Storefront" with `links`: management app, customer storefront, GitHub (ERP).
**Why:** the ERP and owner/admin app are the same deployment; the storefront is a separate app for the same shop. The card model now supports multiple destinations, so consolidation doesn't hide either application.
**Rejected:** two separate cards (duplicates one product); a single link (hides one of the two real apps).

## D2 — SSShopee stack corrected; platform claim dropped

**Decision:** publish `Next.js 16 · TypeScript · Prisma 6 · Supabase PostgreSQL · Tailwind CSS 4`; drop the `React 19 · Vite 6 · Capacitor · Electron` line and the "Web, Android, Windows" kind.
**Evidence:** `sss-erp-hybrid/package.json` (next, prisma, @prisma/client, pg; **no** vite, capacitor, electron) and repo tree (no `capacitor.config.*`, no `electron/`); README documents Next.js 16 + Prisma 6 + Supabase with separate DBs for ERP and storefront.
**Why:** the prompt required verifying the intended stack before publishing; the code has moved on from the old hybrid architecture, so the old claim would be false.

## D3 — Old Render URL retired

**Decision:** remove `shubhamsupershopee.onrender.com` from all data (cards, `/uiux` "Also shipped"); use the Vercel admin URL.
**Evidence:** the host returns 503; the Vercel admin deployment answers with the correct product title.

## D4 — GoldDrip removed

**Decision:** delete the card and every portfolio reference (data file, work-section note, DESIGN.md wireframe sketch).
**Why:** owner instruction — excluded from the development portfolio entirely. Unrelated files untouched.

## D5 — Aether is a rename, not a new entry

**Decision:** update the existing weather card in place: title "Aether Weather App", same live URL, new description/stack.
**Evidence:** the repo README presents the project as "Aether — Weather, elevated.", a ground-up rebuild (Next.js 16, keyless Open-Meteo behind server route handlers, AI layer with fallbacks); the live deployment's title matches.
**Rejected:** a second Aether card (would duplicate one deployment).

## D6 — Recipe generator: Gemini migration verified, then claimed

**Decision:** describe the app as running on Google Gemini (2.5 Flash) and note the OpenAI → Gemini migration.
**Evidence:** `recipe-generator/package.json` contains `@google/generative-ai` and **no** `openai` package; README documents `GEMINI_API_KEY` and Gemini 2.5 Flash. Migration is complete in code, so it is stated as fact, not intention.

## D7 — tech // site gets its live URL, not just GitHub

**Decision:** card links `https://tech-site-new.vercel.app/` (the URL published in the repo README, verified 200) plus the GitHub repo.
**Why:** the repo name alone is meaningless to a recruiter; the README's own live link is the product.

## D8 — HandOff presented as a maintained public beta

**Decision:** "Public beta v1, actively maintained" — not "unfinished".
**Evidence:** `beta.v1` release tag exists; README documents a `verify:all` release gate (lint + docs check + privacy check), versioned scripts, and a full design system — maintenance is explicit, not inferred from commit noise.

## D9 — PatelNetworks: capability described, numbers withheld

**Decision:** describe verified storefront functionality (catalog, kit bundles, Razorpay + COD, GST invoicing with serial-tracked warranty, OTP trade accounts, WhatsApp ordering, tracking); no stack guess, no metrics.
**Evidence:** features read from the deployed site itself; source is private, so the stack line lists platform capabilities instead of invented frameworks. Metrics visible on the site (order counts, ratings) are business figures — deliberately not repeated in the portfolio.

## D10 — CDAC admin link kept, but flagged

**Decision:** the Online Car Service Station card keeps `https://cdacadminpanel.vercel.app/login` per the owner's explicit instruction, even though the deployment returned `404 DEPLOYMENT_NOT_FOUND` during this update.
**Why:** the owner mandated that URL in the same brief; it is their deployment to restore. The alternative (silently deleting the link) would hide the project's only demo surface. The dead state is recorded in `CHANGELOG.md` and `help.md` so it isn't forgotten.
**Review trigger:** if the deployment isn't restored, remove the link on the next content pass.

## D11 — In-development apps stay unlinked and unembellished

**Decision:** Food Ordering and Real-Time Chat keep binary "In development" status, planned scope labeled as planned, no links, no repo claims.
**Evidence:** no public repos for either could be located (GitHub profile scan + name probes), so there is nothing to verify features against beyond the owner's own scope statement.

## D12 — Card model: `links` array instead of `href`

**Decision:** `Project.links?: { href; label }[]`; renderer keeps the whole-card anchor for single-link cards, per-destination anchors for multi-link cards; 0 links → muted "Link to come".
**Why:** SSShopee needs two app links on one card; nested anchors are invalid HTML; keeping the single-link whole-card anchor preserves the existing hit-target UX.
**Cost:** `href`/`hrefLabel` removed from the type — any future project must use `links`.

## D13 — Skills list follows the evidence

**Decision:** `OpenAI APIs` → `Google Gemini APIs`; add `Supabase`, `Kotlin`.
**Why:** no shipped project on the site uses OpenAI anymore (D6); Supabase backs three verified projects (SSShopee, ServePoint, tech // site) and Kotlin is Bandwidth Bandit's language. Skills now match the project evidence on the same page.
