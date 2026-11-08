'use client';

import { useEffect, useState } from 'react';

/* MotionToggle — cursor motion preference toggle in the footer.

   The site's motion philosophy is "always on" (Lenis, reveals and the
   progress bar run for every visitor — see SmoothScroll). The custom
   pointer is the ONE piece that still respects the OS reduced-motion
   request — which silently hid it from visitors whose OS has "Animation
   effects: Off" (Windows) or Reduce Motion (macOS/iOS): they got a native
   cursor, no hint chips, and none of the pointer work, with no way to
   opt in. The toggle is the escape hatch.

   It stores an explicit choice in localStorage('motion-pref'):
     auto — follow the OS (prefers-reduced-motion). Default.
     on   — full pointer motion even if the OS asks for reduced.
     off  — native cursor even if the OS allows motion.

   Cursor.tsx reads the choice on mount and re-evaluates LIVE on the
   'motion-pref' event — no reload. The label says "Cursor" on purpose:
   the toggle currently scopes to the pointer, not to site-wide motion. */

export type MotionPref = 'auto' | 'on' | 'off';
export const MOTION_KEY = 'motion-pref';

const ORDER: MotionPref[] = ['auto', 'on', 'off'];
const LABEL: Record<MotionPref, string> = {
  auto: 'Cursor: auto',
  on: 'Cursor: on',
  off: 'Cursor: off',
};

/** The stored choice, defaulting to 'auto' when nothing (or something
    invalid) is stored. Storage being blocked just means 'auto'. */
export function motionPref(): MotionPref {
  try {
    const v = localStorage.getItem(MOTION_KEY);
    if (v === 'on' || v === 'off') return v;
  } catch {
    /* private mode / storage blocked — fall through to 'auto' */
  }
  return 'auto';
}

export function MotionToggle() {
  // SSR renders 'auto'; the real choice is synced after mount (no hydration
  // mismatch — the label just settles one tick later).
  const [pref, setPref] = useState<MotionPref>('auto');

  useEffect(() => setPref(motionPref()), []);

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(pref) + 1) % ORDER.length];
    setPref(next);
    try {
      localStorage.setItem(MOTION_KEY, next);
    } catch {
      /* private mode: still apply for this session */
    }
    window.dispatchEvent(new Event('motion-pref'));
  };

  return (
    <button
      type="button"
      className="motion-toggle"
      onClick={cycle}
      aria-label={`Cursor motion preference: ${pref}. Click to change.`}
    >
      {LABEL[pref]}
    </button>
  );
}
