import Link from 'next/link';
import { Mail, Linkedin } from 'lucide-react';
import { site } from '@/data/site';
import { ThemeToggle } from '@/components/ThemeToggle';

/* Slim nav for the /uiux portfolio. The global site header hides itself on
   these routes (see Header.tsx) — this strip is the only chrome: back to the
   dev portfolio, the wordmark, mail + LinkedIn icons, and the same theme
   toggle the main portfolio uses (same localStorage key, same class flip). */
export function UiuxNav() {
  return (
    <header className="ux-nav" data-reveal suppressHydrationWarning>
      <nav className="ux-nav-inner" aria-label="UI/UX portfolio">
        <Link href="/" className="ux-nav-back">
          <span aria-hidden="true">←</span> <span className="ux-nav-back-label">Portfolio</span>
        </Link>
        <Link href="/uiux" className="ux-nav-name">
          Omkar Kardile — Design
        </Link>
        <div className="ux-nav-actions">
          <a href={`mailto:${site.email}`} className="ux-nav-icon" aria-label="Email Omkar">
            <Mail size={16} strokeWidth={2} aria-hidden="true" />
          </a>
          <a
            href={site.socials.find((s) => s.label === 'LinkedIn')?.href}
            target="_blank"
            rel="noopener noreferrer"
            className="ux-nav-icon"
            aria-label="Omkar on LinkedIn (opens in a new tab)"
          >
            <Linkedin size={16} strokeWidth={2} aria-hidden="true" />
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
