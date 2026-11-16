import { sanityClient } from './client';
import {
  coursesQuery,
  courseByIdQuery,
  courseIdsQuery,
  servicesQuery,
  siteSettingsQuery,
  homePageQuery,
  contactPageQuery,
  postsQuery,
  postBySlugQuery,
} from './queries';

// Static fallbacks: the site renders identically to before until Sanity is
// configured and populated.
import { coursesList } from '../../components/course/coursesList';
import { services as servicesFallback } from '../../components/services/service_list';
import {
  siteSettingsFallback,
  homePageFallback,
  contactPageFallback,
} from './fallbacks';

function messageOf(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

// Checking the client rather than isSanityConfigured is what narrows away the
// null for the calls below; the two are equivalent by construction.
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
  return fetchOrFallback(coursesQuery, {}, coursesList, 'getCourses');
}

export function getServices() {
  return fetchOrFallback(servicesQuery, {}, servicesFallback, 'getServices');
}

export function getCourseById(id: string | number) {
  const fallback = coursesList.find((c) => String(c.id) === String(id)) || null;
  return fetchOrFallback(courseByIdQuery, { id: String(id) }, fallback, 'getCourseById');
}

export async function getCourseIds() {
  if (!sanityClient) return coursesList.map((c) => String(c.id));
  try {
    const ids: unknown[] = await sanityClient.fetch(courseIdsQuery);
    return ids && ids.length ? ids.map(String) : coursesList.map((c) => String(c.id));
  } catch (err) {
     
    console.warn('[sanity] getCourseIds failed, using fallback:', messageOf(err));
    return coursesList.map((c) => String(c.id));
  }
}

// Singletons: shallow-merge the fallback under the fetched doc so a partially
// filled document never drops a field the UI expects. A GROQ projection returns
// missing attributes as explicit `null`, so we skip null/undefined values and
// let the fallback fill those gaps (otherwise an unset field would blank the UI).
function mergeDefined<T extends object>(fallback: T, data: Record<string, unknown>): T {
  const merged: Record<string, unknown> = { ...(fallback as Record<string, unknown>) };
  for (const [key, value] of Object.entries(data)) {
    if (value !== null && value !== undefined) merged[key] = value;
  }
  return merged as T;
}

async function fetchSingleton<T extends object>(
  query: string, fallback: T, label: string
): Promise<T> {
  if (!sanityClient) return fallback;
  try {
    const data = await sanityClient.fetch(query);
    return data ? mergeDefined(fallback, data as Record<string, unknown>) : fallback;
  } catch (err) {
     
    console.warn(`[sanity] ${label} failed, using fallback:`, messageOf(err));
    return fallback;
  }
}

export function getSiteSettings() {
  return fetchSingleton(siteSettingsQuery, siteSettingsFallback, 'getSiteSettings');
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
