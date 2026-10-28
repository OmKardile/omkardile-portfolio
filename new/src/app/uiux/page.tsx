import type { Metadata } from 'next';
import Link from 'next/link';
import { site, uiux, relay, taar } from '@/data/site';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: `UI/UX Portfolio | ${site.name}`,
  description: uiux.description,
  alternates: { canonical: '/uiux' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    url: `${site.url}/uiux`,
    title: `${site.name} | UI/UX Portfolio`,
    description: uiux.description,
  },
};

function StatusTag({ status }: { status: string }) {
  return (
    <span className="status status-wip">
      <span className="status-dot" aria-hidden="true" />
      {status}
    </span>
  );
}

/* Collapsible pieces use native <details>/<summary> — accessible, no JS, works
   before hydration. `name` groups them into an exclusive accordion (opening
   one chapter closes the previous), which keeps the page short while reading. */

function Chevron() {
  return (
    <span className="ch-chev" aria-hidden="true">
      +
    </span>
  );
}

export default function UiuxPage() {
  const resumeHref = site.socials.find((s) => s.label === 'Resume')?.href;
  const linkedinHref = site.socials.find((s) => s.label === 'LinkedIn')?.href;

  return (
    <>
      {/* Hero */}
      <section className="hero hero-uiux container" id="top" aria-label="Introduction">
        <p className="hero-kicker mono hero-kicker-accent">{uiux.kicker}</p>
        <h1 className="hero-name">
          Omkar Kardile
          <span className="hero-role">{uiux.role}</span>
        </h1>
        <p className="hero-intro">{uiux.tagline}</p>
        <div className="hero-actions">
          <a className="btn btn-solid" href="#design-work">
            View design work <span aria-hidden="true">↓</span>
          </a>
          {resumeHref ? (
            <a className="btn btn-outline" href={resumeHref} target="_blank" rel="noopener noreferrer">
              Open resume <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </section>

      {/* Process */}
      <section className="section container" aria-labelledby="process-title">
        <div className="section-head">
          <p className="mono section-index section-index-accent">01 / How I work</p>
          <h2 id="process-title" className="section-title">
            Three rules, every project.
          </h2>
        </div>
        <div className="process-grid">
          {uiux.process.map((step) => (
            <div className="process-card" key={step.n}>
              <p className="mono process-n">{step.n}</p>
              <h3 className="process-title">{step.title}</h3>
              <p className="process-text">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured case studies */}
      <section className="section container" id="design-work" aria-labelledby="design-title">
        <div className="section-head">
          <p className="mono section-index section-index-accent">02 / Featured case studies</p>
          <h2 id="design-title" className="section-title">
            Two studies, end to end.
          </h2>
          <p className="section-note">
            Relay and Taar are complete and documented on this page, chapter by chapter — expand what you want to
            read. The studies still in review share detailed files on request.
          </p>
        </div>

        <article className="relay" aria-label="Relay case study">
          <div className="card-top">
            <span className="mono card-index">{relay.index}</span>
            <span className="status status-live">
              <span className="status-dot" aria-hidden="true" />
              {relay.status}
            </span>
          </div>
          <h3 className="relay-title">{relay.name}</h3>
          <p className="relay-tagline">{relay.tagline}</p>
          <p className="mono relay-meta">
            {relay.kind} · {relay.date}
          </p>

          <figure className="relay-fig">
            <img src={relay.cover} alt={relay.coverAlt} width={1600} height={1200} loading="lazy" />
          </figure>

          <p className="cs-role relay-role">
            <span className="cs-role-label">My role:</span> {relay.role}
          </p>
          <ul className="skill-list cs-tools">
            {relay.tools.map((t) => (
              <li key={t} className="skill-chip">
                {t}
              </li>
            ))}
          </ul>

          {/* Case study chapters — exclusive accordion, all collapsed by default */}
          <div className="ch-list">
            <details className="chapter" name="relay-ch">
              <summary>
                <span className="mono ch-n">01</span>
                <span className="ch-t">Overview</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                {relay.overview.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </details>

            <details className="chapter" name="relay-ch">
              <summary>
                <span className="mono ch-n">02</span>
                <span className="ch-t">Why this, why now</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{relay.whyNow}</p>
              </div>
            </details>

            <details className="chapter" name="relay-ch">
              <summary>
                <span className="mono ch-n">03</span>
                <span className="ch-t">Competitive landscape</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <ul className="fact-list">
                  {relay.competitors.map((c) => (
                    <li key={c.name}>
                      <strong>{c.name}</strong> — {c.text}
                    </li>
                  ))}
                </ul>
                <p className="relay-gap">{relay.gap}</p>
              </div>
            </details>

            <details className="chapter" name="relay-ch">
              <summary>
                <span className="mono ch-n">04</span>
                <span className="ch-t">Who it’s for &amp; the problem</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <div className="relay-persona">
                  <p className="relay-p-name">{relay.persona.name}</p>
                  <p className="relay-p-meta">{relay.persona.meta}</p>
                  <ul className="fact-list">
                    {relay.persona.facts.map((f) => (
                      <li key={f.slice(0, 24)}>{f}</li>
                    ))}
                  </ul>
                  <p className="relay-quote">“{relay.persona.quote}”</p>
                </div>
                <p className="relay-problem">{relay.problem}</p>
              </div>
            </details>

            <details className="chapter" name="relay-ch">
              <summary>
                <span className="mono ch-n">05</span>
                <span className="ch-t">Information architecture</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{relay.ia.text}</p>
                <figure className="relay-fig">
                  <img src={relay.ia.image} alt={relay.ia.alt} width={1400} height={560} loading="lazy" />
                  <figcaption>{relay.ia.caption}</figcaption>
                </figure>
              </div>
            </details>

            <details className="chapter" name="relay-ch">
              <summary>
                <span className="mono ch-n">06</span>
                <span className="ch-t">Core interaction — the checkpoint</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <div className="relay-cols">
                  <div>
                    <p>{relay.checkpoint.lead}</p>
                    <p>{relay.checkpoint.text}</p>
                    <p>{relay.checkpoint.decline}</p>
                  </div>
                  <figure className="relay-fig relay-fig-tall">
                    <img src={relay.checkpoint.image} alt={relay.checkpoint.alt} width={900} height={1560} loading="lazy" />
                    <figcaption>{relay.checkpoint.caption}</figcaption>
                  </figure>
                </div>
              </div>
            </details>

            <details className="chapter" name="relay-ch">
              <summary>
                <span className="mono ch-n">07</span>
                <span className="ch-t">Visual design system</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{relay.visual.text}</p>
                <ul className="relay-swatches">
                  {relay.visual.tokens.map((t) => (
                    <li key={t.hex} className="relay-swatch">
                      <span className="relay-swatch-dot" style={{ background: t.hex }} aria-hidden="true" />
                      <span>
                        {t.name} <small>{t.hex}</small>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="relay-note">{relay.visual.note}</p>
                <figure className="relay-fig">
                  <img src={relay.visual.image} alt={relay.visual.alt} width={1400} height={340} loading="lazy" />
                  <figcaption>{relay.visual.caption}</figcaption>
                </figure>
              </div>
            </details>

            <details className="chapter" name="relay-ch">
              <summary>
                <span className="mono ch-n">08</span>
                <span className="ch-t">Key screens</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{relay.screens.text}</p>
                <ul className="relay-screens">
                  {relay.screens.items.map((s) => (
                    <li key={s.src}>
                      <figure className="relay-fig">
                        <img src={s.src} alt={`Relay ${s.label} screen`} width={780} height={1580} loading="lazy" />
                        <figcaption>{s.label}</figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
                <p className="relay-note">{relay.screens.caption}</p>
              </div>
            </details>

            <details className="chapter" name="relay-ch">
              <summary>
                <span className="mono ch-n">09</span>
                <span className="ch-t">Live prototype</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{relay.prototype.text}</p>
                <ul className="fact-list">
                  {relay.prototype.bullets.map((b) => (
                    <li key={b.slice(0, 24)}>{b}</li>
                  ))}
                </ul>
                <div className="relay-cta-row">
                  <Link className="btn btn-solid" href={relay.prototype.href}>
                    {relay.prototype.cta} <span aria-hidden="true">→</span>
                  </Link>
                  <p className="relay-cta-note">Runs right here on this site — no download, no Figma link.</p>
                </div>
              </div>
            </details>

            <details className="chapter" name="relay-ch">
              <summary>
                <span className="mono ch-n">10</span>
                <span className="ch-t">What I’d validate next</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{relay.validate.lead}</p>
                <ul className="fact-list">
                  {relay.validate.items.map((q) => (
                    <li key={q.slice(0, 24)}>{q}</li>
                  ))}
                </ul>
                <p className="relay-note">{relay.validate.close}</p>
              </div>
            </details>
          </div>
        </article>

        {/* Case study #2 — Taar (coded prototype) */}
        <article className="relay" aria-label="Taar case study">
          <div className="card-top">
            <span className="mono card-index">{taar.index}</span>
            <span className="status status-live">
              <span className="status-dot" aria-hidden="true" />
              {taar.status}
            </span>
          </div>
          <h3 className="relay-title">{taar.name}</h3>
          <p className="relay-tagline">{taar.tagline}</p>
          <p className="mono relay-meta">
            {taar.kind} · {taar.date}
          </p>

          <figure className="relay-fig">
            <img src={taar.cover} alt={taar.coverAlt} width={900} height={780} loading="lazy" />
          </figure>

          <p className="cs-role relay-role">
            <span className="cs-role-label">My role:</span> {taar.role}
          </p>
          <ul className="skill-list cs-tools">
            {taar.tools.map((t) => (
              <li key={t} className="skill-chip">
                {t}
              </li>
            ))}
          </ul>

          <div className="ch-list">
            <details className="chapter" name="taar-ch">
              <summary>
                <span className="mono ch-n">01</span>
                <span className="ch-t">Overview &amp; the problem</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                {taar.overview.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
                <p className="relay-problem">{taar.problem}</p>
              </div>
            </details>

            <details className="chapter" name="taar-ch">
              <summary>
                <span className="mono ch-n">02</span>
                <span className="ch-t">One filter sheet, live results</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{taar.filter.text}</p>
                <figure className="relay-fig">
                  <img src={taar.filter.image} alt={taar.filter.alt} width={900} height={780} loading="lazy" />
                  <figcaption>{taar.filter.caption}</figcaption>
                </figure>
                <p>{taar.filter.chips}</p>
              </div>
            </details>

            <details className="chapter" name="taar-ch">
              <summary>
                <span className="mono ch-n">03</span>
                <span className="ch-t">Honest availability &amp; quick add</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{taar.availability}</p>
                <p>{taar.quickAdd.text}</p>
                <figure className="relay-fig">
                  <img src={taar.quickAdd.image} alt={taar.quickAdd.alt} width={900} height={780} loading="lazy" />
                  <figcaption>{taar.quickAdd.caption}</figcaption>
                </figure>
              </div>
            </details>

            <details className="chapter" name="taar-ch">
              <summary>
                <span className="mono ch-n">04</span>
                <span className="ch-t">The interface</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{taar.interface.text}</p>
                <p className="relay-note">{taar.interface.note}</p>
              </div>
            </details>

            <details className="chapter" name="taar-ch">
              <summary>
                <span className="mono ch-n">05</span>
                <span className="ch-t">Built accessible</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{taar.a11y.lead}</p>
                <ul className="fact-list">
                  {taar.a11y.items.map((a) => (
                    <li key={a.slice(0, 24)}>{a}</li>
                  ))}
                </ul>
              </div>
            </details>

            <details className="chapter" name="taar-ch">
              <summary>
                <span className="mono ch-n">06</span>
                <span className="ch-t">What’s next</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{taar.next.lead}</p>
                <ul className="fact-list">
                  {taar.next.items.map((n) => (
                    <li key={n.slice(0, 24)}>{n}</li>
                  ))}
                </ul>
                <div className="relay-cta-row">
                  <Link className="btn btn-solid" href={taar.prototype.href}>
                    {taar.prototype.cta} <span aria-hidden="true">→</span>
                  </Link>
                  <p className="relay-cta-note">Runs right here on this site — the real React build, not a video.</p>
                </div>
              </div>
            </details>
          </div>
        </article>

        {/* In-review case studies */}
        <ul className="cs-grid">
          {uiux.caseStudies.map((cs) => (
            <li className="cs-card" key={cs.index}>
              <div className="card-top">
                <span className="mono card-index">{cs.index}</span>
                <StatusTag status={cs.status} />
              </div>
              <h3 className="card-title">{cs.title}</h3>
              <p className="cs-headline">{cs.headline}</p>
              <p className="cs-problem">{cs.problem}</p>
              <p className="cs-role">
                <span className="cs-role-label">My role:</span> {cs.role}
              </p>
              <ul className="skill-list cs-tools">
                {cs.tools.map((t) => (
                  <li key={t} className="skill-chip">
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      {/* Liquid Glass studies — expandable index rows */}
      <section className="section container" id="liquid-glass" aria-labelledby="liquid-glass-title">
        <div className="section-head">
          <p className="mono section-index section-index-accent">03 / Liquid Glass studies</p>
          <h2 id="liquid-glass-title" className="section-title">
            Six apps, redesigned interactively.
          </h2>
          <p className="section-note">
            Each study is a working app plus a written case study — expand a row for both links. Interfaces, ideas,
            products and people, one glass surface at a time.
          </p>
        </div>
        <ul className="lg-list">
          {uiux.liquidGlass.map((lg, i) => {
            const [appName, kind] = lg.title.split(' — ');
            return (
              <li key={lg.app}>
                <details className="lg-row" name="lg-study">
                  <summary>
                    <span className="mono lg-idx">{String(i + 1).padStart(2, '0')}</span>
                    <span className="lg-head">
                      <span className="lg-line">
                        <span className="lg-name">{appName}</span>
                        {kind ? <span className="lg-kind"> — {kind}</span> : null}
                      </span>
                      <span className="lg-sum">{lg.summary}</span>
                    </span>
                    <Chevron />
                  </summary>
                  <div className="lg-body">
                    <p className="mono lg-pages">{lg.pages}</p>
                    <div className="lg-actions">
                      <a
                        className="lg-action"
                        href={`${site.liquidGlassAppBase}${lg.app}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open app <span aria-hidden="true">↗</span>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                      <a
                        className="lg-action"
                        href={`/case-studies/${lg.app}-case-study.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Case study PDF <span aria-hidden="true">↗</span>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </div>
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Also shipped */}
      <section className="section container" aria-labelledby="shipped-title">
        <div className="section-head">
          <p className="mono section-index section-index-accent">04 / Also shipped</p>
          <h2 id="shipped-title" className="section-title">
            Designs that made it to code.
          </h2>
        </div>
        <ul className="xp-list">
          {uiux.shipped.map((s) => (
            <li className="xp-row" key={s.title}>
              <div className="xp-main">
                <h3 className="xp-title">
                  <a className="shipped-link" href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.title} <span aria-hidden="true">↗</span>
                  </a>
                </h3>
                <p className="xp-org">{s.stack}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* About */}
      <section className="section container" aria-labelledby="about-uiux-title">
        <div className="section-head">
          <p className="mono section-index section-index-accent">05 / About</p>
          <h2 id="about-uiux-title" className="section-title">
            Designer who codes.
          </h2>
        </div>
        <div className="about-uiux">
          <p className="about-quote">{uiux.quote}</p>
          <ul className="fact-list">
            {uiux.aboutFacts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact */}
      <section className="section contact container" aria-labelledby="contact-uiux-title">
        <div className="section-head">
          <p className="mono section-index section-index-accent">06 / Contact</p>
          <h2 id="contact-uiux-title" className="section-title">
            Let’s work together.
          </h2>
        </div>
        <div className="contact-grid">
          <div>
            <p className="contact-copy">
              Have a project? I’m available for UI/UX design and frontend roles. Email is the fastest way to start a
              conversation.
            </p>
            <div className="hero-actions">
              <a className="btn btn-solid" href={`mailto:${site.email}`}>
                Send an email <span aria-hidden="true">→</span>
              </a>
              {linkedinHref ? (
                <a className="btn btn-outline" href={linkedinHref} target="_blank" rel="noopener noreferrer">
                  Connect on LinkedIn <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </div>
          </div>
          <ul className="contact-links">
            <li>
              <a href="/">Developer portfolio</a>
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

      <Footer />
    </>
  );
}
