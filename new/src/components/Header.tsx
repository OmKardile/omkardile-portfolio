'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/data/site';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Header() {
  const pathname = usePathname();
  // Anchor targets must jump back to the home page from subpages.
  const anchor = (id: string) => (pathname === '/' ? `#${id}` : `/#${id}`);
  const onUiux = pathname === '/uiux';

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="header-name">
          {site.name}
        </Link>
        <nav className="header-nav" aria-label="Primary">
          {/* Two groups so mobile can lay them out as deliberate rows;
              on desktop both render flat via display:contents. */}
          <div className="nav-links">
            <a href={anchor('work')}>Work</a>
            <a href={anchor('skills')}>Skills</a>
            <a href={anchor('experience')}>Experience</a>
            <a href={anchor('contact')}>Contact</a>
          </div>
          <div className="nav-actions">
            <a
              href={site.socials.find((s) => s.label === 'Resume')?.href}
              target="_blank"
              rel="noopener noreferrer"
              className="header-resume"
            >
              Resume <span aria-hidden="true">↗</span>
            </a>
          {/* Portfolio switch pill: wears its destination's accent — orange
              "UI/UX" on the dev portfolio, blue "Dev Portfolio" on /uiux.
              NOTE: the Creative pill is intentionally hidden while the creative
              build is still in development — see README.md -> "Wiring the
              creative version" to re-enable it when it ships. */}
          <Link href={onUiux ? '/' : '/uiux'} className={onUiux ? 'header-dev' : 'header-uiux'}>
              {onUiux ? 'Dev Portfolio' : 'UI/UX'}
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
