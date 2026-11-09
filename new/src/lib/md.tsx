import React from 'react';

/* Minimal markdown → React renderer for /library. Dependency-free on
   purpose: the docs it renders are first-party files (design-system.md,
   custom-cursor.md, README.md) written to a known subset — headings,
   paragraphs, tables, flat lists with one nesting level, ordered lists
   with true start numbers, fenced code, hr, blockquotes, and inline
   bold / italic / code / links. Anything unexpected degrades to plain
   text, never to raw markdown or HTML (React escapes everything). */

type Item = { text: string; sub: string[] };

const INLINE_SRC =
  "(`[^`]+`|\\*\\*[^*]+?\\*\\*|\\*[^*\\s][^*]*?\\*|\\[[^\\]]+\\]\\([^)\\s]+\\))";

function inline(src: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;
  /* A fresh /g regex per call: inline() recurses (bold/italic bodies are
     parsed inline too), and a shared lastIndex across re-entrant calls
     rewinds the outer loop into an infinite match. */
  const re = new RegExp(INLINE_SRC, 'g');
  while ((m = re.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const t = m[0];
    if (t.startsWith('`')) {
      out.push(<code key={k++}>{t.slice(1, -1)}</code>);
    } else if (t.startsWith('**')) {
      out.push(<strong key={k++}>{inline(t.slice(2, -2))}</strong>);
    } else if (t.startsWith('*')) {
      out.push(<em key={k++}>{inline(t.slice(1, -1))}</em>);
    } else {
      const lm = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(t);
      out.push(
        lm ? (
          <a key={k++} href={lm[2]} target="_blank" rel="noopener noreferrer">
            {lm[1]}
          </a>
        ) : (
          t
        ),
      );
    }
    last = m.index + t.length;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

function cell(line: string): string[] {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|')) s = s.slice(0, -1);
  return s.split('|').map((c) => c.trim());
}

const BLOCK_START =
  /^(#{1,4}\s|```|\||\s*[-*]\s|\s*\d+[.)]\s|>|---\s*$|\*\*\*\s*$|___\s*$)/;

function renderItems(items: Item[]) {
  return (
    <ul>
      {items.map((it, i) => (
        <li key={i}>
          {inline(it.text)}
          {it.sub.length ? (
            <ul>
              {it.sub.map((s, j) => (
                <li key={j}>{inline(s)}</li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function Markdown({ source }: { source: string }) {
  const lines = source.split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  let guard = 0;
  while (i < lines.length) {
    guard++; // (kept from debugging: an outer-loop bound would mean a parser bug)
    if (guard > 100000) throw new Error('md parser: block loop exceeded bound');
    const line = lines[i];

    // fenced code
    if (/^```/.test(line)) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++; // closing fence
      blocks.push(
        <pre key={key++}>
          <code>{buf.join('\n')}</code>
        </pre>,
      );
      continue;
    }

    // blank
    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }

    // hr
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push(<hr key={key++} />);
      i++;
      continue;
    }

    // headings
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      const Tag = ['h1', 'h2', 'h3', 'h4'][h[1].length - 1] as
        | 'h1'
        | 'h2'
        | 'h3'
        | 'h4';
      blocks.push(<Tag key={key++}>{inline(h[2])}</Tag>);
      i++;
      continue;
    }

    // table: header row + |---| separator
    if (
      /^\|.*\|/.test(line) &&
      i + 1 < lines.length &&
      /^\|[\s:|-]+\|?\s*$/.test(lines[i + 1])
    ) {
      const head = cell(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(cell(lines[i++]));
      blocks.push(
        <div key={key++} className="doc-tablewrap">
          <table>
            <thead>
              <tr>
                {head.map((c, ci) => (
                  <th key={ci}>{inline(c)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri}>
                  {head.map((_, ci) => (
                    <td key={ci}>{inline(r[ci] ?? '')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // unordered list (one nesting level)
    if (/^\s*[-*]\s+/.test(line)) {
      const items: Item[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        const indent = lines[i].search(/\S/);
        if (indent >= 2 && items.length) {
          items[items.length - 1].sub.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        } else {
          items.push({ text: lines[i].replace(/^\s*[-*]\s+/, ''), sub: [] });
        }
        i++;
      }
      blocks.push(<React.Fragment key={key++}>{renderItems(items)}</React.Fragment>);
      continue;
    }

    // ordered list (true start number; continuation lines join the item)
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const start = parseInt(/^\s*(\d+)/.exec(line)![1], 10);
      const items: Item[] = [];
      while (i < lines.length) {
        const l = lines[i];
        if (/^\s*\d+[.)]\s+/.test(l)) {
          items.push({ text: l.replace(/^\s*\d+[.)]\s+/, ''), sub: [] });
        } else if (items.length && /^\s{2,}[-*]\s+/.test(l)) {
          items[items.length - 1].sub.push(l.replace(/^\s*[-*]\s+/, ''));
        } else if (items.length && /^\s{2,}\S/.test(l) && !BLOCK_START.test(l)) {
          items[items.length - 1].text += ' ' + l.trim();
        } else break;
        i++;
      }
      blocks.push(
        <ol key={key++} start={start}>
          {items.map((it, ii) => (
            <li key={ii}>
              {inline(it.text)}
              {it.sub.length ? (
                <ul>
                  {it.sub.map((s, si) => (
                    <li key={si}>{inline(s)}</li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    // blockquote
    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i]))
        buf.push(lines[i++].replace(/^>\s?/, ''));
      blocks.push(<blockquote key={key++}>{inline(buf.join(' '))}</blockquote>);
      continue;
    }

    // paragraph: collect until a blank line or the next block
    const buf = [line.trim()];
    i++;
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !BLOCK_START.test(lines[i])) {
      buf.push(lines[i].trim());
      i++;
    }
    blocks.push(<p key={key++}>{inline(buf.join(' '))}</p>);
  }

  return <div className="doc">{blocks}</div>;
}
