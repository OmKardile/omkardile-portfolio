import { Archivo, Fragment_Mono } from 'next/font/google';

// Display + text: one family, two personalities. The width axis (wdth 62..125) is the
// wave's own variable: display runs expanded 125, text runs normal width.
export const display = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-display',
  display: 'swap',
});

// Readouts: meta, indexes, years, statuses, counters.
export const mono = Fragment_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono-ui',
  display: 'swap',
});
