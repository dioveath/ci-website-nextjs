'use client';

import { useQuery } from '@tanstack/react-query';

import useAuth from '../../lib/hooks/Auth';
import { unwrap } from '../../lib/actions/result';
import { getCourseAccess } from '../../app/courses/actions';
import type { CourseId, LessonId } from '../../types/courses';

export const courseAccessKey = (courseId: CourseId, uid: string | undefined) =>
  ['course_access', courseId, uid ?? 'anonymous'] as const;

/**
 * The signed-in visitor's access to a course (enrollment, progress, where to
 * resume). Visitors who are not signed in have no access and cause no request.
 */
export function useCourseAccess(courseId: CourseId) {
  const { user, loading: authLoading, getIdToken } = useAuth();
  const query = useQuery({
    queryKey: courseAccessKey(courseId, user?.uid),
    queryFn: async () => unwrap(await getCourseAccess(await getIdToken(), courseId)),
    enabled: !authLoading && !!user,
    refetchOnMount: 'always',
  });

  const access = query.data ?? null;
  const completed = new Set<LessonId>(
    Object.keys(access?.enrollment?.progress ?? {}).filter((id) => access?.enrollment?.progress[id])
  );

  return {
    access,
    completed,
    signedIn: !!user,
    loading: authLoading || (!!user && query.isPending),
    error: query.error,
    refetch: query.refetch,
  };
}
