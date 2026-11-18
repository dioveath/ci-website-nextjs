import { mergeDefined, sanityClient } from './client';
import {
  coursesQuery,
  courseByIdQuery,
  courseIdsQuery,
  servicesQuery,
  homePageQuery,
  contactPageQuery,
  postsQuery,
  postBySlugQuery,
} from './queries';

// Static fallbacks: the site renders identically until Sanity is configured
// and populated.
import { coursesFallback, servicesFallback, homePageFallback, contactPageFallback } from './fallbacks';

function messageOf(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

async function fetchOrFallback<T>(
  query: string, params: Record<string, unknown>, fallback: T, label: string
): Promise<T> {
  if (!sanityClient) return fallback;
  try {
    const data = await sanityClient.fetch(query, params);
    if (Array.isArray(data)) return (data.length ? data : fallback) as T;
    return data ?? fallback;
  } catch (err) {
    console.warn(`[sanity] ${label} failed, using fallback:`, messageOf(err));
    return fallback;
  }
}

export function getCourses() {
  return fetchOrFallback(coursesQuery, {}, coursesFallback, 'getCourses');
}

export function getServices() {
  return fetchOrFallback(servicesQuery, {}, servicesFallback, 'getServices');
}

export function getCourseById(id: string | number) {
  const fallback = coursesFallback.find((c) => String(c.id) === String(id)) || null;
  return fetchOrFallback(courseByIdQuery, { id: String(id) }, fallback, 'getCourseById');
}

export async function getCourseIds() {
  if (!sanityClient) return coursesFallback.map((c) => String(c.id));
  try {
    const ids: unknown[] = await sanityClient.fetch(courseIdsQuery);
    return ids && ids.length ? ids.map(String) : coursesFallback.map((c) => String(c.id));
  } catch (err) {
    console.warn('[sanity] getCourseIds failed, using fallback:', messageOf(err));
    return coursesFallback.map((c) => String(c.id));
  }
}

// Singletons: a partially filled document never drops a field the UI expects,
// because mergeDefined lets the fallback fill whatever the CMS left unset.
// The client hooks in hooks.ts share that helper.
async function fetchSingleton<T extends object>(
  query: string, fallback: T, label: string
): Promise<T> {
  if (!sanityClient) return fallback;
  try {
    const data = await sanityClient.fetch(query);
    return mergeDefined(fallback, data as Record<string, unknown> | null);
  } catch (err) {
    console.warn(`[sanity] ${label} failed, using fallback:`, messageOf(err));
    return fallback;
  }
}

export function getHomePage() {
  return fetchSingleton(homePageQuery, homePageFallback, 'getHomePage');
}

export function getContactPage() {
  return fetchSingleton(contactPageQuery, contactPageFallback, 'getContactPage');
}

// Blog posts have no static fallback: when Sanity is unconfigured the /blog page
// simply shows the Firebase user articles on their own. So these return an empty
// list / null rather than bundled data.
export async function getBlogPosts() {
  if (!sanityClient) return [];
  try {
    const posts = await sanityClient.fetch(postsQuery);
    return Array.isArray(posts) ? posts : [];
  } catch (err) {
    console.warn('[sanity] getBlogPosts failed, skipping CMS posts:', messageOf(err));
    return [];
  }
}

export async function getBlogPostBySlug(slug?: string | null) {
  if (!sanityClient || !slug) return null;
  try {
    return (await sanityClient.fetch(postBySlugQuery, { slug: String(slug) })) || null;
  } catch (err) {
    console.warn('[sanity] getBlogPostBySlug failed:', messageOf(err));
    return null;
  }
}
