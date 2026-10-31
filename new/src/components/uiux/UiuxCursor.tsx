'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/* UiuxCursor — the /uiux route's custom pointer. Replaces the native cursor
   inside .ux-shell (the shell subtree gets `cursor: none` via the
   html.ux-cursor-on flag this component sets) on fine-pointer devices only.

   Four parts, all decorative and aria-hidden, rendered in a body portal so
   no ancestor transform can offset them:
   - dot  — 6px ink square, tracks the pointer 1:1
   - ring — 32px wireframe square that lags behind with a velocity lean;
            the row-peek card's hard-border look, shrunk to pointer size
   - chip — filled ink label (Space Mono caps) shown over [data-cursor]
            targets instead of dot+ring
   - hint — small filled ink caption anchored to [data-hint] CTAs: a quiet
            guide for actions whose outcome isn't obvious ("opens mail
            app", "switch theme"). Anchored to the ELEMENT's box, not the
            pointer — a pointer-chasing chip always lands on top of the
            button it names. Never shown over [data-cursor] rows, which
            already announce themselves

   States: grows over links/buttons, morphs into the chip over
   [data-cursor="VIEW"] rows, shows the hint chip below (or above, near the
   floor) the hovered [data-hint] element, scales down on press, fades out
   over global chrome outside .ux-shell (the AskOmkar pill keeps its native
   pointer) and whenever the pointer leaves the window.

   Touch and prefers-reduced-motion keep the native cursor: the component
   no-ops and the html flag never lands. Unmounting (SPA navigation away
   from /uiux) removes the flag, so the native cursor returns. */

const INTERACTIVE = 'a, button, [role="button"], summary, input, textarea, select';

export function UiuxCursor() {
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

    // Pointer target vs painted positions: the dot snaps near-instantly,
    // the ring/chip trail on a lerp — the lag IS the design.
    let tx = -100;
    let ty = -100;
    let dx = -100;
    let dy = -100;
    let rx = -100;
    let ry = -100;
    let label = '';
    let raf = 0;

    /* Scale lives in the JS transform, not the CSS `scale` property: the
       individual property composes BEFORE `transform`, so a scaled element
       would render at scale× the pointer position (the ring used to land at
       1.45× the pointer over links). Lerp mirrors the old CSS transition. */
    const target = {
      dot: () => (wrap.classList.contains('is-down') ? 1.6 : wrap.classList.contains('is-link') ? 0.6 : 1),
      ring: () => (wrap.classList.contains('is-down') ? 0.85 : wrap.classList.contains('is-link') ? 1.45 : 1),
      chip: () => (wrap.classList.contains('is-label') ? 1 : 0.4),
    };
    const s = { dot: target.dot(), ring: target.ring(), chip: target.chip() };

    /* The hint guide — bound to the ELEMENT via pointerover delegation.
       Moving to a non-hint target re-fires pointerover and hides it, so
       no pointerout bookkeeping is needed. */
    let hintEl: Element | null = null;
    let hintW = 0;
    let hintH = 0;
    const showHint = (el: Element | null) => {
      if (el === hintEl) return;
      hintEl = el;
      wrap.classList.toggle('is-hint', !!el);
      if (!el) return;
      hint.textContent = (el.getAttribute('data-hint') ?? '').trim();
      hintW = hint.offsetWidth; // measure once per show — the text just changed
      hintH = hint.offsetHeight;
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const inside = !!t?.closest?.('.ux-shell');
      const labelEl = inside ? t?.closest?.('[data-cursor]') : null;
      /* [data-cursor] rows already announce themselves — they never grow one */
      showHint(inside && !labelEl ? (t?.closest?.('[data-hint]') ?? null) : null);
    };
    window.addEventListener('pointerover', onOver, { passive: true });

    const loop = () => {
      dx += (tx - dx) * 0.6;
      dy += (ty - dy) * 0.6;
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      const vel = Math.max(-12, Math.min(12, (tx - rx) * 0.22));
      for (const k of ['dot', 'ring', 'chip'] as const) {
        s[k] += (target[k]() - s[k]) * 0.2;
        if (Math.abs(s[k] - target[k]()) < 0.001) s[k] = target[k]();
      }
      dot.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${s.dot.toFixed(3)})`;
      ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) rotate(${(-5 + vel).toFixed(2)}deg) scale(${s.ring.toFixed(3)})`;
      chip.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) rotate(${(-2 + vel * 0.4).toFixed(2)}deg) scale(${s.chip.toFixed(3)})`;

      /* Hint: anchored to its element, re-read every frame so it sticks to
         the CTA while the page glides under it (Lenis) and drops the
         moment the element scrolls out of reach or unmounts (SPA nav).
         Below the element's left edge by default — never on top of it;
         flips above near the viewport floor; clamps at the side edges. */
      if (hintEl) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const r = hintEl.getBoundingClientRect();
        if ((!r.width && !r.height) || r.bottom < -8 || r.top > vh + 8) {
          showHint(null);
        } else {
          let hx = r.left;
          if (hx + hintW > vw - 12) hx = vw - 12 - hintW;
          if (hx < 12) hx = 12;
          let hy = r.bottom + 10;
          if (hy + hintH > vh - 12) hy = r.top - hintH - 10;
          hint.style.transform = `translate3d(${hx.toFixed(1)}px, ${hy.toFixed(1)}px, 0)`;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const t = e.target as Element | null;
      const inside = !!t?.closest?.('.ux-shell');
      const labelEl = inside ? t?.closest?.('[data-cursor]') : null;
      const next = (labelEl?.getAttribute('data-cursor') ?? '').trim();
      wrap.classList.toggle('is-out', !inside);
      wrap.classList.toggle('is-label', !!next);
      wrap.classList.toggle(
        'is-link',
        inside && !labelEl && !!t?.closest?.(INTERACTIVE),
      );
      if (next !== label) {
        label = next;
        chip.textContent = label;
      }
      wrap.classList.add('is-in');
    };
    const onDown = () => wrap.classList.add('is-down');
    const onUp = () => wrap.classList.remove('is-down');
    const onLeave = () => wrap.classList.remove('is-in');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    root.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      root.removeEventListener('mouseleave', onLeave);
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
