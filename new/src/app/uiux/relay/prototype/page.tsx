import type { Metadata } from 'next';
import Link from 'next/link';
import { site, relay } from '@/data/site';
import { Footer } from '@/components/Footer';
import RelayPrototype from '@/components/RelayPrototype';

export const metadata: Metadata = {
  title: `Relay — Interactive Prototype | ${site.name}`,
  description:
    'Clickable prototype of Relay, a trust-first agentic AI assistant: delegate a task, approve it at the checkpoint, and tune per-category autonomy.',
  alternates: { canonical: '/uiux/relay/prototype' },
};

export default function RelayPrototypePage() {
  return (
    <>
      <section className="section container" style={{ paddingBottom: '1.5rem' }} aria-label="Prototype introduction">
        <div className="section-head">
          <p className="mono section-index section-index-accent">Relay · Interactive prototype</p>
          <h1 className="section-title">Try the checkpoint loop.</h1>
          <p className="section-note">
            A real React build of the case study — not a video, not a Figma mirror. {relay.prototype.text}
          </p>
          <ul className="fact-list" style={{ marginTop: '1rem' }}>
            {relay.prototype.bullets.map((b) => (
              <li key={b.slice(0, 24)}>{b}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="proto-stage" aria-label="Relay prototype">
        <RelayPrototype />
      </section>

      <section className="container" style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
        <div className="relay-cta-row" style={{ marginTop: 0 }}>
          <Link className="btn btn-outline" href="/uiux#design-work">
            Back to the case study <span aria-hidden="true">←</span>
          </Link>
          <p className="relay-cta-note">
            All copy, data and the Maya persona are fictional, created for this exploration.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
