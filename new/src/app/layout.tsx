import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Header } from '@/components/Header';
import { DetailsAnimate } from '@/components/DetailsAnimate';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SmoothScroll } from '@/components/SmoothScroll';
import { UiuxTheme } from '@/components/UiuxTheme';
import { MotionCraft } from '@/components/MotionCraft';
import { AskOmkar } from '@/components/AskOmkar';
import { ViewNotice } from '@/components/ViewNotice';
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
  /* viewport-fit=cover makes env(safe-area-inset-*) report real values on
     notched phones — the AskOmkar pill/panel offset their bottom edge by it.
     interactiveWidget=resizes-content keeps the fixed bottom sheet above the
     Android keyboard instead of hidden behind it when the ask input focuses. */
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
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
        {/* Runs before first paint: stored choice wins, else system preference. No flash.
            /uiux is special: its warm paper (cream) theme is the DEFAULT — dark only
            when explicitly stored. `uiux` scopes the cream tokens in globals.css. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');var u=location.pathname.indexOf('/uiux')===0;if(u)document.documentElement.classList.add('uiux');var d=u?t==='dark':(t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}" +
              // Motion is always enabled — there is no preference toggle and no
              // motion-off state anywhere in the site (the old html.motion-off
              // kill switch was removed with the footer motion button).
              "document.documentElement.classList.add('js-reveal');",
          }}
        />
      </head>
      <body>
        {/* Scroll progress hairline under the header edge; MotionCraft drives
            scaleX. aria-hidden + pointer-events none — purely decorative. */}
        <div id="scroll-progress" className="scroll-progress" aria-hidden="true" />
        {/* data-native-scroll: the skip link jumps instantly even while the
            smooth-scroll engine is running — keyboard users want zero delay. */}
        <a className="skip-link" href="#main" data-native-scroll>
          Skip to content
        </a>
        <Header />
        <SmoothScroll />
        <UiuxTheme />
        <DetailsAnimate />
        <ScrollReveal />
        <MotionCraft />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        {/* AskOmkar — the floating portfolio bot. Present on every route; all
            matching happens client-side (see src/components/AskOmkar.tsx). */}
        <AskOmkar />
        {/* One-time "best viewed on desktop" whisper — 3s, translucent, both sites. */}
        <ViewNotice />
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      </body>
    </html>
  );
}
