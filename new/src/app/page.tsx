import { site, projects, capabilities, experience } from '@/data/site';
import { Footer } from '@/components/Footer';

function SectionHead({ id, index, title, note }: { id: string; index: string; title: string; note?: string }) {
  return (
    <div className="section-head">
      <p className="section-index mono">{index}</p>
      <h2 id={id} className="section-title">
        {title}
      </h2>
      {note ? <p className="section-note">{note}</p> : null}
    </div>
  );
}

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

function CardLinks({ links }: { links?: { href: string; label: string }[] }) {
  if (!links || links.length === 0) {
    return <p className="card-link card-link-muted">Link to come</p>;
  }
  return (
    <>
      {links.map((l) => (
        <a key={l.href} className="card-link" href={l.href} target="_blank" rel="noopener noreferrer">
          {l.label} <span aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ))}
    </>
  );
}

export default function Home() {
  const resumeHref = site.socials.find((s) => s.label === 'Resume')?.href;

  return (
    <>
      {/* .page-dev flips --accent to the dev blue so this page shares the
          same accent patterns as /uiux in its own color (see globals.css). */}
      <div className="page-dev">
      {/* Hero */}
      <section className="hero container" id="top" aria-label="Introduction">
        <p className="hero-kicker mono">Portfolio · Pune, India · Open to work</p>
        <h1 className="hero-name">
          Omkar Kardile
          <span className="hero-role">Developer &amp; UI/UX Designer</span>
        </h1>
        <p className="hero-intro">
          I design and build thoughtful digital products that are simple, useful, and human — pairing product and
          UI/UX design with the engineering to ship the result in code. One person, both ends of the work.
        </p>
        <div className="hero-actions">
          <a className="btn btn-solid" href="#work">
            View selected work <span aria-hidden="true">↓</span>
          </a>
          {resumeHref ? (
            <a className="btn btn-outline" href={resumeHref} target="_blank" rel="noopener noreferrer">
              Open resume <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </section>

      {/* Work */}
      <section className="section container" id="work" aria-labelledby="work-title">
        <SectionHead
          id="work-title"
          index="01 / Selected work"
          title="Built, shipped, and in progress."
          note="Live products, client work and course projects — from a retail ERP to a café operations platform. Links point only to verified destinations."
        />
        <ul className="work-grid">
          {projects.map((p) => {
            const linked = !!p.links && p.links.length === 1;
            const body = (
              <>
                <div className="card-top">
                  <span className="mono card-index">{p.index}</span>
                  <StatusTag status={p.status} />
                </div>
                <h3 className="card-title">{p.title}</h3>
                <p className="card-summary">{p.summary}</p>
                <p className="mono card-stack">{p.stack}</p>
                {/* Single-link cards keep the whole-card anchor (large hit target);
                    multi-link cards render one labeled anchor per destination. */}
                {linked ? (
                  <p className="card-link">{p.links![0].label} <span aria-hidden="true">↗</span></p>
                ) : (
                  <CardLinks links={p.links} />
                )}
              </>
            );
            return (
              <li key={p.slug} className={p.links && p.links.length > 0 ? 'work-card work-card-linked' : 'work-card'}>
                {linked ? (
                  <a href={p.links![0].href} target="_blank" rel="noopener noreferrer">
                    {body}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <div>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Skills */}
      <section className="section container" id="skills" aria-labelledby="skills-title">
        <SectionHead id="skills-title" index="02 / Skills" title="Both ends of the work." />
        <div className="skills-grid">
          {[capabilities.design, capabilities.build].map((cap) => (
            <div className="skill-group" key={cap.label}>
              <h3 className="skill-label">{cap.label}</h3>
              <p className="skill-note">{cap.note}</p>
              <ul className="skill-list">
                {cap.items.map((item) => (
                  <li key={item} className="skill-chip">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="section container" id="experience" aria-labelledby="experience-title">
        <SectionHead id="experience-title" index="03 / Experience" title="Background." />
        <ul className="xp-list">
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
        <div className="contact-grid">
          <div>
            <p className="contact-copy">
              I’m open to UI/UX design and frontend development roles and collaborations. Email is the fastest way to
              start a conversation.
            </p>
            <a className="btn btn-solid" href={`mailto:${site.email}`}>
              Email me <span aria-hidden="true">→</span>
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
      </div>

      <Footer />
    </>
  );
}
