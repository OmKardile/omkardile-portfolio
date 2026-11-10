import { site, projects, capabilities, experience } from '@/data/site';
import { Footer } from '@/components/Footer';
import { CardSummary } from '@/components/CardSummary';
import { MotionReady } from '@/components/MotionReady';

function SectionHead({ id, index, title, note }: { id: string; index: string; title: string; note?: string }) {
  return (
    <div className="section-head" data-reveal suppressHydrationWarning>
      <p className="section-index mono">{index}</p>
      <h2 id={id} className="section-title" data-split>
        {title}
      </h2>
      {note ? <p className="section-note">{note}</p> : null}
    </div>
  );
}

/* Kinetic ticker words — the build vocabulary. Lives at the top of the footer
   now (was under the hero); the Footer component renders it. Decorative
   (aria-hidden): the same facts are readable in the Skills section. */
const TICKER = [
  'React',
  'TypeScript',
  'Next.js',
  'Node.js',
  'Prisma',
  'PostgreSQL',
  'Tailwind',
  'UI/UX design',
  'Design systems',
  'Figma',
];

function StatusTag({ status }: { status: 'live' | 'building' }) {
  return status === 'live' ? (
    <span className="status status-live">
      <span className="status-dot" aria-hidden="true" />
      Live
    </span>
  ) : (
    <span className="status status-building">
      <span className="status-dot" aria-hidden="true" />
      In development
    </span>
  );
}

function CardLinks({ links }: { links?: { href: string; label: string; note?: string }[] }) {
  if (!links || links.length === 0) {
    return <p className="card-link card-link-muted">Link to come</p>;
  }
  return (
    <>
      {links.map((l) => (
        <span key={l.href} className="card-link-item">
          <a className="card-link" href={l.href} target="_blank" rel="noopener noreferrer">
            {l.label} <span className="btn-arrow btn-arrow-out" aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          {l.note ? <span className="card-link-note">{l.note}</span> : null}
        </span>
      ))}
    </>
  );
}

/* Last-commit chip: fetched at build time (revalidated daily server-side),
   so "actively maintained" is a verifiable claim, not a vibe. Source is the
   repo's commits Atom feed, not the REST API — the API caps anonymous
   requests at 60/h per IP, which a shared build runner burns through; the
   HTML-side feed carries the same latest-commit timestamp uncapped. The
   feed-level <updated> is the newest commit on main. Fetch failure just
   omits the chip — it never lies. */
async function lastPush(repo: string): Promise<string | null> {
  if (!repo) return null;
  try {
    const res = await fetch(`https://github.com/OmKardile/${repo}/commits/main.atom`, {
      headers: { 'User-Agent': 'omkardile-portfolio' },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const xml = await res.text();
    const m = xml.match(/<updated>([^<]+)<\/updated>/);
    if (!m) return null;
    return new Date(m[1]).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
  } catch {
    return null;
  }
}

export default async function Home() {
  const resumeHref = site.socials.find((s) => s.label === 'Resume')?.href;

  /* Repos that back the live work cards — only the ones that exist on
     GitHub get the chip; the mapping is verified against the API call.
     Building projects with no repo yet simply don't appear here. */
  const REPO_FOR: Record<string, string> = {
    ssshopee: 'sss-erp-hybrid',
    servepoint: 'servepoint',
    patelnetworks: 'patel-networks',
    'tech-site': 'tech-site',
    handoff: 'handOff',
  };

  const liveProjects = projects.filter((p) => p.status === 'live');
  const pushes = await Promise.all(
    liveProjects.map(async (p) => lastPush(REPO_FOR[p.slug] ?? '')),
  );
  // Nothing to show? Keep the section a plain grid (never an empty promise).
  const hasAnyPush = pushes.some(Boolean);

  return (
    <>
      {/* .page-dev flips --accent to the dev blue so this page shares the
          same accent patterns as /uiux in its own color (see globals.css). */}
      <div className="page-dev">
      {/* Hero */}
      <section className="hero container" id="top" aria-label="Introduction">
        <p className="hero-kicker mono">Portfolio · Pune, India · Open to work</p>
        <h1 className="hero-name" data-split>
          Omkar Kardile
          <span className="hero-role">Developer &amp; UI/UX Designer</span>
        </h1>
        <p className="hero-intro">
          I design and build thoughtful digital products that are simple, useful, and human — pairing product and
          UI/UX design with the engineering to ship the result in code. One person, both ends of the work.
        </p>
        <div className="hero-actions">
          <a className="btn btn-solid" href="#work">
            View selected work <span className="btn-arrow btn-arrow-down" aria-hidden="true">↓</span>
          </a>
          {resumeHref ? (
            <a className="btn btn-outline" href={resumeHref} target="_blank" rel="noopener noreferrer">
              Open resume <span className="btn-arrow btn-arrow-out" aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </section>

      {/* Work */}
      <section className="section container" id="work" aria-labelledby="work-title">
        <SectionHead
          id="work-title"
          index="01 / Selected work"
          title="Built and shipped."
          note="Live products and client work — from a retail ERP to a café operations platform. Every link opens the real thing."
        />
        <ul className="work-grid" data-reveal-group suppressHydrationWarning>
          {liveProjects.map((p, pi) => {
            const linked = !!p.links && p.links.length > 0;
            const pushed = pushes[pi];
            return (
              <li key={p.slug} className={linked ? 'work-card work-card-linked' : 'work-card'}>
                {/* Plain card (no whole-card anchor): the …more toggle inside
                    the summary must not sit inside an <a>, and every linked
                    card already carries labeled links at its foot. */}
                <div>
                  <div className="card-top">
                    <span className="mono card-index">{p.index}</span>
                    <StatusTag status={p.status} />
                  </div>
                  <h3 className="card-title">{p.title}</h3>
                  <CardSummary text={p.summary} />
                  <p className="mono card-stack">{p.stack}</p>
                  {hasAnyPush && pushed ? (
                    <p className="mono card-pushed" title="Last push to the repo, from its commit feed at build time">
                      last commit {pushed}
                    </p>
                  ) : null}
                  <CardLinks links={p.links} />
                </div>
              </li>
            );
          })}
        </ul>

        {/* In development — quiet bench rows under the grid. The shipped work
            above is the headline; these sit lower, smaller, badge-free. */}
        <div className="work-wip">
          <p className="mono work-wip-label">In development</p>
          <ul className="work-wip-list" data-reveal-group suppressHydrationWarning>
            {projects
              .filter((p) => p.status === 'building')
              .map((p) => (
                <li className="work-wip-row" key={p.slug}>
                  <span className="mono work-wip-idx" aria-hidden="true">
                    {p.index}
                  </span>
                  <div className="work-wip-main">
                    <h3 className="work-wip-title">{p.title}</h3>
                    <p className="work-wip-text">{p.summary}</p>
                  </div>
                  <p className="mono work-wip-stack">{p.stack}</p>
                </li>
              ))}
          </ul>
        </div>
      </section>

      {/* Skills */}
      <section className="section container" id="skills" aria-labelledby="skills-title">
        <SectionHead id="skills-title" index="02 / Skills" title="Both ends of the work." />
        <div className="skills-grid" data-reveal-group suppressHydrationWarning>
          {[capabilities.design, capabilities.build].map((cap) => (
            <div className="skill-group" key={cap.label}>
              <h3 className="skill-label">{cap.label}</h3>
              <p className="skill-note">{cap.note}</p>
              <ul className="skill-list">
                {cap.items.map((item) => {
                  const learning = cap.learning.includes(item);
                  return (
                    <li
                      key={item}
                      className="skill-chip"
                      title={learning ? 'Learning — no shipped evidence yet' : undefined}
                    >
                      {item}
                      {learning ? (
                        <span className="mono" style={{ color: 'var(--muted)' }} aria-label="learning">
                          {' '}· learning
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <p
          className="mono"
          data-reveal
          suppressHydrationWarning
          style={{ color: 'var(--muted)', fontSize: '0.74rem', marginTop: '0.8rem' }}
        >
          · learning — marked honestly: evidence pending, the receipts land as they ship.
        </p>
      </section>

      {/* Experience */}
      <section className="section container" id="experience" aria-labelledby="experience-title">
        <SectionHead id="experience-title" index="03 / Experience" title="Background." />
        <ul className="xp-list" data-reveal-group suppressHydrationWarning>
          {experience.map((e) => (
            <li className="xp-row" key={e.title}>
              <div className="xp-main">
                <h3 className="xp-title">{e.title}</h3>
                <p className="xp-org">{e.org}</p>
              </div>
              <div className="xp-side">
                <p className="xp-kind">{e.kind}</p>
                <p className="mono xp-period">{e.period}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Contact */}
      <section className="section contact container" id="contact" aria-labelledby="contact-title">
        <SectionHead id="contact-title" index="04 / Contact" title="Let’s make something useful." />
        <div className="contact-grid" data-reveal suppressHydrationWarning>
          <div>
            <p className="contact-copy">
              I’m open to UI/UX design and frontend development roles and collaborations. Email is the fastest way to
              start a conversation.
            </p>
            <a className="btn btn-solid" href={`mailto:${site.email}`}>
              Email me <span className="btn-arrow btn-arrow-right" aria-hidden="true">→</span>
            </a>
          </div>
          <ul className="contact-links">
            <li>
              <a href="/uiux">UI/UX portfolio</a>
            </li>
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
          </ul>
        </div>
      </section>

      {/* Footer sits inside .page-dev so the ticker's accent dots wear the
          dev blue — same accent patterns as the rest of this page. */}
      <Footer ticker={TICKER} />
      </div>

      {/* Page-hydration sentinel: MotionCraft waits for this before touching page DOM. */}
      <MotionReady />
    </>
  );
}
