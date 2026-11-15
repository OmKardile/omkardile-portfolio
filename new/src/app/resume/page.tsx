import type { Metadata } from 'next';
import { site, projects, experience, capabilities } from '@/data/site';
import {
  resumeEducation,
  resumeSummary,
  resumeSkills,
  proofUsage,
  roleBullets,
} from '@/data/resume';

export const metadata: Metadata = {
  title: 'Resume',
  description:
    'The resume of Omkar Kardile — rendered from the same data files the site renders from, printed to /resume.pdf from this route.',
  alternates: { canonical: './' },
};

/* /resume — the print route from [1.5.9], tuned for parsers in [1.6.1].
   One source, one page: name, contact, roles, projects and skills render
   from src/data/site.ts; only the resume-only facts come from
   src/data/resume.ts. The contact line can't drift the way the old PDF's
   did. [1.6.1] changes, from an ATS-extraction review:
   - headings are plain words with no letter-spacing (tracked text made
     extractors split "SUMMARY" into "S UMMA R Y"), so a parser keeps the
     section names;
   - roles and education are single inline lines, not flex rows — joined
     text runs glued words like "ERPthat" in extraction;
   - the phone number left the printed page (email is the contact; the
     vCard QR on /receipt carries the phone for anyone who wants it);
   - the repo-manifest file counts stayed on the site — the resume says
     what each product does for a real person (proofUsage in resume.ts);
   - the "rendered from the one source" footer left the printed page.
   scripts/build-resume-pdf.py prints this route to public/resume.pdf and
   refuses a second page, a drifted contact line, or a glued word.
   Experience bullets render only for orgs with facts in roleBullets —
   nothing ships as placeholder. Single column, real text, ATS-safe. */

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
  fontSize: '10.5pt',
  borderBottom: '1px solid #18181b',
  paddingBottom: '2pt',
  margin: '10pt 0 5pt',
  fontWeight: 700,
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
      <h1 style={{ fontSize: '20pt', fontWeight: 700, margin: 0 }}>{site.name}</h1>
      <p style={{ margin: '2pt 0 0', fontSize: '11pt', color: '#52525b' }}>{site.role}</p>
      <p style={{ margin: '6pt 0 0', fontSize: '9pt' }}>
        {site.email} · {site.location} · {site.url.replace('https://', '')} ·
        github.com/OmKardile · linkedin.com/in/omkar-kardile-49501b213
      </p>

      <p style={sectionTitle}>Summary</p>
      <p style={{ margin: 0 }}>{resumeSummary}</p>

      <p style={sectionTitle}>Experience</p>
      {roles.map((r) => (
        <div key={`${r.title}-${r.org}`} style={{ marginBottom: '5pt' }}>
          <p style={{ margin: 0 }}>
            <strong style={{ fontSize: '10pt' }}>
              {r.title} · {r.org}
            </strong>
            {' — '}
            <span style={{ fontSize: '9pt', color: '#52525b' }}>{r.period}</span>
          </p>
          {(roleBullets[r.org] ?? []).map((b) => (
            <p key={b} style={{ margin: '1pt 0 0 12pt', fontSize: '9.5pt', color: '#3f3f46' }}>
              • {b}
            </p>
          ))}
        </div>
      ))}

      <p style={sectionTitle}>Projects</p>
      {proofs.map((p) => (
        <div key={p.slug} style={{ marginBottom: '5pt' }}>
          <p style={{ margin: 0 }}>
            <strong style={{ fontSize: '10pt' }}>{p.title.split(' — ')[0]}</strong>
            {' — '}
            <span style={{ fontSize: '9pt', color: '#52525b' }}>
              {p.kind}, {p.year}
            </span>
          </p>
          <p style={{ margin: '1pt 0 0', fontSize: '9.5pt' }}>{proofUsage[p.slug]}</p>
          <p style={{ margin: '1pt 0 0', fontSize: '9pt', color: '#3f3f46' }}>{p.stack}</p>
        </div>
      ))}

      <p style={sectionTitle}>Education</p>
      {schools.map((s) => (
        <p key={s.what} style={{ margin: '0 0 2pt' }}>
          {'what' in s ? s.what : `${s.title} — ${s.org}`}
          {' — '}
          <span style={{ fontSize: '9pt', color: '#52525b' }}>
            {'when' in s ? `${s.when}${'score' in s ? ` · ${s.score}` : ''}` : s.period}
          </span>
        </p>
      ))}

      <p style={sectionTitle}>Skills</p>
      <p style={{ margin: 0, fontSize: '9.5pt' }}>{skills.join(' · ')}</p>
      <p style={{ margin: '3pt 0 0', fontSize: '9.5pt', color: '#3f3f46' }}>
        Also: {resumeSkills}
      </p>
    </main>
  );
}
