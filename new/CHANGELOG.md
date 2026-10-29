# Changelog

All notable changes to the Omkar Kardile portfolio are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.1.0] — 2026-10-29

### Added

- **UI/UX portfolio rebuild** — `/uiux` is now a data-driven editorial design portfolio: oversized Fraunces hero, three asymmetric work rows (Taar 01, Ghar 02, Sutra 03), a how-I-work strip, "Also shipped" rows with live URLs, about + contact, and a credit footer.
- **Three case-study routes** — `/uiux/taar`, `/uiux/ghar`, `/uiux/sutra`, all rendered by one shared `CaseStudyLayout` driven by `src/data/uiuxProjects.ts` (typed block model: paragraph, list, hypotheses, table, personas, flow, wireframes, decisions, swatches, typeSpecimen, rules, slot). Nine sections per project, in a fixed order.
- **Wireframe schematics** — nine hand-drawn inline SVGs (three per project), `currentColor`-themed, `role="img"` + `aria-label` on each.
- **`DeviceFrame`** — 390×844 live-prototype embed with reserved `aspect-ratio` (no layout shift), sandboxed iframe, mounts only near the viewport and only on viewports ≥768px; phones get a poster + "Open prototype" button. The section renders only when `prototypeUrl` is set — same for the Figma "Design file" embed.
- **Unfinished-evidence contract** — dashed `{ slot }` placeholders render in development and vanish from the production build; tables flagged `filled: false` collapse to a quiet "Research in progress" line in production. No "link pending" anywhere.
- **Editorial theme for `/uiux`** — paper `#F6F3EE` / ink `#1B1D22` / mute `#6B685F` / line `#DDD7CC` in light, graphite `#141518` / `#ECE8DF` / `#A09C92` / `#2B2D33` in dark, with per-project accents (Taar/Sutra navy `#1F2A44`, Ghar terracotta `#A63D1F`; AA-lightened in dark). Fraunces (light 300, italic emphasis) + Hanken Grotesk via `next/font`, self-hosted.
- **Slim `/uiux` nav** — "← Portfolio", wordmark, mail + LinkedIn icons (lucide-react, already a dependency), and the same theme toggle as the main portfolio. The global site header hides itself on the four `/uiux` chrome routes only.
- Sitemap entries for the three case-study routes; per-route metadata (title, description, canonical, Open Graph with placeholder image paths `/og/uiux-*.png`).
- Motion: one-shot 12px fade-up reveals via the site's IntersectionObserver system, ≤60ms stagger, fully disabled under `prefers-reduced-motion` / `motion-off`. Hover is limited to underline offset + accent numeral colour.
- README: "UI/UX case studies" section (adding a project, wiring prototype/Figma/repo URLs, unfinished evidence).

### Changed

- `/uiux` page replaced the previous Relay/Lethe/Stoop/Liquid Glass layout (the in-site prototype stages at `/uiux/*/prototype` are untouched and keep the site chrome).
- `html.uiux` tokens updated to the case-study palette; `html.uiux.dark` added (previously fell back to the generic dark theme).
- The homepage and dev portfolio are untouched beyond the existing `/uiux` entry links.

### Removed

- Nothing user-facing outside `/uiux`; the Liquid Glass case-study PDFs remain served under `/case-studies/`.

## [1.0.1] — 2026-10-29

### Changed

- Kinetic word tickers moved from under the heroes into the site footer (both portfolios keep their own vocabulary and accent).
- The UI/UX "Also shipped" section folded into the dev projects list (SSShopee ERP, AI Recipe Generator and Car Service Admin Panel already live there with verified links); sections renumbered.

## [1.0.0] — 2026-10-28

### Added

- Developer portfolio (`/`), UI/UX portfolio with Relay/Taar/Sutra case studies and live in-site prototype stages, smooth-scroll engine (Lenis on one GSAP clock), site-wide motion craft, dark mode with no-flash bootstrap, Liquid Glass case-study PDFs.
