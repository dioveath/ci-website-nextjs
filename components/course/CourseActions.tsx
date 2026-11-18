'use client';

import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';

import useAuth from '../../lib/hooks/Auth';
import queryClient from '../../lib/queryclient';
import { enrollFree } from '../../app/courses/actions';
import { errorMessage, unwrap } from '../../lib/actions/result';
import { formatMoney } from '../../lib/courses/format';
import { allLessons, findLesson } from '../../lib/courses/progress';
import { useCourseAccess } from './useCourseAccess';
import ProgressBar from './ProgressBar';
import type { CatalogCourse } from '../../types/courses';

const buttonClass =
  'w-full text-center text-white text-lg py-3 rounded-lg shadow-md transition-colors bg-eggblue hover:bg-greenpea disabled:bg-riverbed disabled:animate-pulse';

/** The enroll / buy / continue box on a course page. */
export default function CourseActions({ course }: { course: CatalogCourse }) {
  const { getIdToken, loginWithGoogle, fetching } = useAuth();
  const { access, signedIn, loading, error } = useCourseAccess(course.id);

  const enroll = useMutation({
    mutationFn: async () => unwrap(await enrollFree((await getIdToken()) ?? '', { courseId: course.id })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['course_access', course.id] }),
  });

  const firstLesson = allLessons(course)[0];
  const resume = access?.resumeLessonId ? findLesson(course, access.resumeLessonId)?.lesson : null;

  let body: React.ReactNode;
  if (loading) {
    body = <button type="button" disabled className={buttonClass}>Loading…</button>;
  } else if (access?.hasAccess) {
    const started = (access.progress?.completed ?? 0) > 0;
    const target = resume ?? firstLesson;
    body = (
      <>
        {access.progress && <ProgressBar progress={access.progress} />}
        {access.enrollment?.certificateId && (
          <Link href={`/certificates/${access.enrollment.certificateId}`} className="text-cheeseyellow hover:underline">
            View your certificate
          </Link>
        )}
        {target ? (
          <Link href={`/courses/${course.id}/learn/${target.id}`} className={buttonClass}>
            {started ? `Continue: ${target.title}` : 'Start the course'}
          </Link>
        ) : (
          <p className="text-gray-300">Lessons are being prepared.</p>
        )}
      </>
    );
  } else if (!signedIn) {
    body = (
      <button type="button" className={buttonClass} disabled={fetching} onClick={() => loginWithGoogle()}>
        Sign in to enroll
      </button>
    );
  } else if (!course.price) {
    body = (
      <button type="button" className={buttonClass} disabled={enroll.isPending} onClick={() => enroll.mutate()}>
        {enroll.isPending ? 'Enrolling…' : 'Enroll for free'}
      </button>
    );
  } else {
    body = <p className="text-gray-200">Online payment is opening soon.</p>;
  }

  const ended = access?.enrollment && !access.hasAccess;

  return (
    <section className="rounded-lg bg-timbergreen/60 p-5 flex flex-col gap-4 text-white">
      <p className="text-3xl font-bold">{formatMoney(course.price)}</p>
      {ended && (
        <p className="text-sm text-cheeseyellow">
          Your access to this course has ended. Contact us if you think this is a mistake.
        </p>
      )}
      {body}
      {(enroll.error || error) && <p className="text-sm text-red-300">{errorMessage(enroll.error ?? error)}</p>}
      <p className="text-sm text-gray-300">
        {course.totalLessons} lessons · self-paced · lifetime access
      </p>
    </section>
  );
}
