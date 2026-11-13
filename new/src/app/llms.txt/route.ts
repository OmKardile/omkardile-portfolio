import { site, projects } from '@/data/site';
import { buildScans, PUBLIC_SOURCE_REPOS, BUILDS_INDEXED } from '@/data/builds';
import { ledgerOwed, ledgerSettled } from '@/data/now';

export const dynamic = 'force-static';

/* /llms.txt — the machine-readable front door, compiled at build time from
   the same data files every page renders from. Nothing here is typed
   twice: the builds come from site.ts (stacks verified by the repo scan
   in builds.ts), the ledger from now.ts, the routes from the file tree.
   An assistant that reads this gets the facts, the receipts and the
   open promises with their dates — accountability as metadata. */

export async function GET() {
  const lines: string[] = [];
  const url = (p: string) => `${site.url}${p}`;

  lines.push(`# ${site.name} — portfolio`);
  lines.push('');
  lines.push(`> ${site.statement}`);
  lines.push('');
  lines.push(`${site.role} in ${site.location}. One person, both ends of the work: product`);
  lines.push('and UI/UX design paired with the engineering to ship the result in code.');
  lines.push('');
  lines.push('## Contact');
  lines.push('');
  lines.push(`- Email: ${site.email}`);
  lines.push(`- Phone: ${site.phone}`);
  lines.push(`- Site: ${site.url}`);
  lines.push('- GitHub: https://github.com/OmKardile');
  lines.push('- LinkedIn: https://www.linkedin.com/in/omkar-kardile-49501b213/');
  lines.push('- Resume: ' + url('/resume.pdf') + ' (print route: ' + url('/resume') + ')');
  lines.push('');
  lines.push(`## Builds (${projects.length + 1}, every stack verified from the repo manifest)`);
  lines.push('');
  lines.push(`- ${site.url.replace('https://', '')} — Portfolio, live — Next.js 16 · React 19 ·`);
  lines.push('  TypeScript · Tailwind CSS 4 · Lenis, on Vercel. Source: https://github.com/OmKardile/omkardile-portfolio');
  for (const p of projects) {
    const scan = buildScans.find((b) => b.slug === p.slug);
    const repo = p.links?.find((l) => l.href.includes('github.com'))?.href ?? (scan ? `https://github.com/${scan.repo}` : null);
    const name = p.title.split(' — ')[0];
    lines.push(`- ${name} — ${p.kind}, ${p.status} (${p.year}) — ${p.stack}`);
    if (repo) lines.push(`  Source: ${repo}`);
    if (scan) lines.push(`  Repo scan: ${scan.files} tracked files on ${scan.branch}; manifest-verified: ${scan.verifiedStack}`);
  }
  lines.push('');
  lines.push('## Routes');
  lines.push('');
  lines.push(`- ${url('/')} — the pitch, the work, skills, experience`);
  lines.push('- ' + url('/uiux') + ' — the UI/UX portfolio: case studies with live prototypes');
  lines.push('- ' + url('/library') + ' — the docs: system documents whole, design systems, the sites guide');
  lines.push('- ' + url('/colophon') + ' — how everything is made: the fleet + this build in detail');
  lines.push('- ' + url('/now') + ' — the ledger: open promises with dates, settled ones stamped');
  lines.push('- ' + url('/receipt') + ' — the candidate receipt: the three best proofs, printable');
  lines.push('- ' + url('/resume') + ' — the resume, rendered from the one source');
  lines.push('');
  lines.push('## The ledger — open promises, dated');
  lines.push('');
  for (const e of ledgerOwed) {
    lines.push(`- [owes, ${e.logged}] ${e.item} — ${e.detail}`);
  }
  lines.push(`- ${ledgerSettled.length} entries settled, each stamped with the version that closed it`);
  lines.push('');
  lines.push('## Facts');
  lines.push('');
  lines.push(`- ${PUBLIC_SOURCE_REPOS} public source repos on GitHub; ${buildScans.length} build repos scanned ${BUILDS_INDEXED}`);
  lines.push('- Every claim on the site traces to a data file, a repo, or a live deployment');
  lines.push('- Skills without shipped evidence are marked "learning", not passed off as practiced');
  lines.push('- This file is compiled from src/data/site.ts, src/data/builds.ts and src/data/now.ts');
  lines.push('  at build time — regenerate the data, regenerate the truth.');
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
