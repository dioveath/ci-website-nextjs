'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import ReactPlayer from 'react-player';
import { AiFillLock, AiOutlineArrowLeft, AiOutlineArrowRight, AiFillCheckCircle } from 'react-icons/ai';

import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer/Footer';
import PortableBody from '../../../../../components/blog/PortableBody';
import LiveCurriculum from '../../../../../components/course/LiveCurriculum';
import ProgressBar from '../../../../../components/course/ProgressBar';
import { useCourseAccess } from '../../../../../components/course/useCourseAccess';
import useAuth from '../../../../../lib/hooks/Auth';
import queryClient from '../../../../../lib/queryclient';
import { ActionResultError, errorMessage, unwrap } from '../../../../../lib/actions/result';
import { adjacentLessons, findLesson } from '../../../../../lib/courses/progress';
import { completeLesson, getLesson } from '../../../../courses/actions';
import type { CatalogCourse, LessonContent, LessonId } from '../../../../../types/courses';

function LockedPanel({ course, signedIn, onSignIn }: { course: CatalogCourse; signedIn: boolean; onSignIn: () => void }) {
  return (
    <div className="aspect-video w-full rounded-lg bg-timbergreen flex flex-col items-center justify-center gap-4 p-6 text-center">
      <AiFillLock className="text-5xl text-gray-300" aria-hidden />
      <p className="text-white text-xl">This lesson is part of {course.title}.</p>
      {signedIn ? (
        <Link href={`/courses/${course.id}`} className="px-6 py-3 rounded-lg bg-eggblue hover:bg-greenpea text-white">
          Enroll to unlock
        </Link>
      ) : (
        <button type="button" onClick={onSignIn} className="px-6 py-3 rounded-lg bg-eggblue hover:bg-greenpea text-white">
          Sign in to continue
        </button>
      )}
    </div>
  );
}

function LessonBody({ content, onVideoEnded }: { content: LessonContent; onVideoEnded: () => void }) {
  if (content.type === 'article') {
    return content.body ? (
      <article className="text-white text-lg">
        <PortableBody value={content.body} />
      </article>
    ) : (
      <p className="text-gray-300">The written content of this lesson is coming soon.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
        <ReactPlayer
          key={content.playback.url}
          src={content.playback.url}
          controls
          width="100%"
          height="100%"
          onEnded={onVideoEnded}
        />
      </div>
      {content.playback.isPlaceholder && (
        <p className="text-sm text-cheeseyellow">
          The video for this lesson is being produced. A placeholder plays in the meantime.
        </p>
      )}
      {content.notes && (
        <article className="text-white">
          <PortableBody value={content.notes} />
        </article>
      )}
    </div>
  );
}

export default function LessonView({ course, lessonId }: { course: CatalogCourse; lessonId: LessonId }) {
  const { user, loading: authLoading, getIdToken, loginWithGoogle } = useAuth();
  const { access, completed } = useCourseAccess(course.id);
  const [certificateId, setCertificateId] = useState<string | null>(null);

  const { lesson, section } = findLesson(course, lessonId)!;
  const { previous, next } = adjacentLessons(course, lessonId);

  const content = useQuery({
    queryKey: ['lesson', course.id, lessonId, user?.uid ?? 'anonymous'],
    queryFn: async () => unwrap(await getLesson(await getIdToken(), { courseId: course.id, lessonId })),
    enabled: !authLoading,
    retry: false,
    refetchOnMount: 'always',
  });

  const complete = useMutation({
    mutationFn: async () =>
      unwrap(await completeLesson((await getIdToken()) ?? '', { courseId: course.id, lessonId })),
    onSuccess: async (result) => {
      if (result.certificateId) setCertificateId(result.certificateId);
      await queryClient.invalidateQueries({ queryKey: ['course_access', course.id] });
      await queryClient.invalidateQueries({ queryKey: ['my_courses'] });
    },
  });

  const enrolled = access?.hasAccess ?? false;
  const isDone = completed.has(lessonId);
  const markComplete = () => {
    if (enrolled && !isDone && !complete.isPending) complete.mutate();
  };

  const lockedCode = content.error instanceof ActionResultError ? content.error.code : null;
  const locked = lockedCode === 'not_enrolled' || lockedCode === 'unauthenticated';

  return (
    <div className="bg-slategray min-h-screen">
      <Navbar path="/courses" />

      <main className="px-4 lg:px-12 py-6 grid gap-8 lg:grid-cols-[20rem_1fr]">
        <aside className="order-2 lg:order-1 flex flex-col gap-4">
          <Link href={`/courses/${course.id}`} className="text-aquamarine hover:underline flex items-center gap-2">
            <AiOutlineArrowLeft aria-hidden /> {course.title}
          </Link>
          {access?.progress && enrolled && <ProgressBar progress={access.progress} />}
          <LiveCurriculum course={course} currentLessonId={lessonId} compact />
        </aside>

        <section className="order-1 lg:order-2 flex flex-col gap-6 min-w-0">
          <header>
            <p className="text-sm text-gray-300">{section.title}</p>
            <h1 className="text-white text-2xl lg:text-4xl font-bold">{lesson.title}</h1>
          </header>

          {(certificateId || (isDone && access?.enrollment?.certificateId && !next)) && (
            <div className="rounded-lg bg-greenpea p-4 text-white flex flex-wrap items-center gap-3">
              <span className="text-lg">You completed {course.title}!</span>
              <Link
                href={`/certificates/${certificateId ?? access?.enrollment?.certificateId}`}
                className="underline text-cheeseyellow"
              >
                View your certificate
              </Link>
            </div>
          )}

          {content.isPending ? (
            <div className="aspect-video w-full rounded-lg bg-timbergreen animate-pulse" />
          ) : locked ? (
            <LockedPanel course={course} signedIn={!!user} onSignIn={() => loginWithGoogle()} />
          ) : content.error ? (
            <p className="text-red-300">{errorMessage(content.error)}</p>
          ) : (
            <LessonBody content={content.data} onVideoEnded={markComplete} />
          )}

          <nav className="flex flex-wrap items-center justify-between gap-3 border-t border-riverbed pt-4">
            {previous ? (
              <Link href={`/courses/${course.id}/learn/${previous.id}`} className="text-aquamarine hover:underline flex items-center gap-2">
                <AiOutlineArrowLeft aria-hidden /> {previous.title}
              </Link>
            ) : <span />}

            {enrolled && (
              isDone ? (
                <span className="flex items-center gap-2 text-eggblue">
                  <AiFillCheckCircle aria-hidden /> Completed
                </span>
              ) : (
                <button
                  type="button"
                  onClick={markComplete}
                  disabled={complete.isPending || !content.isSuccess}
                  className="px-5 py-2 rounded-lg bg-eggblue hover:bg-greenpea disabled:bg-riverbed text-white"
                >
                  {complete.isPending ? 'Saving…' : 'Mark as complete'}
                </button>
              )
            )}

            {next ? (
              <Link href={`/courses/${course.id}/learn/${next.id}`} className="text-aquamarine hover:underline flex items-center gap-2">
                {next.title} <AiOutlineArrowRight aria-hidden />
              </Link>
            ) : <span />}
          </nav>
          {complete.error && <p className="text-red-300">{errorMessage(complete.error)}</p>}
        </section>
      </main>

      <Footer />
    </div>
  );
}
