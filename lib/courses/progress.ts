import type {
  CatalogCourse,
  CourseSection,
  LessonId,
  LessonSummary,
  ProgressSummary,
} from '../../types/courses';

/** Any progress map: the Firestore one (Timestamps) or its serialised form. */
type ProgressMap = Partial<Record<LessonId, unknown>>;

export function allLessons(course: Pick<CatalogCourse, 'sections'>): LessonSummary[] {
  return course.sections.flatMap((section) => section.lessons);
}

export function findLesson(
  course: Pick<CatalogCourse, 'sections'>,
  lessonId: LessonId
): { lesson: LessonSummary; section: CourseSection; index: number } | null {
  let index = 0;
  for (const section of course.sections) {
    for (const lesson of section.lessons) {
      if (lesson.id === lessonId) return { lesson, section, index };
      index++;
    }
  }
  return null;
}

export function adjacentLessons(
  course: Pick<CatalogCourse, 'sections'>,
  lessonId: LessonId
): { previous: LessonSummary | null; next: LessonSummary | null } {
  const lessons = allLessons(course);
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: lessons[index - 1] ?? null,
    next: lessons[index + 1] ?? null,
  };
}

/**
 * Only lessons that are still in the course count, so removing a lesson in
 * the Studio never leaves a student stuck below 100%.
 */
export function summarizeProgress(
  course: Pick<CatalogCourse, 'sections'>,
  progress: ProgressMap | undefined
): ProgressSummary {
  const lessons = allLessons(course);
  const completed = lessons.filter((lesson) => progress?.[lesson.id] != null).length;
  const total = lessons.length;
  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.floor((completed / total) * 100),
  };
}

export function isCourseComplete(
  course: Pick<CatalogCourse, 'sections'>,
  progress: ProgressMap | undefined
): boolean {
  const { completed, total } = summarizeProgress(course, progress);
  return total > 0 && completed === total;
}

/**
 * Where "Continue" should take the student: the first lesson they have not
 * completed, or, once everything is done, the last lesson they opened.
 */
export function resumeLessonId(
  course: Pick<CatalogCourse, 'sections'>,
  progress: ProgressMap | undefined,
  lastLessonId?: LessonId
): LessonId | null {
  const lessons = allLessons(course);
  if (lessons.length === 0) return null;
  const firstIncomplete = lessons.find((lesson) => progress?.[lesson.id] == null);
  if (firstIncomplete) return firstIncomplete.id;
  const last = lastLessonId && lessons.find((lesson) => lesson.id === lastLessonId);
  return last ? last.id : lessons[0].id;
}
