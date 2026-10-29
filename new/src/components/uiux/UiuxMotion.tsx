'use client';

import { useEffect } from 'react';

/* UiuxMotion — the /uiux route's motion layer. Vanilla rAF/IO only, no
   dependencies, transform/opacity only. Mounted once per page inside
   UiuxShell (the shell remounts on SPA navigation, so every bind is fresh).

   Subsystems:
   1. Per-char reveal — [data-chars] elements split into .ux-ch > .ux-ch-i
      spans with a --ci index; .chars-in lands on first viewport entry and
      CSS staggers the rise (hero name lines).
   2. Scroll-velocity skew — a rAF loop turns scrollY delta into a smoothed
      --vskew angle on the shell; [data-skew] elements read it in CSS and
      lean with the scroll. Decays to 0 when the scroll stops.
   3. Cursor-following peeks — [data-peek] rows feed --mx/--my on pointermove
      so the wireframe card trails the cursor; fine pointers only.
   4. Ghost-numeral drift — [data-drift] elements get --drift (-1..1) from
      their viewport position, scrolled on a rAF while visible. */

const SKEW_MAX = 4; // deg

/* --- 1. per-char split -------------------------------------------------- */

function splitChars(el: HTMLElement): number {
  const text = el.textContent ?? '';
  let count = 0;
  const frag = document.createDocumentFragment();

  for (const ch of text) {
    if (ch === ' ') {
      frag.appendChild(document.createTextNode(' '));
      continue;
    }
    const mask = document.createElement('span');
    mask.className = 'ux-ch';
    const inner = document.createElement('span');
    inner.className = 'ux-ch-i';
    inner.textContent = ch;
    inner.style.setProperty('--ci', String(count));
    mask.appendChild(inner);
    frag.appendChild(mask);
    count += 1;
  }

  el.textContent = '';
  el.appendChild(frag);
  return count;
}

function bindChars(root: ParentNode): (() => void) | null {
  const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-chars]'));
  if (!targets.length || !('IntersectionObserver' in window)) return null;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('chars-in');
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.25 },
  );

  for (const el of targets) {
    if (el.dataset.charsDone) continue;
    el.dataset.charsDone = '1';
    if (!splitChars(el)) continue;
    io.observe(el);
  }

  return () => io.disconnect();
}

/* --- 2. scroll-velocity skew -------------------------------------------- */

function bindVelocitySkew(root: HTMLElement): () => void {
  let raf = 0;
  let last = window.scrollY;
  let cur = 0;

  const loop = () => {
    const y = window.scrollY;
    const delta = y - last;
    last = y;
    const target = Math.max(-SKEW_MAX, Math.min(SKEW_MAX, delta * 0.28));
    cur += (target - cur) * 0.1;
    if (Math.abs(cur) < 0.01) cur = 0;
    root.style.setProperty('--vskew', `${cur.toFixed(3)}deg`);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    root.style.removeProperty('--vskew');
  };
}

/* --- 3. cursor-following peeks ------------------------------------------ */

function bindPeeks(root: ParentNode): (() => void) | null {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return null;
  const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-peek]'));
  if (!rows.length) return null;

  const cleanups = rows.map((row) => {
    const onMove = (e: PointerEvent) => {
      const r = row.getBoundingClientRect();
      row.style.setProperty('--mx', `${(e.clientX - r.left).toFixed(1)}px`);
      row.style.setProperty('--my', `${(e.clientY - r.top).toFixed(1)}px`);
    };
    row.addEventListener('pointermove', onMove);
    return () => {
      row.removeEventListener('pointermove', onMove);
      row.style.removeProperty('--mx');
      row.style.removeProperty('--my');
    };
  });

  return () => cleanups.forEach((fn) => fn());
}

/* --- 4. ghost-numeral drift ---------------------------------------------- */

function bindDrift(root: ParentNode): (() => void) | null {
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-drift]'));
  if (!els.length || !('IntersectionObserver' in window)) return null;

  const state = els.map((el) => ({ el, visible: false }));
  let raf = 0;

  const update = () => {
    raf = 0;
    const vh = window.innerHeight;
    for (const { el, visible } of state) {
      if (!visible) continue;
      const r = el.getBoundingClientRect();
      const progress = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));
      el.style.setProperty('--drift', clamped.toFixed(3));
    }
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const item = state.find((s) => s.el === entry.target);
        if (item) item.visible = entry.isIntersecting;
      }
      onScroll();
    },
    { rootMargin: '10% 0px 10% 0px' },
  );
  state.forEach((s) => io.observe(s.el));
  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    io.disconnect();
    window.removeEventListener('scroll', onScroll);
    if (raf) cancelAnimationFrame(raf);
    state.forEach((s) => s.el.style.removeProperty('--drift'));
  };
}

export function UiuxMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const shell = root.querySelector<HTMLElement>('.ux-shell');
    if (!shell) return;

    const cleanups: (() => void)[] = [];
    const offChars = bindChars(shell);
    if (offChars) cleanups.push(offChars);
    cleanups.push(bindVelocitySkew(shell));
    const offPeeks = bindPeeks(shell);
    if (offPeeks) cleanups.push(offPeeks);
    const offDrift = bindDrift(shell);
    if (offDrift) cleanups.push(offDrift);

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
