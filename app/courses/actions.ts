'use server';

import { fail, runAction } from '../../lib/server/actions';
import { optionalCaller, requireCaller, type Caller } from '../../lib/server/authz';
import { coursesById, requireCourse } from '../../lib/server/catalog';
import { getLessonBody, resolvePlayback } from '../../lib/server/content';
import {
  completeLesson as completeLessonFor,
  describeAccess,
  enrollInFreeCourse,
  getEnrollment,
  hasActiveAccess,
  listEnrollmentsFor,
  rememberLesson,
  toEnrollmentDTO,
  type CompletionResult,
  type Student,
} from '../../lib/server/enrollments';
import { isLessonId } from '../../lib/courses/ids';
import { findLesson, resumeLessonId, summarizeProgress } from '../../lib/courses/progress';
import type {
  ActionResult,
  CourseAccess,
  CourseId,
  EnrollmentDTO,
  LessonContent,
  LessonId,
  MyCourseView,
} from '../../types/courses';

/*
 * Student-facing course actions. The first argument is always the caller's
 * Firebase ID token (or null where signing in is optional); every action
 * verifies it and checks access itself.
 */

function asStudent(caller: Caller): Student {
  return { uid: caller.uid, name: caller.name, email: caller.email };
}

/** What the current visitor can do with a course. Anonymous callers get "no access". */
export async function getCourseAccess(
  idToken: string | null,
  courseId: CourseId
): Promise<ActionResult<CourseAccess>> {
  return runAction('getCourseAccess', async () => {
    const course = await requireCourse(courseId);
    const caller = await optionalCaller(idToken);
    if (!caller) return describeAccess(course, null, null);
    return describeAccess(course, await getEnrollment(course.id, caller.uid), caller.uid);
  });
}

export async function enrollFree(idToken: string, input: { courseId: CourseId }): Promise<ActionResult<EnrollmentDTO>> {
  return runAction('enrollFree', async () => {
    const caller = await requireCaller(idToken);
    const course = await requireCourse(input?.courseId);
    return enrollInFreeCourse(course, asStudent(caller));
  });
}

/**
 * The content of one lesson. Free-preview lessons are open to everyone;
 * the rest need an active enrollment. Admins can open everything, to review.
 */
export async function getLesson(
  idToken: string | null,
  input: { courseId: CourseId; lessonId: LessonId }
): Promise<ActionResult<LessonContent>> {
  return runAction('getLesson', async () => {
    if (!isLessonId(input?.lessonId)) fail('invalid', 'Invalid lesson.');
    const course = await requireCourse(input.courseId);
    const found = findLesson(course, input.lessonId);
    if (!found) fail('not_found', 'This lesson does not exist.');
    const { lesson } = found;

    const caller = await optionalCaller(idToken);
    const enrollment = caller ? await getEnrollment(course.id, caller.uid) : null;
    const enrolled = hasActiveAccess(enrollment);

    if (!lesson.isPreview && !enrolled && !caller?.isAdmin) {
      if (!caller) fail('unauthenticated', 'Sign in and enroll to open this lesson.');
      fail('not_enrolled', 'Enroll in this course to open this lesson.');
    }

    if (enrolled && enrollment?.lastLessonId !== lesson.id) {
      await rememberLesson(course.id, caller!.uid, lesson.id);
    }

    const body = await getLessonBody(course.id, lesson.id);
    if (lesson.type === 'article') {
      return { id: lesson.id, type: 'article', body };
    }
    return { id: lesson.id, type: 'video', playback: await resolvePlayback(lesson.video), notes: body };
  });
}

export async function completeLesson(
  idToken: string,
  input: { courseId: CourseId; lessonId: LessonId }
): Promise<ActionResult<CompletionResult>> {
  return runAction('completeLesson', async () => {
    const caller = await requireCaller(idToken);
    if (!isLessonId(input?.lessonId)) fail('invalid', 'Invalid lesson.');
    const course = await requireCourse(input.courseId);
    return completeLessonFor(course, asStudent(caller), input.lessonId);
  });
}

/** The caller's courses with active access, most recently enrolled first. */
export async function getMyCourses(idToken: string): Promise<ActionResult<MyCourseView[]>> {
  return runAction('getMyCourses', async () => {
    const caller = await requireCaller(idToken);
    const enrollments = (await listEnrollmentsFor(caller.uid)).filter(({ enrollment }) =>
      hasActiveAccess(enrollment)
    );
    const courses = await coursesById(enrollments.map(({ enrollment }) => enrollment.courseId));

    return enrollments.map(({ id, enrollment }) => {
      const course = courses.get(enrollment.courseId) ?? null;
      return {
        course,
        enrollment: toEnrollmentDTO(id, enrollment),
        progress: course ? summarizeProgress(course, enrollment.progress) : { completed: 0, total: 0, percent: 0 },
        resumeLessonId: course ? resumeLessonId(course, enrollment.progress, enrollment.lastLessonId) : null,
      };
    });
  });
}
