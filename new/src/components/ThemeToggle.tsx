'use client';

// Theme toggle: flips the `dark` class on <html> and persists the choice.
// Initial theme comes from the no-flash script in layout.tsx (stored choice,
// else system preference). No React state — CSS shows the right icon based
// on html.dark, so there is nothing to hydrate.

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = !root.classList.contains('dark');
    const apply = () => {
      root.classList.toggle('dark', next);
      try {
        localStorage.setItem('theme', next ? 'dark' : 'light');
      } catch {
        /* private mode: choice just won't persist */
      }
    };
    // Chromium/Safari 18+: cross-fade the WHOLE document via View Transitions
    // (CSS sizes the sweep at 0.35s ease-apple). Engines without it fall back
    // to the body/.site-header color transitions. Motion is always enabled,
    // so there is no reduced-motion branch.
    const doc = document as Document & {
      startViewTransition?: (update: () => void) => unknown;
    };
    if (typeof doc.startViewTransition === 'function') {
      doc.startViewTransition(apply);
    } else {
      apply();
    }
  }

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label="Toggle dark mode">
      <svg
        className="icon-moon"
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <svg
        className="icon-sun"
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    </button>
  );
}
