import type { Block } from '@/data/uiuxProjects';
import { WireframeArtSvg } from '@/components/uiux/WireframeArt';

/* Block renderer for the case-study sections. Every block type from the data
   model gets exactly one presentation here — hairline dividers, no cards.

   Unfinished evidence contract:
   - { type: 'slot' } renders a dashed placeholder in development and is
     removed entirely from the production build (next build sets NODE_ENV).
   - { type: 'table', filled: false } renders the dashed table skeleton in
     development and one quiet "Research in progress" line in production.
   Nothing ever renders as "link pending" — sections with empty URLs are not
   rendered at all (see CaseStudyLayout). */

const DEV = process.env.NODE_ENV === 'development';

function TableBlock({ block }: { block: Extract<Block, { type: 'table' }> }) {
  if (!block.filled && !DEV) {
    return <p className="ux-quiet">Research in progress.</p>;
  }
  if (!block.filled && DEV) {
    return (
      <div className="ux-slot" role="note" aria-label="Placeholder table — evidence not collected yet">
        <table className="ux-table">
          <thead>
            <tr>
              {block.head.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="ux-slot-note">Add after testing — the table fills after the first round.</p>
      </div>
    );
  }
  return (
    <div className="ux-table-scroll" tabIndex={0} aria-label={`${block.head.join(', ')} — scrollable table`}>
      <table className="ux-table">
        <thead>
          <tr>
            {block.head.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Block({ block }: { block: Block }) {
  switch (block.type) {
    case 'paragraph':
      return <p className="ux-p">{block.text}</p>;

    case 'list': {
      const List = block.ordered ? 'ol' : 'ul';
      return (
        <List className={`ux-list${block.ordered ? ' ux-list-ordered' : ''}`}>
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </List>
      );
    }

    case 'hypotheses':
      return (
        <ul className="ux-hypotheses">
          {block.items.map((h, i) => (
            <li key={i}>
              <p className="ux-hypothesis">{h.bet}</p>
              <p className="ux-hypothesis-because">Because {h.because.charAt(0).toLowerCase() + h.because.slice(1)}</p>
            </li>
          ))}
        </ul>
      );

    case 'table':
      return <TableBlock block={block} />;

    case 'personas':
      return (
        <div className="ux-personas">
          {block.items.map((p, i) => (
            <article className="ux-persona" key={i}>
              <h3 className="ux-persona-name">{p.name}</h3>
              <p className="ux-persona-meta">{p.meta}</p>
              <ul className="ux-list">
                {p.facts.map((f, j) => (
                  <li key={j}>{f}</li>
                ))}
              </ul>
              {p.quote ? <p className="ux-persona-quote">“{p.quote}”</p> : null}
            </article>
          ))}
        </div>
      );

    case 'flow':
      return (
        <ol className="ux-flow">
          {block.steps.map((step, i) => (
            <li key={i}>
              <span className="ux-flow-text">{step}</span>
              {i < block.steps.length - 1 ? (
                <span className="ux-flow-arrow" aria-hidden="true">
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      );

    case 'wireframes':
      return (
        <div className="ux-wireframes" data-reveal-group suppressHydrationWarning>
          {block.items.map((w) => (
            <figure className="ux-wireframe" key={w.art}>
              <span className="ux-wireframe-frame">
                <WireframeArtSvg art={w.art} />
              </span>
              {/* role="img" + aria-label: the drawing is meaningful content. */}
              <span role="img" aria-label={w.alt} className="ux-wireframe-label">
                {w.label}
              </span>
            </figure>
          ))}
        </div>
      );

    case 'decisions':
      return (
        <dl className="ux-decisions">
          {block.items.map((d, i) => (
            <div className="ux-decision" key={i}>
              <dt className="ux-decision-title">{d.title}</dt>
              <dd className="ux-decision-rationale">{d.rationale}</dd>
              {d.tradeoff ? <dd className="ux-decision-tradeoff">Trade-off — {d.tradeoff}</dd> : null}
            </div>
          ))}
        </dl>
      );

    case 'swatches':
      return (
        <ul className="ux-swatches" data-reveal-group suppressHydrationWarning>
          {block.items.map((s) => (
            <li className="ux-swatch" key={s.hex + s.name}>
              <span className="ux-swatch-dot" style={{ background: s.hex }} aria-hidden="true" />
              <span className="ux-swatch-body">
                <span className="ux-swatch-name">
                  {s.name} <small className="ux-swatch-hex">{s.hex}</small>
                </span>
                <span className="ux-swatch-use">{s.use}</span>
              </span>
            </li>
          ))}
        </ul>
      );

    case 'typeSpecimen':
      return (
        <div className="ux-type">
          <p className="ux-p ux-type-intro">{block.intro}</p>
          <div className="ux-type-rows">
            {block.rows.map((r) => (
              <div className="ux-type-row" key={r.role}>
                <p className="ux-type-meta mono">
                  {r.role} — {r.face}
                </p>
                <p className={r.role === 'Display' ? 'ux-type-sample-display' : 'ux-type-sample-ui'}>{r.sample}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'rules':
      return (
        <dl className="ux-rules">
          {block.items.map((r, i) => (
            <div className="ux-rule" key={i}>
              <dt className="ux-rule-title">
                <span className="ux-rule-n mono">{String(i + 1).padStart(2, '0')}</span>
                {r.title}
              </dt>
              <dd className="ux-rule-text">{r.text}</dd>
            </div>
          ))}
        </dl>
      );

    case 'slot':
      /* Evidence placeholder: dashed in development, absent in production. */
      if (!DEV) return null;
      return (
        <p className="ux-slot ux-slot-single" role="note">
          <span className="ux-slot-label">Add later</span>
          {block.label}
        </p>
      );

    default:
      return null;
  }
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <Block block={b} key={i} />
      ))}
    </>
  );
}
