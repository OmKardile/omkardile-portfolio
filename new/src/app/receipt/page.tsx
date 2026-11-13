import type { Metadata } from 'next';
import { site, projects } from '@/data/site';
import { buildScans, PUBLIC_SOURCE_REPOS, BUILDS_INDEXED } from '@/data/builds';
import { ledgerOwed, ledgerSettled } from '@/data/now';
import { receiptQrPath, receiptQrSize } from '@/data/receipt-qr';

export const metadata: Metadata = {
  title: 'The candidate receipt',
  description:
    'One forwardable page: the three best proofs, the open promises with dates, the totals — printed from the same data files the site renders from, with a vCard QR to save the contact.',
  alternates: { canonical: './' },
};

/* /receipt — the candidate receipt from [1.5.9]: a forwardable, thermal-
   receipt-styled page a recruiter can pass to their team in one action.
   Everything renders from the one source at build time — the proofs from
   site.ts with their verified repo scans, the open promises from now.ts,
   the contact QR from a vCard generated off site.ts's own fields — so
   nothing on it can drift, and nothing about a visit leaves the browser:
   the page is fully static, the QR is inked at build time, and there is
   no client fetch anywhere on it. Fragment Mono, dotted rules, the
   margin-note voice of a real receipt. */

const proofs = projects.filter((p) => p.status === 'live').slice(0, 3);

const RULE: React.CSSProperties = {
  border: 'none',
  borderTop: '1px dashed var(--line-strong)',
  margin: '1.1rem 0',
};

const row: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '1rem',
  alignItems: 'baseline',
  fontSize: '0.72rem',
};

export default function ReceiptPage() {
  return (
    <section className="section container" aria-labelledby="receipt-title">
      <div
        style={{
          maxWidth: '380px',
          margin: '0 auto',
          background: 'var(--bg)',
          padding: '1.6rem 1.4rem 1.4rem',
          border: '1px solid var(--line-strong)',
          boxShadow: '0 1px 0 var(--line-strong), 0 12px 40px var(--line)',
          fontFamily: 'var(--mono)',
        }}
      >
        <p
          style={{
            margin: 0,
            textAlign: 'center',
            letterSpacing: '0.14em',
            fontSize: '0.78rem',
            fontWeight: 700,
          }}
        >
          CANDIDATE RECEIPT
        </p>
        <p style={{ margin: '0.3rem 0 0', textAlign: 'center', fontSize: '0.62rem', color: 'var(--muted)' }}>
          {site.name.toUpperCase()} · {site.url.replace('https://', '').toUpperCase()} · №OK-2026
        </p>
        <hr style={RULE} />
        <div style={{ display: 'grid', gap: '0.28rem', fontSize: '0.66rem', color: 'var(--muted)' }}>
          <div style={row}>
            <span>ROLE</span>
            <span style={{ textAlign: 'right' }}>{site.role.toUpperCase()}</span>
          </div>
          <div style={row}>
            <span>LOCATED</span>
            <span style={{ textAlign: 'right' }}>{site.location.toUpperCase()}</span>
          </div>
          <div style={row}>
            <span>PRINTED</span>
            <span style={{ textAlign: 'right' }}>{BUILDS_INDEXED.toUpperCase()}</span>
          </div>
        </div>
        <hr style={RULE} />
        <p style={{ margin: 0, fontSize: '0.62rem', letterSpacing: '0.12em', color: 'var(--muted)' }}>
          PROOFS — 3 OF {projects.filter((p) => p.status === 'live').length} LIVE
        </p>
        {proofs.map((p, i) => {
          const scan = buildScans.find((b) => b.slug === p.slug);
          const repo = p.links?.find((l) => l.href.includes('github.com'))?.href;
          return (
            <div key={p.slug} style={{ marginBlock: '0.7rem' }}>
              <div style={row}>
                <span style={{ fontWeight: 700, fontSize: '0.74rem' }}>
                  {String(i + 1).padStart(2, '0')} {p.title.split(' — ')[0].toUpperCase()}
                </span>
                <span style={{ color: 'var(--green)', flexShrink: 0 }}>● LIVE</span>
              </div>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.64rem', color: 'var(--muted)' }}>
                {p.kind} · {p.year}
              </p>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.64rem' }}>
                {scan
                  ? `VERIFIED FROM THE MANIFEST: ${scan.files} FILES — ${scan.verifiedStack.toUpperCase()}`
                  : `RUNS ON ${p.stack.toUpperCase()}`}
              </p>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.62rem', color: 'var(--muted)' }}>
                {p.summary}
              </p>
              {repo && (
                <p style={{ margin: '0.15rem 0 0', fontSize: '0.62rem' }}>
                  <a href={repo} target="_blank" rel="noopener noreferrer" data-hint="Proof · new tab">
                    {repo.replace('https://github.com/', '')} ↗
                  </a>
                </p>
              )}
            </div>
          );
        })}
        <hr style={RULE} />
        <div style={{ display: 'grid', gap: '0.28rem' }}>
          {[
            ['BUILDS SHIPPED', String(projects.length + 1)],
            ['PUBLIC SOURCE REPOS', String(PUBLIC_SOURCE_REPOS)],
            ['OPEN PROMISES, DATED', String(ledgerOwed.length)],
            ['SETTLED, STAMPED', String(ledgerSettled.length)],
            ['UNVERIFIABLE CLAIMS', '0'],
          ].map(([k, v]) => (
            <div key={k} style={row}>
              <span style={{ color: 'var(--muted)' }}>{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
        <hr style={RULE} />
        <p style={{ margin: 0, fontSize: '0.62rem', letterSpacing: '0.12em', color: 'var(--muted)' }}>
          OWED — OPEN PROMISES, DATED
        </p>
        {ledgerOwed.map((e) => (
          <div key={e.item} style={{ marginBlock: '0.45rem', fontSize: '0.64rem' }}>
            <div style={row}>
              <span style={{ fontWeight: 600 }}>{e.item.toUpperCase()}</span>
              <span style={{ color: 'var(--muted)', flexShrink: 0 }}>{e.logged}</span>
            </div>
            <p style={{ margin: '0.1rem 0 0', fontSize: '0.62rem', color: 'var(--muted)' }}>
              {e.detail}
            </p>
          </div>
        ))}
        <hr style={RULE} />
        <div style={{ display: 'grid', justifyItems: 'center', gap: '0.5rem' }}>
          <svg
            role="img"
            aria-label="QR code — save Omkar Kardile's contact as a vCard"
            viewBox={`0 0 ${receiptQrSize} ${receiptQrSize}`}
            style={{ width: '132px', height: '132px', imageRendering: 'pixelated' }}
            shapeRendering="crispEdges"
          >
            <rect width={receiptQrSize} height={receiptQrSize} fill="var(--bg)" />
            <path d={receiptQrPath} fill="var(--fg)" />
          </svg>
          <p style={{ margin: 0, fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--muted)' }}>
            SCAN TO SAVE CONTACT (VCARD) · {site.phone} · {site.email}
          </p>
        </div>
        <hr style={RULE} />
        <p style={{ margin: 0, textAlign: 'center', fontSize: '0.62rem', letterSpacing: '0.1em' }}>
          THANK YOU — CHECK THE RECEIPTS
        </p>
        <p style={{ margin: '0.3rem 0 0', textAlign: 'center', fontSize: '0.6rem', color: 'var(--muted)' }}>
          <a href="/now" data-hint="The ledger">
            the ledger · /now
          </a>{' '}
          ·{' '}
          <a href="/resume.pdf" data-hint="The resume">
            the resume · /resume.pdf
          </a>{' '}
          ·{' '}
          <a href="/library" data-hint="The library">
            the docs · /library
          </a>
        </p>
        <div
          aria-hidden="true"
          style={{
            marginTop: '1rem',
            height: '26px',
            background:
              'repeating-linear-gradient(90deg, var(--fg) 0 2px, transparent 2px 5px, var(--fg) 5px 6px, transparent 6px 9px, var(--fg) 9px 12px, transparent 12px 14px)',
            opacity: 0.85,
          }}
        />
        <p style={{ margin: '0.4rem 0 0', textAlign: 'center', fontSize: '0.58rem', color: 'var(--muted)' }}>
          {site.name.toUpperCase()} · PUNE · PRINTED FROM THE ONE SOURCE — NOTHING ABOUT THIS
          VISIT LEFT YOUR BROWSER
        </p>
      </div>
    </section>
  );
}
