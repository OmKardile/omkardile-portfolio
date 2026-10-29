import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Linkedin } from 'lucide-react';
import { site, uiux } from '@/data/site';
import { uiuxProjects, uiuxPrinciples, alsoShipped } from '@/data/uiuxProjects';
import { UiuxShell } from '@/components/uiux/UiuxShell';
import { ProjectRow } from '@/components/uiux/ProjectRow';

/* /uiux — design portfolio index. Editorial layout per the portfolio spec:
   slim nav (in the shell), oversized Fraunces hero, three asymmetric work
   rows (Taar / Ghar / Sutra), how-I-work strip, also-shipped rows, about +
   contact, credit footer. Typography is the design — no imagery. */

export const metadata: Metadata = {
  /* The root template already appends "| Omkar Kardile" — don't double it. */
  title: 'UI/UX Design Portfolio',
  description: uiux.description,
  alternates: { canonical: '/uiux' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    url: `${site.url}/uiux`,
    title: `${site.name} | UI/UX Design Portfolio`,
    description: uiux.description,
    /* Placeholder path — replace with a real screenshot. */
    images: ['/og/uiux.png'],
  },
};

export default function UiuxPage() {
  const [taar, ghar, sutra] = uiuxProjects;
  const linkedIn = site.socials.find((s) => s.label === 'LinkedIn')?.href;

  return (
    <UiuxShell>
      {/* Hero — typography is the design */}
      <section className="ux-hero ux-container" aria-label="Introduction" data-reveal suppressHydrationWarning>
        <h1 className="ux-hero-name">Omkar Kardile</h1>
        <p className="ux-hero-role">UI/UX designer who builds what he designs</p>
        <p className="ux-hero-meta">Pune, India</p>
        <p className="ux-hero-available">{uiux.availability}</p>
      </section>

      {/* Selected work — three large editorial rows, 01 widest, 02/03 offset */}
      <section className="ux-work" aria-labelledby="ux-work-title">
        <div className="ux-container">
          <div className="ux-work-head" data-reveal suppressHydrationWarning>
            <h2 id="ux-work-title" className="ux-label">
              Selected work
            </h2>
            <p className="ux-label" aria-hidden="true">
              01 — 03
            </p>
          </div>
          <ol className="ux-work-list">
            <li>
              <ProjectRow project={taar} />
            </li>
            <li>
              <ProjectRow project={ghar} offset />
            </li>
            <li>
              <ProjectRow project={sutra} offset />
            </li>
          </ol>
        </div>
      </section>

      {/* How I work — one strip, three principles, no icons */}
      <section className="ux-how" aria-labelledby="ux-how-title">
        <div className="ux-container">
          <h2 id="ux-how-title" className="ux-label" data-reveal suppressHydrationWarning>
            How I work
          </h2>
          <div className="ux-how-grid" data-reveal-group suppressHydrationWarning>
            {uiuxPrinciples.map((p) => (
              <div className="ux-how-item" key={p.n}>
                <p className="ux-how-n mono" aria-hidden="true">
                  {p.n}
                </p>
                <h3 className="ux-how-title">{p.title}</h3>
                <p className="ux-how-text">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Also shipped — minimal text rows, live URLs from the repo */}
      <section className="ux-shipped" aria-labelledby="ux-shipped-title">
        <div className="ux-container">
          <h2 id="ux-shipped-title" className="ux-label" data-reveal suppressHydrationWarning>
            Also shipped
          </h2>
          <ul className="ux-shipped-list" data-reveal-group suppressHydrationWarning>
            {alsoShipped.map((s) => (
              <li className="ux-shipped-row" key={s.href}>
                <a
                  className="ux-shipped-link"
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ux-shipped-title">{s.title}</span>
                  <span className="ux-shipped-stack">{s.stack}</span>
                  <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* About + contact */}
      <section className="ux-about" aria-labelledby="ux-about-title">
        <div className="ux-container">
          <h2 id="ux-about-title" className="ux-label" data-reveal suppressHydrationWarning>
            About
          </h2>
          <div className="ux-about-grid">
            <div data-reveal suppressHydrationWarning>
              <p className="ux-about-quote">“{uiux.quote}”</p>
              <ul className="ux-about-facts">
                {uiux.aboutFacts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div data-reveal suppressHydrationWarning>
              <p className="ux-contact-note">
                Open to UI/UX design and frontend roles and collaborations. Email is the fastest way to start a
                conversation.
              </p>
              <div className="ux-contact-actions">
                <a className="ux-btn" href={`mailto:${site.email}`}>
                  <Mail size={15} strokeWidth={2} aria-hidden="true" /> Email me
                </a>
                {linkedIn ? (
                  <a className="ux-btn ux-btn-ghost" href={linkedIn} target="_blank" rel="noopener noreferrer">
                    <Linkedin size={15} strokeWidth={2} aria-hidden="true" /> LinkedIn
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet pointer back to the dev portfolio (the nav's ← Portfolio covers
          it too; this one is for readers who reached the footer). */}
      <div className="ux-container" style={{ paddingBottom: '3rem' }}>
        <Link href="/" className="ux-case-back" data-reveal suppressHydrationWarning>
          <span aria-hidden="true">←</span> Developer portfolio
        </Link>
      </div>
    </UiuxShell>
  );
}
