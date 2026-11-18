import 'server-only';

import { sanityClient } from '../sanity/client';
import { allCoursesQuery, courseByIdQuery, coursesByIdsQuery } from '../sanity/queries';
import { normalizeCourse, normalizeCourses, type RawCourse } from '../courses/catalog';
import { isCourseId } from '../courses/ids';
import { coursesFallback } from '../sanity/fallbacks';
import { fail } from './errors';
import type { CatalogCourse, CourseId } from '../../types/courses';

/*
 * The catalog as the server trusts it, for decisions (who may open a lesson,
 * what a course costs). It bypasses the Sanity CDN, so a price change applies
 * to the very next checkout, and it never falls back to sample data when a
 * configured Sanity is unreachable.
 */

const liveClient = sanityClient?.withConfig({ useCdn: false }) ?? null;

export function isSampleCatalog(): boolean {
  return liveClient === null;
}

export async function requireCourse(courseId: unknown): Promise<CatalogCourse> {
  if (!isCourseId(courseId)) fail('invalid', 'Invalid course.');
  let course: CatalogCourse | null;
  try {
    course = liveClient
      ? normalizeCourse(await liveClient.fetch<RawCourse | null>(courseByIdQuery, { id: courseId }))
      : normalizeCourse(coursesFallback.find((raw) => raw.id === courseId));
  } catch (error) {
    console.error('[catalog] course lookup failed:', error);
    fail('unavailable', 'Courses are temporarily unavailable. Please try again shortly.');
  }
  if (!course) fail('not_found', 'This course does not exist.');
  return course;
}

/** Courses by id. Missing ids are simply absent from the map. */
export async function coursesById(ids: CourseId[]): Promise<Map<CourseId, CatalogCourse>> {
  const unique = [...new Set(ids.filter(isCourseId))];
  if (unique.length === 0) return new Map();
  let courses: CatalogCourse[];
  try {
    courses = liveClient
      ? normalizeCourses(await liveClient.fetch<RawCourse[]>(coursesByIdsQuery, { ids: unique }))
      : normalizeCourses(coursesFallback.filter((raw) => raw.id && unique.includes(raw.id)));
  } catch (error) {
    console.error('[catalog] courses lookup failed:', error);
    fail('unavailable', 'Courses are temporarily unavailable. Please try again shortly.');
  }
  return new Map(courses.map((course) => [course.id, course]));
}

/** Every course, including unlisted ones. */
export async function allCourses(): Promise<CatalogCourse[]> {
  try {
    return liveClient
      ? normalizeCourses(await liveClient.fetch<RawCourse[]>(allCoursesQuery))
      : normalizeCourses(coursesFallback);
  } catch (error) {
    console.error('[catalog] listing courses failed:', error);
    fail('unavailable', 'Courses are temporarily unavailable. Please try again shortly.');
  }
}
