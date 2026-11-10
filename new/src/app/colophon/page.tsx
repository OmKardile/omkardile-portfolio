import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { site } from '@/data/site';
import { hand } from '@/data/askomkar/hand';
import { faqBank } from '@/data/askomkar/bank';

export const metadata: Metadata = {
  title: 'Colophon',
  description:
    'How this site is made: the type, the ink tokens, the motion system and the machine underneath — designed and built by the same person.',
  alternates: { canonical: './' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    url: `${site.url}/colophon`,
    title: 'Colophon — how this site is made',
    description:
      'The type, the ink, the motion and the machine underneath this site — every claim traceable to the codebase.',
    images: ['/og/colophon.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Colophon — how this site is made',
    description:
      'The type, the ink, the motion and the machine underneath this site — every claim traceable to the codebase.',
    images: ['/og/colophon.png'],
  },
};

/* /colophon — the maker's page: how this site is made. Every claim traces
   to the codebase: fonts.ts (Archivo's wdth axis, Fragment Mono's job),
   the :root token block in globals.css, the motion engine under src/engine,
   Cursor.tsx / MotionToggle.tsx, package.json for the stack, and the
   AskOmkar matcher for the retrieval story. The ink swatches below render
   from the same CSS custom properties the site uses — toggle the theme and
   they flip, which is the point the section makes. */

const INK = [
  { name: '--fg', note: 'the ink' },
  { name: '--bg', note: 'the paper' },
  { name: '--muted', note: 'the whisper' },
  { name: '--line', note: 'the rules' },
  { name: '--accent-dev', note: 'dev accent' },
  { name: '--accent', note: 'uiux accent' },
  { name: '--green', note: 'live status' },
];

const mono = {
  fontFamily: 'var(--mono)',
  fontSize: '0.72rem',
  color: 'var(--muted)',
} as const;

export default function ColophonPage() {
  /* The AskOmkar numbers, computed — never typed. The served bank is the
     hand-written entries plus one derived entry per project in site.ts, so
     the counts can't drift from the data files the bot actually ships. */
  const handCount = hand.length;
  const derivedCount = faqBank.length - handCount;
  return (
    <>
      <section className="section container" aria-labelledby="colophon-title">
        <p className="mono" style={{ color: 'var(--muted)', marginBottom: '0.6rem' }}>
          /colophon · how this site is made
        </p>
        <h1
          id="colophon-title"
          data-split
          suppressHydrationWarning
          style={{ fontSize: 'clamp(2.4rem, 6vw, 3.6rem)', fontWeight: 700, letterSpacing: '-0.02em' }}
        >
          Colophon.
        </h1>
        <p style={{ color: 'var(--muted)', marginBlock: '1rem 0', maxWidth: '34rem' }}>
          Every artifact on this site was designed and built by the same person. This page
          is the receipt: the type, the ink, the motion and the machine underneath.
        </p>
      </section>

      {/* 01 / Type */}
      <section className="section container" aria-labelledby="type-title">
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="section-index mono">01 / Type</p>
          <h2 id="type-title" className="section-title" data-split suppressHydrationWarning>
            Two families, four jobs.
          </h2>
        </div>
        <div data-reveal suppressHydrationWarning style={{ maxWidth: '38rem' }}>
          <p>
            <strong>Archivo</strong> — the voice. One variable family, two personalities: the
            width axis (wdth 62–125) is the wave hero&apos;s own variable, with display type
            running expanded 125 and body text at normal width.
          </p>
          <p style={{ marginTop: '0.8rem' }}>
            <strong>Fragment Mono</strong> — the readouts: meta, indexes, years, statuses,
            counters. It is also the custom cursor&apos;s voice — the View chips and the hint
            captions are set in it. Everything quiet and factual on this site is Fragment Mono.
          </p>
        </div>
      </section>

      {/* 02 / Ink */}
      <section className="section container" aria-labelledby="ink-title">
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="section-index mono">02 / Ink</p>
          <h2 id="ink-title" className="section-title" data-split suppressHydrationWarning>
            One ink, one paper.
          </h2>
        </div>
        <div data-reveal suppressHydrationWarning style={{ maxWidth: '38rem' }}>
          <p>
            The whole site is <span className="mono">--fg</span> on{' '}
            <span className="mono">--bg</span> — ink #18181b on paper #ffffff, inverted for
            dark — and everything else derives from that pair. Two accents stay in their
            lanes: blue for the dev site, orange for the /uiux portfolio. Components read
            only the tokens, so a theme change re-inks the pointer, the chips, the hints —
            everything — without a single special case.
          </p>
          <ul
            aria-label="Live ink swatches — these render from the site's own tokens"
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '1.4rem 0 0',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem 1.4rem',
            }}
          >
            {INK.map((swatch) => (
              <li key={swatch.name} style={{ display: 'grid', gap: '0.4rem', justifyItems: 'start' }}>
                <span
                  aria-hidden="true"
                  style={{
                    display: 'block',
                    width: '2.2rem',
                    height: '2.2rem',
                    borderRadius: '4px',
                    background: `var(${swatch.name})`,
                    border: '1px solid var(--line-strong)',
                    boxShadow: '0 0 0 1px var(--bg)',
                  }}
                />
                <span style={mono}>{swatch.name}</span>
                <span style={{ ...mono, fontSize: '0.64rem', opacity: 0.8 }}>{swatch.note}</span>
              </li>
            ))}
          </ul>
          <p style={{ ...mono, marginTop: '0.9rem' }}>
            ↑ these render from the same custom properties the site uses — toggle the theme
            and watch them flip.
          </p>
        </div>
      </section>

      {/* 03 / Motion */}
      <section className="section container" aria-labelledby="motion-title">
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="section-index mono">03 / Motion</p>
          <h2 id="motion-title" className="section-title" data-split suppressHydrationWarning>
            Always on — almost.
          </h2>
        </div>
        <div data-reveal suppressHydrationWarning style={{ maxWidth: '38rem' }}>
          <p>
            Motion here is a philosophy, not a garnish: Lenis inertial scrolling, split-text
            reveals, the scroll progress hairline, Apple-style expo-out easing. The one
            exception proves the rule — the custom pointer (a 6px ink dot and a 32px
            wireframe ring that re-derive all their state per frame from{' '}
            <span className="mono">elementFromPoint()</span>) honors the OS reduced-motion
            request, with a footer <span className="mono">Cursor: on</span> toggle as the
            explicit escape hatch. Hints ride beside the pointer; chips replace it; touch
            keeps the native cursor.
          </p>
        </div>
      </section>

      {/* 04 / Machine */}
      <section className="section container" aria-labelledby="machine-title">
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="section-index mono">04 / Machine</p>
          <h2 id="machine-title" className="section-title" data-split suppressHydrationWarning>
            What it runs on.
          </h2>
        </div>
        <div data-reveal suppressHydrationWarning style={{ maxWidth: '38rem' }}>
          <p>
            Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Lenis.
            Deployed on Vercel from GitHub <span className="mono">main</span>; every change
            is logged in a dated CHANGELOG before it ships.
          </p>
          <p style={{ marginTop: '0.8rem' }}>
            <strong>AskOmkar</strong> — the floating bot on every page — is retrieval, not
            generation: {faqBank.length} pre-written answers ({handCount} hand-written,{' '}
            {derivedCount} derived from the site&apos;s own project data so they can&apos;t drift
            from it), embedded offline into vectors with MiniLM (384-dim). At runtime only{' '}
            <em>your question</em> is embedded, in-browser, by a ~23MB model fetched once when
            you first ask — the chips answer before it loads, and the model caches after that;
            a cosine matcher picks the answer locally. Nothing is sent to a server, and when
            your question is outside the bank it says so instead of improvising.
          </p>
          <p style={{ marginTop: '0.8rem' }}>
            The /uiux case studies run their prototypes in iframes on purpose: real,
            isolated artifacts rather than screenshots of them.
          </p>
        </div>
      </section>

      {/* 05 / Receipts */}
      <section className="section container" aria-labelledby="receipts-title">
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="section-index mono">05 / Receipts</p>
          <h2 id="receipts-title" className="section-title" data-split suppressHydrationWarning>
            Check the work.
          </h2>
        </div>
        <ul
          data-reveal
          suppressHydrationWarning
          style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.55rem' }}
        >
          <li>
            <a
              href="https://github.com/OmKardile/omkardile-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              data-hint="Source · new tab"
            >
              Source on GitHub <span aria-hidden="true">↗</span>
            </a>
          </li>
          <li>
            <a
              href="https://github.com/OmKardile/omkardile-portfolio/blob/main/new/CHANGELOG.md"
              target="_blank"
              rel="noopener noreferrer"
              data-hint="CHANGELOG · new tab"
            >
              The full changelog, version by version <span aria-hidden="true">↗</span>
            </a>
          </li>
          <li>
            <a href="/now" data-hint="What I'm building now">
              /now — what I&apos;m building at this exact moment <span aria-hidden="true">→</span>
            </a>
          </li>
        </ul>
        <p data-reveal suppressHydrationWarning style={{ ...mono, marginTop: '2.2rem' }}>
          Set in Archivo and Fragment Mono. Designed and built in Pune — {site.name}.
        </p>
      </section>

      <Footer />
    </>
  );
}
