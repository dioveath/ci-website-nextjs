import type { MetadataRoute } from 'next';

import { PRIVATE_ROUTES, SITE_URL } from '../lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Per-user and signed-in routes, which have nothing to offer a crawler.
      disallow: PRIVATE_ROUTES
    },
    sitemap: new URL('/sitemap.xml', SITE_URL).toString()
  };
}
