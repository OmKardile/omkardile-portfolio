import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Asterisk, Mail, Linkedin } from 'lucide-react';
import { site, uiux } from '@/data/site';
import { uiuxProjects, uiuxPrinciples, alsoShipped } from '@/data/uiuxProjects';
import type { UiuxProject, WireframeArt } from '@/data/uiuxProjects';
import { UiuxShell } from '@/components/uiux/UiuxShell';
import { ProjectRow } from '@/components/uiux/ProjectRow';
import { WireframeArtSvg } from '@/components/uiux/WireframeArt';

/* /uiux — design portfolio index. The loud version: a stacked clash-type
   hero (Anton caps over an outlined Syne line over Fraunces italic), a
   rotating availability badge, a rotated scroll-skewed marquee strip, three
   asymmetric work rows with ghost numerals and cursor-following wireframe
   peeks, a stepped how-I-work diagonal, and a word-staggered about quote.
   Typography is still the design — no imagery. Motion: UiuxMotion. */

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

/* First wireframe of a project — the cursor-following row peek on the index.
   Decorative duplication of the case study's drawing, so it renders
   aria-hidden inside the row. */
function peekArt(project: UiuxProject): WireframeArt | null {
  for (const section of project.sections) {
    for (const block of section.blocks) {
      if (block.type === 'wireframes') return block.items[0].art;
    }
  }
  return null;
}

const MARQUEE_WORDS = ['DESIGN', 'CODE', 'SHIP', 'REPEAT'];

export default function UiuxPage() {
  const [taar, ghar, sutra] = uiuxProjects;
  const linkedIn = site.socials.find((s) => s.label === 'LinkedIn')?.href;
  const strip = [...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS];

  return (
    <UiuxShell>
      {/* Hero — the clash-type stack */}
      <section className="ux-hero ux-container" aria-label="Introduction">
        <div className="ux-hero-kicker" data-reveal suppressHydrationWarning>
          <p className="ux-kicker">Portfolio — 2026</p>
          <span className="ux-hero-badge" aria-hidden="true">
            <svg viewBox="0 0 100 100" className="ux-badge-ring">
              <defs>
                <path
                  id="ux-badge-circ"
                  d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
                  fill="none"
                />
              </defs>
              <text className="ux-badge-text">
                <textPath href="#ux-badge-circ" textLength="238" lengthAdjust="spacingAndGlyphs">
                  OPEN TO WORK · PUNE · UI/UX · FRONTEND ·
                </textPath>
              </text>
            </svg>
            <Asterisk className="ux-badge-mark" size={22} strokeWidth={2.5} aria-hidden="true" />
          </span>
        </div>

        <h1 className="ux-hero-name" aria-label="Omkar Kardile" data-skew>
          <span className="ux-hero-line ux-hero-line-fill" data-chars aria-hidden="true">
            OMKAR
          </span>
          <span className="ux-hero-line ux-hero-line-outline" data-chars aria-hidden="true">
            KARDILE
          </span>
        </h1>

        <div className="ux-hero-strip" aria-hidden="true" data-reveal suppressHydrationWarning>
          <div className="ux-hero-strip-track">
            {[...strip, ...strip].map((w, i) => (
              <span className="ux-hero-strip-item" key={`${w}-${i}`}>
                {w}
                <Asterisk size={13} strokeWidth={3} aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>

        <p className="ux-hero-role" data-reveal suppressHydrationWarning>
          UI/UX designer who <em>builds</em> what he designs
        </p>
        <p className="ux-hero-meta" data-reveal suppressHydrationWarning>
          Pune, India
        </p>
        <p className="ux-hero-available" data-reveal suppressHydrationWarning>
          {uiux.availability}
        </p>
      </section>

      {/* Selected work — ghost numerals, cursor peeks, offset rows */}
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
              <ProjectRow project={taar} peekArt={peekArt(taar)} />
            </li>
            <li>
              <ProjectRow project={ghar} offset peekArt={peekArt(ghar)} />
            </li>
            <li>
              <ProjectRow project={sutra} offset peekArt={peekArt(sutra)} />
            </li>
          </ol>
        </div>
      </section>

      {/* How I work — a stepped diagonal, big outlined numerals */}
      <section className="ux-how" aria-labelledby="ux-how-title">
        <div className="ux-container">
          <h2 id="ux-how-title" className="ux-label" data-reveal suppressHydrationWarning>
            How I work
          </h2>
          <div className="ux-how-grid" data-reveal-group suppressHydrationWarning>
            {uiuxPrinciples.map((p) => (
              <div className="ux-how-item" key={p.n}>
                <span className="ux-how-big" aria-hidden="true" data-drift>
                  {p.n}
                </span>
                <h3 className="ux-how-title">{p.title}</h3>
                <p className="ux-how-text">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Also shipped — mono rows, live URLs from the repo */}
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

      {/* About + contact — word-staggered quote, magnetic CTAs */}
      <section className="ux-about" aria-labelledby="ux-about-title">
        <div className="ux-container">
          <h2 id="ux-about-title" className="ux-label" data-reveal suppressHydrationWarning>
            About
          </h2>
          <div className="ux-about-grid">
            <div data-reveal suppressHydrationWarning>
              <p className="ux-about-quote">
                <span className="sr-only">“{uiux.quote}”</span>
                <span aria-hidden="true">
                  “{uiux.quote.split(' ').map((w, i) => (
                    <span className="ux-qw" style={{ '--wi': i } as CSSProperties} key={i}>
                      {w}
                    </span>
                  )).reduce<React.ReactNode[]>((acc, el, i) => (
                    i === 0 ? [el] : [...acc, ' ', el]
                  ), [])}
                </span>
              </p>
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
                <a className="ux-btn" href={`mailto:${site.email}`} data-magnetic>
                  <Mail size={15} strokeWidth={2} aria-hidden="true" /> Email me
                </a>
                {linkedIn ? (
                  <a
                    className="ux-btn ux-btn-ghost"
                    href={linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-magnetic
                  >
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
