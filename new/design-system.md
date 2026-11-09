# Design system — tokens & rules, as shipped

The receipt for how this site looks and moves: one ink on one paper, two
typefaces with fixed jobs, motion that is always on except where it must
answer to the visitor. Every value below is copied from the shipped files —
the `:root` block and `html.dark` in `src/app/globals.css`, the `html.uiux`
scopes, and `src/app/fonts.ts` — not from a design file that drifted.

| File | Role |
| --- | --- |
| `src/app/globals.css` | `:root` tokens (light), `html.dark`, dev-site rules, motion tokens |
| `src/app/uiux/uiux.css` | The editorial paper theme, scoped to `html.uiux` |
| `src/app/fonts.ts` | Archivo (`--sans`) and Fragment Mono (`--mono`) declarations |
| `src/components/ThemeToggle.tsx` | The theme state the tokens respond to |
| `src/components/Cursor.tsx` | The pointer — draws only `--fg`/`--bg`, so themes re-ink it for free |

---

## 01 / Ink — one pair, everything derives from it

The whole site is `--fg` on `--bg`. Nothing picks a raw hex outside the
`:root` blocks; accents, lines, softs and hovers are all declared once here
and consumed everywhere, which is why a theme change re-inks the pointer,
the chips, the hints, the swatches — everything — without a single special
case.

| Token | Light | Dark | Job |
| --- | --- | --- | --- |
| `--bg` | `#ffffff` | `#0f0f11` | the paper |
| `--fg` | `#18181b` | `#ededf0` | the ink |
| `--muted` | `#5c5c66` | `#9a9aa3` | the whisper (secondary text) |
| `--line` | `#e4e4e9` | `#26262c` | hairline rules |
| `--line-strong` | `#c9c9d1` | `#34343d` | visible edges (phone nav bar) |
| `--soft` | `#f6f6f8` | `#1a1a1f` | filled wells (code, table heads) |
| `--green` | `#15803d` | `#3fb950` | **live status only — never brand** |
| `--accent` | `#ea580c` | `#fb923c` | UI/UX portfolio accent + its navbar pill |
| `--accent-dev` | `#2563eb` | `#60a5fa` | the dev portfolio's blue |
| `--accent-contrast` | `#ffffff` | `#181818` | text on accent fills |
| `--btn-solid-hover` | `#35353b` | `#d6d6dc` | solid button hover fill |
| `--header-bg` | `rgba(255,255,255,.92)` | `rgba(15,15,17,.9)` | the sticky header's only glass |

`color-scheme` is set per theme (`light` / `dark`) so UA chrome — scrollbars,
form controls — follows along. Status dots stay green on purpose: they mean
"live", not "brand".

## 02 / Three themes, two portfolios

1. **Dev light** — `:root`, the default.
2. **Dev dark** — `html.dark`, toggled in the navbar, system preference by
   default, persisted in `localStorage`, applied pre-paint by the inline
   script in `layout.tsx` so there is no flash.
3. **/uiux paper** — `html.uiux` scope: the editorial portfolio defaults to
   *light even on dark-OS machines* (paper `#F6F3EE`, ink `#1B1D22`, mute
   `#6B685F`, line `#DDD7CC`; dark `#141518` / `#ECE8DF` / `#A09C92` /
   `#2B2D33`). `:not(.dark)` in the selectors lets the toggle win when a
   visitor flips it.

Per-project accents live outside the token table on purpose: rows and case
pages set `--pa-light` / `--pa-dark` inline (Taar/Sutra navy `#1F2A44`, Ghar
terracotta `#A63D1F`), and `uiux.css` resolves them to `--pa` per theme. Both
portfolios share the same accent *patterns*, so recoloring a portfolio is a
one-line change — the discipline the token system buys.

## 03 / Type — two families, four jobs

**Archivo** (`--sans`) is the voice. One variable family with the width axis
kept live (`wdth 62..125`, declared in `fonts.ts`): display type runs
expanded at 125, body text runs normal width. The axis is a design material
here, not a fallback.

**Fragment Mono** (`--mono`, weight 400 only) is the readout voice: meta
lines, section indexes, years, statuses, counters, table heads — and the
custom cursor's chips and hints. Everything quiet and factual on the site is
Fragment Mono. The stacks carry the real font first and the family name
second (`var(--font-display), 'Archivo', system-ui, sans-serif`) so the
system falls back gracefully.

Scale discipline: display sizes are clamped, never fixed — the meta pages'
h1 runs `clamp(2.4rem, 6vw, 3.6rem)`; section titles and body sizes step
down from there. Weights stay in the 400–700 band.

## 04 / Motion — always on, almost

The philosophy: motion is communication, not garnish, and it runs for every
visitor — Lenis inertial scrolling, split-text reveals, the scroll progress
hairline, 420ms accordion folds. The tokens (`:root`):

| Token | Value | Job |
| --- | --- | --- |
| `--ease-apple` | `cubic-bezier(0.16, 1, 0.3, 1)` | the house easing — expo-out, fast start, long settle |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | general transitions |
| `--press-scale` | `0.97` | touch-down feedback on `.btn`, pills, the theme toggle |
| `--dur-micro` | `120ms` | micro-interactions (press, chevron, hover tints) |

The one exception proves the rule: the custom pointer honors the OS
reduced-motion request — which used to *silently hide it* from visitors with
"Animation effects: Off", the "nah cant see any diff" report. Since [1.4.7]
the footer **Cursor: auto / on / off** toggle is the escape hatch: `on`
overrides the OS, `off` forces native, `auto` (default) follows it. The
label says "Cursor" because that is what it scopes to. Everything else stays
always-on by design.

## 05 / Discipline & accessibility

- **Hit targets**: 44px minimum on pills, the theme toggle and buttons.
- **Press feedback on touch-down**: the `:active` scale to
  `var(--press-scale)` reads as acknowledgment, not decoration.
- **Reduce Transparency**: the sticky header (the site's only glass element)
  drops its blur and goes opaque.
- **Increase Contrast**: separators and the header edge strengthen
  (`--line: #86868f` under the contrast query).
- **Semantic colors**: components read tokens, never hex — the rule that
  makes sections 01–03 true at once.
- **Deliberately skipped**: glass skins, squircles, spring gesture libraries,
  parallax noise. Flat and fast on purpose; the Apple UX kit contributed the
  *discipline*, not the skin.

## 06 / Using this file

If you build on this repo: consume tokens, never raw hex; keep new motion on
the two easings; keep status green for "live"; keep Fragment Mono for
readouts. If you change a token, the CHANGELOG entry is the receipt — every
version ships dated.

*Shipped with [1.4.9]. Companion doc: `custom-cursor.md` (the pointer
system).*
