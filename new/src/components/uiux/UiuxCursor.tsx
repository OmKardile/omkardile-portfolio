'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/* UiuxCursor — the /uiux route's custom pointer. Replaces the native cursor
   inside .ux-shell (the shell subtree gets `cursor: none` via the
   html.ux-cursor-on flag this component sets) on fine-pointer devices only.

   Three parts, all decorative and aria-hidden, rendered in a body portal so
   no ancestor transform can offset them:
   - dot  — 6px ink square, tracks the pointer 1:1
   - ring — 32px wireframe square that lags behind with a velocity lean;
            the row-peek card's hard-border look, shrunk to pointer size
   - chip — filled ink label (Space Mono caps) shown over [data-cursor]
            targets instead of dot+ring

   States: grows over links/buttons, morphs into the chip over
   [data-cursor="VIEW"] rows, scales down on press, fades out over global
   chrome outside .ux-shell (the AskOmkar pill keeps its native pointer)
   and whenever the pointer leaves the window.

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
    if (!wrap || !dot || !ring || !chip) return;

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

    const loop = () => {
      dx += (tx - dx) * 0.6;
      dy += (ty - dy) * 0.6;
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      const vel = Math.max(-12, Math.min(12, (tx - rx) * 0.22));
      dot.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) rotate(${(-5 + vel).toFixed(2)}deg)`;
      chip.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) rotate(${(-2 + vel * 0.4).toFixed(2)}deg)`;
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
      <span ref={dotRef} className="ux-cursor-dot" />
    </div>,
    document.body,
  );
}
