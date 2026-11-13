import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { site, projects, experience, capabilities } from '@/data/site';
import { hand } from '@/data/askomkar/hand';
import { uiuxProjects } from '@/data/uiuxProjects';
import { ghRepos, GH_INDEXED } from '@/data/library';
import { acrossBuildsDocs, buildScans, PUBLIC_SOURCE_REPOS, BUILDS_INDEXED } from '@/data/builds';
import { Markdown } from '@/lib/md';
import { DesignSystemDownload } from '@/components/DesignSystemDownload';

export const metadata: Metadata = {
  title: 'Library',
  description:
    'The docs library — system documents rendered whole at build time across all the builds, plus the design systems and the doc collections across the GitHub repos with the design-system folders downloadable as zips, and the sites guide: what every site runs on.',
  alternates: { canonical: './' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    url: `${site.url}/library`,
    title: 'Library — the docs, as shipped',
    description:
      'The system documents rendered whole, the design systems across the repos downloadable as zips, and the guide to what every site runs on.',
    images: ['/og/library.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Library — the docs, as shipped',
    description:
      'The system documents rendered whole, the design systems across the repos downloadable as zips, and the guide to what every site runs on.',
    images: ['/og/library.png'],
  },
};

/* /library — the docs live with the code they describe, on this site and
   across every build. The reading room renders the system documents whole
   from the repo at build time — and, since [1.5.8], the other builds' own
   docs too (README + design-system/README per build repo, generated into
   src/data/builds.ts by scripts/curate-builds.py from a live clone scan,
   capped at 64 KB with truncation flagged). 02 / Across GitHub is curated
   to the repos where the docs are the point — the design systems and the
   doc collections — generated into src/data/library.ts; every collection
   stat is computed from real files — nothing here is a number that was
   typed by hand. The design-system folders download as zips — the chip
   sits on the row itself, assembled in the browser by
   src/components/DesignSystemDownload.tsx. 03 / The sites is the guide to
   what my sites run on — every site and app, this one included, the stack
   in plain sight on the row, rendered from src/data/site.ts (the
   portfolio's machine line from /colophon); 04 / Collections keeps the
   data files this site renders from, stats computed at build time. */

const REPO_BLOB =
  'https://github.com/OmKardile/omkardile-portfolio/blob/main/new';

/** The per-repo doc lists are capped in the UI; the full index lives in the
    data file and in the repo itself. */
const MAX_MDS_SHOWN = 12;

const ghBlob = (repo: string, branch: string, path: string) =>
  `https://github.com/OmKardile/${repo}/blob/${branch}/${path
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`;

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

  /* The GitHub index — stats computed from the generated data, not typed. */
  const totalDocs = ghRepos.reduce((n, r) => n + r.mds.length, 0);
  const designSystemCount = ghRepos.filter((r) =>
    r.collections.some((c) => c.folder === 'design-system'),
  ).length;

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

  /* The sites guide — every site and app, this one included, with the
     stack in plain sight on the row (no unfolding to read it). Project
     rows render straight from the work data — title, status, year, stack,
     summary and links all come from src/data/site.ts; the portfolio's
     machine line is the colophon's. Nothing typed twice. */
  type SiteRow = {
    name: string;
    status: 'live' | 'building';
    when: string;
    stack: string;
    kind: string;
    summary: string;
    links: { href: string; label: string; note?: string }[];
  };
  const portfolio: SiteRow = {
    name: 'omkardile.is-a.dev',
    status: 'live',
    when: 'continuous',
    stack: 'Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Lenis, on Vercel',
    kind: 'Portfolio · the site you\u2019re on',
    summary:
      'The site you\u2019re on. Every page renders whole from data files at build time — the collections in 04 below carry them — and every change ships through a logged version in the CHANGELOG.',
    links: [
      { href: '/colophon', label: 'the receipt · /colophon' },
      { href: 'https://github.com/OmKardile/omkardile-portfolio', label: 'source repo' },
      { href: '/now', label: 'the dated present · /now' },
    ],
  };
  const SITES: SiteRow[] = [
    portfolio,
    ...projects.map((p) => ({
      name: p.title.split(' — ')[0],
      status: p.status,
      when: p.year,
      stack: p.stack,
      kind: p.kind,
      summary: p.summary,
      links: p.links ?? [],
    })),
  ];
  const liveCount = SITES.filter((s) => s.status === 'live').length;
  const buildingCount = SITES.length - liveCount;

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
          The docs live with the code they describe — on this site and across every
          build. The reading room renders this repo&apos;s system documents whole from
          the build, then the other builds&apos; own docs below them; the GitHub index
          carries the design systems and the doc collections — the repos where the docs
          are the point — with the design-system folders downloadable as zips, built in
          your browser; and the sites guide at the bottom says what every one of my
          sites runs on. No number was typed by hand.
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

        {/* Across the builds — [1.5.8]. The other builds' own docs, pulled
            whole by scripts/curate-builds.py at index time, capped at 64 KB
            with truncation flagged and every card linked back to its repo. */}
        <div className="lg-list" data-reveal suppressHydrationWarning style={{ marginTop: '2.2rem' }}>
          <p
            className="mono"
            style={{ fontSize: '0.68rem', color: 'var(--muted)', letterSpacing: '0.08em', marginBlock: '0 0.5rem' }}
          >
            ACROSS THE BUILDS · {acrossBuildsDocs.length} DOCS RENDERED WHOLE · SCANNED {BUILDS_INDEXED}
          </p>
          <p style={{ color: 'var(--muted)', marginBlock: '0 0.6rem', maxWidth: '40rem' }}>
            The reading room is no longer just this site&apos;s docs — every build&apos;s README
            and design-system front page renders whole below, pulled from its repo at index
            time and capped at 64 KB, with the uncapped original one click away.
          </p>
          {acrossBuildsDocs.map((d, di) => {
            const branch = buildScans.find((b) => b.slug === d.slug)?.branch ?? 'main';
            return (
              <details className="lg-row" name="library-builds" key={`${d.repo}/${d.path}`}>
                <summary>
                  <span className="lg-idx mono">{String(di + 1).padStart(2, '0')}</span>
                  <span className="lg-head">
                    <span className="lg-line">
                      <span className="lg-name">{d.name}</span>
                      <span className="lg-kind"> · {d.kind}</span>
                    </span>
                    <span className="lg-sum">
                      {d.repo} · {d.lines} lines · {d.kb} KB{d.truncated ? ' · capped' : ''}
                    </span>
                  </span>
                  <span className="ch-chev" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="lg-body">
                  <p className="mono" style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
                    {d.path} · {d.lines} lines · {d.kb} KB ·{' '}
                    <a
                      href={ghBlob(d.repo, branch, d.path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-hint="Source · new tab"
                    >
                      source ↗
                    </a>
                  </p>
                  <Markdown source={d.text} />
                  {d.truncated && (
                    <p className="mono" style={{ color: 'var(--muted)', fontSize: '0.76rem' }}>
                      …this doc ran past the 64 KB shelf cap — the uncapped original is the
                      source link above.
                    </p>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </section>
      {/* 02 / Across GitHub */}
      <section className="section container" aria-labelledby="github-title">
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="section-index mono">02 / Across GitHub</p>
          <h2 id="github-title" className="section-title" data-split suppressHydrationWarning>
            The systems and the collections.
          </h2>
        </div>
        <p
          data-reveal
          suppressHydrationWarning
          className="mono"
          style={{ color: 'var(--muted)', fontSize: '0.76rem', marginBottom: '0.6rem' }}
        >
          {ghRepos.length} of {PUBLIC_SOURCE_REPOS} public source repos · {totalDocs} markdown
          documents · {designSystemCount} design systems, downloadable · the rest are repos, not
          docs · indexed {GH_INDEXED}
        </p>
        <p
          data-reveal
          suppressHydrationWarning
          style={{ color: 'var(--muted)', marginBlock: '0.4rem 0.6rem', maxWidth: '40rem' }}
        >
          About the AI you&apos;ll see in these repos — AGENT_LOG, CLAUDE.md, PROMPT.md are
          real files on purpose. The tools draft; Omkar decides, reviews and ships. Each
          repo&apos;s decision docs record what was chosen and why, so the division of
          labor is auditable rather than implied — and the curation and the counts on
          this page are computed from the files, not typed by hand.
        </p>
        <div className="lg-list" data-reveal suppressHydrationWarning>
          {ghRepos.map((r, ri) => {
            const shown = r.mds.slice(0, MAX_MDS_SHOWN);
            const rest = r.mds.length - shown.length;
            return (
              <details className="lg-row" name="github" key={r.name}>
                <summary>
                  <span className="lg-idx mono">{String(ri + 1).padStart(2, '0')}</span>
                  <span className="lg-head">
                    <span className="lg-line">
                      <span className="lg-name">{r.name}</span>
                      <span className="lg-kind"> · {r.kind}</span>
                    </span>
                    <span className="lg-sum">{r.description}</span>
                  </span>
                  {r.dsFolder && r.dsFiles && (
                    <DesignSystemDownload
                      repo={r.name}
                      branch={r.branch}
                      folder={r.dsFolder}
                      files={r.dsFiles}
                    />
                  )}
                  <span className="ch-chev" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="lg-body">
                  <p className="mono" style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
                    {r.branch} · {r.files} files · {r.mds.length} markdown docs ·{' '}
                    <a
                      href={`https://github.com/OmKardile/${r.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-hint="Repo · new tab"
                    >
                      repo ↗
                    </a>
                  </p>
                  {r.collections.length > 0 && (
                    <p className="mono" style={{ fontSize: '0.74rem', marginBlock: '0.5rem' }}>
                      {r.collections.map((c) => (
                        <span key={c.folder} style={{ marginRight: '0.9rem', display: 'inline-block' }}>
                          <a
                            href={`https://github.com/OmKardile/${r.name}/tree/${r.branch}/${c.folder}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-hint="Folder · new tab"
                          >
                            {c.folder}/
                          </a>{' '}
                          ×{c.count}
                        </span>
                      ))}
                    </p>
                  )}
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: '0.4rem 0 0',
                      display: 'grid',
                      gap: '0.3rem',
                    }}
                  >
                    {shown.map((m) => (
                      <li key={m}>
                        <a
                          className="mono"
                          style={{ fontSize: '0.78rem' }}
                          href={ghBlob(r.name, r.branch, m)}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-hint="Doc · new tab"
                        >
                          {m}
                        </a>
                      </li>
                    ))}
                    {rest > 0 && (
                      <li className="mono" style={{ fontSize: '0.78rem' }}>
                        <a
                          href={`https://github.com/OmKardile/${r.name}/tree/${r.branch}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-hint="Repo tree · new tab"
                          style={{ color: 'var(--muted)' }}
                        >
                          + {rest} more in the repo ↗
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </details>
            );
          })}
        </div>
      </section>

      {/* 03 / The sites — the guide to what every site runs on. The stack
          sits on the row itself; unfolding gives the story and the links. */}
      <section className="section container" aria-labelledby="sites-title">
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="section-index mono">03 / The sites</p>
          <h2 id="sites-title" className="section-title" data-split suppressHydrationWarning>
            What my sites run on.
          </h2>
        </div>
        <p
          data-reveal
          suppressHydrationWarning
          className="mono"
          style={{ color: 'var(--muted)', fontSize: '0.76rem', marginBottom: '0.6rem' }}
        >
          {SITES.length} sites and apps · {liveCount} live, {buildingCount} building ·
          the project stacks carried from src/data/site.ts, this site&apos;s from /colophon
        </p>
        <div className="lg-list" data-reveal suppressHydrationWarning>
          {SITES.map((s, si) => (
            <details className="lg-row" name="sites" key={s.name}>
              <summary>
                <span className="lg-idx mono">{String(si + 1).padStart(2, '0')}</span>
                <span className="lg-head">
                  <span className="lg-line">
                    <span className="lg-name">{s.name}</span>
                    <span className="lg-kind">
                      {' · '}
                      <span style={{ color: s.status === 'live' ? 'var(--green)' : 'var(--muted)' }}>
                        {s.status}
                      </span>
                      {' · '}
                      {s.when}
                    </span>
                  </span>
                  <span className="lg-sum">runs on {s.stack}</span>
                </span>
                <span className="ch-chev" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="lg-body">
                <p className="mono" style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
                  {s.kind} · {s.when} · {s.status}
                </p>
                <p style={{ margin: 0, maxWidth: '40rem' }}>{s.summary}</p>
                {s.links.length > 0 && (
                  <p
                    className="mono"
                    style={{ fontSize: '0.78rem', display: 'grid', gap: '0.3rem' }}
                  >
                    {s.links.map((l) => (
                      <span key={l.href}>
                        <a
                          href={l.href}
                          target={l.href.startsWith('http') ? '_blank' : undefined}
                          rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          data-hint={`${s.name} · ${l.label}`}
                        >
                          {l.label}
                          {l.href.startsWith('http') ? ' ↗' : ''}
                        </a>
                      </span>
                    ))}
                  </p>
                )}
                {s.links.some((l) => l.note) && (
                  <p className="mono" style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                    {s.links
                      .filter((l) => l.note)
                      .map((l) => `${l.label} — ${l.note}`)
                      .join(' · ')}
                  </p>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* 04 / Collections — the data files this site renders from. */}
      <section className="section container" aria-labelledby="collections-title">
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="section-index mono">04 / Collections</p>
          <h2 id="collections-title" className="section-title" data-split suppressHydrationWarning>
            This site, file by file.
          </h2>
        </div>
        <p
          data-reveal
          suppressHydrationWarning
          className="mono"
          style={{ color: 'var(--muted)', fontSize: '0.76rem', marginBottom: '0.6rem' }}
        >
          the data files the portfolio itself renders from — stats computed at build time
        </p>
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
          Set whole from the repo at build time · {versions.length} versions and counting ·
          the GitHub index generated {GH_INDEXED} · the builds scanned {BUILDS_INDEXED}.
        </p>
      </section>

      <Footer />
    </>
  );
}
