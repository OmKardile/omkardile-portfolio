import type { Metadata } from 'next';
import { site, projects, experience, capabilities } from '@/data/site';
import { resumeEducation, resumeSummary } from '@/data/resume';
import { buildScans } from '@/data/builds';

export const metadata: Metadata = {
  title: 'Resume',
  description:
    'The resume of Omkar Kardile — rendered from the same data files the site renders from, printed to /resume.pdf from this route.',
  alternates: { canonical: './' },
};

/* /resume — the print route from [1.5.9]. One source, one page: the name,
   contact, roles, projects and skills all render from src/data/site.ts (the
   same array the home page, the sites guide and AskOmkar read); only the
   education rows site.ts doesn't carry come from src/data/resume.ts. The
   contact line can't drift the way the old PDF's did — its email and URL
   come from the same fields as the rest of the site. scripts/
   build-resume-pdf.py prints this route to public/resume.pdf with the
   Playwright already in the toolchain. Single column, real text, no
   tables-with-tabs, no columns — ATS-safe by construction. */

const scanFor = (slug: string) => buildScans.find((b) => b.slug === slug);

const sheet: React.CSSProperties = {
  maxWidth: '210mm',
  margin: '0 auto',
  padding: '13mm 15mm',
  fontFamily: 'var(--font-sans, Archivo, sans-serif)',
  color: '#18181b',
  background: '#ffffff',
  fontSize: '10pt',
  lineHeight: 1.36,
};

const sectionTitle: React.CSSProperties = {
  fontSize: '8pt',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  borderBottom: '1px solid #18181b',
  paddingBottom: '2pt',
  margin: '10pt 0 5pt',
  fontWeight: 700,
};

const job: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '12pt',
  alignItems: 'baseline',
};

export default function ResumePage() {
  const roles = experience.filter((e) => e.kind === 'Role');
  const schools = [
    ...experience.filter((e) => e.kind === 'Education'),
    ...resumeEducation,
  ];
  const proofs = projects.filter((p) => p.status === 'live').slice(0, 3);
  const skills = [
    ...capabilities.design.items.filter((s) => !capabilities.design.learning.includes(s)),
    ...capabilities.build.items.filter((s) => !capabilities.build.learning.includes(s)),
  ];

  return (
    <main style={sheet}>
      <h1 style={{ fontSize: '20pt', fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>
        {site.name}
      </h1>
      <p style={{ margin: '2pt 0 0', fontSize: '11pt', color: '#52525b' }}>{site.role}</p>
      <p style={{ margin: '6pt 0 0', fontSize: '9pt' }}>
        {site.email} · {site.phone} · {site.location} · {site.url.replace('https://', '')} ·{' '}
        github.com/OmKardile · linkedin.com/in/omkar-kardile-49501b213
      </p>

      <p style={sectionTitle}>Summary</p>
      <p style={{ margin: 0 }}>{resumeSummary}</p>

      <p style={sectionTitle}>Experience</p>
      {roles.map((r) => (
        <div key={`${r.title}-${r.org}`} style={{ marginBottom: '4pt' }}>
          <div style={job}>
            <strong style={{ fontSize: '10pt' }}>
              {r.title} · {r.org}
            </strong>
            <span style={{ fontSize: '9pt', color: '#52525b', flexShrink: 0 }}>{r.period}</span>
          </div>
        </div>
      ))}

      <p style={sectionTitle}>Projects — live, with receipts</p>
      {proofs.map((p) => {
        const scan = scanFor(p.slug);
        return (
          <div key={p.slug} style={{ marginBottom: '4pt' }}>
            <div style={job}>
              <strong style={{ fontSize: '10.5pt' }}>{p.title.split(' — ')[0]}</strong>
              <span style={{ fontSize: '9pt', color: '#52525b', flexShrink: 0 }}>{p.year}</span>
            </div>
            <p style={{ margin: '1pt 0 0', fontSize: '9.5pt' }}>
              {p.stack}
              {scan ? ` — verified from the repo manifest: ${scan.files} tracked files` : ''}
            </p>
            <p style={{ margin: '1pt 0 0', fontSize: '9.5pt', color: '#3f3f46' }}>{p.summary}</p>
          </div>
        );
      })}

      <p style={sectionTitle}>Education</p>
      {schools.map((s) => (
        <div key={s.what} style={job}>
          <span style={{ fontSize: '10pt' }}>
            {'what' in s ? s.what : `${s.title} — ${s.org}`}
          </span>
          <span style={{ fontSize: '9pt', color: '#52525b', flexShrink: 0 }}>
            {'when' in s ? `${s.when}${'score' in s ? ` · ${s.score}` : ''}` : s.period}
          </span>
        </div>
      ))}

      <p style={sectionTitle}>Skills</p>
      <p style={{ margin: 0, fontSize: '9.5pt' }}>{skills.join(' · ')}</p>

      <p
        className="mono"
        style={{ marginTop: '8pt', fontSize: '7pt', color: '#71717a' }}
      >
        Rendered from the one source (src/data/site.ts) at build time — the /resume.pdf this
        page prints is the same route, inked. omkardile.is-a.dev/resume
      </p>
    </main>
  );
}
