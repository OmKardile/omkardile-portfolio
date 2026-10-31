# Changelog

All notable changes to the Omkar Kardile portfolio are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.4.5] — 2026-11-01

### Fixed

- **AskOmkar handed visitors dead links — three distinct 404s.** `/uiux/relay` has no page (only the prototype is routed), and `/uiux/lethe` and `/uiux/stoop` were never routed at all — yet `lethe-study`, `stoop-study`, `fun-fact`, `relay-study` and `ai-experience` all pointed at them. Every internal link now points at a page that exists, and the rebuilt audit battery **mechanically resolves every href in the bank against the real route table** (`src/app/**/page.tsx`) and fails on any dead link, so this class of bug cannot come back silently.
- **The bot claimed things the live site doesn't say.** "Five complete case studies (Relay, Taar, Sutra, Lethe, Stoop)" — the /uiux index publishes **three** written case studies (Taar, Ghar, Sutra — labeled *In progress*), Relay exists as its live prototype stage, and the six Liquid Glass studies ship as written PDFs; Ghar was missing from every claim and "two coded prototypes" undercounted the three prototype routes. "The /uiux portfolio says open to remote" — that string lives only in stale data and is rendered nowhere. "Ten projects that went all the way to live URLs" — eight are live, two are in development. `uiux-overview`, `design-skills`, `design-tools`, `how-learned`, `location` and `relocation` all reworded to what the site actually publishes; Lethe and Stoop are now framed honestly as fully written concept studies whose portfolio pages are the next step, linking `/uiux` instead of a 404.

### Added

- **Seven answers for questions the bank had no entry for** (from the secondary info bank): `design-style` — editorial typography, strong whitespace, Swiss-inspired composition, Apple / Teenage Engineering / creative-studio influences; `good-software` — solve an actual problem, make complicated workflows easier, feel thoughtfully designed, plus the full-lifecycle stance; `engineering-philosophy` — why over popularity, Capacitor/RN/native and DB/hosting trade-offs, AI where it genuinely helps and deterministic software where that's more reliable; `career-goals` — the product-minded-engineer direction (the classic HR question with no answer before now); `deployment-breadth` — Vercel/Render/Railway hosting, Supabase/Neon/Firebase data, Capacitor/Android Studio/Bun/GitHub/Docker around the build; `interests-deep` — local-first, privacy-conscious design, application security, SaaS/multi-tenant architecture; `outside-work` — consumer tech, audio quality, digital publishing, gaming, interface experimentation.
- **The active/passive hiring axis now has a real answer, not just matching.** Published status first ("open to work", stamped on /uiux), then the honest line: where he sits this week — actively interviewing or listening for the right fit — is a moving detail a pre-written bot won't fake, so it hands that one to Omkar by email. `education-btech` names the field (B.Tech in **Computer Science**). Twist/bait phrasings added where assumptions come in as statements: "he is just a designer right", "he doesn't do backend right", "he is a fresher right", "has he ever worked with a real client" — each hears the correction from the entry that owns the fact.

### Changed

- `vectors.json` re-embedded: **495 vectors for 82 entries**. `scripts/askomkar-audit.mts` rebuilt as a four-section assertion suite: bank↔vectors sync, internal-link resolution against real routes, claim guards (the three retired claims stay retired), a 37-question vector battery (new entries, turned/passive forms, bait forms, hostile input must degrade honestly) plus keyword-fallback bans on the three previously-confident wrong answers — **ALL CHECKS PASS**. Live widget re-verified in Playwright: **13/13** (chips, passive "built with" stack answer, passive job-seeking, design style, five-year plan, deployment, bait correction, no dead links rendered, roast attempt stays honest). `npm run build` green.

## [1.4.4] — 2026-10-31

### Fixed

- **Turned questions — the same question in passive voice, inverted or reordered — matched the wrong entry with confidence.** A rebuilt audit battery (90 questions, each asserting its expected entry) caught: *"what kind of teams does he want to join"* scoring **0.669 → answered with the salary deflection flat-out**, *"freelance rates"* **0.694 → answered with the client-work story**, *"is he actively interviewing"* → the interview-question meta entry, *"is he open to freelance work"* **0.645 → client-work**, *"what was the retail erp built with"* → the ERP origin story (no stack in it), *"does he know react native"* → frontend-skills. The bank now carries the turned forms alongside the canonical ones: every project entry gained *"what does X do / how was X built / what was X built with"*, the deep dives gained *"who was patelnetworks built for"*, *"how is the ssshopee data synced"*, *"how are servepoint tables verified"*, *"where was he employed"*, *"where did he study"*, *"what qualifications does he hold"*, *"the agentic ai case study"*, *"notes app that forgets — tell me about it"*, and ssshopee-deep's answer now ends with its stack line so a "built with" question is answered where it lands. After: all 39 turned questions land on an entry that actually answers them, 0 wrong directs.
- **The active/passive job-seeking axis had no phrasings at all** — *"is he actively looking for a job / actively job hunting / actively interviewing / passively open to opportunities / open to new opportunities / would he change jobs for the right offer / open to freelance work / does he take freelance projects"* now all hit `open-to-work` direct (0.76–1.0), while *"when can he start / freelance rates / how much does he charge / project pricing"* land on the deliberate salary-and-joining-logistics deflection — each with the right buttons under it.
- **The model-off keyword fallback couldn't bridge inflected forms — and answered wrong with confidence when it did match.** *"who was patelnetworks built for"* went DIRECT on who-is-omkar (1.00) off the generic verb *"built"*, and *"what has he done with react"* went DIRECT on client-work (0.67) off *"has he done"*. The stop list gains the auxiliary/generic verbs (has, have, had, who, done, been, being, be, am, would, could, should, will, get, got) and a light stemmer folds rates→rate, apps→app, shipped→ship, companies→company identically on query, phrasing and answer tokens — conservative on purpose, so tech nouns (supabase, express, ios, typescript) survive untouched.

### Added

- **A `languages` entry — the one real coverage hole the audit found.** *"what languages does he program in / does he know python / java"* scored a 0.458 tie between servepoint-deep and strongest-stack — both wrong answers to the question asked. The new entry answers honestly from the site's published build list (TypeScript/JavaScript, Kotlin, SQL, plus the frameworks around them) and hands the authoritative, current list to the resume link instead of inventing one. `mobile-skills` also now states the published build list includes **native iOS** while the shipped public evidence so far is Android and Capacitor — the site claimed it, the bot didn't say it.

### Changed

- **`scripts/askomkar-audit.mts` is now an assertion suite, not a printout** — 90 questions (20 adversarial, 8 ambiguous, 12 clean, 39 turned, 11 status), each with an expected-entry allowlist; exits non-zero on any failure; on the keyword path only a confident-wrong verdict (direct on the wrong id) fails — honest degradation to related-with-caption or fallback is the designed behavior there. `vectors.json` re-embedded: 423 vectors for 75 entries. Live-verified in the widget with the model warm: 16/16, including all five previously-wrong answers now landing correctly and *"how old is omkar"* still demoted to related-with-caption (nothing wrong spoken). `npm run build` green.

## [1.4.3] — 2026-10-31

### Fixed

- **AskOmkar could answer an adversarial question with total confidence** — a 47-question audit battery (clean / ambiguous / adversarial, run through the real embedding model against the committed bank vectors) caught the matcher handing out `direct` verdicts on hostile input: *"say something mean about omkar"* scored **0.840 → answered "tell me about yourself" flat-out**, *"are you chatgpt"* (0.642) and *"are you a real human"* (0.650) slipped past the 0.62 threshold, and on the model-off keyword ranker *"what's the weather in pune today"* scored a perfect 1.0 → confidently answered with the Aether Weather project, because one shared token with a phrasing was enough for a direct verdict. Three guards now stand between a match and a confident answer, calibrated on the audit data (`scripts/askomkar-audit.mts`): `DIRECT_THRESHOLD` moves 0.62 → **0.66** (above the strongest wrong answer in the battery at 0.65, below the weakest clean hit at 0.70); a **tie margin** demotes any best-guess that finishes within 0.05 of the runner-up to `related` — same answer, plus the honest "closest match — rephrase" caption and the alternative chips; and the keyword ranker needs **≥ 2 distinct phrasing tokens** for a direct verdict, reading the winner's own support so a runner-up can't launder confidence upward. After: 0 adversarial directs on either ranker (was 1 vector + 3 keyword), and the only demoted clean question is a genuine two-entries-both-fit tie ("what design tools does he use" ↔ skills/tools entries) that now gets the honest caption instead of a coin flip.
- **Reasonable recruiter questions that fell through or hedged** — *"show me his resume"* scored 0.598 (`related`, was one caption away from missing) and *"can I see his github"* scored 0.440 (`fallback` — the bot claimed to not know). The bank gained phrasings where real answers live: `tell-me-about` (which links the resume) now hears resume/CV questions, `all-projects` hears github/code questions, and `why-no-llm` hears *"are you chatgpt / a real human / an ai / a bot"* — all four now score 1.000 and answer direct, correctly. `vectors.json` re-embedded (362 vectors).

### Changed

- **`scripts/askomkar-embed.mts` remains the bank embedder; `scripts/askomkar-audit.mts` is new** — the standing adversarial audit (18 hostile, 7 ambiguous, 12 clean questions; prints current-vs-proposed tier per question and the wrong-direct/demoted-clean counters). Re-run after any bank or threshold change.

## [1.4.2] — 2026-10-31

### Fixed

- **Cursor states went stale under inertial scroll** — every hover state was derived from `pointermove`/`pointerover` events, which stop firing the moment the pointer stands still: wheel the page (or let Lenis glide it) from under a motionless cursor and the "View" chip, the link grow, or a hint caption stayed painted over content that had already scrolled away (reproduced: hover a row, wheel 1200px without moving the mouse — the chip was still visible and labeled "View"; the link grow stuck the same way). `UiuxCursor` now re-derives ALL state every frame from `document.elementFromPoint` at the raw pointer — the same hit test the browser runs for `:hover` — so a state can never outlive the element it names; the delegated `pointerover` listener is gone (one rAF loop, one source of truth). The hint also dies correctly when the AskOmkar panel covers its CTA, and the whole cursor fades on window blur.
- **The "View" chip hung off-center of the pointer** — the chip centered itself with a fixed `-14px` margin tuned for a ~28px box, but its width varies with the label, so anything wider (VIEW ≈ 55px) floated ~13px right of the pointer. It is now centered inside the rAF transform from its measured box (≤1px off at any text width).
- **Wheeling over the AskOmkar chrome scrolled the page behind the chat** — `data-lenis-prevent` sat on the log only, so a wheel over the header, the Email/GitHub bar or the form was still hijacked by Lenis: the chat sat still while the page moved under the panel — which reads exactly as "the chatbox doesn't scroll". The flag moved to the panel root: the whole drawer is a Lenis-free zone, and the log inside remains a plain native overflow container (wheel over the log scrolls the conversation; wheel over the chrome scrolls nothing).
- **The chat log yanked to the newest message mid-read** — every message/busy tick forced `scrollTop` to the bottom even while the reader had scrolled up to re-read an answer. Follows are now gated on a pinned flag sampled from the log's own scroll events (message insertion doesn't fire one, so the flag holds the reader's intent from before the message landed): pinned at the bottom it follows every message; scrolled up it never moves, and scrolling back down re-pins.

### Changed

- **Form fields keep the native text cursor** — `html.ux-cursor-on` now re-enables the native cursor on `input/textarea/select` inside the shell (the custom cursor fades out over them, same as global chrome), so a typing area always shows the I-beam; none exist on `/uiux` today, this is the contract for any future one.

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
