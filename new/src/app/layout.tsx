import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Header } from '@/components/Header';
import { DetailsAnimate } from '@/components/DetailsAnimate';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SmoothScroll } from '@/components/SmoothScroll';
import { site } from '@/data/site';
import { display, mono } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.role}`, template: `%s | ${site.name}` },
  description: site.description,
  alternates: { canonical: './' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    url: site.url,
    title: `${site.name} | ${site.role}`,
    description: site.description,
    images: ['/og.png'],
  },
  twitter: { card: 'summary_large_image', title: `${site.name} | ${site.role}`, description: site.description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f11' },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  email: `mailto:${site.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Pune', addressCountry: 'IN' },
  sameAs: site.socials.filter((s) => s.label !== 'Resume').map((s) => s.href),
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable}`}
      /* Tells Next to suppress the CSS smooth scroll during its own route
         transitions (the engine + no-JS fallback below still glide anchors). */
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Runs before first paint: stored choice wins, else system preference. No flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}" +
              // Effective motion preference BEFORE paint: explicit footer toggle
      // choice wins; otherwise the OS setting. motion-off is the single
      // authority every animated subsystem reads (CSS kills, Lenis, WAAPI).
              "try{var m=localStorage.getItem('motion-pref');var r=m==='off'||(m!=='on'&&matchMedia('(prefers-reduced-motion: reduce)').matches);if(r)document.documentElement.classList.add('motion-off')}catch(e){}" +
              "document.documentElement.classList.add('js-reveal');",
          }}
        />
      </head>
      <body>
        {/* data-native-scroll: the skip link jumps instantly even while the
            smooth-scroll engine is running — keyboard users want zero delay. */}
        <a className="skip-link" href="#main" data-native-scroll>
          Skip to content
        </a>
        <Header />
        <SmoothScroll />
        <DetailsAnimate />
        <ScrollReveal />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      </body>
    </html>
  );
}
