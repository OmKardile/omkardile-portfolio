import Link from 'next/link';
import type { UiuxProject, WireframeArt } from '@/data/uiuxProjects';
import { WireframeArtSvg } from '@/components/uiux/WireframeArt';

/* One editorial row on the index — the whole row is a single link target.
   The numeral is a huge outlined ghost (Anton) that drifts on scroll and
   fills with the project accent on hover; a wireframe "peek" card trails
   the cursor over the row (fine pointers only, see UiuxMotion). Title in
   Syne, meta in Space Mono, tagline + problem in Hanken. Rows 02/03 offset
   via the .ux-row--offset class (asymmetric grid, see uiux.css). */
export function ProjectRow({
  project,
  offset,
  peekArt,
}: {
  project: UiuxProject;
  offset?: boolean;
  peekArt?: WireframeArt | null;
}) {
  return (
    <Link
      href={`/uiux/${project.slug}`}
      className={`ux-row${offset ? ' ux-row--offset' : ''}`}
      style={{ '--pa-light': project.accent, '--pa-dark': project.accentDark } as React.CSSProperties}
      data-reveal
      data-peek
      suppressHydrationWarning
    >
      <span className="ux-row-number" aria-hidden="true" data-drift>
        {project.number}
      </span>
      <span className="ux-row-body">
        <span className="ux-row-top">
          <span className="ux-row-title">{project.title}</span>
          <span className={`ux-status${project.status === 'Complete' ? ' ux-status-done' : ''}`}>{project.status}</span>
        </span>
        <span className="ux-row-tagline">{project.tagline}</span>
        <span className="ux-row-problem">{project.problem}</span>
        <span className="ux-row-meta">
          <span className="ux-row-role">{project.role.join(' · ')}</span>
          <span className="ux-row-tools">{project.tools.join(' · ')}</span>
        </span>
        <span className="ux-row-cta">
          Read case study <span aria-hidden="true">→</span>
        </span>
      </span>
      {peekArt ? (
        <span className="ux-row-peek" aria-hidden="true">
          <WireframeArtSvg art={peekArt} />
        </span>
      ) : null}
    </Link>
  );
}
