'use client';

import { useEffect } from 'react';

/* UiuxMotion — the /uiux route's motion layer. Vanilla rAF/IO only, no
   dependencies, transform/opacity only. Mounted once per page inside
   UiuxShell (the shell remounts on SPA navigation, so every bind is fresh).

   Subsystems:
   1. Per-char reveal — [data-chars] elements split into .ux-ch > .ux-ch-i
      spans with a --ci index; .chars-in lands on first viewport entry and
      CSS staggers the rise (hero name lines).
   2. Scroll scrub — ONE rAF loop drives every scroll-linked custom property:
        --vskew  scroll-velocity lean (deg), smoothed, decays to 0
        --vvel   normalized scroll speed (0..1), for velocity shear
        --hx     hero exit progress (0..1) on .ux-hero — the scrub-exit
        --scrub  viewport progress (-1..1, center = 0) on [data-scrub]
        --drift  same progress, for [data-drift] ghost numerals
      Sections join/leave the measurement via IntersectionObserver, so
      off-screen work costs nothing. Coarse pointers get bigger gains —
      phones get the loud version (see uiux.css, "mobile scrub").
   3. Cursor-following peeks — [data-peek] rows feed --mx/--my on pointermove
      so the wireframe card trails the cursor; fine pointers only. */

const SKEW_GAIN_FINE = 0.28;
const SKEW_GAIN_COARSE = 0.4;
const SKEW_MAX_FINE = 4; // deg
const SKEW_MAX_COARSE = 7; // deg — phones lean harder

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

/* --- 2. scroll scrub — one loop for every scroll-linked var -------------- */

function bindScrub(shell: HTMLElement): () => void {
  const hero = shell.querySelector<HTMLElement>('.ux-hero');
  const scrubs = Array.from(shell.querySelectorAll<HTMLElement>('[data-scrub]'));
  const drifts = Array.from(shell.querySelectorAll<HTMLElement>('[data-drift]')).map((el) => ({
    el,
    visible: false,
  }));
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  let raf = 0;
  let last = window.scrollY;
  let skew = 0;
  let vel = 0;
  let heroLive = false;
  const scrubLive = new Map<HTMLElement, boolean>();

  let io: IntersectionObserver | null = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (el === hero) heroLive = entry.isIntersecting;
          if (scrubLive.has(el)) scrubLive.set(el, entry.isIntersecting);
          const d = drifts.find((x) => x.el === el);
          if (d) d.visible = entry.isIntersecting;
        }
      },
      { rootMargin: '14% 0px 14% 0px' },
    );
    if (hero) io.observe(hero);
    for (const el of scrubs) {
      scrubLive.set(el, false);
      io.observe(el);
    }
    for (const d of drifts) io.observe(d.el);
  }

  const progress = (r: DOMRect, vh: number) =>
    (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);

  const loop = () => {
    const vh = window.innerHeight;

    // Velocity → lean + normalized speed.
    const y = window.scrollY;
    const delta = y - last;
    last = y;
    const gain = coarse ? SKEW_GAIN_COARSE : SKEW_GAIN_FINE;
    const max = coarse ? SKEW_MAX_COARSE : SKEW_MAX_FINE;
    const target = Math.max(-max, Math.min(max, delta * gain));
    skew += (target - skew) * 0.1;
    if (Math.abs(skew) < 0.01) skew = 0;
    shell.style.setProperty('--vskew', `${skew.toFixed(3)}deg`);
    const speed = Math.min(1, Math.abs(delta) / (coarse ? 55 : 70));
    vel += (speed - vel) * 0.12;
    if (vel < 0.01) vel = 0;
    shell.style.setProperty('--vvel', vel.toFixed(3));

    if (vh > 0) {
      // Hero scrub-exit: 0 while the hero is intact, →1 as it leaves.
      if (hero && heroLive) {
        const r = hero.getBoundingClientRect();
        const exit = Math.max(0, Math.min(1, (64 - r.top) / (r.height * 0.9)));
        hero.style.setProperty('--hx', exit.toFixed(4));
      }
      for (const [el, live] of scrubLive) {
        if (!live) continue;
        const p = Math.max(-1, Math.min(1, progress(el.getBoundingClientRect(), vh)));
        el.style.setProperty('--scrub', p.toFixed(4));
      }
      for (const { el, visible } of drifts) {
        if (!visible) continue;
        const p = Math.max(-1, Math.min(1, progress(el.getBoundingClientRect(), vh)));
        el.style.setProperty('--drift', p.toFixed(3));
      }
    }

    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    io?.disconnect();
    shell.style.removeProperty('--vskew');
    shell.style.removeProperty('--vvel');
    hero?.style.removeProperty('--hx');
    for (const el of scrubs) el.style.removeProperty('--scrub');
    for (const { el } of drifts) el.style.removeProperty('--drift');
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

export function UiuxMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const shell = root.querySelector<HTMLElement>('.ux-shell');
    if (!shell) return;

    const cleanups: (() => void)[] = [];
    const offChars = bindChars(shell);
    if (offChars) cleanups.push(offChars);
    cleanups.push(bindScrub(shell));
    const offPeeks = bindPeeks(shell);
    if (offPeeks) cleanups.push(offPeeks);

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
