import type { Metadata } from 'next';
import { Fraunces, Hanken_Grotesk } from 'next/font/google';
import SutraPrototype from '@/components/SutraPrototype';

/* Chrome-free Sutra prototype stage — the page the DeviceFrame iframe on
   /uiux/sutra embeds. Same app as /uiux/sutra/prototype, minus the editorial
   intro, the header, AskOmkar, the view notice and the footer: inside a
   390×844 frame only the app itself should exist. Noindexed (the framed
   experience lives on the case study; the framed page is an instrument). */
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-sutra-serif',
  display: 'swap',
});

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sutra-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sutra — Prototype (embed)',
  robots: { index: false, follow: false },
};

export default function SutraPrototypeEmbed() {
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
      <div className={`ux-embed-stage sutra-stage ${fraunces.variable} ${hanken.variable}`}>
        <SutraPrototype />
      </div>
    </>
  );
}
