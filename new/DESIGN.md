# DESIGN.md — Omkar Kardile, portfolio

## Concept Card

```
Idea:        Omkar means the primordial sound (ॐ + kara): the site is one continuous
             signal, a live waveform that runs through the whole page and tunes itself
             to every section and every project.
Metaphor:    a bench instrument's signal line, read like an oscilloscope. Precision,
             not temple ornament. Design and engineering are the two phases of one wave.
Signature:   the hero. OMKAR KARDILE set at mega size with a live canvas waveform
             threading the letters. At rest it breathes. The pointer bends it. Scroll
             splits it into two phases (signal red + ink) that travel through the page
             and re-align at each section mark.
Emotion:     calm, precise, in control. "This person ships."
Motion verb: resonate. Everything settles into phase: expo-out reveals, hover states
             that rise like a ripple, one waveform breathing at rest.
Screenshot:  OMKAR KARDILE in expanded grotesk, one ink wave line through the letters,
             a small red live dot on the signal.
```

Anchor: the name's literal meaning (Sanskrit: the syllable Om). Swap test: a portfolio
of anyone not named after a sound cannot use it. Runner-up detail kept: index rows
carry a mono spec line (from the "draft then ink" concept).

## Art direction

### Palette (by role)

| Role | Value | Use |
|---|---|---|
| `ground` | `#F1EFE8` bone | page ground; loader ground |
| `ink` | `#161511` warm near-black | text, primary wave line, fills |
| `muted` | `#6D6A5F` | secondary text (4.6:1 on ground, AA) |
| `line` | `rgba(22,21,17,0.15)` | hairlines, row rules, grid marks |
| `accent` | `#C93A12` signal red | the live phase of the wave, live dot, selection, focus ring, key meta. Used rarely and meaningfully. 4.7:1 on ground |
| `curtain` | ink | loader/transition ground |

Pure #000/#fff avoided; everything sits a degree warm. One committed theme, no dark mode.
Genericness check: warm cream + serif + terracotta is the banned default; this is a
grotesk-led Swiss index (bone / ink / one saturated) mutated by the signal concept, and
the red is earned by the concept (a live signal), not a palette reflex.

### Type

- **Display + text:** Archivo (variable, `wght` 100–900, `wdth` 62–125) via `next/font/google`.
  Display: 800–900 weight, wdth 125, tracking −0.045em, leading 0.85, optical margin −0.06em.
  Text: 400–500 at normal width. One family, two personalities; its width axis is also the
  wave's axis (letters breathe with the signal in the hero).
- **Readouts:** Fragment Mono (meta, indexes, years, statuses, counters). Tabular figures.
- Scale: engine tokens (`--t-mega` … `--t-xs`). Body 16–18px, measure ≤ 60ch. UI 12–14px.

### Grid & rhythm

12 columns, outer margin = gutter. Everything hangs off columns 1 / 5 / 9. Four-corner
frame: name top-left, nav top-right, location/context bottom-left, status + email
bottom-right. Frame steps aside on scroll down, returns on scroll up.
Section rhythm varies: hero full viewport (+ sticky run), statement airy, work tight rows,
capabilities normal, experience normal, contact full viewport finale.

### Shape

Radius 0 everywhere (instrument edges). One rule, no exceptions.

### Composition plan (ASCII, one family per section)

```
HERO (poster):                     WORK (index list):
+----------------------------+     +----------------------------+
| OK        Work About Contact|     | 01 LIVE  SSShopee (2 apps)  |
|                            |     |    ~~~~~~~~  Next.js 16...  |→ floating
|        OMKAR               |     | 02 LIVE  ServePoint         |   preview panel
|        KARDILE             |     | 03 LIVE  PatelNetworks      |   (frequency
|  ~~~~ wave ~~~~            |     | 04 LIVE  tech // site       |    cover)
| designer+developer, Pune   |     | 05 LIVE  HandOff            |
|                 Email me   |     | 06 LIVE  Bandwidth Bandit   |
+----------------------------+     | 07 LIVE  Aether Weather     |
                                   | 08 LIVE  AI Recipe Gen      |
                                   | 09 LIVE  Car Service Stn    |
                                   | 10 BLDG  Food Ordering      |
                                   | 11 BLDG  Real-Time Chat     |
                                   +----------------------------+
STATEMENT (manifesto):
large paragraph across 8-9 cols, mono index "00 / signal"

CAPABILITIES (data/facts):        EXPERIENCE (asymmetric pair):
Design ......... 10               left sticky label   | rows with mono years
Build .......... 11               (Background)        | PG-DMC, SWAAS, Arrow, Bharat

CONTACT (finale):
"Let's make something useful." at t-xl, email fill-flood button, link row,
colophon, wave returns flat under the name.
```

### Explainer figure

Not needed: no "how it works" section in this brief.

## Motion system

- One clock (gsap.ticker): Lenis, ScrollTrigger, the wave, the idle input.
- **Driver** (`src/motion/wave.ts`): one variable `phase` (0→1 across the page) mapped to:
  wave split amount (red line diverges from ink line mid-page, re-aligns at contact),
  amplitude envelope, section readout ("signal 00 → 05"). Pointer bends the line locally;
  idle drift keeps it breathing (few px, paused off-screen, zero under reduced motion).
- Reveals: `data-split` lines for headings, `data-reveal` for blocks, `data-intro` in hero.
- Loader: bone ground, mono counter bottom-right, wordmark bottom-left, 1px bar.
  Exit: counter lifts, ground wipes up, wave draws across the hero (real handoff).
- Micro-interactions, one treatment per role:
  - nav links: letter roll (roll recipe)
  - project rows: title nudge + rule draw + floating preview reveal, `data-cursor="Open"`
  - primary CTA (email): fill floods from the pointer's side
  - inline links: underline at rest, rises into a band on hover
  - arrows: nudge along direction
- Reduced motion: native scroll, static single ink wave (SVG), all content visible,
  color/underline states only, loader is a fast fade.

## Stack

Next.js 16 App Router, TypeScript. Plain CSS design tokens (engine contract) + Tailwind
utility import left in place. gsap + lenis. No WebGL: the signature is a 2D canvas wave
(one canvas, one ticker, rendered only while the hero is visible). Server-rendered SVG
frequency covers per project (honest generative art; no fake screenshots). Fonts via
next/font. Single page: hero, statement, work, capabilities, experience, contact.
`omkardile.is-a.dev` is the production URL (this site replaces the old one).

## Content rules

First person, plain, specific. No em/en dashes in visible text. No banned filler words.
Real links only (GitHub, LinkedIn, resume, live apps). In-progress projects marked
"Building, link to come" honestly. Email the one action name: "Email me".

## Placeholders / assumptions to replace

- Headline portrait/photography: none used; covers are generated frequency patterns
  (by design, honest). Replace with real product screenshots if the owner wants.
- Linear redesign links to the live interactive redesign on the old site
  (`omkardile.is-a.dev/uiux/apps/linear`) until it has its own URL.
- `site.url` set to `https://omkardile.is-a.dev`.
