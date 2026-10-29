'use client';

// Route-scoped theme authority for the UI/UX portfolio.
//
// The inline no-flash script in layout.tsx sets the `uiux` class on <html>
// before first paint (and defaults /uiux to LIGHT — cream — even when the OS
// prefers dark). This component keeps that state correct across SPA route
// changes, which the inline script never sees:
//   - entering /uiux  → add `uiux`; drop `dark` unless the visitor explicitly
//     stored a dark choice (dark stays an opt-in via the header toggle);
//   - leaving /uiux   → restore the site-wide default: stored choice, else the
//     OS preference (so a system-dark visitor's home page is dark again).
// CSS: html.uiux:not(.dark) carries the warm paper palette in globals.css.

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function storedTheme(): string | null {
  try {
    return localStorage.getItem('theme');
  } catch {
    return null; // private mode: choice just won't persist
  }
}

export function UiuxTheme() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const onUiux = pathname.startsWith('/uiux');
    root.classList.toggle('uiux', onUiux);

    if (onUiux) {
      // Cream light is the default here; only an explicit stored 'dark' wins.
      root.classList.toggle('dark', storedTheme() === 'dark');
    } else {
      const t = storedTheme();
      root.classList.toggle(
        'dark',
        t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches,
      );
    }
  }, [pathname]);

  return null;
}
