'use client';

import { useEffect } from 'react';

/* Fires `motion:ready` on window once THIS page segment has hydrated.

   Why it exists: layout-mounted client components (MotionCraft) run their
   effects when the layout shell hydrates — which can be BEFORE the routed
   page's segment hydrates (Next streams and hydrates segments separately).
   Any DOM mutation MotionCraft makes on page elements at that point (word
   splitting, curtain classes) is thrown away when React detects the
   mismatch and re-renders the page segment client-side.

   Effects run deepest-first within a commit, so a sentinel placed at the
   very end of the page runs AFTER the page content above it is committed;
   the setTimeout hands the dispatch a macrotask so a listener mounted in
   the same hydration pass (shallower layout component) is guaranteed to be
   attached first. */
export function MotionReady() {
  useEffect(() => {
    const t = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('motion:ready'));
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  return null;
}
