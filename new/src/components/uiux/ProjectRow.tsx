import Link from 'next/link';
import type { UiuxProject } from '@/data/uiuxProjects';

/* One editorial row on the index — the whole row is a single link target.
   Big numeral in the project accent, title, tagline, the problem in two
   lines, role, tools, status tag, "Read case study →". Rows 02/03 offset via
   the .ux-row--offset class (asymmetric grid, see uiux.css). */
export function ProjectRow({ project, offset }: { project: UiuxProject; offset?: boolean }) {
  return (
    <Link
      href={`/uiux/${project.slug}`}
      className={`ux-row${offset ? ' ux-row--offset' : ''}`}
      style={{ '--pa-light': project.accent, '--pa-dark': project.accentDark } as React.CSSProperties}
      data-reveal
      suppressHydrationWarning
    >
      <span className="ux-row-number" aria-hidden="true">
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
          <span className="ux-row-tools mono">{project.tools.join(' · ')}</span>
        </span>
        <span className="ux-row-cta">
          Read case study <span aria-hidden="true">→</span>
        </span>
      </span>
    </Link>
  );
}
