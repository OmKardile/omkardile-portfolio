import Link from 'next/link';
import { Fragment } from 'react';
import type { UiuxProject } from '@/data/uiuxProjects';
import { BlockRenderer, isEmptyInProd } from '@/components/uiux/blocks';
import { DeviceFrame } from '@/components/uiux/DeviceFrame';

/* Shared case-study template, driven entirely by the data in
   src/data/uiuxProjects.ts — no hand-written JSX per page.

   Composition: header (number, title, tagline, meta) → the nine numbered
   sections, each a two-column editorial row (label left, content right) →
   optional "Try it" embed after section 05 → optional "Design file" (Figma)
   → previous / next project links. */

function SectionRow({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="ux-section" data-reveal suppressHydrationWarning aria-labelledby={`ux-s-${n}`}>
      <div className="ux-section-label">
        <p className="ux-section-n mono" aria-hidden="true">
          {n}
        </p>
        <h2 id={`ux-s-${n}`} className="ux-section-title">
          {title}
        </h2>
      </div>
      <div className="ux-section-body">{children}</div>
    </section>
  );
}

export function CaseStudyLayout({
  project,
  prev,
  next,
}: {
  project: UiuxProject;
  prev?: UiuxProject;
  next?: UiuxProject;
}) {
  const { sections } = project;

  /* Sections whose evidence hasn't been collected yet collapse entirely in
     production — a heading with nothing under it reads as a broken page.
     Development keeps them, rendered as dashed placeholders. The survivors
     renumber 01..N so the case never shows a numbering gap. */
  const DEV = process.env.NODE_ENV === 'development';
  const shown = DEV ? sections : sections.filter((s) => !isEmptyInProd(s.blocks));
  const wireframes = shown.findIndex((s) => s.title === 'Wireframes');

  return (
    <article
      className="ux-case"
      style={{ '--pa-light': project.accent, '--pa-dark': project.accentDark } as React.CSSProperties}
    >
      {/* Case header */}
      <header className="ux-case-head" data-reveal suppressHydrationWarning>
        <Link href="/uiux" className="ux-case-back">
          <span aria-hidden="true">←</span> All work
        </Link>
        <p className="ux-case-number" aria-hidden="true">
          {project.number}
        </p>
        <h1 className="ux-case-title">{project.title}</h1>
        <p className="ux-case-tagline">{project.tagline}</p>
        <dl className="ux-case-meta">
          <div className="ux-case-meta-item">
            <dt className="mono">Role</dt>
            <dd>{project.role.join(' · ')}</dd>
          </div>
          <div className="ux-case-meta-item">
            <dt className="mono">Tools</dt>
            <dd className="mono">{project.tools.join(' · ')}</dd>
          </div>
          <div className="ux-case-meta-item">
            <dt className="mono">Status</dt>
            <dd>
              <span className={`ux-status${project.status === 'Complete' ? ' ux-status-done' : ''}`}>
                {project.status}
              </span>
            </dd>
          </div>
        </dl>
      </header>

      {/* The numbered sections — and the live embed, slotted after Wireframes.
          Empty-in-prod sections are gone, so the label renumbers 01..N. */}
      {shown.map((section, i) => (
        <Fragment key={section.n}>
          <SectionRow n={String(i + 1).padStart(2, '0')} title={section.title}>
            <BlockRenderer blocks={section.blocks} />
          </SectionRow>
          {i === wireframes && project.prototypeUrl ? (
            <SectionRow n="＋" title="Try it">
              <div className="ux-tryit">
                <div className="ux-tryit-copy">
                  <p className="ux-p ux-tryit-lead">{project.tryIt.lead}</p>
                  <p className="ux-p">{project.tryIt.more}</p>
                </div>
                <DeviceFrame
                  src={project.prototypeEmbedUrl ?? project.prototypeUrl}
                  title={`Live prototype of ${project.title}`}
                  href={project.prototypeUrl}
                />
              </div>
            </SectionRow>
          ) : null}
        </Fragment>
      ))}

      {/* Figma embed — only when the URL exists, never "link pending" */}
      {project.figmaUrl ? (
        <SectionRow n="✳" title="Design file">
          <div className="ux-figma">
            <div className="ux-figma-frame">
              <iframe
                src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(project.figmaUrl)}`}
                title={`Figma design file of ${project.title}`}
                loading="lazy"
                allowFullScreen
              />
            </div>
            <p className="ux-device-caption">
              <a href={project.figmaUrl} target="_blank" rel="noopener noreferrer">
                Open in Figma <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </div>
        </SectionRow>
      ) : null}

      {/* Previous / next */}
      <nav className="ux-pn" aria-label="More case studies" data-reveal suppressHydrationWarning>
        {prev ? (
          <Link className="ux-pn-link ux-pn-prev" href={`/uiux/${prev.slug}`}>
            <span className="mono ux-pn-n">{prev.number}</span>
            <span className="ux-pn-dir">
              <span aria-hidden="true">←</span> Previous
            </span>
            <span className="ux-pn-title">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="ux-pn-link ux-pn-next" href={`/uiux/${next.slug}`}>
            <span className="mono ux-pn-n">{next.number}</span>
            <span className="ux-pn-dir">
              Next <span aria-hidden="true">→</span>
            </span>
            <span className="ux-pn-title">{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
