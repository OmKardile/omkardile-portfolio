import type { Metadata } from 'next';
import Link from 'next/link';
import { Fraunces, Hanken_Grotesk } from 'next/font/google';
import { site, taar } from '@/data/site';
import { Footer } from '@/components/Footer';
import TaarPrototype from '@/components/TaarPrototype';

/* Editorial type for the prototype stage, self-hosted via next/font.
   The .variable classes define the CSS vars the .taar scope consumes. */
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
  title: `Taar — Interactive Prototype | ${site.name}`,
  description:
    'Clickable prototype of Taar, a fashion e-commerce discovery redesign: one filter sheet with a live result count, honest sold-out sizes and quick add from the grid.',
  alternates: { canonical: '/uiux/taar/prototype' },
};

export default function TaarPrototypePage() {
  return (
    <>
      <section className="section container" style={{ paddingBottom: '1.5rem' }} aria-label="Prototype introduction">
        <div className="section-head">
          <p className="mono section-index section-index-accent">Taar · Interactive prototype</p>
          <h1 className="section-title">Narrow the catalogue in one place.</h1>
          <p className="section-note">
            A real React build of the case study — not a video, not a Figma mirror. {taar.prototype.text}
          </p>
          <ul className="fact-list" style={{ marginTop: '1rem' }}>
            {taar.prototype.bullets.map((b) => (
              <li key={b.slice(0, 24)}>{b}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`taar-stage ${fraunces.variable} ${hanken.variable}`} aria-label="Taar prototype">
        <TaarPrototype />
      </section>

      <section className="container" style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
        <div className="relay-cta-row" style={{ marginTop: 0 }}>
          <Link className="btn btn-outline" href="/uiux#design-work">
            Back to the case study <span aria-hidden="true">←</span>
          </Link>
          <p className="relay-cta-note">
            All products, prices and the “Taar” label are fictional, created for this exploration.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
