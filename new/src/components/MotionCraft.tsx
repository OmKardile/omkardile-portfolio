'use client';

import { useEffect, useRef } from 'react';

/* MotionCraft — the site-wide motion layer. Vanilla rAF/IO/WAAPI only (no
   dependencies), and every subsystem is gated on the same authority the rest
   of the site reads: html.motion-off (the footer toggle) or
   prefers-reduced-motion. All work is transform/opacity/clip-path on
   compositor-friendly properties; nothing animates layout.

   Subsystems:
   1. Scroll progress hairline — #scroll-progress scaleX 0→1 (layout-owned,
      binds at mount).
   2. Split-text reveal — [data-split] headings rise word by word, inside
      overflow masks, the first time they enter the viewport.
   3. Figure curtain + drift — .relay-fig covers wipe open (clip-path) on
      entry, then drift on a subtle scroll-linked parallax (base scale 1.06
      keeps the rounded corners covered).
   4. Magnetic CTAs — [data-magnetic] elements lean toward the pointer on
      fine pointers only, and spring back on leave.

   Hydration contract: subsystems 2–4 MUTATE page elements (word spans,
   classes). The routed page's segment can hydrate after this layout-level
   component, and React discards mutated nodes it considers mismatched. So
   all page-element binding waits for the `motion:ready` event that
   <MotionReady /> (mounted as the last child of each page) dispatches once
   that page has hydrated. See MotionReady.tsx for the full story. */

function motionOff() {
  return (
    document.documentElement.classList.contains('motion-off') ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/* --- 2. split text ---------------------------------------------------- */

function splitEl(el: HTMLElement): HTMLElement[] {
  const words: HTMLElement[] = [];

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? '';
      if (!text.trim()) return;
      const frag = document.createDocumentFragment();
      for (const part of text.split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(' '));
          continue;
        }
        const mask = document.createElement('span');
        mask.className = 'sw';
        const inner = document.createElement('span');
        inner.className = 'sw-i';
        inner.textContent = part;
        mask.appendChild(inner);
        frag.appendChild(mask);
        words.push(inner);
      }
      node.parentNode?.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const child = node as Element;
      if (child.matches('script, style, [aria-hidden="true"], .sw')) return;
      Array.from(child.childNodes).forEach(walk);
    }
  };

  Array.from(el.childNodes).forEach(walk);
  words.forEach((w, i) => w.style.setProperty('--swi', String(i)));
  return words;
}

function bindSplits(root: ParentNode): (() => void)[] {
  const cleanups: (() => void)[] = [];
  const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-split]'));
  if (!targets.length || !('IntersectionObserver' in window)) return cleanups;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        // Let the headline settle into place first, then rise the words.
        window.setTimeout(() => el.classList.add('split-in'), 90);
        io.unobserve(el);
      }
    },
    { threshold: 0.18 },
  );

  for (const el of targets) {
    if (el.dataset.splitDone || el.querySelector('.sw')) continue;
    el.dataset.splitDone = '1';
    const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
    const words = splitEl(el);
    if (!words.length) continue;
    el.setAttribute('aria-label', text);
    io.observe(el);
  }

  cleanups.push(() => io.disconnect());
  return cleanups;
}

/* --- 4. magnetic ------------------------------------------------------ */

function bindMagnetic(el: HTMLElement) {
  const strength = 0.22;
  const max = 9; // px — keep the lean subtle
  let raf = 0;
  let tx = 0;
  let ty = 0;

  const apply = () => {
    el.style.setProperty('--mag-x', `${tx.toFixed(2)}px`);
    el.style.setProperty('--mag-y', `${ty.toFixed(2)}px`);
    raf = 0;
  };

  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    tx = Math.max(-max, Math.min(max, (e.clientX - (r.left + r.width / 2)) * strength));
    ty = Math.max(-max, Math.min(max, (e.clientY - (r.top + r.height / 2)) * strength));
    el.classList.add('mag-live');
    if (!raf) raf = requestAnimationFrame(apply);
  };

  const onLeave = () => {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    el.classList.remove('mag-live');
    tx = 0;
    ty = 0;
    apply();
  };

  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerleave', onLeave);
  return () => {
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerleave', onLeave);
    if (raf) cancelAnimationFrame(raf);
    el.classList.remove('mag-live');
    el.style.removeProperty('--mag-x');
    el.style.removeProperty('--mag-y');
  };
}

/* --- 3. parallax ------------------------------------------------------ */

function bindParallax(el: HTMLElement) {
  const strength = Math.min(Math.abs(parseFloat(el.dataset.parallax || '0.07')), 0.14);
  let visible = false;
  let raf = 0;

  const update = () => {
    raf = 0;
    if (!visible) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // -1 (just below the fold) → 1 (just above), 0 = centered
    const progress = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
    const clamped = Math.max(-1, Math.min(1, progress));
    el.style.setProperty('--parallax-y', `${(-clamped * strength * 100).toFixed(2)}px`);
  };

  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };

  const io = new IntersectionObserver(
    (entries) => {
      visible = entries.some((en) => en.isIntersecting);
      if (visible) onScroll();
    },
    { rootMargin: '12% 0px 12% 0px' },
  );
  io.observe(el);
  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    io.disconnect();
    window.removeEventListener('scroll', onScroll);
    if (raf) cancelAnimationFrame(raf);
    el.style.removeProperty('--parallax-y');
  };
}

/* --- 1. scroll progress ---------------------------------------------- */

function bindProgress(bar: HTMLElement) {
  let raf = 0;
  const update = () => {
    raf = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    bar.style.transform = `scaleX(${p.toFixed(4)})`;
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    if (raf) cancelAnimationFrame(raf);
    bar.style.transform = 'scaleX(0)';
  };
}

export function MotionCraft() {
  const pageCleanups = useRef<(() => void)[]>([]);

  useEffect(() => {
    if (motionOff()) return;

    /* 1 — progress hairline: layout-owned element, binds once. */
    const bar = document.getElementById('scroll-progress');
    const offBar = bar ? bindProgress(bar) : null;

    /* 2–4 — page-element bindings, (re)armed each time a page hydrates. */
    const onPageReady = () => {
      // A previously armed page's cleanups first (SPA navigation).
      pageCleanups.current.forEach((fn) => fn());
      pageCleanups.current = [];

      const root = document.documentElement;
      pageCleanups.current.push(...bindSplits(root));

      if ('IntersectionObserver' in window) {
        for (const img of Array.from(root.querySelectorAll<HTMLElement>('.relay-fig[data-curtain] img'))) {
          pageCleanups.current.push(bindParallax(img));
        }

        const curtainIo = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              entry.target.classList.add('curtain-in');
              curtainIo.unobserve(entry.target);
            }
          },
          { threshold: 0.25 },
        );
        for (const fig of Array.from(root.querySelectorAll<HTMLElement>('.relay-fig[data-curtain]'))) {
          curtainIo.observe(fig);
        }
        pageCleanups.current.push(() => curtainIo.disconnect());
      }

      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        for (const el of Array.from(root.querySelectorAll<HTMLElement>('[data-magnetic]'))) {
          pageCleanups.current.push(bindMagnetic(el));
        }
      }
    };

    window.addEventListener('motion:ready', onPageReady);
    // A page may have dispatched before this listener attached (e.g. hot
    // reload remounting only the layout component) — arm for the current
    // DOM if its sentinel is already done. Cheap idempotent check: splits
    // and magnetics guard themselves.
    // (Dispatch is deferred by MotionReady, so this double-arm is rare.)
    window.setTimeout(() => {
      if (document.querySelector('[data-split]:not([data-split-done])')) onPageReady();
    }, 300);

    return () => {
      window.removeEventListener('motion:ready', onPageReady);
      offBar?.();
      pageCleanups.current.forEach((fn) => fn());
      pageCleanups.current = [];
    };
  }, []);

  return null;
}
