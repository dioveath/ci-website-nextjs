/**
 * Facts about the site that more than one place needs: metadata, the sitemap,
 * robots.txt, the Open Graph image and the JSON-LD organisation record.
 *
 * `metadataBase`, the sitemap host and the structured data all derive from
 * SITE_URL, so there is one place to change when the domain does.
 */
export const SITE_URL = 'https://charichainstitute.com.np';

export const SITE_NAME = 'Charicha Institute';

export const SITE_DESCRIPTION =
  'Computer training in Belbari, Morang — beginner to advanced courses, certification prep, repairs and consulting.';

/** Routes that exist regardless of CMS content, with their crawl priority. */
export const STATIC_ROUTES = [
  { path: '/', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/courses', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/services', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/blog', priority: 0.7, changeFrequency: 'daily' as const },
  { path: '/contact', priority: 0.6, changeFrequency: 'monthly' as const }
];

/** Routes that must never be indexed: they are per-user or behind sign-in. */
export const PRIVATE_ROUTES = ['/admin', '/dashboard', '/login', '/profile/', '/api/'];

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
