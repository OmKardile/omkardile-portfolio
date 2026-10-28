import { site } from '@/data/site';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>{site.name} © 2026 · Pune, India</p>
        <div className="footer-links">
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
