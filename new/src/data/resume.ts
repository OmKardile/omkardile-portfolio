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
