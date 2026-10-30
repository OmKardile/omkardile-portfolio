'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/* Apple-style scroll reveal. Elements tagged [data-reveal] fade/rise the
   first time they enter the viewport; children of [data-reveal-group] do the
   same with a CSS-driven stagger (nth-child transition delays).

   The hidden state is gated on the `js-reveal` class, which a tiny inline
   script in <head> adds before first paint — so content animates in cleanly
   on load, while users without JS always see everything. Motion is always
   enabled (no reduced-motion gate).

   ── Why this effect re-arms itself three ways ────────────────────────────
   The observer must survive every way content can appear LATER than this
   layout-level effect:

   1. pathname effect — re-arms on route change. But with the root
      loading.tsx boundary, usePathname flips while the loading skeleton is
      still mounted; the scan then finds nothing, and when the real page
      streams in a beat later nothing is observing it. That exact race made
      every [data-reveal] on /uiux stay at opacity:0 forever (reproduced:
      18 stuck elements after a home → /uiux SPA nav), invisible even after
      scrolling.

   2. MutationObserver — watches the document for inserted nodes and arms
      any [data-reveal] that arrives after the effect ran. This covers the
      loading-skeleton swap, streamed segments landing after hydration on
      slow mobile networks, and any future lazy content. rAF-batched; the
      scan is one cheap querySelectorAll and arm() is idempotent.

   3. Failsafe sweep — while any armed element is still unrevealed, a
      passive scroll/resize listener (plus pageshow for bfcache restores and
      two timed passes) directly reveals elements currently inside the
      viewport. IntersectionObserver remains the primary trigger; the sweep
      only exists so "invisible even after scroll" is structurally
      impossible — on old WebViews, frozen IOs, or whatever else a real
      phone throws at this. */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('js-reveal');

    const SELECTOR = '[data-reveal], [data-reveal-group]';
    const pending = new Set<Element>(); // armed, not yet revealed

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.classList.add('revealed');
                io?.unobserve(entry.target);
                pending.delete(entry.target);
              }
            },
            { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
          )
        : null;

    const arm = (el: Element) => {
      if (pending.has(el) || el.classList.contains('revealed')) return;
      pending.add(el);
      if (io) io.observe(el);
      else el.classList.add('revealed'); // no IO support: show everything
    };

    const scan = () => {
      // Drop entries whose page has been swapped away (detached by SPA nav).
      for (const el of pending) {
        if (!el.isConnected) {
          pending.delete(el);
          io?.unobserve(el);
        }
      }
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach(arm);
    };

    scan();

    /* 2 — arm content that arrives after this effect (see header note). */
    let moRaf = 0;
    const mo =
      typeof MutationObserver !== 'undefined'
        ? new MutationObserver(() => {
            if (moRaf) return;
            moRaf = requestAnimationFrame(() => {
              moRaf = 0;
              scan();
            });
          })
        : null;
    mo?.observe(document.body, { childList: true, subtree: true });

    /* 3 — viewport sweep so nothing can stay invisible after scroll. */
    let sweepRaf = 0;
    const sweep = () => {
      sweepRaf = 0;
      if (!pending.size) return;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const pad = vh * 0.08;
      for (const el of pending) {
        const r = el.getBoundingClientRect();
        // Zero-size rects (display:none) are never "in view" — leave them
        // for the moment they actually render.
        if (r.width && r.height && r.top < vh + pad && r.bottom > -pad && r.left < vw && r.right > 0) {
          el.classList.add('revealed');
          io?.unobserve(el);
          pending.delete(el);
        }
      }
    };
    const queueSweep = () => {
      if (sweepRaf || !pending.size) return;
      sweepRaf = requestAnimationFrame(sweep);
    };
    window.addEventListener('scroll', queueSweep, { passive: true });
    window.addEventListener('resize', queueSweep, { passive: true });
    window.addEventListener('pageshow', queueSweep);
    const t1 = window.setTimeout(queueSweep, 900);
    const t2 = window.setTimeout(queueSweep, 2400);

    return () => {
      io?.disconnect();
      mo?.disconnect();
      if (moRaf) cancelAnimationFrame(moRaf);
      if (sweepRaf) cancelAnimationFrame(sweepRaf);
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
      window.removeEventListener('pageshow', queueSweep);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
