import type { MetadataRoute } from 'next';

import { getCourseIds } from '../lib/sanity/fetchers';
import { getBlogSummaries } from '../lib/blog/normalize';
import { SITE_URL, STATIC_ROUTES } from '../lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Either source failing should cost us that source's URLs, not the sitemap.
  const [courseIds, posts] = await Promise.all([
    getCourseIds().catch(() => [] as string[]),
    getBlogSummaries().catch(() => [])
  ]);

  return [
    ...STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
      url: new URL(path, SITE_URL).toString(),
      lastModified: now,
      changeFrequency,
      priority
    })),
    ...courseIds.map((id) => ({
      url: new URL(`/courses/${id}`, SITE_URL).toString(),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8
    })),
    ...posts.map((post) => ({
      url: new URL(post.href, SITE_URL).toString(),
      lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
      changeFrequency: 'yearly' as const,
      priority: 0.6
    }))
  ];
}
