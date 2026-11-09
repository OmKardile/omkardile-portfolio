import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Now',
  description:
    'What Omkar Kardile is building and looking for right now — updated November 2026.',
  alternates: { canonical: './' },
};

/* /now — the nownownow convention: what I'm building and looking for at
   this exact moment, dated so it can go stale honestly. Every claim here
   traces to the repo: the "building" projects are the two `status:
   'building'` entries in src/data/site.ts, the portfolio line is the
   CHANGELOG, and the looking-for copy is the homepage statement. */

const NOW_STAMP = 'Updated November 2026';

export default function NowPage() {
  return (
    <>
      <section className="section container" aria-labelledby="now-title">
        <p className="mono" style={{ color: 'var(--muted)', marginBottom: '0.6rem' }}>
          /now · {NOW_STAMP}
        </p>
        <h1
          id="now-title"
          data-split
          suppressHydrationWarning
          style={{ fontSize: 'clamp(2.4rem, 6vw, 3.6rem)', fontWeight: 700, letterSpacing: '-0.02em' }}
        >
          Now.
        </h1>
        <p style={{ color: 'var(--muted)', marginBlock: '1rem 0', maxWidth: '34rem' }}>
          Designer and developer in Pune. This page says what I&apos;m building and what
          I&apos;m looking for at this exact moment — dated, so it can go stale honestly.
        </p>
      </section>

      {/* 01 / Building */}
      <section className="section container" aria-labelledby="building-title">
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="section-index mono">01 / Building</p>
          <h2 id="building-title" className="section-title" data-split suppressHydrationWarning>
            On the bench.
          </h2>
        </div>
        <div data-reveal suppressHydrationWarning>
          <div style={{ paddingBlock: '1.1rem', borderBottom: '1px solid var(--line)' }}>
            <h3 style={{ fontWeight: 600, fontSize: '1.05rem' }}>
              This portfolio{' '}
              <span className="mono" style={{ color: 'var(--muted)', fontWeight: 400, fontSize: '0.8rem' }}>
                · continuously
              </span>
            </h3>
            <p style={{ color: 'var(--muted)', marginBlock: '0.4rem', maxWidth: '36rem' }}>
              Version [1.4.8] just shipped: the site-wide custom pointer with hints riding
              it ([1.4.6]), the footer motion toggle for reduced-motion machines ([1.4.7]),
              and this page. Every change is logged in the repo&apos;s CHANGELOG.
            </p>
            <p className="mono" style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: '0.45rem' }}>
              Next.js 16 · React 19 · Tailwind CSS 4 · Lenis
            </p>
          </div>
          <div style={{ paddingBlock: '1.1rem', borderBottom: '1px solid var(--line)' }}>
            <h3 style={{ fontWeight: 600, fontSize: '1.05rem' }}>Full-Stack Food Ordering App</h3>
            <p style={{ color: 'var(--muted)', marginBlock: '0.4rem', maxWidth: '36rem' }}>
              In active development: menu browsing, order placement and delivery tracking.
              Implemented features and a live link land on the work page as they ship.
            </p>
            <p className="mono" style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: '0.45rem' }}>
              Next.js · MongoDB
            </p>
          </div>
          <div style={{ paddingBlock: '1.1rem' }}>
            <h3 style={{ fontWeight: 600, fontSize: '1.05rem' }}>Real-Time Chat App</h3>
            <p style={{ color: 'var(--muted)', marginBlock: '0.4rem', maxWidth: '36rem' }}>
              A mobile chat app with authentication and real-time messaging across devices.
              Verified functionality lands here as features ship.
            </p>
            <p className="mono" style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: '0.45rem' }}>
              React Native · Firebase
            </p>
          </div>
        </div>
      </section>

      {/* 02 / Looking for */}
      <section className="section container" aria-labelledby="looking-title">
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="section-index mono">02 / Looking for</p>
          <h2 id="looking-title" className="section-title" data-split suppressHydrationWarning>
            Let&apos;s make something useful.
          </h2>
        </div>
        <div data-reveal suppressHydrationWarning>
          <p style={{ color: 'var(--muted)', maxWidth: '36rem' }}>
            I&apos;m open to UI/UX design and frontend development roles and collaborations.
            Email is the fastest way to start a conversation.
          </p>
          <div style={{ marginTop: '1.4rem' }}>
            <a className="btn btn-solid" href={`mailto:${site.email}`} data-hint="Opens mail app">
              Email me <span className="btn-arrow btn-arrow-right" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* 03 / Elsewhere */}
      <section className="section container" aria-labelledby="elsewhere-title">
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="section-index mono">03 / Elsewhere</p>
          <h2 id="elsewhere-title" className="section-title" data-split suppressHydrationWarning>
            The rest of me.
          </h2>
        </div>
        <ul
          data-reveal
          suppressHydrationWarning
          style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.55rem' }}
        >
          {site.socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-hint={`${s.label} · new tab`}
              >
                {s.label} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
          <li>
            <Link href="/">Work &amp; experience <span aria-hidden="true">→</span></Link>
          </li>
        </ul>
      </section>

      <Footer />
    </>
  );
}
