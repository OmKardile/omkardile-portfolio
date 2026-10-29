import type { ReactNode } from 'react';
import { Fraunces, Hanken_Grotesk } from 'next/font/google';
import { UiuxNav } from '@/components/uiux/Nav';
import { UiuxFooter } from '@/components/uiux/Footer';
import '@/app/uiux/uiux.css';

/* Editorial type for the UI/UX portfolio — self-hosted via next/font, same
   families the coded apps use (Fraunces light 300 for display, italic for
   emphasis; Hanken Grotesk for the interface). The .variable classes put the
   CSS vars on the shell wrapper, so the site-wide Archivo/Fragment Mono are
   untouched outside /uiux. */
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

/* Common chrome for all four /uiux routes: slim nav, content, credit footer.
   Pages compose <UiuxShell> themselves (no route layout.tsx, so the legacy
   prototype stages under /uiux keep their existing chrome untouched). The
   root layout already owns the main landmark (and the skip link's target) —
   this shell renders inside it, so no second main/id here. */
export function UiuxShell({ children }: { children: ReactNode }) {
  return (
    <div className={`${fraunces.variable} ${hanken.variable} ux-shell`}>
      <UiuxNav />
      <div className="ux-main">{children}</div>
      <UiuxFooter />
    </div>
  );
}
