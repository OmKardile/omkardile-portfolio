import { site } from '@/data/site';
import { MotionToggle } from '@/components/MotionToggle';

/* `note` renders an availability line above the standard bottom row —
   the /uiux footer uses it ("Open to UI/UX design and frontend…"). */
export function Footer({ note }: { note?: string }) {
  return (
    <footer className="site-footer">
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
