'use client';

import { useEffect, useRef, useState } from 'react';

/* Project card summary. On small screens the text clamps to three lines
   (CSS, applied server-side so there is no reflow); after mount we measure
   whether it actually overflows and only then render the …more / less
   toggle. Expanding removes the clamp so the full summary shows; the toggle
   stays available ("less") to fold it back. */
export function CardSummary({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      if (open) return; // expanded: keep the "less" toggle in place
      setOverflows(el.scrollHeight > el.clientHeight + 1);
    };

    check();
    // Web fonts change line wrapping; re-measure once they settle.
    document.fonts?.ready.then(check).catch(() => {});
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [open]);

  return (
    <>
      <p ref={ref} className={open ? 'card-summary' : 'card-summary is-clamped'}>
        {text}
      </p>
      {overflows ? (
        <button
          type="button"
          className="card-more"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'less' : '…more'}
        </button>
      ) : null}
    </>
  );
}
