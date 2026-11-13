import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { site } from '@/data/site';
import { nowPlaying, playlist, playlists, appleMusicEmbed, reading, learning, screens, ledgerOwed, ledgerSettled } from '@/data/now';

export const metadata: Metadata = {
  title: 'Now',
  description:
    'What Omkar Kardile is building and looking for right now — updated November 2026.',
  alternates: { canonical: './' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    url: `${site.url}/now`,
    title: 'Now — what Omkar is building right now',
    description:
      'What Omkar Kardile is building and looking for right now — the bench, the playlists, the reading. Updated November 2026.',
    images: ['/og/now.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Now — what Omkar is building right now',
    description:
      'What Omkar Kardile is building and looking for right now — the bench, the playlists, the reading. Updated November 2026.',
    images: ['/og/now.png'],
  },
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
          Designer and developer in Pune. This page says what I&apos;m building, what I
          owe, what I&apos;m looking for and what&apos;s off the clock at this exact
          moment — the rotation, the shelf, the other screens — dated, so it can
          go stale honestly.
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
              Version [1.5.9] just shipped: one source, many outputs — the resume is a route
              printed to /resume.pdf from the same fields the site renders from (the old
              PDF&apos;s drifted contact line is what proved the point), /llms.txt compiles
              the facts and the dated ledger for assistants, and /receipt is the candidate
              receipt — the three best proofs with their verified stacks, the open promises
              with their dates, a vCard QR, and nothing about your visit leaving the
              browser. Before that: the fleet ([1.5.8]) — the colophon and the reading
              room widened from this site to everything built, every stack verified from
              its own repo manifest. And before that: the off-the-clock sections grew
              honest and loud ([1.5.7]) — the player says LAST PLAYED instead of
              pretending to stream, the rotation swapped to this month&apos;s queue (Her&apos;s,
              Niyam, and the Daft Punk that stays), the bag grew genre chips and Marathi
              lit, sharpening picked up ServiceNow, and Ko-fi joined Elsewhere. The ledger
              below keeps the same rule it has since [1.5.6] — open promises on one page,
              dated when they were logged; settled ones stamped with the version that
              closed them, corrections included; the counts compute from the data, and a
              verifier fails the build past five open lines or a stamp the CHANGELOG
              can&apos;t back. And before that: the anti-aliased
              custom pointer ([1.5.5]) and the honesty pass ([1.5.4]) —
              case-study sections with no
              evidence behind them vanish from production and the survivors
              renumber, the Taar and Sutra prototypes embed live on their case
              studies, every page got its own share card with rendered OG
              images, the resume moved on-site to /resume.pdf, the skill chips
              wear their learning marks, the library index dropped the fork
              that inflated its count, and AskOmkar downloads nothing until
              you actually ask. And before that, further back: the site-wide custom pointer
              with hints riding it ([1.4.6]), the footer motion toggle for
              reduced-motion machines ([1.4.7]),
              this page and /colophon ([1.4.8]), the /library docs room gone repo-wide
              ([1.4.9]–[1.5.0]), the listening playlists with a playing/paused state
              ([1.5.1]), the design-system zips built right in the browser with the chips
              living on the rows themselves ([1.5.2]), and the /library sites guide —
              what my sites run on, all eleven of them, the stack in plain sight on
              every row ([1.5.3]). Every change is logged in the
              repo&apos;s CHANGELOG.
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

      {/* 02 / The ledger */}
      <section className="section container" aria-labelledby="ledger-title">
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="section-index mono">02 / The ledger</p>
          <h2 id="ledger-title" className="section-title" data-split suppressHydrationWarning>
            Owed and settled.
          </h2>
        </div>
        <div data-reveal suppressHydrationWarning>
          <p style={{ color: 'var(--muted)', marginBlock: '0 1.3rem', maxWidth: '36rem' }}>
            An udhar book for my own promises — the same ledger SSShopee built for a
            real shop, pointed at me. What I owe sits on the left page with the date
            it was logged; what&apos;s settled carries the stamp of the version that
            closed it. Five open lines, maximum — a stale ledger is worse than none.
          </p>
          <div className="ledger-grid">
            <div className="ledger-page--owed">
              <p className="ledger-label">OWED · {ledgerOwed.length} OPEN</p>
              {ledgerOwed.map((e) => (
                <div key={e.item} className="ledger-row">
                  <div className="ledger-line">
                    <p className="ledger-item">{e.item}</p>
                    <span className="ledger-leader" aria-hidden="true" />
                    <span className="ledger-date">logged {e.logged}</span>
                  </div>
                  <p className="ledger-detail">{e.detail}</p>
                </div>
              ))}
            </div>
            <div className="ledger-page--settled">
              <p className="ledger-label">SETTLED · {ledgerSettled.length} CLOSED</p>
              {ledgerSettled.map((e) => (
                <div key={e.item} className="ledger-row">
                  <div className="ledger-line">
                    <p className="ledger-item">{e.item}</p>
                    <span className="ledger-leader" aria-hidden="true" />
                    <span className="ledger-stamp">[{e.closedIn}]</span>
                  </div>
                  <p className="ledger-detail">
                    {e.kind === 'correction' && <span className="ledger-kind">Correction · </span>}
                    {e.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p className="mono" style={{ color: 'var(--muted)', fontSize: '0.72rem', marginTop: '0.9rem' }}>
            {ledgerOwed.length} open · {ledgerSettled.length} settled · every stamp is a
            version in the repo&apos;s CHANGELOG · {NOW_STAMP}
          </p>
        </div>
      </section>

      {/* 03 / Looking for */}
      <section className="section container" aria-labelledby="looking-title">
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="section-index mono">03 / Looking for</p>
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

      {/* 04 / Listening */}
      <section className="section container" aria-labelledby="listening-title">
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="section-index mono">04 / Listening</p>
          <h2 id="listening-title" className="section-title" data-split suppressHydrationWarning>
            The current rotation.
          </h2>
        </div>
        <div data-reveal suppressHydrationWarning style={{ maxWidth: '38rem' }}>
          <div className="player-card">
            <span
              className={`disc${nowPlaying.status === 'now-playing' ? ' disc--spin' : ''}`}
              aria-hidden="true"
            >
              <span className="disc-hole" />
            </span>
            <div>
              <p className="player-state mono">
                <span
                  aria-hidden="true"
                  style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: nowPlaying.status === 'now-playing' ? 'var(--green)' : 'transparent',
                    border: nowPlaying.status === 'now-playing' ? 'none' : '1.5px solid var(--muted)',
                    flexShrink: 0,
                  }}
                />
                {nowPlaying.status === 'now-playing'
                  ? 'NOW PLAYING'
                  : nowPlaying.status === 'last-played'
                    ? 'LAST PLAYED'
                    : 'PAUSED'}
              </p>
              <p className="player-track">
                {nowPlaying.title}{' '}
                <span style={{ color: 'var(--muted)', fontWeight: 400 }}>— {nowPlaying.artist}</span>
              </p>
              <p className="player-note">{nowPlaying.note}</p>
            </div>
          </div>
          {playlist.map((t) => (
            <div
              key={t.title}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: '1rem',
                paddingBlock: '0.8rem',
                borderBottom: '1px solid var(--line)',
              }}
            >
              <p style={{ margin: 0 }}>
                <strong style={{ fontWeight: 600 }}>{t.title}</strong>
                <span style={{ color: 'var(--muted)' }}> — {t.artist}</span>
              </p>
              <span
                className="mono"
                style={{
                  color: 'var(--muted)',
                  fontSize: '0.74rem',
                  textAlign: 'right',
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                {t.tag && <span className="tag-chip">{t.tag}</span>}
                {t.note}
              </span>
            </div>
          ))}
          <p className="mono" style={{ color: 'var(--muted)', fontSize: '0.72rem', marginTop: '0.9rem' }}>
            ↑ the rotation, roughly by plays · {NOW_STAMP}
          </p>

          {/* The proper playlists — linked, the Apple one embedded. */}
          <div style={{ marginTop: '1.4rem' }}>
            <p
              className="mono"
              style={{ fontSize: '0.68rem', color: 'var(--muted)', letterSpacing: '0.08em', marginBlock: '0 0.2rem' }}
            >
              THE PLAYLISTS
            </p>
            {playlists.map((pl) => (
              <div
                key={pl.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: '1rem',
                  paddingBlock: '0.8rem',
                  borderBottom: '1px solid var(--line)',
                }}
              >
                <p style={{ margin: 0 }}>
                  <a
                    href={pl.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-hint={`${pl.platform} · new tab`}
                  >
                    <strong style={{ fontWeight: 600 }}>{pl.name}</strong>
                  </a>
                  <span style={{ color: 'var(--muted)' }}> — {pl.platform}</span>
                </p>
                <span
                  className="mono"
                  style={{ color: 'var(--muted)', fontSize: '0.74rem', textAlign: 'right', flexShrink: 0 }}
                >
                  {pl.note}
                </span>
              </div>
            ))}
            <iframe
              allow="autoplay *; encrypted-media *;"
              frameBorder={0}
              height={450}
              loading="lazy"
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
              src={appleMusicEmbed}
              title="Apple Music — Vibin' in Classroom"
              style={{
                width: '100%',
                maxWidth: 660,
                overflow: 'hidden',
                background: 'transparent',
                display: 'block',
                marginBlock: '1.2rem 0.4rem',
              }}
            />
            <p className="mono" style={{ color: 'var(--muted)', fontSize: '0.72rem' }}>
              &quot;Vibin&apos; in Classroom&quot;, embedded from Apple Music — the link above opens the full playlist.
            </p>
          </div>
        </div>
      </section>

      {/* 04 / Reading */}
      <section className="section container" aria-labelledby="reading-title">
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="section-index mono">05 / Reading</p>
          <h2 id="reading-title" className="section-title" data-split suppressHydrationWarning>
            In the bag.
          </h2>
        </div>
        <div data-reveal suppressHydrationWarning style={{ maxWidth: '38rem' }}>
          {reading.map((b) => (
            <div
              key={b.title}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: '1rem',
                paddingBlock: '0.8rem',
                borderBottom: '1px solid var(--line)',
              }}
            >
              <p style={{ margin: 0 }}>
                <strong style={{ fontWeight: 600 }}>{b.title}</strong>
                <span style={{ color: 'var(--muted)' }}> — {b.author}</span>
              </p>
              <span
                className="mono"
                style={{
                  color: 'var(--muted)',
                  fontSize: '0.74rem',
                  textAlign: 'right',
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                {b.kind && <span className="tag-chip">{b.kind}</span>}
                {b.note}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 06 / On the side */}
      <section className="section container" aria-labelledby="screens-title">
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="section-index mono">06 / On the side</p>
          <h2 id="screens-title" className="section-title" data-split suppressHydrationWarning>
            The other screens.
          </h2>
        </div>
        <div data-reveal suppressHydrationWarning style={{ maxWidth: '38rem' }}>
          {screens.map((s) => (
            <div
              key={s.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: '1rem',
                paddingBlock: '0.8rem',
                borderBottom: '1px solid var(--line)',
              }}
            >
              <p style={{ margin: 0, fontWeight: 600 }}>{s.label}</p>
              <span
                className="mono"
                style={{ color: 'var(--muted)', fontSize: '0.74rem', textAlign: 'right', flexShrink: 0 }}
              >
                {s.note}
              </span>
            </div>
          ))}
          <p className="mono" style={{ color: 'var(--muted)', fontSize: '0.72rem', marginTop: '0.9rem' }}>
            music · film · books · games — the four hobbies; the picks rotate faster than the ledger closes
          </p>
        </div>
      </section>

      {/* 07 / Learning */}
      <section className="section container" aria-labelledby="learning-title">
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="section-index mono">07 / Learning</p>
          <h2 id="learning-title" className="section-title" data-split suppressHydrationWarning>
            Sharpening.
          </h2>
        </div>
        <div data-reveal suppressHydrationWarning style={{ maxWidth: '38rem' }}>
          {learning.map((l) => (
            <div
              key={l.topic}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: '1rem',
                paddingBlock: '0.8rem',
                borderBottom: '1px solid var(--line)',
              }}
            >
              <p style={{ margin: 0, fontWeight: 600 }}>{l.topic}</p>
              <span
                className="mono"
                style={{ color: 'var(--muted)', fontSize: '0.74rem', textAlign: 'right', flexShrink: 0 }}
              >
                {l.note}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 08 / Elsewhere */}
      <section className="section container" aria-labelledby="elsewhere-title">
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="section-index mono">08 / Elsewhere</p>
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
