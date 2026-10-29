import type { Metadata } from 'next';
import Link from 'next/link';
import { Fraunces, Hanken_Grotesk } from 'next/font/google';
import { site, sutra } from '@/data/site';
import { Footer } from '@/components/Footer';
import SutraPrototype from '@/components/SutraPrototype';

/* Editorial type for the prototype stage, self-hosted via next/font.
   The .variable classes define the CSS vars the .sutra scope consumes. */
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
  /* The root template appends "| Omkar Kardile" — don't double it. */
  title: 'Sutra Checkout — Interactive Prototype',
  description:
    'Clickable prototype of Sutra, a three-step mobile checkout redesign with forgiving forms, fees before commitment, and the design system it runs on — one accent token, two products.',
  alternates: { canonical: '/uiux/sutra/prototype' },
};

export default function SutraPrototypePage() {
  return (
    <>
      <section className="section container" style={{ paddingBottom: '1.5rem' }} aria-label="Prototype introduction">
        <div className="section-head">
          <p className="mono section-index section-index-accent">Sutra · Interactive prototype</p>
          <h1 className="section-title">A checkout that forgives.</h1>
          <p className="section-note">
            A real React build of the case study — not a video, not a Figma mirror. {sutra.prototype.text}
          </p>
          <ul className="fact-list" style={{ marginTop: '1rem' }}>
            {sutra.prototype.bullets.map((b) => (
              <li key={b.slice(0, 24)}>{b}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`sutra-stage ${fraunces.variable} ${hanken.variable}`} aria-label="Sutra prototype">
        <SutraPrototype />
      </section>

      <section className="container" style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
        <div className="relay-cta-row" style={{ marginTop: 0 }}>
          <Link className="btn btn-outline" href="/uiux#design-work">
            Back to the case study <span aria-hidden="true">←</span>
          </Link>
          <p className="relay-cta-note">
            All products, prices, the PIN table and the “Taar” label are fictional, created for this exploration. No
            real payment is taken.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
