'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/* Apple-style scroll reveal. Elements tagged [data-reveal] fade/rise the
   first time they enter the viewport; children of [data-reveal-group] do the
   same with a CSS-driven stagger (nth-child transition delays).

   The hidden state is gated on the `js-reveal` class, which a tiny inline
   script in <head> adds before first paint — so content animates in cleanly
   on load, while users without JS (and reduced-motion users, via CSS) always
   see everything. Re-runs per pathname so SPA navigations re-arm the
   observer for the new page's elements. */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('js-reveal');

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-group]'),
    );

    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach((t) => t.classList.add('revealed'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );

    targets.forEach((t) => {
      if (!t.classList.contains('revealed')) io.observe(t);
    });

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
