import { mergeDefined, sanityClient } from './client';
import {
  coursesQuery,
  courseByIdQuery,
  coursesByIdsQuery,
  courseIdsQuery,
  servicesQuery,
  homePageQuery,
  contactPageQuery,
  postsQuery,
  postBySlugQuery,
} from './queries';

// Static fallbacks: the site renders identically until Sanity is configured
// and populated (courses excepted; see below).
import { normalizeCourse, normalizeCourses, type RawCourse } from '../courses/catalog';
import type { CatalogCourse, CourseId } from '../../types/courses';
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

export function getServices() {
  return fetchOrFallback(servicesQuery, {}, servicesFallback, 'getServices');
}

/*
 * Courses are sold, so they do not follow the "fall back on error" rule the
 * marketing content uses: the bundled sample catalog is shown only when Sanity
 * is not configured at all. Once it is, an outage must never put sample
 * courses (with sample prices) in front of buyers.
 */

/** The public catalog for /courses: listed courses only. */
export async function getCourses(): Promise<CatalogCourse[]> {
  if (!sanityClient) return normalizeCourses(coursesFallback).filter((course) => course.listed);
  try {
    return normalizeCourses(await sanityClient.fetch<RawCourse[]>(coursesQuery));
  } catch (err) {
    console.warn('[sanity] getCourses failed:', messageOf(err));
    return [];
  }
}

/**
 * One course, listed or not. Throws when Sanity is configured but unreachable,
 * so an ISR revalidation keeps serving the last good page instead of a 404.
 */
export async function getCourseById(id: string | number): Promise<CatalogCourse | null> {
  if (!sanityClient) {
    return normalizeCourse(coursesFallback.find((course) => course.id === String(id)));
  }
  return normalizeCourse(await sanityClient.fetch<RawCourse | null>(courseByIdQuery, { id: String(id) }));
}

export async function getCoursesByIds(ids: CourseId[]): Promise<CatalogCourse[]> {
  if (ids.length === 0) return [];
  if (!sanityClient) {
    return normalizeCourses(coursesFallback.filter((course) => course.id && ids.includes(course.id)));
  }
  return normalizeCourses(await sanityClient.fetch<RawCourse[]>(coursesByIdsQuery, { ids }));
}

export async function getCourseIds(): Promise<string[]> {
  if (!sanityClient) return normalizeCourses(coursesFallback).map((course) => course.id);
  try {
    const ids = await sanityClient.fetch<unknown[]>(courseIdsQuery);
    return (ids ?? []).map(String);
  } catch (err) {
    // Pages are then rendered on first request instead of at build time.
    console.warn('[sanity] getCourseIds failed:', messageOf(err));
    return [];
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

/** Home page singleton; featured courses come back normalised like every course. */
export async function getHomePage() {
  const home = await fetchSingleton(homePageQuery, homePageFallback, 'getHomePage');
  return { ...home, featuredCourses: normalizeCourses(home.featuredCourses as RawCourse[]) };
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
