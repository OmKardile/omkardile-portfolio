import { site } from '@/data/site';
import { MotionToggle } from '@/components/MotionToggle';

/* `note` renders an availability line above the standard bottom row —
   the /uiux footer uses it ("Open to UI/UX design and frontend…").

   `ticker` renders the kinetic word marquee as the footer's opening strip
   (moved up from under the heroes): each page passes its own vocabulary —
   the dev stack on /, the craft vocabulary on /uiux. Decorative (aria-hidden):
   the same facts stay readable in the sections above the footer. */
export function Footer({ note, ticker }: { note?: string; ticker?: string[] }) {
  return (
    <footer className="site-footer">
      {ticker ? (
        <div className="ticker footer-ticker" aria-hidden="true">
          <div className="ticker-track">
            {[...ticker, ...ticker].map((t, i) => (
              <span className="ticker-item" key={`${t}-${i}`}>
                {t}
                <span className="ticker-dot" />
              </span>
            ))}
          </div>
        </div>
      ) : null}
      {note ? (
        <div className="container footer-availability">
          <p>{note}</p>
        </div>
      ) : null}
      <div className="container footer-inner">
        <p>{site.name} © 2026 · Pune, India</p>
        <div className="footer-links">
          <MotionToggle />
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
