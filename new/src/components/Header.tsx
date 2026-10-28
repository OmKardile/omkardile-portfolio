'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLinkStatus } from 'next/link';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { site } from '@/data/site';
import { ThemeToggle } from '@/components/ThemeToggle';

const SECTIONS = [
  { id: 'work', label: 'Work', idx: '01' },
  { id: 'skills', label: 'Skills', idx: '02' },
  { id: 'experience', label: 'Experience', idx: '03' },
  { id: 'contact', label: 'Contact', idx: '04' },
] as const;

/* Pending spinner for the portfolio switch pill. useLinkStatus must read from
   a child of <Link>, hence the tiny subcomponent. While the other portfolio
   is loading in, a small spinner appears inside the pill's own accent. */
function PillContent({ onUiux }: { onUiux: boolean }) {
  const { pending } = useLinkStatus();
  return (
    <>
      {onUiux ? 'Dev Portfolio' : 'UI/UX'}
      {pending ? <span className="pill-spin" aria-hidden="true" /> : null}
    </>
  );
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  // Anchor targets must jump back to the home page from subpages.
  const anchor = (id: string) => (pathname === '/' ? `#${id}` : `/#${id}`);
  const onUiux = pathname === '/uiux';
  const resumeHref = site.socials.find((s) => s.label === 'Resume')?.href;

  // NOTE: no pathname effect needed — every element that triggers a route
  // change (sheet links, Resume, the switch pill below) closes the sheet in
  // its own click handler, which keeps the react-hooks/set-state-in-effect
  // rule happy and avoids an extra render on navigation.

  // Escape closes the sheet.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="header-name">
          <img
            src="/signature.png"
            alt={site.name}
            className="header-signature"
            width={642}
            height={216}
          />
        </Link>
        <nav className="header-nav" aria-label="Primary">
          {/* Mobile: the burger joins the right-hand cluster (order puts it
              outermost). Desktop it is hidden and the two groups below
              render flat via display:contents. */}
          <button
            type="button"
            className="nav-burger"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            <span className="burger-box" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>

          <div className="nav-links">
            {SECTIONS.map((s) => (
              <a key={s.id} href={anchor(s.id)}>
                {s.label}
              </a>
            ))}
          </div>
          <div className="nav-actions">
            {resumeHref ? (
              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="header-resume"
              >
                Resume <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            {/* Portfolio switch pill: wears its destination's accent — orange
                "UI/UX" on the dev portfolio, blue "Dev Portfolio" on /uiux.
                NOTE: the Creative pill is intentionally hidden while the
                creative build is still in development — see README.md ->
                "Wiring the creative version" to re-enable it when it ships. */}
            <Link
              href={onUiux ? '/' : '/uiux'}
              className={onUiux ? 'header-dev' : 'header-uiux'}
              onClick={() => setMenuOpen(false)}
            >
              <PillContent onUiux={onUiux} />
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </div>

      {/* Mobile drop sheet: section links plus Resume / email in the foot.
          Closes on link tap, scrim tap, Escape and route change. */}
      <div id="mobile-menu" className={menuOpen ? 'nav-sheet open' : 'nav-sheet'}>
        <ul className="nav-sheet-list">
          {SECTIONS.map((s, i) => (
            <li key={s.id} style={{ '--i': i } as CSSProperties}>
              <a href={anchor(s.id)} onClick={() => setMenuOpen(false)}>
                <span className="mono sheet-idx" aria-hidden="true">
                  {s.idx}
                </span>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-sheet-foot">
          {resumeHref ? (
            <a
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-sheet-resume"
              onClick={() => setMenuOpen(false)}
            >
              Resume <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
          <a className="nav-sheet-mail" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
      </div>

      {/* Click-catcher lives on <body> (portaled) so it covers the viewport —
          the header's backdrop-filter would otherwise contain position:fixed. */}
      {menuOpen
        ? createPortal(
            <button
              type="button"
              className="nav-scrim"
              aria-hidden="true"
              tabIndex={-1}
              onClick={() => setMenuOpen(false)}
            />,
            document.body,
          )
        : null}
    </header>
  );
}
