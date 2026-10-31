'use client';

// AskOmkar — the portfolio's resident bot.
//
// A floating pill opens a drawer that answers recruiter questions about Omkar
// from a fully pre-written bank. Free-typed questions are matched IN-BROWSER
// by a small embedding model (lazy-loaded from CDN, ~23 MB once, cached);
// suggested chips bypass the model entirely and answer instantly.
//
// Guarantees by construction:
//   - no server calls at answer time (the only network fetch is the one-time
//     model download from the public CDN);
//   - no generative LLM, so nothing can be jailbroken into unapproved text;
//   - anonymous ask log stays in localStorage, plus an optional webhook if
//     NEXT_PUBLIC_ASK_LOG_URL is set at build time.

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { chipLabel, faqBank, suggestedIds, type FaqEntry, type FaqLink } from '@/data/askomkar/bank';
import { rankByKeywords, rankByVector, type MatchResult, type VectorsFile } from '@/lib/askomkar/matcher';
import '@/app/askomkar.css';

const CDN = 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';
const MODEL = 'Xenova/all-MiniLM-L6-v2';
const LOG_KEY = 'askomkar-log';

type Embedder = (text: string) => Promise<number[]>;

let embedderPromise: Promise<Embedder> | null = null;
let vectorsPromise: Promise<VectorsFile> | null = null;

function loadEmbedder(onProgress?: (fraction: number) => void): Promise<Embedder> {
  if (!embedderPromise) {
    embedderPromise = (async () => {
      const url = CDN;
      const mod: Record<string, unknown> = await import(
        /* webpackIgnore: true */ /* turbopackIgnore: true */ url
      );
      type Progress = { status?: string; progress?: number };
      const pipe = await (mod.pipeline as (task: string, model: string, opts?: object) => Promise<unknown>)(
        'feature-extraction',
        MODEL,
        {
          progress_callback: (info: Progress) => {
            if (info?.status === 'progress' && typeof info.progress === 'number') onProgress?.(info.progress / 100);
          },
        },
      );
      const run = pipe as (t: string, o: object) => Promise<{ data: Float32Array }>;
      return async (text: string) => {
        const out = await run(text, { pooling: 'mean', normalize: true });
        return Array.from(out.data);
      };
    })().catch((err) => {
      embedderPromise = null; // allow a later retry
      throw err;
    });
  }
  return embedderPromise;
}

function loadVectors(): Promise<VectorsFile> {
  if (!vectorsPromise) {
    vectorsPromise = import('@/data/askomkar/vectors.json').then((m) => m.default as VectorsFile);
  }
  return vectorsPromise;
}

// ---------- anonymous ask log ----------

function logAsk(q: string, id: string | null, score: number, tier: string) {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    const arr: unknown[] = raw ? JSON.parse(raw) : [];
    arr.push({ q, id, score: Math.round(score * 1000) / 1000, tier, ts: Date.now() });
    localStorage.setItem(LOG_KEY, JSON.stringify(arr.slice(-100)));
  } catch {
    /* storage blocked — ignore */
  }
  const url = process.env.NEXT_PUBLIC_ASK_LOG_URL;
  if (url) {
    try {
      void fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q, id, tier }),
      });
    } catch {
      /* endpoint down — ignore */
    }
  }
}

// ---------- markdown-lite rendering (bold, italics, links, lists, paragraphs) ----------

const INLINE_RE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*\n]+)\*/g;

function renderInline(text: string, key: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(INLINE_RE)) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) {
      const href = m[2];
      parts.push(
        href.startsWith('/') ? (
          <Link key={`${key}-${i}`} href={href}>
            {m[1]}
          </Link>
        ) : (
          <a key={`${key}-${i}`} href={href} target="_blank" rel="noopener noreferrer">
            {m[1]}
            <span className="ao-ext" aria-hidden="true">
              {' '}
              ↗
            </span>
          </a>
        ),
      );
    } else if (m[3] !== undefined) {
      parts.push(<strong key={`${key}-${i}`}>{m[3]}</strong>);
    } else if (m[4] !== undefined) {
      parts.push(<em key={`${key}-${i}`}>{m[4]}</em>);
    }
    i++;
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function Markdown({ text }: { text: string }) {
  return (
    <>
      {text.split('\n\n').map((para, pi) => {
        const lines = para.split('\n').map((l) => l.trim()).filter(Boolean);
        const isList = lines.length > 0 && lines.every((l) => /^(-|\d+\.)\s/.test(l));
        if (isList) {
          return (
            <ul key={pi}>
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.replace(/^(-|\d+\.)\s/, ''), `${pi}-${li}`)}</li>
              ))}
            </ul>
          );
        }
        return <p key={pi}>{renderInline(para, String(pi))}</p>;
      })}
    </>
  );
}

// ---------- messages ----------

type Msg = {
  role: 'user' | 'bot';
  text?: string;
  links?: FaqLink[];
  chips?: FaqEntry[];
  note?: string;
};

const FALLBACK_TEXT =
  "That one's outside my pre-written bank — and I don't guess.\n\nOmkar answers email quickly, or try one of these:";

const byId = new Map(faqBank.map((e) => [e.id, e]));

export function AskOmkar() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [warm, setWarm] = useState<'idle' | 'warming' | 'ready' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);

  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const intro: Msg = useMemo(
    () => ({
      role: 'bot',
      text: "Hi — I'm **AskOmkar**, Omkar's portfolio bot. My answers are pre-written by Omkar and matched locally in your browser, so nothing you type leaves this page.\n\nPick a question or type your own:",
      chips: suggestedIds.map((id) => byId.get(id)).filter((e): e is FaqEntry => Boolean(e)),
    }),
    [],
  );

  // Is the reader pinned to the latest line? Sampled on every real scroll
  // of the log. Message insertion changes scrollHeight WITHOUT firing a
  // scroll event, so the flag captures the reader's intent from before the
  // message landed — the near-bottom distance measured after insertion
  // would go false the first time a tall answer overflows the threshold
  // and the log would stop following forever.
  const pinnedRef = useRef(true);

  // Follow the newest message while the reader is pinned to the bottom —
  // yanking to the latest line while they scrolled up to re-read an answer
  // reads as the log fighting their scrolling. Scrolling back down re-pins.
  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    if (pinnedRef.current) el.scrollTop = el.scrollHeight;
  }, [msgs, busy]);

  // The pin sampler itself. The log mounts with the panel (open), so this
  // effect re-attaches on every open and resets to pinned — a fresh
  // conversation always starts at the latest line.
  useEffect(() => {
    if (!open) return;
    const el = logRef.current;
    if (!el) return;
    pinnedRef.current = true;
    const onScroll = () => {
      pinnedRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 96;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [open]);

  // Esc closes; focus lands in the input when the panel opens.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
    };
  }, [open]);

  // Lock page scroll behind the mobile sheet.
  useEffect(() => {
    if (!open) return;
    const lock = window.matchMedia('(max-width: 640px)').matches;
    if (!lock) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Quietly warm the model once the panel has been open for a moment.
  useEffect(() => {
    if (!open || warm !== 'idle') return;
    const t = window.setTimeout(() => {
      setWarm('warming');
      loadEmbedder((f) => setProgress(f))
        .then(() => setWarm('ready'))
        .catch(() => setWarm('failed'));
    }, 700);
    return () => window.clearTimeout(t);
  }, [open, warm]);

  // First open plants the intro message (never inside a state updater —
  // updater functions must stay pure or React can drop the update).
  useEffect(() => {
    if (!open) return;
    setMsgs((m) => (m.length ? m : [intro]));
  }, [open, intro]);

  const toggle = () => setOpen((v) => !v);

  const answerDirectly = (entry: FaqEntry) => {
    setMsgs((m) => [...m, { role: 'bot', text: entry.a, links: entry.links }]);
    logAsk(entry.q[0], entry.id, 1, 'chip');
  };

  const onChip = (entry: FaqEntry) => {
    setMsgs((m) => [...m, { role: 'user', text: chipLabel(entry) }]);
    answerDirectly(entry);
  };

  const send = async () => {
    const q = input.trim();
    if (!q || busy) return;
    setInput('');
    setBusy(true);
    setMsgs((m) => [...m, { role: 'user', text: q }]);
    try {
      let match: MatchResult;
      try {
        const embed = await loadEmbedder();
        const vectors = await loadVectors();
        const qvec = await embed(q);
        match = rankByVector(qvec, vectors);
        if (warm !== 'ready') setWarm('ready');
      } catch {
        // Model or CDN unavailable — keyword fallback keeps the bot usable.
        match = rankByKeywords(q);
        setWarm('failed');
      }
      logAsk(q, match.best.entry.id, match.best.score, match.tier);
      const { entry } = match.best;
      if (match.tier === 'fallback') {
        setMsgs((m) => [
          ...m,
          {
            role: 'bot',
            text: FALLBACK_TEXT,
            chips: match.alternatives.length
              ? match.alternatives.map((a) => a.entry)
              : suggestedIds.map((id) => byId.get(id)).filter((e): e is FaqEntry => Boolean(e)).slice(0, 3),
          },
        ]);
      } else {
        setMsgs((m) => [
          ...m,
          {
            role: 'bot',
            text: entry.a,
            links: entry.links,
            note: match.tier === 'related' ? 'Closest match from my bank — rephrase if this is not what you meant.' : undefined,
            chips: match.tier === 'related' ? match.alternatives.map((a) => a.entry) : undefined,
          },
        ]);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {!open && (
        <button className="ao-pill" onClick={toggle} aria-expanded="false" aria-controls="askomkar-panel">
          <span className="ao-pill-dot" aria-hidden="true" />
          AskOmkar
        </button>
      )}

      {open && (
        <section
          id="askomkar-panel"
          className="ao-panel"
          role="dialog"
          aria-label="AskOmkar — answers about Omkar"
          data-lenis-prevent
        >
          <header className="ao-head">
            <span className="ao-avatar" aria-hidden="true">
              AO
            </span>
            <span className="ao-head-text">
              <strong>AskOmkar</strong>
              <span>Pre-written by Omkar · runs in your browser</span>
            </span>
            <button className="ao-close" onClick={() => setOpen(false)} aria-label="Close AskOmkar">
              ×
            </button>
          </header>

          {/* The whole panel is a Lenis-free zone (data-lenis-prevent above):
              Lenis intercepts wheel input globally, so without it a wheel
              over the header, CTA bar or form scrolled the PAGE behind the
              chat while the chat itself sat still — the panel read as
              broken. Inside, .ao-log is a plain native overflow container:
              wheel over the log scrolls the conversation, wheel over the
              chrome scrolls nothing. */}
          <div className="ao-log" ref={logRef} aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'ao-msg ao-msg-user' : 'ao-msg'}>
                {m.text ? (
                  <div className="ao-bubble">
                    <Markdown text={m.text} />
                    {m.note ? <p className="ao-note">{m.note}</p> : null}
                    {m.links?.length ? (
                      <div className="ao-links">
                        {m.links.map((l) =>
                          l.href.startsWith('/') ? (
                            <Link key={l.href + l.label} className="ao-link" href={l.href}>
                              {l.label} <span aria-hidden="true">→</span>
                            </Link>
                          ) : (
                            <a key={l.href + l.label} className="ao-link" href={l.href} target="_blank" rel="noopener noreferrer">
                              {l.label} <span aria-hidden="true">↗</span>
                              {l.note ? <span className="ao-link-note">{l.note}</span> : null}
                            </a>
                          ),
                        )}
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {m.chips?.length ? (
                  <div className="ao-chips">
                    {m.chips.map((c) => (
                      <button key={c.id} className="ao-chip" onClick={() => onChip(c)}>
                        {chipLabel(c)}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {busy && (
              <div className="ao-msg">
                <div className="ao-bubble ao-busy">
                  {warm === 'warming' ? (
                    <span>
                      Warming up the matcher… {progress > 0 ? `${Math.round(progress * 100)}%` : ''}
                      <span className="ao-warm-sub"> one-time ~23 MB download, cached after this</span>
                    </span>
                  ) : (
                    <span className="ao-dots" aria-label="Matching your question">
                      <span />
                      <span />
                      <span />
                    </span>
                  )}
                </div>
              </div>
            )}
            {warm === 'failed' && !busy && (
              <p className="ao-degraded">Matcher offline — answering by keyword. Everything still runs locally.</p>
            )}
          </div>

          <div className="ao-cta">
            <a href="mailto:omkarkardileatwork@gmail.com">Email</a>
            <a href="https://github.com/OmKardile" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/omkar-kardile-49501b213/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a
              href="https://drive.google.com/file/d/19PxUGcMTALOfNKFbVObd4E0xLKVGGWkZ/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
            </a>
          </div>

          <form
            className="ao-form"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Omkar's work…"
              aria-label="Ask a question about Omkar"
              maxLength={280}
            />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send question">
              ↑
            </button>
          </form>
        </section>
      )}
    </>
  );
}

export default AskOmkar;
