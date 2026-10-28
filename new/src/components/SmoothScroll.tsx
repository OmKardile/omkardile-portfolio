'use client';

import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/* Inertial "buttery" scrolling — the glide you feel on apple.com and
   awwwards-grade sites. Lenis intercepts wheel input and lerps the scroll
   position with an expo-out ease, so the page glides instead of stepping.

   - Touch devices keep native scrolling (syncTouch off by default): phones
     already have momentum, hijacking it feels worse.
   - prefers-reduced-motion users get the untouched native scroll.
   - `anchors: true` routes same-page #hash clicks through lenis.scrollTo so
     the nav links glide too; cross-page hashes (/uiux -> /#work) still land
     via the browser's own jump on the fresh load.
   - On SPA route changes Next resets scroll instantly; we re-sync Lenis so
     the lerp doesn't fight the reset.
   - The html.lenis rules in globals.css neutralize CSS scroll-behavior while
     the engine owns the scroll. */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: true,
    });
    lenisRef.current = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Re-sync after SPA route changes (Next jumps to top instantly).
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
