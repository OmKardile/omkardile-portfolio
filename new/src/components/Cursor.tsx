'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/* Cursor — the site-wide custom pointer. Replaces the native cursor on
   EVERY route (dev portfolio, /uiux, over the AskOmkar pill and panel),
   not just inside the /uiux shell — the native pointer used to pop back
   over global chrome, which read as the custom cursor losing control.

   ONE rAF loop, ONE source of truth: every frame the loop runs
   document.elementFromPoint() at the raw pointer position and re-derives
   ALL cursor state from the element it returns. No hover state is ever
   cached from pointermove/pointerover events. That is the whole fix for
   the classic custom-cursor failure on inertial-scroll sites: the pointer
   stands still while Lenis glides the page, the events stop firing, and
   the old state (a "View" chip, a hint caption, the link grow) stays
   painted over content that has already scrolled away. Per-frame
   hit-testing is exactly what the browser does for :hover, and it costs
   one hit test per frame.

   Four parts, all decorative (aria-hidden), rendered into a body portal so
   no ancestor transform can offset them:
   - dot  — 6px ink square, tracks the pointer 1:1
   - ring — 32px wireframe square trailing on a lerp with a velocity lean;
            the row-peek card's hard-border look, shrunk to pointer size
   - chip — filled ink label ("View") over [data-cursor] targets; centered
            on the pointer with its MEASURED size (its width varies with
            the text, so a fixed margin used to leave it hanging off-side)
   - hint — small ink caption for [data-hint] CTAs whose outcome isn't
            obvious ("switch theme", "opens PDF", "pre-written answers").
            Anchored to the POINTER, not the element box: on wide CTAs an
            element-anchored caption sits far from where the visitor is
            looking, and with adjacent CTAs it reads as nobody's annotation.
            The offset (right of, below) keeps it off the button's face, it
            flips above near the viewport floor and to the left near the
            right edge. Alive only while the hit test actually returns that
            CTA, and suppressed over [data-cursor] rows, which already
            announce themselves.

   States: grows over links/buttons, becomes the chip over [data-cursor]
   rows, shows the hint beside the pointer over [data-hint] CTAs, squeezes
   on press, and fades out over form fields — typing keeps the native
   I-beam — and whenever the pointer leaves the window.

   Touch and prefers-reduced-motion keep the native cursor: the component
   no-ops and the html flag never lands. Unmounting removes the flag, so
   the native cursor returns. */

const LABEL = '[data-cursor]';
const HINT = '[data-hint]';
const FIELD = 'input, textarea, select';
const INTERACTIVE = 'a, button, [role="button"], summary';

export function Cursor() {
  const [mounted, setMounted] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const chipRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);

  useEffect(() => setMounted(true), []);

  /* Depends on `mounted`: the first pass has no portal (refs null), the
     second runs once the wrapper exists in document.body. */
  useEffect(() => {
    if (!mounted) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || calm.matches) return;

    const wrap = wrapRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const chip = chipRef.current;
    const hint = hintRef.current;
    if (!wrap || !dot || !ring || !chip || !hint) return;

    const root = document.documentElement;
    root.classList.add('ux-cursor-on');

    // Raw pointer (tx/ty) vs painted positions: the dot snaps near-instantly,
    // the ring/chip trail on a lerp — the lag IS the design. State is NEVER
    // read here; the loop re-derives it from the hit test every frame.
    let tx = -100;
    let ty = -100;
    let dx = tx;
    let dy = ty;
    let rx = tx;
    let ry = ty;
    let raf = 0;

    /* Scale lives in the JS transform, not the CSS `scale` property: the
       individual property composes BEFORE `transform`, so a scaled element
       would render at scale× the pointer position (the ring used to land at
       1.45× the pointer over links). Lerp mirrors the old CSS transition. */
    const scaleTargets = () => ({
      dot: wrap.classList.contains('is-down') ? 1.6 : wrap.classList.contains('is-link') ? 0.6 : 1,
      ring: wrap.classList.contains('is-down') ? 0.85 : wrap.classList.contains('is-link') ? 1.45 : 1,
      chip: wrap.classList.contains('is-label') ? 1 : 0.4,
    });
    let s = scaleTargets();

    /* Measured once per text change; the chip is centered with these. */
    let chipW = 0;
    let chipH = 0;
    let hintW = 0;
    let hintH = 0;
    let labelText = '';
    let hintEl: Element | null = null;

    const setHint = (el: Element | null) => {
      if (el === hintEl) return;
      hintEl = el;
      wrap.classList.toggle('is-hint', !!el);
      if (el) {
        hint.textContent = (el.getAttribute('data-hint') ?? '').trim();
        hintW = hint.offsetWidth; // measure once per show — the text just changed
        hintH = hint.offsetHeight;
      }
    };

    const loop = () => {
      /* ---- the one source of truth: what is actually under the pointer ----
         Returns null outside the document, the topmost element otherwise
         (pointer-events: none decorations are skipped, matching :hover). */
      const hit = document.elementFromPoint(tx, ty);
      const overField = !!hit?.closest?.(FIELD);
      const inside = !!hit && !overField; // fields keep the native I-beam
      const labelEl = inside ? (hit as Element).closest(LABEL) : null;
      const nextLabel = (labelEl?.getAttribute('data-cursor') ?? '').trim();

      wrap.classList.toggle('is-out', !inside);
      wrap.classList.toggle('is-label', !!labelEl);
      wrap.classList.toggle(
        'is-link',
        inside && !labelEl && !!(hit as Element).closest?.(INTERACTIVE),
      );

      if (nextLabel !== labelText) {
        labelText = nextLabel;
        chip.textContent = nextLabel;
        chipW = chip.offsetWidth;
        chipH = chip.offsetHeight;
      }

      /* The hint re-derives from the SAME hit test: only alive while the
         pointer genuinely sits on the CTA, so it dies the moment the CTA
         scrolls away, unmounts, or gets covered by another surface. */
      setHint(inside && !labelEl ? (hit as Element).closest(HINT) : null);

      dx += (tx - dx) * 0.6;
      dy += (ty - dy) * 0.6;
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      const vel = Math.max(-12, Math.min(12, (tx - rx) * 0.22));
      const t = scaleTargets();
      for (const k of ['dot', 'ring', 'chip'] as const) {
        s[k] += (t[k] - s[k]) * 0.2;
        if (Math.abs(s[k] - t[k]) < 0.001) s[k] = t[k];
      }
      dot.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${s.dot.toFixed(3)})`;
      ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) rotate(${(-5 + vel).toFixed(2)}deg) scale(${s.ring.toFixed(3)})`;
      /* chip centered on the pointer by measured size — a fixed margin
         hangs it off-side the moment the text is wider than ~28px */
      chip.style.transform = `translate3d(${(rx - chipW / 2).toFixed(1)}px, ${(ry - chipH / 2).toFixed(1)}px, 0) rotate(${(-2 + vel * 0.4).toFixed(2)}deg) scale(${s.chip.toFixed(3)})`;

      /* Hint: rides BESIDE THE POINTER (right of, below) so the caption is
         visually glued to the thing being pointed at — the visitor's eye is
         already on the cursor, and on wide CTAs an element-anchored caption
         floated too far away to read as belonging to anything. Flips above
         the pointer near the viewport floor and to its left near the right
         edge; the ring's lerped position drives it so it glides, not jitters. */
      if (hintEl) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const r = hintEl.getBoundingClientRect();
        if (!r.width && !r.height) {
          setHint(null); // unmounted mid-hover (SPA swap)
        } else {
          let hx = rx + 18;
          if (hx + hintW > vw - 12) hx = rx - hintW - 18;
          if (hx < 12) hx = 12;
          let hy = ry + 20;
          if (hy + hintH > vh - 12) hy = ry - hintH - 16;
          hint.style.transform = `translate3d(${hx.toFixed(1)}px, ${hy.toFixed(1)}px, 0)`;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    /* pointermove only feeds coordinates and the "pointer is live" flag —
       every state decision lives in the loop above. */
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      wrap.classList.add('is-in');
    };
    const onDown = () => wrap.classList.add('is-down');
    const onUp = () => wrap.classList.remove('is-down');
    const onLeave = () => wrap.classList.remove('is-in');
    const onBlur = () => wrap.classList.remove('is-in');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    root.addEventListener('mouseleave', onLeave);
    window.addEventListener('blur', onBlur);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      root.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('blur', onBlur);
      root.classList.remove('ux-cursor-on');
    };
  }, [mounted]);

  if (!mounted) return null;
  return createPortal(
    <div ref={wrapRef} className="ux-cursor" aria-hidden="true">
      <span ref={ringRef} className="ux-cursor-ring" />
      <span ref={chipRef} className="ux-cursor-chip" />
      <span ref={hintRef} className="ux-cursor-hint" />
      <span ref={dotRef} className="ux-cursor-dot" />
    </div>,
    document.body,
  );
}
