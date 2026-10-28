import type { MetadataRoute } from 'next';
import { site } from '@/data/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, lastModified: new Date(), priority: 1 },
    { url: `${site.url}/uiux`, lastModified: new Date(), priority: 0.9 },
    { url: `${site.url}/uiux/relay/prototype`, lastModified: new Date(), priority: 0.6 },
    { url: `${site.url}/uiux/taar/prototype`, lastModified: new Date(), priority: 0.6 },
  ];
}
