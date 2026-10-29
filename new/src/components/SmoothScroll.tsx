'use client';

import Lenis from 'lenis';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

/* Inertial "buttery" scrolling — the glide you feel on apple.com and
   awwwards-grade sites. Lenis intercepts wheel input and lerps the scroll
   position with an expo-out ease, so the page glides instead of stepping.

   Anchor links are owned here, not by the browser:
   - Same-page <a href="#…"> is intercepted in the CAPTURE phase and routed
     through lenis.scrollTo with the same expo-out ease, then the hash is
     updated via history.pushState. Why capture + preventDefault? Lenis's
     own `anchors` mode never prevents the default hash jump, so the browser
     flashes to the target instantly while Lenis is mid-glide — the page
     yanks back and re-scrolls. Intercepting first and cancelling the
     default removes that fight entirely. Works for nav links, hero CTAs,
     "Back to top" — every same-page anchor on the site.
   - Cross-page anchors (/#work from /uiux) do a router.push instead of a
     full page reload, and the route effect below lands on the target
     instantly (gliding across a page you haven't seen yet is disorienting).
   - data-native-scroll opts out: the a11y skip link keeps its instant jump.
   - After the glide, keyboard focus moves to the target like a native jump.

   Motion is always enabled: the engine starts on every load, for every
   visitor. There is no preference toggle and no motion-off state — the old
   footer button and its 'motion-pref' live-swap event were removed.

   - Touch devices keep native scrolling (syncTouch off by default): phones
     already have momentum, hijacking it feels worse.
   - On SPA route changes Next resets scroll instantly; we re-sync Lenis so
     the lerp doesn't fight the reset.
   - The html.lenis rules in globals.css neutralize CSS scroll-behavior while
     the engine owns the scroll. */

const DURATION = 1.15;
const EASE = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let raf = 0;

    const startLoop = (lenis: Lenis) => {
      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (lenisRef.current) return;
      const lenis = new Lenis({ duration: DURATION, easing: EASE });
      lenisRef.current = lenis;
      startLoop(lenis);
    };

    const stop = () => {
      const lenis = lenisRef.current;
      if (!lenis) return;
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };

    start();

    return () => {
      stop();
    };
  }, []);

  useEffect(() => {
    const focusTarget = (hash: string) => {
      const el = document.querySelector<HTMLElement>(hash);
      if (el) {
        el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
      }
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // new-tab modifiers
      const link = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      if (link.hasAttribute('data-native-scroll')) return; // skip link: instant for a11y

      const url = new URL(link.href, window.location.href);
      const samePage =
        url.host === window.location.host &&
        url.pathname === window.location.pathname &&
        url.search === window.location.search;
      if (!url.hash) return;

      const lenis = lenisRef.current;
      if (!lenis) return; // engine not running (shouldn't happen): native jump

      e.preventDefault();
      if (samePage) {
        const target = url.hash === '#' ? 0 : url.hash;
        lenis.scrollTo(target, {
          duration: DURATION,
          easing: EASE,
          onComplete: () => focusTarget(url.hash),
        });
        window.history.pushState(null, '', url.hash);
      } else {
        // Cross-page anchor: SPA-swap the page, then land on the target
        // (the route effect below does the positioning once it is rendered).
        router.push(`${url.pathname}${url.search}${url.hash}`);
      }
    };

    // Back/forward across hash entries: land without fighting restoration.
    const onPopState = () => {
      const hash = window.location.hash;
      lenisRef.current?.scrollTo(hash && hash !== '#' ? hash : 0, {
        immediate: true,
        force: true,
      });
    };

    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', onPopState);

    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', onPopState);
    };
    // router is stable across renders; the listeners are set up once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Route changes: land on the hash target if there is one, else the top —
  // immediately, so the lerp never fights Next's scroll reset.
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const lenis = lenisRef.current;
    if (!lenis) return;
    const hash = window.location.hash;
    if (hash && hash !== '#') {
      // One frame later, so the freshly rendered section is measurable.
      requestAnimationFrame(() => lenis.scrollTo(hash, { immediate: true, force: true }));
    } else {
      lenis.scrollTo(0, { immediate: true, force: true });
    }
  }, [pathname]);

  return null;
}
