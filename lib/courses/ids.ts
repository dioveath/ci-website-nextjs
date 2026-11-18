import type { CourseId, EnrollmentId, LessonId, Uid } from '../../types/courses';

// Course ids may not contain "_" so that `${courseId}_${uid}` always splits
// back unambiguously at the first underscore. The Studio enforces the same
// patterns (studio/schemaTypes/documents/course.js).
export const COURSE_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;
export const LESSON_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,95}$/;
// Firebase Auth uids: up to 128 characters, never "/".
const UID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

export function isCourseId(value: unknown): value is CourseId {
  return typeof value === 'string' && COURSE_ID_PATTERN.test(value);
}

export function isLessonId(value: unknown): value is LessonId {
  return typeof value === 'string' && LESSON_ID_PATTERN.test(value);
}

export function isUid(value: unknown): value is Uid {
  return typeof value === 'string' && UID_PATTERN.test(value);
}

export function enrollmentId(courseId: CourseId, uid: Uid): EnrollmentId {
  if (!isCourseId(courseId)) throw new Error(`Invalid course id: ${courseId}`);
  if (!isUid(uid)) throw new Error('Invalid uid');
  return `${courseId}_${uid}`;
}

export function parseEnrollmentId(value: unknown): { courseId: CourseId; uid: Uid } | null {
  if (typeof value !== 'string') return null;
  const split = value.indexOf('_');
  if (split === -1) return null;
  const courseId = value.slice(0, split);
  const uid = value.slice(split + 1);
  return isCourseId(courseId) && isUid(uid) ? { courseId, uid } : null;
}
