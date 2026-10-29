import type { ReactNode } from 'react';
import { Anton, Fraunces, Hanken_Grotesk, Space_Mono, Syne } from 'next/font/google';
import { UiuxNav } from '@/components/uiux/Nav';
import { UiuxFooter } from '@/components/uiux/Footer';
import { UiuxMotion } from '@/components/uiux/UiuxMotion';
import '@/app/uiux/uiux.css';

/* Type system for the UI/UX portfolio — self-hosted via next/font.
   Five voices, one page:
   - Fraunces (light 300, italic) — the editorial serif, emphasis + quotes
   - Hanken Grotesk — the interface body
   - Anton — brutal condensed display: the hero name, ghost numerals
   - Syne — the quirky wide display: titles, the outlined "KARDILE" line
   - Space Mono — typewriter chrome: kickers, marquees, badges, meta
   The .variable classes put the CSS vars on the shell wrapper, so the
   site-wide Archivo/Fragment Mono are untouched outside /uiux. */
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-ux-serif',
  display: 'swap',
});

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ux-sans',
  display: 'swap',
});

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-ux-anton',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-ux-syne',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ux-mono',
  display: 'swap',
});

/* Common chrome for all four /uiux routes: slim nav, content, credit footer.
   Pages compose <UiuxShell> themselves (no route layout.tsx, so the legacy
   prototype stages under /uiux keep their existing chrome untouched). The
   root layout already owns the main landmark (and the skip link's target) —
   this shell renders inside it, so no second main/id here.
   UiuxMotion is the route's motion layer: per-char hero reveals, scroll
   velocity skew, cursor-following row peeks, ghost-numeral drift. */
export function UiuxShell({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${fraunces.variable} ${hanken.variable} ${anton.variable} ${syne.variable} ${spaceMono.variable} ux-shell`}
    >
      <UiuxNav />
      <div className="ux-main">{children}</div>
      <UiuxFooter />
      <UiuxMotion />
    </div>
  );
}
