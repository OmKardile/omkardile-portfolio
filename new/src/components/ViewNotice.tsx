'use client';

import { useEffect, useState } from 'react';

/* ViewNotice — a one-time, ~3-second, self-dismissing whisper:
   "best viewed on desktop".

   Contract:
   - Non-attention-seeking: translucent glass pill stacked just above the
     AskOmkar pill (bottom-right), tiny mono caps, pointer-events: none,
     aria-hidden — it never asks to be clicked, never blocks anything.
   - Shows once per browser session (sessionStorage guard), ~0.8s after the
     page has landed so it never competes with the first paint.
   - Auto-fades after ~3s. No dismiss button, no backdrop, nothing to close.
   - Styled only with site tokens (var(--bg/fg/soft/line/accent/mono)), so
     light, dark and the /uiux paper theme all dress it correctly — one
     component in the root layout covers every route of both sites. */

const KEY = 'vn-seen';
const SHOW_AT_MS = 800;
const HOLD_MS = 2500;
const FADE_MS = 450;

export function ViewNotice() {
  const [phase, setPhase] = useState<'idle' | 'in' | 'out' | 'gone'>('idle');

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === '1';
    } catch {
      /* storage blocked — still show, once per load */
    }
    if (seen) return;
    const t = window.setTimeout(() => setPhase('in'), SHOW_AT_MS);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== 'in') return;
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => setPhase('out'), HOLD_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'out') return;
    const t = window.setTimeout(() => setPhase('gone'), FADE_MS + 80);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === 'idle' || phase === 'gone') return null;

  return (
    <div className={`vn${phase === 'out' ? ' is-out' : ' is-in'}`} aria-hidden="true">
      <span className="vn-dot" />
      <span className="vn-text">Best viewed on desktop</span>
    </div>
  );
}

export default ViewNotice;
