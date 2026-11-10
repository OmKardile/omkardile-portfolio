import type { Metadata } from 'next';
import { Fraunces, Hanken_Grotesk } from 'next/font/google';
import TaarPrototype from '@/components/TaarPrototype';

/* Chrome-free Taar prototype stage — the page the DeviceFrame iframe on
   /uiux/taar embeds. Same app as /uiux/taar/prototype, minus the editorial
   intro, the header, AskOmkar, the view notice and the footer: inside a
   390×844 frame only the app itself should exist. Noindexed (the framed
   experience lives on the case study; the framed page is an instrument). */
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-taar-serif',
  display: 'swap',
});

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-taar-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Taar — Prototype (embed)',
  robots: { index: false, follow: false },
};

export default function TaarPrototypeEmbed() {
  return (
    <>
      {/* Suppress the site-wide chrome this route inherits from the root
          layout — inside the phone frame none of it should paint. :has()
          keeps the rules scoped to pages that actually carry the stage. */}
      <style
        dangerouslySetInnerHTML={{
          __html: [
            'body:has(.ux-embed-stage) .site-header,',
            'body:has(.ux-embed-stage) .ao-pill,',
            'body:has(.ux-embed-stage) .vn,',
            'body:has(.ux-embed-stage) .scroll-progress,',
            'body:has(.ux-embed-stage) .skip-link { display: none !important; }',
            'body:has(.ux-embed-stage) main { padding-top: 0 !important; }',
            'body:has(.ux-embed-stage) { overflow: hidden; }',
          ].join(' '),
        }}
      />
      <div className={`ux-embed-stage taar-stage ${fraunces.variable} ${hanken.variable}`}>
        <TaarPrototype />
      </div>
    </>
  );
}
