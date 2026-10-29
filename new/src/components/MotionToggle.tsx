'use client';

import { useEffect, useState } from 'react';

/* Motion preference toggle in the footer. Cycles three states:
   auto  — follow the OS (prefers-reduced-motion). Default.
   on    — full motion even if the OS asks for reduced. This is the escape
           hatch for owners whose OS has "Animation effects: Off" (Windows)
           or Reduce Motion (macOS/iOS): without it the whole site —
           transitions, accordion expand, inertial scroll — silently runs
           in reduced mode and the smoothness is invisible.
   off   — reduced motion even if the OS allows it.

   The choice lives in localStorage('motion-pref') and the inline <head>
   script applies the html.motion-off class BEFORE first paint (no flash).
   This component applies it again on click for live switching, and pings
   'motion-pref' so SmoothScroll can start/stop Lenis without a reload. */

export type MotionPref = 'auto' | 'on' | 'off';

const KEY = 'motion-pref';
const ORDER: MotionPref[] = ['auto', 'on', 'off'];

const LABEL: Record<MotionPref, string> = {
  auto: 'Motion: auto',
  on: 'Motion: on',
  off: 'Motion: off',
};

/** Effective reduced-motion state: the explicit choice, else the OS setting. */
export function prefersReducedMotion(): boolean {
  let pref: string | null = null;
  try {
    pref = localStorage.getItem(KEY);
  } catch {
    /* storage blocked — fall through to OS setting */
  }
  if (pref === 'off') return true;
  if (pref === 'on') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function applyMotionClass() {
  document.documentElement.classList.toggle('motion-off', prefersReducedMotion());
  window.dispatchEvent(new CustomEvent('motion-pref'));
}

export function MotionToggle() {
  // SSR renders 'auto'; the real choice is synced after mount (no hydration
  // mismatch — the label just settles one tick later).
  const [pref, setPref] = useState<MotionPref>('auto');

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {
      /* ignore */
    }
    if (stored === 'on' || stored === 'off') setPref(stored);
  }, []);

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(pref) + 1) % ORDER.length];
    setPref(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* private mode: still apply for this session */
    }
    applyMotionClass();
  };

  return (
    <button
      type="button"
      className="motion-toggle"
      onClick={cycle}
      aria-label={`Motion preference: ${LABEL[pref]}. Click to change.`}
    >
      {LABEL[pref]}
    </button>
  );
}
