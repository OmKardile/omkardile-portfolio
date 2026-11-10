import type { Metadata } from 'next';
import { site } from '@/data/site';
import { uiuxProjects } from '@/data/uiuxProjects';
import { UiuxShell } from '@/components/uiux/UiuxShell';
import { CaseStudyLayout } from '@/components/uiux/CaseStudyLayout';

/* /uiux/sutra — case study 03, checkout + design system. One data-driven
   template (CaseStudyLayout); this file only resolves the entry + metadata. */

const project = uiuxProjects[2];

export const metadata: Metadata = {
  title: `${project.title} — ${project.status === 'Complete' ? 'Complete' : 'In progress'} case study`,
  description: project.tagline,
  alternates: { canonical: `/uiux/${project.slug}` },
  openGraph: {
    type: 'article',
    siteName: site.name,
    url: `${site.url}/uiux/${project.slug}`,
    title: `${project.title} | UI/UX Case Study ${project.number}`,
    description: project.tagline,
    /* Rendered from the case study's own accent — scripts/gen-og-images.py */
    images: [`/og/uiux-${project.slug}.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${project.title} | UI/UX Case Study ${project.number}`,
    description: project.tagline,
    images: [`/og/uiux-${project.slug}.png`],
  },
};

export default function SutraCaseStudy() {
  return (
    <UiuxShell>
      <CaseStudyLayout project={project} prev={uiuxProjects[1]} next={uiuxProjects[0]} />
    </UiuxShell>
  );
}
