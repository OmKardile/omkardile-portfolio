import type { Metadata } from 'next';
import Link from 'next/link';
import { site, uiux, relay, taar, sutra, lethe, stoop } from '@/data/site';
import { Footer } from '@/components/Footer';
import { MotionReady } from '@/components/MotionReady';

/* Kinetic ticker words — the craft vocabulary, full-bleed under the hero.
   Decorative (aria-hidden): the same facts are readable in the sections below. */
const TICKER = [
  'Research',
  'IA & flows',
  'Design systems',
  'Prototyping',
  'Accessibility',
  'Figma',
  'React',
  'Usability testing',
  'Design tokens',
  'Visual craft',
];

export const metadata: Metadata = {
  /* The root template already appends "| Omkar Kardile" — don't double it. */
  title: 'UI/UX Portfolio',
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
  return (
    <>
      {/* Hero — warm-paper editorial: status row, giant tagline, intro + actions */}
      <section className="hero hero-uiux container" id="top" aria-label="Introduction">
        <p className="uiux-status mono">
          <span className="uiux-open">
            <span className="uiux-open-dot" aria-hidden="true" />
            Open to work
          </span>
          <span className="uiux-status-meta">{uiux.role}</span>
          {/* Fuller location form for the status row (site.location is "Pune, India"). */}
          <span className="uiux-status-meta">Pune, Maharashtra</span>
        </p>
        {/* Marked-up mirror of uiux.tagline — keep the two in sync.
            data-split: MotionCraft rises the words through masks on entry. */}
        <h1 className="uiux-headline" data-split>
          I design interfaces that are <span className="hl-accent">honest</span>. Then I{' '}
          <span className="hl-strong">build</span> <span className="hl-muted">them.</span>
        </h1>
        <div className="uiux-foot">
          <p className="uiux-intro">{uiux.intro}</p>
          <div className="uiux-actions">
            <a className="btn btn-ghost" href={`mailto:${site.email}`} data-magnetic>
              Email me
            </a>
            <a className="textlink" href="#design-work" data-magnetic>
              See the work
            </a>
          </div>
        </div>
      </section>

      {/* Full-bleed kinetic ticker between the hero and the work. */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span className="ticker-item" key={`${t}-${i}`}>
              {t}
              <span className="ticker-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* Process */}
      <section className="section container" aria-labelledby="process-title">
        {/* suppressHydrationWarning: ScrollReveal (layout) may add `revealed`
            to this server HTML before this boundary hydrates — intentional
            external class mutation, not a real mismatch. */}
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="mono section-index section-index-accent">01 / How I work</p>
          <h2 id="process-title" className="section-title">
            Three rules, every project.
          </h2>
        </div>
        <div className="process-grid" data-reveal-group suppressHydrationWarning>
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
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="mono section-index section-index-accent">02 / Featured case studies</p>
          <h2 id="design-title" className="section-title" data-split>
            Five studies, documented.
          </h2>
          <p className="section-note">
            Relay, Taar and Sutra run as live prototypes right here on this site; Lethe and Stoop are documented
            concepts. Every study expands chapter by chapter — read what you want. The food delivery study is still in
            progress and shares files on request.
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

          <figure className="relay-fig" data-curtain>
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
                    {relay.prototype.cta} <span className="btn-arrow btn-arrow-right" aria-hidden="true">→</span>
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

          <figure className="relay-fig" data-curtain>
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
                    {taar.prototype.cta} <span className="btn-arrow btn-arrow-right" aria-hidden="true">→</span>
                  </Link>
                  <p className="relay-cta-note">Runs right here on this site — the real React build, not a video.</p>
                </div>
              </div>
            </details>
          </div>
        </article>

        {/* Case study #3 — Sutra Checkout (coded prototype + design system) */}
        <article className="relay" aria-label="Sutra Checkout case study">
          <div className="card-top">
            <span className="mono card-index">{sutra.index}</span>
            <span className="status status-live">
              <span className="status-dot" aria-hidden="true" />
              {sutra.status}
            </span>
          </div>
          <h3 className="relay-title">{sutra.name}</h3>
          <p className="relay-tagline">{sutra.tagline}</p>
          <p className="mono relay-meta">
            {sutra.kind} · {sutra.date}
          </p>

          <p className="cs-role relay-role">
            <span className="cs-role-label">My role:</span> {sutra.role}
          </p>
          <ul className="skill-list cs-tools">
            {sutra.tools.map((t) => (
              <li key={t} className="skill-chip">
                {t}
              </li>
            ))}
          </ul>

          <div className="ch-list">
            <details className="chapter" name="sutra-ch">
              <summary>
                <span className="mono ch-n">01</span>
                <span className="ch-t">Overview &amp; the problem</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                {sutra.overview.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
                <p className="relay-problem">{sutra.problem}</p>
              </div>
            </details>

            <details className="chapter" name="sutra-ch">
              <summary>
                <span className="mono ch-n">02</span>
                <span className="ch-t">Forgiving forms</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{sutra.forgiving.text}</p>
                <ul className="fact-list">
                  {sutra.forgiving.items.map((i) => (
                    <li key={i.slice(0, 24)}>{i}</li>
                  ))}
                </ul>
              </div>
            </details>

            <details className="chapter" name="sutra-ch">
              <summary>
                <span className="mono ch-n">03</span>
                <span className="ch-t">Fees before commitment</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{sutra.fees.text}</p>
              </div>
            </details>

            <details className="chapter" name="sutra-ch">
              <summary>
                <span className="mono ch-n">04</span>
                <span className="ch-t">One system, two products</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{sutra.system.text}</p>
                <ul className="relay-swatches">
                  {sutra.system.tokens.map((t) => (
                    <li key={t.hex} className="relay-swatch">
                      <span className="relay-swatch-dot" style={{ background: t.hex }} aria-hidden="true" />
                      <span>
                        {t.name} <small>{t.hex}</small>
                      </span>
                    </li>
                  ))}
                </ul>
                <ul className="fact-list">
                  {sutra.system.items.map((i) => (
                    <li key={i.slice(0, 24)}>{i}</li>
                  ))}
                </ul>
              </div>
            </details>

            <details className="chapter" name="sutra-ch">
              <summary>
                <span className="mono ch-n">05</span>
                <span className="ch-t">Built accessible</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{sutra.a11y.lead}</p>
                <ul className="fact-list">
                  {sutra.a11y.items.map((a) => (
                    <li key={a.slice(0, 24)}>{a}</li>
                  ))}
                </ul>
              </div>
            </details>

            <details className="chapter" name="sutra-ch">
              <summary>
                <span className="mono ch-n">06</span>
                <span className="ch-t">Honest limits</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <ul className="fact-list">
                  {sutra.limits.map((l) => (
                    <li key={l.slice(0, 24)}>{l}</li>
                  ))}
                </ul>
                <p className="relay-note">
                  Next up: {sutra.next.items[0].charAt(0).toLowerCase()}
                  {sutra.next.items[0].slice(1)}
                </p>
              </div>
            </details>

            <details className="chapter" name="sutra-ch">
              <summary>
                <span className="mono ch-n">07</span>
                <span className="ch-t">Live prototype</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{sutra.prototype.text}</p>
                <ul className="fact-list">
                  {sutra.prototype.bullets.map((b) => (
                    <li key={b.slice(0, 24)}>{b}</li>
                  ))}
                </ul>
                <div className="relay-cta-row">
                  <Link className="btn btn-solid" href={sutra.prototype.href}>
                    {sutra.prototype.cta} <span className="btn-arrow btn-arrow-right" aria-hidden="true">→</span>
                  </Link>
                  <p className="relay-cta-note">Runs right here on this site — checkout and design system included.</p>
                </div>
              </div>
            </details>
          </div>
        </article>

        {/* Case study #4 — Lethe (documented concept) */}
        <article className="relay" aria-label="Lethe case study">
          <div className="card-top">
            <span className="mono card-index">{lethe.index}</span>
            <span className="status status-concept">
              <span className="status-dot" aria-hidden="true" />
              {lethe.status}
            </span>
          </div>
          <h3 className="relay-title">{lethe.name}</h3>
          <p className="relay-tagline">{lethe.tagline}</p>
          <p className="mono relay-meta">
            {lethe.kind} · {lethe.date}
          </p>

          <p className="cs-role relay-role">
            <span className="cs-role-label">My role:</span> {lethe.role}
          </p>
          <ul className="skill-list cs-tools">
            {lethe.tools.map((t) => (
              <li key={t} className="skill-chip">
                {t}
              </li>
            ))}
          </ul>

          <div className="ch-list">
            <details className="chapter" name="lethe-ch">
              <summary>
                <span className="mono ch-n">01</span>
                <span className="ch-t">Overview &amp; the position</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                {lethe.overview.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </details>

            <details className="chapter" name="lethe-ch">
              <summary>
                <span className="mono ch-n">02</span>
                <span className="ch-t">Why this, why now</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{lethe.whyNow}</p>
              </div>
            </details>

            <details className="chapter" name="lethe-ch">
              <summary>
                <span className="mono ch-n">03</span>
                <span className="ch-t">The core mechanic</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{lethe.mechanic.text}</p>
                <ul className="fact-list">
                  {lethe.mechanic.items.map((m) => (
                    <li key={m.slice(0, 24)}>{m}</li>
                  ))}
                </ul>
              </div>
            </details>

            <details className="chapter" name="lethe-ch">
              <summary>
                <span className="mono ch-n">04</span>
                <span className="ch-t">Information architecture</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{lethe.ia.text}</p>
              </div>
            </details>

            <details className="chapter" name="lethe-ch">
              <summary>
                <span className="mono ch-n">05</span>
                <span className="ch-t">Visual system</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{lethe.visual.text}</p>
                <ul className="relay-swatches">
                  {lethe.visual.tokens.map((t) => (
                    <li key={t.hex} className="relay-swatch">
                      <span className="relay-swatch-dot" style={{ background: t.hex }} aria-hidden="true" />
                      <span>
                        {t.name} <small>{t.hex}</small>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="relay-note">{lethe.visual.note}</p>
              </div>
            </details>

            <details className="chapter" name="lethe-ch">
              <summary>
                <span className="mono ch-n">06</span>
                <span className="ch-t">What I’d validate next</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{lethe.validate.lead}</p>
                <ul className="fact-list">
                  {lethe.validate.items.map((q) => (
                    <li key={q.slice(0, 24)}>{q}</li>
                  ))}
                </ul>
                <p className="relay-note">{lethe.validate.close}</p>
              </div>
            </details>
          </div>
        </article>

        {/* Case study #5 — Stoop (documented concept) */}
        <article className="relay" aria-label="Stoop case study">
          <div className="card-top">
            <span className="mono card-index">{stoop.index}</span>
            <span className="status status-concept">
              <span className="status-dot" aria-hidden="true" />
              {stoop.status}
            </span>
          </div>
          <h3 className="relay-title">{stoop.name}</h3>
          <p className="relay-tagline">{stoop.tagline}</p>
          <p className="mono relay-meta">
            {stoop.kind} · {stoop.date}
          </p>

          <p className="cs-role relay-role">
            <span className="cs-role-label">My role:</span> {stoop.role}
          </p>
          <ul className="skill-list cs-tools">
            {stoop.tools.map((t) => (
              <li key={t} className="skill-chip">
                {t}
              </li>
            ))}
          </ul>

          <div className="ch-list">
            <details className="chapter" name="stoop-ch">
              <summary>
                <span className="mono ch-n">01</span>
                <span className="ch-t">Overview &amp; the problem</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                {stoop.overview.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </details>

            <details className="chapter" name="stoop-ch">
              <summary>
                <span className="mono ch-n">02</span>
                <span className="ch-t">Why this, why now</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{stoop.whyNow}</p>
              </div>
            </details>

            <details className="chapter" name="stoop-ch">
              <summary>
                <span className="mono ch-n">03</span>
                <span className="ch-t">Trust on the decision screen</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{stoop.trust.text}</p>
                <ul className="fact-list">
                  {stoop.trust.items.map((i) => (
                    <li key={i.slice(0, 24)}>{i}</li>
                  ))}
                </ul>
              </div>
            </details>

            <details className="chapter" name="stoop-ch">
              <summary>
                <span className="mono ch-n">04</span>
                <span className="ch-t">The streak</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{stoop.streak.text}</p>
              </div>
            </details>

            <details className="chapter" name="stoop-ch">
              <summary>
                <span className="mono ch-n">05</span>
                <span className="ch-t">Visual system</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{stoop.visual.text}</p>
                <ul className="relay-swatches">
                  {stoop.visual.tokens.map((t) => (
                    <li key={t.hex} className="relay-swatch">
                      <span className="relay-swatch-dot" style={{ background: t.hex }} aria-hidden="true" />
                      <span>
                        {t.name} <small>{t.hex}</small>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="relay-note">{stoop.visual.note}</p>
              </div>
            </details>

            <details className="chapter" name="stoop-ch">
              <summary>
                <span className="mono ch-n">06</span>
                <span className="ch-t">What I’d validate next</span>
                <Chevron />
              </summary>
              <div className="ch-body">
                <p>{stoop.validate.lead}</p>
                <ul className="fact-list">
                  {stoop.validate.items.map((q) => (
                    <li key={q.slice(0, 24)}>{q}</li>
                  ))}
                </ul>
                <p className="relay-note">{stoop.validate.close}</p>
              </div>
            </details>
          </div>
        </article>

        {/* Still in progress — the only study that stays a card. */}
        <ul className="cs-grid" data-reveal-group suppressHydrationWarning>
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
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="mono section-index section-index-accent">03 / Liquid Glass studies</p>
          <h2 id="liquid-glass-title" className="section-title">
            Six apps, redesigned interactively.
          </h2>
          <p className="section-note">
            Each study comes with a written case study — expand a row to open it. Interfaces, ideas, products and
            people, one glass surface at a time.
          </p>
        </div>
        <ul className="lg-list" data-reveal-group suppressHydrationWarning>
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
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="mono section-index section-index-accent">04 / Also shipped</p>
          <h2 id="shipped-title" className="section-title">
            Designs that made it to code.
          </h2>
        </div>
        <ul className="xp-list" data-reveal-group suppressHydrationWarning>
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
        <div className="section-head" data-reveal suppressHydrationWarning>
          <p className="mono section-index section-index-accent">05 / About</p>
          <h2 id="about-uiux-title" className="section-title">
            Designer who codes.
          </h2>
        </div>
        <div className="about-uiux" data-reveal suppressHydrationWarning>
          <p className="about-quote">{uiux.quote}</p>
          <ul className="fact-list">
            {uiux.aboutFacts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact — big closing block: index + rule, huge question, email CTA, links */}
      <section className="section contact-xl container" id="contact" aria-labelledby="contact-uiux-title">
        <div data-reveal suppressHydrationWarning>
          <p className="xl-rule mono">
            <span className="xl-n">06</span>
            <span className="xl-lbl">Contact</span>
          </p>
          <h2 id="contact-uiux-title" className="xl-title" data-split>
            {uiux.contactTitle}
          </h2>
        </div>
        <div className="xl-cta" data-reveal suppressHydrationWarning>
          <a className="btn btn-ghost" href={`mailto:${site.email}`} data-magnetic>
            Email me
          </a>
          <a className="xl-mail" href={`mailto:${site.email}`} data-magnetic>
            {site.email}
          </a>
        </div>
        <ul className="xl-links" data-reveal-group suppressHydrationWarning>
          <li>
            <a href="/">Developer portfolio</a>
          </li>
          {site.socials
            .filter((s) => ['GitHub', 'LinkedIn', 'Resume'].includes(s.label))
            .map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
        </ul>
      </section>

      <Footer note={uiux.availability} />
      {/* Page-hydration sentinel: MotionCraft waits for this before touching page DOM. */}
      <MotionReady />
    </>
  );
}
