import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { applications } from '@/data/applications';
import { projects, site } from '@/data/site';
import { buildScans } from '@/data/builds';

export const dynamicParams = false;

/* /for/[slug] — the per-application pages from [1.6.0]: one page per
   target, built from one data file (src/data/applications.ts), noindex
   and outside the sitemap. The slug is the tracking — the URL that got
   opened tells you which application worked. Unlisted is not private, so
   everything here is constructive, public-documentation-only, and the
   proofs are projects already verified from their repos. */

export async function generateStaticParams() {
  return applications.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = applications.find((x) => x.slug === slug);
  if (!a) return {};
  return {
    title: `For ${a.company} — ${a.role}`,
    description: `Omkar Kardile's page for the ${a.role} application at ${a.company}: three notes on ${a.product} and the shipped proofs that match the role.`,
    robots: { index: false, follow: false },
  };
}

const RULE: React.CSSProperties = {
  border: 'none',
  borderTop: '1px dashed var(--line-strong)',
  margin: '1.6rem 0',
};

const label: React.CSSProperties = {
  fontSize: '0.62rem',
  letterSpacing: '0.14em',
  color: 'var(--muted)',
  fontFamily: 'var(--mono)',
};

export default async function ForPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = applications.find((x) => x.slug === slug);
  if (!a) notFound();

  const proofs = a.proofs.map((s) => {
    const p = projects.find((x) => x.slug === s);
    if (!p) throw new Error(`application ${a.slug} references unknown proof ${s}`);
    return { p, scan: buildScans.find((b) => b.slug === s) };
  });

  return (
    <section className="section container" aria-labelledby="for-title">
      <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'baseline' }}>
          <p style={{ ...label, margin: 0 }}>UNLISTED · FOR ONE READER</p>
          <p style={{ ...label, margin: 0 }}>SENT {a.sent}</p>
        </div>
        <hr style={RULE} />
        <h1 id="for-title" style={{ fontSize: '1.7rem', letterSpacing: '-0.01em', margin: 0 }}>
          For {a.company}
        </h1>
        <p style={{ color: 'var(--muted)', margin: '0.4rem 0 0', fontSize: '0.95rem' }}>
          {a.role} · three notes on {a.product}, written from its public documentation, and the
          three shipped proofs that match the role.
        </p>
        <hr style={RULE} />
        <p style={{ margin: 0, fontSize: '1.02rem' }}>{a.fit}</p>
        <hr style={RULE} />

        <p style={label}>THREE NOTES ON {a.product.toUpperCase()}</p>
        {a.notes.map((n, i) => (
          <div key={n.title} style={{ marginBlock: '1.1rem' }}>
            <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'baseline' }}>
              <span className="mono" style={{ color: 'var(--muted)', fontSize: '0.72rem', flexShrink: 0 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 style={{ fontSize: '1.02rem', margin: 0, fontWeight: 600 }}>{n.title}</h2>
            </div>
            <p style={{ margin: '0.35rem 0 0', color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              {n.note}
            </p>
          </div>
        ))}
        <hr style={RULE} />

        <p style={label}>THE PROOFS THAT MATCH THIS ROLE</p>
        {proofs.map(({ p, scan }) => {
          const repo = p.links?.find((l) => l.href.includes('github.com'))?.href;
          return (
            <div key={p.slug} style={{ marginBlock: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '0.98rem' }}>{p.title.split(' — ')[0]}</strong>
                <span style={{ ...label, flexShrink: 0, color: 'var(--green)' }}>● {p.status.toUpperCase()} · {p.year}</span>
              </div>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
                {p.stack}
                {scan ? ` — verified from the repo manifest: ${scan.files} tracked files` : ''}
              </p>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem' }}>{p.summary}</p>
              {repo && (
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem' }}>
                  <a href={repo} target="_blank" rel="noopener noreferrer" data-hint="Proof · new tab">
                    {repo.replace('https://github.com/', '')} ↗
                  </a>
                </p>
              )}
            </div>
          );
        })}
        <hr style={RULE} />

        <p style={{ margin: 0, fontSize: '0.95rem' }}>
          The resume is{' '}
          <a href="/resume.pdf" data-hint="The resume">
            /resume.pdf
          </a>{' '}
          — one page, rendered from the same data files this site renders from. The forwardable
          version of the proofs is{' '}
          <Link href="/receipt" data-hint="The candidate receipt">
            /receipt
          </Link>
          . Questions worth more than a form answer: {site.email}
        </p>
        <hr style={RULE} />
        <p style={{ ...label, margin: 0 }}>
          UNLISTED BY DESIGN — NOINDEX, OUTSIDE THE SITEMAP · UNLISTED IS NOT PRIVATE, SO THE
          NOTES STAY CONSTRUCTIVE AND PUBLIC-INFO ONLY · EMAIL LINK SCANNERS CAN INFLATE
          ANYTHING THIS PAGE COUNTS, SO IT COUNTS NOTHING
        </p>
      </div>
    </section>
  );
}
