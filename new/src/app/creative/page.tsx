import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/Footer';

// Placeholder for the creative portfolio version. Replace this file when the
// creative app is ported in (see README.md -> "Wiring the creative version").
// NOTE: while the creative build is still in development, its navbar pill is
// hidden — this route stays reachable by direct URL only (noindex).

export const metadata: Metadata = {
  title: 'Creative Portfolio',
  description: 'The creative version of this portfolio lives here.',
  robots: { index: false, follow: true },
};

export default function CreativePage() {
  return (
    <>
      <section className="hero container" id="top" aria-label="Creative portfolio placeholder">
        <p className="hero-kicker mono">Creative build · slot reserved</p>
        <h1 className="hero-name">
          Creative version
          <span className="hero-role">This route hosts the creative portfolio</span>
        </h1>
        <p className="hero-intro">
          Wire your creative build into this slot — no second Vercel project needed. The README in the repo root has
          the two options (port it as a route, or drop a static export). Until then, the rest of the site works
          exactly as shipped.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-solid" href="/">
            Developer portfolio <span aria-hidden="true">→</span>
          </Link>
          <Link className="btn btn-outline" href="/uiux">
            UI/UX portfolio <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
