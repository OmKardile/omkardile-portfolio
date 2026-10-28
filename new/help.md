# Help — Maintaining the Portfolio

Practical how-tos for the most common maintenance tasks. For architecture see `technical-documentation.md`; for deployment/creative-version wiring see `README.md`.

## Run and check locally

```bash
npm install        # once
npm run dev        # http://localhost:3000
npm run lint       # eslint — must pass
npm run typecheck  # tsc --noEmit — must pass
npm run build      # production build — must pass
```

The dev project card data is type-checked, so a malformed `links` array or status value fails `typecheck` before it can ship.

## Edit project content

All content lives in **`src/data/site.ts`**. To update a project: edit its `summary`, `stack`, `kind`, `status` or `links` — never the page components. After any change:

1. `npm run lint && npm run typecheck`
2. Manually open the changed card at `http://localhost:3000` (or `/uiux` if you touched `uiux.shipped`).
3. HTTP-check every link you touched (`curl -s -o /dev/null -w "%{http_code}" <url>`). For Render free-tier hosts, allow ~60–90 s cold start before concluding anything.
4. Record the change in `CHANGELOG.md` (what + date, no fabricated history).

## Add a new project card

Append an object to `projects` in `site.ts` and renumber `index` if needed:

```ts
{
  slug: 'my-app',                      // unique
  index: '12',
  title: 'My App',
  kind: 'Product · Web',               // carries the live/client/academic distinction
  year: '2026',
  status: 'live',                      // 'live' | 'building' — only two visual states exist
  summary: 'One to three sentences, verified features only.',
  stack: 'Next.js · TypeScript',
  links: [{ href: 'https://…', label: 'Open app' }],  // omit for in-development
  cover: { alt: 'Signal pattern for My App', seed: 44.2 },  // any float, unique per card
}
```

Rules that keep the portfolio trustworthy: link only deployments/repos you just HTTP-checked; claim only stack entries visible in the project's dependency manifest or README; if the project has no public code, describe only what the deployed site shows.

## Known issues at the time of writing (2026-10-28)

- **Online Car Service Station admin panel is offline.** `https://cdacadminpanel.vercel.app/login` returned `404 DEPLOYMENT_NOT_FOUND` on two independent checks while the portfolio was being updated. The link remains on card 09 per the owner's instruction. Fix: redeploy the project on the owner's Vercel account (or remove the card's link in `site.ts` if the deployment is permanently gone).
- **PatelNetworks is on Render free tier** — first request after idle may take up to a minute (cold start). That is hosting behavior, not downtime; the URL is correct.
- **Old SSShopee Render host is retired.** `shubhamsupershopee.onrender.com` (503) must not reappear anywhere; the canonical admin URL is `https://shubhamsupershopee-admin.vercel.app/`.

## URL change checklist (e.g. a project moves hosts)

1. Update the link in `src/data/site.ts` → `projects` (and `uiux.shipped` if the project appears there).
2. Grep the repo for the old host: `grep -rn "old-host.example" src/ *.md` — docs must not keep stale URLs.
3. Note the change in `CHANGELOG.md`.

## Restore the Creative navbar pill

The Creative version is still in development, so its pill is hidden. When it ships, follow **README → "Wiring the creative version"** (Option A: port into `src/app/creative/`; Option B: static export into `public/creative/` + rewrites) and restore the pill block marked with a NOTE comment in `src/components/Header.tsx` — its CSS (`.header-creative`) is already in place.

## Where things are

| What | Where |
|---|---|
| All portfolio content | `src/data/site.ts` |
| Card rendering / links model | `src/app/page.tsx` |
| Theme, accents, status colors | `src/app/globals.css` (tokens in `:root`) |
| SEO metadata, JSON-LD | `src/app/layout.tsx`, `sitemap.ts`, `robots.ts` |
| UI/UX "Also shipped" links | `uiux.shipped` in `site.ts` |
| Decision log | `decisions.md` |
