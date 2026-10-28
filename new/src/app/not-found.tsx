import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The page you are looking for does not exist. Head back to the homepage.',
};

export default function NotFound() {
  return (
    <section className="container" style={{ paddingBlock: '6rem' }}>
      <p className="mono" style={{ color: 'var(--muted)', marginBottom: '0.6rem' }}>
        404 / Page not found
      </p>
      <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>
        Nothing here.
      </h1>
      <p style={{ color: 'var(--muted)', marginBlock: '1rem 1.75rem', maxWidth: '32rem' }}>
        The page you asked for does not exist. Everything worth seeing is on the homepage.
      </p>
      <Link className="btn btn-solid" href="/">
        Back home <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
