/* The resume's resume-only facts. Everything site.ts already knows — name,
   role, location, contact, projects, stacks, skills, roles — is imported at
   render time, not retyped here; this file carries only what site.ts
   doesn't. That's the one-source rule from [1.5.9]: the /resume route,
   the public/resume.pdf built from it, the candidate receipt and the
   vCard QR all read the same fields, so the contact line that drifted
   (the old PDF's omkardile84@gmail.com vs the site's real email) can't
   drift again. Education rows beyond the PG-DMC are the only retyped
   facts — site.ts's experience array carries the roles and the diploma. */

export type ResumeEducation = {
  what: string;
  when: string;
  score: string;
};

export const resumeEducation: ResumeEducation[] = [
  {
    what: 'B.Tech, Computer Engineering — D.Y. Patil School of Engineering & Technology, Pune',
    when: '2025',
    score: '70.00%',
  },
  {
    what: 'Diploma, Computer Engineering — K.K. Wagh Polytechnic, Nashik',
    when: '2022',
    score: '80.4%',
  },
  {
    what: 'Class X, Marutirao Kote Abhinav Public School (Maharashtra State Board)',
    when: '2019',
    score: '75.2%',
  },
];

export const resumeSummary =
  'Full stack developer and UI/UX designer who builds web, Android and Windows apps with ' +
  'React, Next.js, TypeScript, Node.js and Supabase — and designs them in Figma first. ' +
  'Shipped a retail ERP that runs a real store on web, Android and Windows, a café ' +
  'operations platform, and a real-time client e-commerce build.';

/* The ATS keyword line, resume-only — the site's skill chips are curated
   and deliberately narrow, but a resume parser looks for staples. Every
   keyword here comes from the resume's own previous skills section (the
   candidate's earlier artifact), so none of it is invented for the
   parser's sake. */
export const resumeSkills =
  'JavaScript · HTML5 · CSS3 · REST APIs · Git · GitHub · MongoDB · MySQL · Firebase · ' +
  'Express.js · React Native · Kotlin · Electron · Capacitor · Expo · PWA · SSR/SSG · ' +
  'responsive design · authentication and role-based access · Postman · npm · Vercel · Render';

/* Usage lines replace the repo-manifest file counts on the resume itself:
   a recruiter reads what the product does for a real person, the site
   keeps the scans. Keys are project slugs from site.ts. */
export const proofUsage: Record<string, string> = {
  ssshopee:
    'Runs a real kirana store daily — billing at the counter, inventory and restock, customer credit ledgers, purchase and expense tracking.',
  servepoint:
    'Runs a café counter end to end — ordering with GST checkout, live kitchen queue, bill collection and the end-of-day close.',
  patelnetworks:
    'Shipped to a paying client — storefront with catalog and exclusive bundles, Razorpay checkout, GST invoicing with serial-tracked warranty.',
};

/* Experience bullets, waiting on the only input that cannot be
   reconstructed: what the work actually was, in the candidate's own
   words. Keys are the org names from site.ts's experience array. The
   route renders bullets for an org only when facts exist here — no
   placeholder sentences ship. */
export const roleBullets: Record<string, string[]> = {
  // 'SWAAS TECHNO, Khardi': [
  //   '— facts pending from the candidate —',
  // ],
};

