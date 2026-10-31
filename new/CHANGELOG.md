# Changelog

All notable changes to the Omkar Kardile portfolio are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.4.1] — 2026-10-31

### Fixed

- **AskOmkar's chat log could not be scrolled** — the site's Lenis smooth-scroll engine intercepts wheel input globally, so wheeling over the log scrolled the page behind the panel while the log itself never moved (reproduced: log `scrollTop` frozen at 807, page at 3631). The log now carries `data-lenis-prevent`, the escape hatch Lenis's own contract in `globals.css` already anticipates; `overscroll-behavior: contain` stops the scroll chaining there.
- **The hover hint chip landed on top of the CTA it described** — a pointer-chasing chip is doomed: the pointer is inside the element by definition, so the chip (offset a fixed 18/20px from the ring) sat on the hovered button and read as a rendering bug, merging with the button's ink hover fill. The hint is now anchored to the ELEMENT's box: below its left edge by default, flipped above near the viewport floor, clamped at the side edges, re-read every frame so it sticks to the CTA while the page glides under it (Lenis) and drops when the element scrolls away or unmounts. Binding moved from `pointermove` to one delegated `pointerover` listener; measurement happens once per show.
- **The ink cursor vanished on ink surfaces** — `.ux-btn:hover` fills with `var(--fg)`, so the ink dot and ring went invisible over the hovered Email/LinkedIn buttons. Both now carry a 1px `var(--bg)` halo (`box-shadow`), invisible on paper and exactly what keeps them readable on ink.

### Changed

- **Hints culled to genuinely quiet CTAs** — the user's rule was "every CTA except the very obvious ones": rows that already announce themselves (Also shipped, the Liquid Glass taste rows with their "N-PAGE CASE STUDY" meta, "← All work", "← Developer portfolio", "Open prototype ↗", "Open full screen ↗") lost their `data-hint`, and the unused `hint` field left `uiuxProjects.ts`. Hints remain where the outcome isn't written on the control: the two icon-only nav actions, the theme toggle, "← Portfolio" (dev or design?), the footer's inline "Omkar Kardile" link, and the mailto/LinkedIn contact buttons.

## [1.4.0] — 2026-10-30

### Added

- **"Personal design taste" section on `/uiux`** — the six Liquid Glass redesign studies (Linear, Spotify, LinkedIn, Stripe, Airbnb, Slack) return to the loud index as a mono index of their own, directly under "Also shipped": an `01 — 06` count head, one quiet intro line, rows with index numerals, page-count meta and ↗ arrows, each linking to its written case-study PDF in `public/case-studies/`. The studies (and their PDFs) had been orphaned since loud mode replaced the editorial index.
- **One-time desktop whisper (`ViewNotice`)** — a ~3s translucent "best viewed on desktop" note stacked bottom-right above the AskOmkar pill: pointer-events none, once per session, site tokens only so light/dark/uiux all dress it. Mounted in the root layout, so both sites carry it.
- **Hover hint chip for quiet CTAs** — a fourth cursor element: a small ink Space Mono caption that trails the ring over any CTA carrying `data-hint` ("opens mail app", "case PDF · new tab", "back to all work", "admin dashboard · new tab", "switch theme", "dev portfolio", "live site · new tab", "prototype · new tab"), fading in with a 5px rise and the same velocity lean. Project rows keep their loud VIEW chip and never grow a hint; prev/next, nav home and other self-describing controls get nothing. Touch and reduced-motion are untouched (the cursor no-ops there); the `data-hint` attribute is inert on the dev portfolio, which has no reader for it.

### Changed

- **"Also shipped" swap** — SSShopee ERP is out; **PatelNetworks — Admin Panel** (`patelnetworks-5ne3.onrender.com/admin`, the owner-side dashboard shipped with the client project) is in, next to AI Recipe Generator.

### Fixed

- **The custom cursor's grow/squeeze states rendered at the wrong position** — the CSS `scale` property composes before the JS-driven `transform`, so the scaled element rendered at scale× the pointer position: over links the dot landed at 0.6× and the ring flew out to 1.45× the pointer (measured: pointer at 864px, ring rect at 1227px). Scale now lives inside the rAF transform with a JS lerp mirroring the old easing; CSS keeps only opacity (plus the hint's translate rise, a pure translation, which composes safely).
- **The case-study "← All work" link was unclickable on desktop** — the big accent project number's inline text box (line-height 0.85 lets the content area tower ~0.3em above the border box) covered the link's centre at every viewport ≥ ~1000px, so `elementFromPoint` returned the `<p>` and clicks died there (verified at 1440/1280/1024; worked at 800). The decorative aria-hidden numeral now carries `pointer-events: none`, its cap drops 10rem → 9rem and it gains a step of margin so it never climbs into the link's row again.
- **Project numbering tamed** — index ghost numerals shrink on mobile (`clamp(4rem, 19vw, 6.5rem)`, was `4.5rem/22vw/7rem`) and the flick swing softens to ±6° with a 48px drift cap, so the digits stay inside the row bounds on narrow screens.
- **Reveals can no longer strand content invisible** — the root `loading.tsx` boundary made `usePathname` flip while the skeleton was still mounted, so the reveal observer armed against the skeleton and every `[data-reveal]` on the incoming page stayed at `opacity: 0` forever (reproduced on a home → `/uiux` SPA nav, 18 stuck elements). A MutationObserver now arms late-arriving content (loading swap, streamed segments, lazy nodes) and a passive scroll/resize/pageshow sweep reveals anything still stuck inside the viewport; IntersectionObserver stays the primary trigger.
- **Loud mobile scrub (`UiuxMotion`)** — one rAF loop drives every scroll-linked variable: velocity lean (`--vskew`, coarse pointers get bigger gain and a 7° ceiling), normalized speed (`--vvel`), hero exit progress (`--hx`), viewport progress for `[data-scrub]` rows and `[data-drift]` numerals, all IO-gated off-screen. The ≤48rem cut peels the hero away in five layers, swings row numerals with flick velocity, counter-drifts row bodies, and reveal keyframes animate into the scrubbed position — no end-of-animation jump. Desktop rendering is untouched.

## [1.3.0] — 2026-10-30

### Changed

- **`/uiux` goes loud** — new type system (five voices, all `next/font` self-hosted): Anton for the brutal condensed display (hero first line, ghost numerals, case-study titles/numbers), Syne for the quirky wide display (outlined "KARDILE" hero line, work titles, section titles, nav wordmark), Space Mono for typewriter chrome (kicker, labels, meta, marquee, stacks), Fraunces italic stays for emphasis/taglines, Hanken Grotesk stays for body. Case-study copy is untouched — presentation only.
- **New `UiuxMotion` client component** (vanilla rAF/IO, no deps) with four subsystems: per-char hero reveal (`data-chars`, masked chars rising with rotate + stagger), scroll-velocity skew (`--vskew` on the shell, ±4° clamp, decays to 0), cursor-following wireframe peeks on work rows (`--mx/--my`, fine pointers only, shows each project's first case-study wireframe), and ghost-numeral scroll drift (`data-drift`, −1..1 viewport progress).
- **Index layout overhaul**: stacked clash-type hero with a rotating circular "OPEN TO WORK" SVG badge and a full-bleed rotated ink marquee ("DESIGN ✳ CODE ✳ SHIP ✳ REPEAT") that leans with scroll velocity; work rows rebuilt around huge outlined ghost numerals that fill with the project accent on hover; "How I work" is now a stepped diagonal with outlined Anton numerals and alternating slide-in reveals; about quote is word-staggered at display size; contact buttons are magnetic and invert to ink on hover; shipped rows wear mono stacks with nudging arrows.
- Case-study pages inherit the type system (Anton uppercase titles + accent numerals, Syne section titles, Space Mono labels, Fraunces italic taglines); body copy, section order and verbatim content unchanged.
- Accessibility preserved throughout: h1 keeps `aria-label` around the split chars, decorative layers are `aria-hidden`, no horizontal scroll at any breakpoint (rotated strip clipped via `overflow-x: clip` without breaking sticky labels), peeks/stepping collapse correctly at 390px, focus rings and 44px targets intact.

## [1.2.0] — 2026-10-29

### Removed

- **Footer motion button** — the `Motion: auto / on / off` three-state toggle is gone from the footer, along with its component (`MotionToggle.tsx`), its `.motion-toggle` styles, the `motion-pref` localStorage key and the `'motion-pref'` live-swap event.

### Changed

- **Motion is always enabled — no default gate at all.** The site previously read a stored preference (or the OS `prefers-reduced-motion` setting) into an `html.motion-off` class that every animated subsystem checked; that whole layer is removed. Lenis now starts on every load, split-text/curtain/magnetic/scroll-progress (MotionCraft) always bind, the WAAPI accordion and the theme-toggle View Transition have no reduced-motion branch, and CSS `scroll-behavior: smooth` is unconditional. All `html.motion-off` CSS kill rules (~30 across `globals.css` / `uiux.css`) were deleted with it.
- Debug pass over the full motion stack after the removal — verified in the browser on `/`, `/uiux`, the three case studies, `/uiux/sutra/prototype` and `/creative`: no console errors, Lenis glide + anchor interception works, scroll progress hairline tracks 0→1, IntersectionObserver reveals fire on scroll, footer ticker animates, theme toggle cross-fades in both directions, mobile (390px) has no horizontal scroll, and the `DeviceFrame` embed path was E2E-tested with a temporary `prototypeUrl` (iframe title/sandbox/lazy-mount/aspect-ratio all correct) before reverting.

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
