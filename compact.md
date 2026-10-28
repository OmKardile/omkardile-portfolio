# compact.md — One-Page Site Summary

Dense reference for quick context. Details: `technical-documentation.md` (how it's built), `decisions.md` (why content is what it is), `help.md` (how to maintain).

## Site

- **Owner:** Omkar Kardile — developer & UI/UX designer, Pune, India. `omkardile.is-a.dev`.
- **Stack:** Next.js 16 + React 19 + TypeScript, npm, plain CSS custom properties (dual accent system: dev blue on `/`, UI/UX orange on `/uiux`), dark mode (no-flash, localStorage, system default), Archivo + Fragment Mono.
- **Routes:** `/` dev portfolio · `/uiux` design portfolio · `/uiux/relay/prototype` live Relay prototype · `/creative` reserved placeholder (pill hidden while in dev).
- **Content source of truth:** `src/data/site.ts` — pages only render. Card statuses are binary (`live`/`building`); live/client/academic/product distinctions ride the `kind` label; a card carries 0+ labeled links (`links` array).

## Development projects (11)

| # | Card | Status | Links | Stack (published) |
|---|---|---|---|---|
| 01 | SSShopee — Retail ERP + Storefront | Live · one project, two apps | admin app · storefront · GitHub | Next.js 16 · TS · Prisma 6 · Supabase · Tailwind 4 |
| 02 | ServePoint — Café Operations Platform | Live | app · GitHub | React 19 · TS · Vite · Tailwind 4 · Zustand · Supabase |
| 03 | PatelNetworks — Client E-commerce | Live · client | site | capabilities only (code private) |
| 04 | tech // site — Technology Web Platform | Live | site · GitHub | Next.js 15 · React 19 · TS · Supabase |
| 05 | HandOff | Live product · beta v1 · maintained | GitHub · release | Next.js 16 · TS · Capacitor 8 · Tailwind 4 |
| 06 | Bandwidth Bandit | Live · Android | GitHub | Kotlin (NetworkStatsManager, foreground service) |
| 07 | Aether Weather App | Live | app · GitHub | Next.js 16 · React 19 · TS · Open-Meteo (keyless) |
| 08 | AI Recipe Generator | Live · Gemini | app · GitHub | Next.js · React · Tailwind · Google Gemini |
| 09 | Online Car Service Station | Academic · PG-DMC major | admin panel ⚠ offline at edit time | React · hybrid app · admin panel |
| 10 | Full-Stack Food Ordering App | In development | — | Next.js · MongoDB |
| 11 | Real-Time Chat App | In development | — | React Native · Tailwind · Firebase |

## Content rules (in force)

1. Every status/stack/link verified against the live deployment or the public repo before publishing (method in `technical-documentation.md`).
2. No metrics, revenue figures or invented achievements anywhere.
3. Retired URLs never reappear: `shubhamsupershopee.onrender.com` (503) is gone; admin URL is `shubhamsupershopee-admin.vercel.app`.
4. GoldDrip excluded from the development portfolio (owner decision).
5. SSShopee = one card, two labeled application links.
6. AI claims match code: recipe generator on Gemini (2.5 Flash, verified in deps); no OpenAI references left except the migration note.

## Open items

- Redeploy `cdacadminpanel.vercel.app` (404 at edit time) or drop card 09's link — tracked in `help.md` / `decisions.md` D10.
- Food ordering + real-time chat: add links only when a working deployment exists.
- Creative version: wire per README Option A/B when it ships, restore the hidden pill.
- Liquid Glass apps still live on the old deployment — if they move, update `liquidGlassAppBase` in `site.ts` (one constant).
