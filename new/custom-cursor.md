# Custom Cursor — architecture & behavior

The site-wide pointer: it replaces the native cursor on every route, and the
hover guidance (chips, hints) rides *with* it. Shipped in two commits —
`ef42f9b` ([1.4.6], site-wide replacement + hints riding the pointer) and
`60ca4c6` ([1.4.7], the footer motion toggle). This doc describes the system
as it actually behaves in `src/`, not as planned.

| File | Role |
| --- | --- |
| `src/components/Cursor.tsx` | The engine: one rAF loop, all state, the portal |
| `src/app/cursor.css` | The look, the `cursor: none` contract, field exemption |
| `src/components/MotionToggle.tsx` | The preference (auto/on/off) + `motionPref()` |
| `src/components/Footer.tsx` | Toggle mount (dev site footer, bottom row) |
| `src/components/uiux/Footer.tsx` | Toggle mount (/uiux credit line) |
| `src/app/globals.css` | `.motion-toggle` styles (a footer link that is a `<button>`) |
| `src/app/layout.tsx` | Mounts `<Cursor />` globally (line ~107) |

---

## What the visitor sees

| Situation | Pointer behavior |
| --- | --- |
| Default | 6px ink dot tracking 1:1 + 32px wireframe square trailing on a lerp |
| Over links/buttons (`a, button, [role="button"], summary`) | Ring wraps the dot — ring scale 1.45, opacity 0.9; dot shrinks to 0.6 |
| Over `[data-cursor]` rows (project rows: `data-cursor="View"`) | Dot+ring fade out; a filled ink **chip** with the label replaces them, centered on the pointer |
| Over `[data-hint]` CTAs | A small ink **hint** caption rides beside the pointer ("Switch theme", "Opens PDF", "Pre-written answers · runs locally") |
| Mouse press | Dot scales 1.6×, ring squeezes to 0.85×, ring opacity 0.4; the hint stays up (flicker on click reads as a glitch) |
| Over form fields (`input, textarea, select`) | Custom cursor fades out (`.is-out`), native I-beam returns — typing needs it |
| Pointer leaves the window / window blurs | Whole cursor fades out; returns on `pointermove` |
| Touch devices | Never activates — native behavior everywhere, by design |

Current hint inventory: ThemeToggle ("Switch theme"), Header resume ("Opens
PDF"), AskOmkar pill ("Pre-written answers · runs locally"), /uiux Nav
("Dev portfolio", "Opens mail app", "LinkedIn · new tab"), /uiux footer
("Live site · new tab") and the /uiux contact CTAs.

## Activation gate

The engine runs only when **all** of these hold, re-checked live:

1. The component is mounted (the portal refs exist).
2. `matchMedia('(hover: hover) and (pointer: fine)')` matches — coarse
   pointers bail before anything else happens.
3. The motion preference allows it (see the toggle section): `'off'` forces
   native; `'auto'` follows the OS (`prefers-reduced-motion: reduce` bails);
   `'on'` overrides the OS.

On activation it adds `html.ux-cursor-on`; `cursor.css` turns that into
`cursor: none !important` on `body *` (inside the same media query, so the
CSS and JS gates can never disagree). The class is removed on teardown —
flipping the toggle or unmounting restores the native cursor without a
reload.

## The one rAF loop — per-frame hit-testing

Every frame the loop runs `document.elementFromPoint()` at the raw pointer
position and re-derives **all** state from the element it returns. No hover
state is ever cached from `pointermove`/`pointerover` events.

Why: this is a Lenis (inertial scroll) site. The pointer stands still while
the page glides under it; pointer events stop firing; any event-cached state
(a "View" chip, a hint) stays painted over content that has already scrolled
away. Per-frame hit-testing is exactly what the browser does for `:hover`,
and it costs one hit test per frame. Consequences that fall out of it for
free: a hint dies the instant its CTA scrolls away, gets covered, or
unmounts mid-hover (a zero-sized `getBoundingClientRect` also triggers
`setHint(null)` for SPA swaps).

Position bookkeeping:

- `tx/ty` — raw pointer (`pointermove` feeds coordinates only)
- `dx/dy` — dot, lerp 0.6 (near-instant)
- `rx/ry` — ring/chip/hint, lerp 0.18 (the lag is the design)
- velocity lean `vel = clamp((tx - rx) * 0.22, ±12)` — ring rotates
  `-5° + vel`, chip rotates `-2° + vel * 0.4`
- scales lerp at 0.2 toward per-frame targets (press/link/label states)

## The four parts

All four are `aria-hidden`, `position: fixed` in a **body portal** (`z-index:
999`, above the header at 100 and the AskOmkar pill/panel at 90/91) so no
ancestor transform can offset them and no shell scoping can hide them.

- **dot** — 6px ink square (`var(--fg)`), centered by −3px margins, 1px
  `var(--bg)` halo so it stays readable on ink surfaces (hovered inverted
  buttons). Rasterized at 2× (a 12px element with a 2px halo) and scaled
  0.5 in the JS transform — see "Anti-aliasing" below.
- **ring** — 32px wireframe square, 4px radius, 1px ink border, resting
  opacity 0.55. Trails on the slow lerp with the velocity lean. Rasterized
  at 2× (64px element, 2px border, 8px radius) and scaled 0.5 in the JS
  transform — see "Anti-aliasing" below.
- **chip** — the `[data-cursor]` label. Filled ink, Fragment Mono
  (`--mono` set explicitly — portal children sit outside every shell scope,
  so shell-scoped font vars silently resolved to nothing once), 0.62rem
  uppercase. Centered on the pointer using its **measured** `offsetWidth/
  offsetHeight` (re-measured on every text change): a fixed margin hangs the
  label off-side the moment the text is wider than ~28px.
- **hint** — the `[data-hint]` caption. Filled ink, 0.56rem mono uppercase,
  entrance rise via the `translate` property (pure translation, safe next to
  the JS transform). Anchored to the **pointer**, not the element box — on
  wide CTAs an element-anchored caption floats far from where the visitor is
  looking and reads as nobody's annotation.

### Hint placement math (per frame)

```
hx = rx + 18;  if hx + hintW > vw - 12: hx = rx - hintW - 18   // right-edge flip
if hx < 12: hx = 12                                            // hard clamp
hy = ry + 20;  if hy + hintH > vh - 12: hy = ry - hintH - 16   // floor flip
```

`vw/vh` are read from `window.innerWidth/innerHeight` every frame. The hint
is suppressed while a `[data-cursor]` chip is active (the chip already
announces the row) and while the pointer is over a form field.

## Scale discipline — why scale lives in the JS transform

The ring used to land at 1.45× the pointer position over links: the CSS
individual `scale` property composes **before** `transform`, so a scaled
element renders at `scale ×` its translated position. Fix: scale is part of
the `translate3d(...) scale(...)` string written per frame. Targets —
dot: 1.6 pressed / 0.6 over links; ring: 0.85 pressed / 1.45 over links;
chip: 1 in label mode / 0.4 otherwise.

## Anti-aliasing — the 2× raster ([1.5.5])

The dot and ring are tiny composited boxes animated at fractional pixel
offsets and rotations every frame — at their raw sizes the edges stair-step
on 1×-DPR screens, worst on the ring's 1px corner arcs. Fix: **supersample**.
`cursor.css` declares both at twice their visual size (dot 12px + 2px halo,
ring 64px + 2px border + 8px radius + 2px halo) and `Cursor.tsx` writes
`scale(visual × 0.5)` into the per-frame transform (`const SS = 0.5`). The
compositor then resamples a doubled raster at every fractional offset and
rotation, so edges render smooth. The scale lerp still works in visual
units (press 1.6×, link 1.45×, squeeze 0.85× are unchanged); the factor
folds into the written transform only. Chip and hint are text and stay 1:1
— glyphs are already anti-aliased by the font rasterizer, and scaling them
down would blur them.

## The motion preference — "Cursor: auto / on / off" (footer)

The site's motion philosophy is "always on" (Lenis, reveals, progress bar
run for everyone), but the pointer was the one piece honoring the OS
reduced-motion request — which **silently hid it, and every hint, from
visitors whose OS has "Animation effects: Off" (Windows) or Reduce Motion
(macOS/iOS)**, with no way to opt in. That was the "nah cant see any diff"
report. `MotionToggle` is the escape hatch:

- Cycles `auto → on → off`, stored in `localStorage('motion-pref')`
  (`motionPref()` defaults to `'auto'` on nothing/invalid/blocked storage).
- On every click it dispatches `window` event `'motion-pref'`; `Cursor`
  keeps that in React state, so the effect tears down / re-inits **live** —
  no reload. Unmounting removes the flag and the native cursor returns.
- The choice persists across visits. The label says "Cursor" on purpose: it
  scopes to the pointer, the only motion that consults the OS preference.
- Styled as a quiet footer link (`.motion-toggle` in `globals.css`) next to
  "Back to top ↑" on the dev site and in the /uiux credit line.

## Theming

Colors are only `var(--fg)` / `var(--bg)` — the pointer re-inks itself with
every theme (light, dark, the /uiux paper theme) for free. The 1px
`var(--bg)` halo on dot/ring/hint keeps ink readable where it crosses ink.

## Verification

Scripts live in `scripts/` and are tracked in git (since [1.5.4] — they used
to be gitignored and were rewritten from scratch every session) and run
against Playwright/chromium with real mouse simulation:

| Script | Checks | Notes |
| --- | --- | --- |
| `verify-cursor-live.py` | 30 (C1–C12) | States, flips, press, chip centering; the floor-flip case is made deterministic by spoofing `window.innerHeight` via `Object.defineProperty` |
| `verify-motion-toggle.py` | 8 | Runs against **the live deployment**: reduced-motion OS reproduces the "no diff" report (T1), one click turns the pointer on live (T2–T3), choice survives reload (T4), "off" hands back native (T5), defaults untouched (T6–T7), touch stays native (T8) |
| `verify-askomkar.py` | 13 | Chat panel behavior under the cursor system |
| `smoke-chat-cursor.py` | 6 | Cross-checks including log scroll pinning |

Evidence screenshots: `download/cursor-evidence/` (incl. the live-site
before/after pair for the reduced-motion fix).

## History

- **[1.5.5]** — the dot and ring raster at 2× their visual size and scale
  0.5 in the JS transform: anti-aliased edges at every fractional offset
  and rotation, identical geometry (see "Anti-aliasing" above).
- **[1.4.6]** `ef42f9b` — site-wide replacement (the native pointer used to
  pop back over global chrome), hints anchored to the pointer with edge/floor
  flips, chip measured centering, portal font fix.
- **[1.4.7]** `60ca4c6` — footer motion toggle; the gate treats an explicit
  visitor choice as the authority over the OS.
