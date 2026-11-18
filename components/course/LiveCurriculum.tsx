'use client';

import CourseCurriculum from '@/components/course/CourseCurriculum';
import { useCourseAccess } from '@/components/course/useCourseAccess';
import type { CatalogCourse, LessonId } from '@/types/courses';

/** The curriculum, unlocked and ticked off for a student who owns the course. */
export default function LiveCurriculum({
  course,
  currentLessonId,
  compact,
}: {
  course: CatalogCourse;
  currentLessonId?: LessonId;
  compact?: boolean;
}) {
  const { access, completed } = useCourseAccess(course.id);
  return (
    <CourseCurriculum
      course={course}
      hasAccess={access?.hasAccess ?? false}
      completed={completed}
      currentLessonId={currentLessonId}
      compact={compact}
    />
  );
}
