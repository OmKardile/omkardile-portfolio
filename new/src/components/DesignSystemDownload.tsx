'use client';

import { useState } from 'react';

/* The design-system download chip — sits on the repo row itself, visible
   without unfolding anything. Builds the zip in the browser, live from
   raw.githubusercontent.com (CORS-open), with a dependency-free
   store-method ZIP writer — CRC32 table, local headers, central
   directory, EOCD. No jszip, no third-party download service; the bytes
   come straight from the repo and the archive is assembled on the
   visitor's machine. The click is kept from folding the row
   (preventDefault on the summary's default toggle); progress shows in
   the chip ("zipping 7/23"), success flips it to "zipped ↓ N", and a
   failed fetch turns the chip into a link to the folder on GitHub. */

const CRC_TABLE = /* @__PURE__ */ (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(d: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < d.length; i++) c = CRC_TABLE[(c ^ d[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

type Entry = { name: string; data: Uint8Array };

function makeZip(entries: Entry[]): Blob {
  const enc = new TextEncoder();
  const u16 = (v: number) => new Uint8Array([v & 255, (v >>> 8) & 255]);
  const u32 = (v: number) =>
    new Uint8Array([v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255]);

  const local: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  for (const e of entries) {
    const name = enc.encode(e.name);
    const crc = crc32(e.data);
    local.push(
      u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0),
      u32(crc), u32(e.data.length), u32(e.data.length),
      u16(name.length), u16(0), name, e.data,
    );
    central.push(
      u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0),
      u32(crc), u32(e.data.length), u32(e.data.length),
      u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), name,
    );
    offset += 30 + name.length + e.data.length;
  }

  const cdSize = central.reduce((n, c) => n + c.length, 0);
  const eocd = [
    u32(0x06054b50), u16(0), u16(0),
    u16(entries.length), u16(entries.length),
    u32(cdSize), u32(offset), u16(0),
  ];

  return new Blob([...local, ...central, ...eocd], { type: 'application/zip' });
}

type Props = { repo: string; branch: string; folder: string; files: string[] };

export function DesignSystemDownload({ repo, branch, folder, files }: Props) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState(false);

  async function download(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault(); /* the row stays folded — only the zip happens */
    e.stopPropagation();
    setBusy(true);
    setErr(false);
    setMsg(null);
    try {
      const entries: Entry[] = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        setMsg(`${i + 1}/${files.length}`);
        const res = await fetch(
          `https://raw.githubusercontent.com/OmKardile/${repo}/${branch}/${f
            .split('/')
            .map(encodeURIComponent)
            .join('/')}`,
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        entries.push({
          name: f.slice(folder.length + 1),
          data: new Uint8Array(await res.arrayBuffer()),
        });
      }
      const url = URL.createObjectURL(makeZip(entries));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${repo}-${folder}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setMsg(null);
      setDone(true);
    } catch (e) {
      setErr(true);
      setMsg(e instanceof Error ? e.message : 'fetch failed');
    } finally {
      setBusy(false);
    }
  }

  const chipStyle = {
    flexShrink: 0,
    alignSelf: 'center' as const,
    font: 'inherit',
    fontFamily: 'var(--mono)',
    fontSize: '0.7rem',
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap' as const,
    padding: '0.3rem 0.6rem',
    transition: 'background 160ms ease, color 160ms ease',
  };

  if (err) {
    /* fetch failed — the chip itself becomes the way out */
    return (
      <a
        href={`https://github.com/OmKardile/${repo}/tree/${branch}/${folder}`}
        target="_blank"
        rel="noopener noreferrer"
        title={msg ?? 'fetch failed'}
        data-hint="Zip failed · read the folder on GitHub"
        className="mono"
        style={{
          ...chipStyle,
          border: '1px solid var(--line)',
          background: 'transparent',
          color: 'var(--muted)',
          textDecoration: 'none',
        }}
      >
        on GitHub ↗
      </a>
    );
  }

  return (
    <button
      onClick={download}
      disabled={busy}
      data-hint={`${repo} ${folder}/ · zip built in your browser`}
      aria-label={`Download ${repo}'s ${folder} folder as a zip — ${files.length} files, assembled in your browser`}
      style={{
        ...chipStyle,
        border: '1px solid var(--fg)',
        background: 'transparent',
        color: 'var(--fg)',
        cursor: busy ? 'progress' : 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--fg)';
        e.currentTarget.style.color = 'var(--bg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = 'var(--fg)';
      }}
    >
      {busy ? `zipping ${msg}…` : done ? `zipped ↓ ${files.length}` : `download ↓ ${files.length}`}
    </button>
  );
}
