import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { projects, experience, capabilities } from '@/data/site';
import { hand } from '@/data/askomkar/hand';
import { uiuxProjects } from '@/data/uiuxProjects';
import { Markdown } from '@/lib/md';

export const metadata: Metadata = {
  title: 'Library',
  description:
    'The docs and collections behind the site — the design system, the cursor architecture, the wiring README, the changelog — rendered from the repo at build time.',
  alternates: { canonical: './' },
};

/* /library — the docs live with the code they describe. Every word on this
   page is read from the repo at build time: the three system documents are
   rendered whole from their markdown, the CHANGELOG card parses its own
   version history, and every collection stat (projects, case studies,
   answers, line counts) is computed from the real files — nothing here is
   a number that was typed by hand. */

const REPO_BLOB =
  'https://github.com/OmKardile/omkardile-portfolio/blob/main/new';

function readDoc(file: string) {
  try {
    const full = path.join(process.cwd(), file);
    const text = fs.readFileSync(full, 'utf8');
    return {
      text,
      lines: text.split('\n').length,
      kb: (fs.statSync(full).size / 1024).toFixed(1),
    };
  } catch {
    return null;
  }
}

function statFile(file: string) {
  try {
    return fs.statSync(path.join(process.cwd(), file)).size;
  } catch {
    return 0;
  }
}

function countLines(file: string) {
  try {
    return fs.readFileSync(path.join(process.cwd(), file), 'utf8').split('\n').length;
  } catch {
    return 0;
  }
}

function fmtSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${(bytes / 1024).toFixed(1)} KB`;
}

/* The reading room, in shelf order. The CHANGELOG card shows its latest
   release section instead of the whole file. */
const SHELF = [
  {
    file: 'design-system.md',
    name: 'Design system',
    kind: 'tokens & rules',
    what: 'One ink on one paper, two typefaces with fixed jobs, motion that is always on except where it answers to the visitor — with every value copied from the shipped files.',
  },
  {
    file: 'custom-cursor.md',
    name: 'Custom cursor',
    kind: 'architecture & behavior',
    what: 'The site-wide pointer: the per-frame hit-testing loop, the four parts, the hint placement math, the reduced-motion escape hatch.',
  },
  {
    file: 'README.md',
    name: 'README',
    kind: 'how the repo is wired',
    what: 'Routes and accents, the deploy shape, where the content lives, the content rules every claim has to pass.',
  },
  {
    file: 'CHANGELOG.md',
    name: 'CHANGELOG',
    kind: 'the receipt',
    what: 'Every version, dated, before it ships. The card below carries the latest release; the full history lives in the repo.',
  },
];

export default function LibraryPage() {
  /* Build-time parses — the card that refuses to lie about its own data. */
  const changelog = readDoc('CHANGELOG.md');
  const versions = changelog
    ? [...changelog.text.matchAll(/^## \[([^\]]+)\] — (.+)$/gm)].map(
        (m) => ({ v: m[1], date: m[2] }),
      )
    : [];
  const latest = versions[0];
  const latestSection = changelog
    ? changelog.text.slice(
        changelog.text.indexOf('## ['),
        changelog.text.indexOf('\n## [', 1) > 0
          ? changelog.text.indexOf('\n## [', 1)
          : undefined,
      )
    : '';

  const vectorsBytes = statFile('src/data/askomkar/vectors.json');

  const COLLECTIONS = [
    {
      file: 'src/data/site.ts',
      what: 'The single source of truth — projects, capabilities, experience, socials. Edit there, not in the pages.',
      stat: `${projects.length} projects · ${experience.length} roles · ${capabilities.design.items.length + capabilities.build.items.length} skills`,
    },
    {
      file: 'src/data/uiuxProjects.ts',
      what: 'The /uiux case studies as typed content blocks; the index and three study pages render from it.',
      stat: `${uiuxProjects.length} case studies`,
    },
    {
      file: 'src/data/askomkar/hand.ts',
      what: "AskOmkar's hand-written answer bank — retrieval, not generation.",
      stat: `${hand.length} pre-written answers`,
    },
    {
      file: 'src/data/askomkar/vectors.json',
      what: 'The bank, offline-embedded with MiniLM at 384 dimensions; the runtime embeds only your question.',
      stat: vectorsBytes ? fmtSize(vectorsBytes) : 'unavailable',
    },
    {
      file: 'src/app/globals.css',
      what: 'The token system (:root, html.dark) and the dev site\u2019s rules.',
      stat: `${countLines('src/app/globals.css')} lines`,
    },
    {
      file: 'src/app/cursor.css',
      what: 'The pointer\u2019s look and the cursor: none contract.',
      stat: `${countLines('src/app/cursor.css')} lines`,
    },
    {
      file: 'src/lib/askomkar/matcher.ts',
      what: 'The cosine matcher that picks an answer locally, in your browser.',
      stat: `${countLines('src/lib/askomkar/matcher.ts')} lines`,
    },
  ];

  return (
    <>
      <section className="section container" aria-labelledby="library-title">
        <p className="mono" style={{ color: 'var(--muted)', marginBottom: '0.6rem' }}>
          /library · the docs, as shipped
        </p>
        <h1
          id="library-title"
          data-split
          suppressHydrationWarning
          style={{ fontSize: 'clamp(2.4rem, 6vw, 3.6rem)', fontWeight: 700, letterSpacing: '-0.02em' }}
        >
          Library.
        </h1>
        <p style={{ color: 'var(--muted)', marginBlock: '1rem 0', maxWidth: '34rem' }}>
          The system docs live with the code they describe. Everything on this page
          is read from the repo at build time — rendered whole, counted live, and
          linked to its source blob. No number on this page was typed by hand.
        </p>
      </section>

      {/* 01 / Reading room */}
      <section className="section container" aria-labelledby="readingroom-title">
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="section-index mono">01 / Reading room</p>
          <h2 id="readingroom-title" className="section-title" data-split suppressHydrationWarning>
            The docs, whole.
          </h2>
        </div>
        <div className="lg-list" data-reveal suppressHydrationWarning>
          {SHELF.map((d, di) => {
            const doc = readDoc(d.file);
            const meta = doc
              ? `${d.file} · ${doc.lines} lines · ${doc.kb} KB`
              : `${d.file} · missing from this build`;
            return (
              <details className="lg-row" name="library" key={d.file}>
                <summary>
                  <span className="lg-idx mono">{String(di + 1).padStart(2, '0')}</span>
                  <span className="lg-head">
                    <span className="lg-line">
                      <span className="lg-name">{d.name}</span>
                      <span className="lg-kind"> · {d.kind}</span>
                    </span>
                    <span className="lg-sum">{d.what}</span>
                  </span>
                  <span className="ch-chev" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="lg-body">
                  <p className="mono" style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
                    {meta} ·{' '}
                    <a
                      href={`${REPO_BLOB}/${d.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-hint="Source · new tab"
                    >
                      source ↗
                    </a>
                  </p>
                  {d.file === 'CHANGELOG.md' ? (
                    <>
                      <p className="mono" style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
                        {versions.length} versions since day one
                        {latest ? ` · latest ${latest.v}, ${latest.date}` : ''}
                      </p>
                      {latestSection ? <Markdown source={latestSection} /> : null}
                      <p>
                        <a
                          href={`${REPO_BLOB}/CHANGELOG.md`}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-hint="CHANGELOG · new tab"
                        >
                          The full history, version by version <span aria-hidden="true">↗</span>
                        </a>
                      </p>
                    </>
                  ) : doc ? (
                    <Markdown source={doc.text} />
                  ) : (
                    <p className="mono" style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
                      This file isn&apos;t in the build tree — read it in the repo instead.
                    </p>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </section>

      {/* 02 / Collections */}
      <section className="section container" aria-labelledby="collections-title">
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="section-index mono">02 / Collections</p>
          <h2 id="collections-title" className="section-title" data-split suppressHydrationWarning>
            What the site runs on.
          </h2>
        </div>
        <div data-reveal suppressHydrationWarning>
          {COLLECTIONS.map((c) => (
            <div
              key={c.file}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: '1rem',
                paddingBlock: '0.85rem',
                borderBottom: '1px solid var(--line)',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <p className="mono" style={{ margin: 0, fontSize: '0.8rem' }}>
                  {c.file}
                </p>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.3rem', maxWidth: '34rem' }}>
                  {c.what}
                </p>
              </div>
              <div
                style={{
                  textAlign: 'right',
                  flexShrink: 0,
                  display: 'grid',
                  gap: '0.35rem',
                  justifyItems: 'end',
                }}
              >
                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                  {c.stat}
                </span>
                <a
                  href={`${REPO_BLOB}/${c.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hint="Source · new tab"
                  className="mono"
                  style={{ fontSize: '0.74rem' }}
                >
                  source ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section container">
        <p data-reveal suppressHydrationWarning className="mono" style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
          Set whole from the repo at build time · {versions.length} versions and counting.
        </p>
      </section>

      <Footer />
    </>
  );
}
