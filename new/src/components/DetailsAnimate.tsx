'use client';

import { useEffect } from 'react';

/* Cross-browser smooth expand/collapse for the native accordions
   (details.chapter on the dev portfolio, details.lg-row on /uiux).

   The previous CSS route (::details-content + interpolate-size) only worked
   in Chromium 129+ — Firefox and Safari users got an instant snap, which is
   one of the "no smooth expand" reports. This animates a real element's
   height with WAAPI instead, which every engine supports:

   - Open:   set [open] (content renders), measure the body, animate 0 → h,
             then clear the inline height so text can rewrap freely.
   - Close:  set an explicit start height (content must stay rendered), then
             0 → remove [open].
   - summary default is prevented so the UA jump never fights the animation;
     the [open] attribute still drives the chevron/color states via CSS.
   - No-JS and html.motion-off visitors keep the native instant toggle:
     the listener simply doesn't preventDefault there.
   - Focus stays on the summary, so keyboard flow is unchanged. */

const DURATION = 420;
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'; // matches --ease-apple

function animatableBody(details: HTMLDetailsElement): HTMLElement | null {
  return details.querySelector<HTMLElement>('.ch-body, .lg-body');
}

function toggleDetails(details: HTMLDetailsElement, summary: HTMLElement) {
  const body = animatableBody(details);
  const reduced = document.documentElement.classList.contains('motion-off');

  // Reduced motion or no animatable body: instant native toggle.
  if (!body || reduced) {
    details.open = !details.open;
    return;
  }

  if (details.open) {
    // --- CLOSE: pin the current height, fold to zero, then collapse. ---
    body.style.overflow = 'hidden';
    body.style.height = `${body.getBoundingClientRect().height}px`;
    const fold = body.animate([{ height: `${body.getBoundingClientRect().height}px` }, { height: '0px' }], {
      duration: DURATION,
      easing: EASE,
    });
    fold.onfinish = () => {
      details.open = false;
      body.style.height = '';
      body.style.overflow = '';
    };
  } else {
    // --- OPEN: render, measure, grow from zero, then release the height. ---
    // Exclusive group (details name="…"): mimic the UA — siblings snap shut.
    if (details.name) {
      document
        .querySelectorAll<HTMLDetailsElement>(`details[name='${details.name}'][open]`)
        .forEach((other) => {
          if (other === details) return;
          other.open = false;
        });
    }
    details.open = true;
    const target = body.getBoundingClientRect().height;
    body.style.overflow = 'hidden';
    const grow = body.animate([{ height: '0px' }, { height: `${target}px` }], {
      duration: DURATION,
      easing: EASE,
    });
    grow.onfinish = () => {
      body.style.height = '';
      body.style.overflow = '';
    };
  }
}

export function DetailsAnimate() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      const summary = (e.target as Element | null)?.closest?.('summary');
      if (!summary) return;
      const details = summary.closest<HTMLDetailsElement>('details.chapter, details.lg-row');
      if (!details || !details.contains(summary)) return;
      if (summary !== details.querySelector('summary')) return; // nested summaries: leave native

      e.preventDefault();
      toggleDetails(details, summary);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
