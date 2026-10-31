'use client';

import { useEffect, useRef, useState } from 'react';

/* Live-prototype embed. 390×844 logical size, scaled to fit the column:
   the wrapper carries aspect-ratio (390/844) so there is zero layout shift
   while the iframe loads. The iframe itself mounts only on viewports ≥768px
   and only once the frame is near the viewport (IntersectionObserver on top
   of loading="lazy") — below 768px a poster with the same text and an
   "Open prototype" button keeps phones fast. */

const PHONE_W = 390;
const PHONE_H = 844;

export function DeviceFrame({ src, title, href }: { src: string; title: string; href: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [canEmbed, setCanEmbed] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const sync = () => setCanEmbed(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNear(true); // no IO support: just load it
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '25% 0px' }, // start loading slightly before it's visible
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="ux-device" ref={wrapperRef}>
      {canEmbed ? (
        <div className="ux-device-frame" data-near={near ? 'true' : 'false'}>
          {near ? (
            <iframe
              src={src}
              title={title}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          ) : (
            <p className="ux-device-wait mono" aria-hidden="true">
              Prototype loads near the viewport
            </p>
          )}
        </div>
      ) : (
        <div className="ux-device-poster">
          <p className="mono ux-device-poster-note">390 × 844 · best on a wider screen</p>
          <a className="ux-btn ux-btn-ghost" href={href} target="_blank" rel="noopener noreferrer" data-hint="Prototype · new tab">
            Open prototype <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      )}
      <p className="ux-device-caption">
        <a href={href} target="_blank" rel="noopener noreferrer" data-hint="Prototype · new tab">
          Open full screen <span aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    </div>
  );
}
