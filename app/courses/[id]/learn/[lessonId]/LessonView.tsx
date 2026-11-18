'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import ReactPlayer from 'react-player';
import { ArrowLeft, ArrowRight, CircleCheck, Lock } from 'lucide-react';

import PageShell from '@/components/layout/PageShell';
import Section from '@/components/layout/Section';
import PortableBody from '@/components/blog/PortableBody';
import LiveCurriculum from '@/components/course/LiveCurriculum';
import ProgressBar from '@/components/course/ProgressBar';
import { useCourseAccess } from '@/components/course/useCourseAccess';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import useAuth from '@/lib/auth';
import queryClient from '@/lib/queryClient';
import { ActionResultError, errorMessage, unwrap } from '@/lib/actions/result';
import { adjacentLessons, findLesson } from '@/lib/courses/progress';
import { completeLesson, getLesson } from '@/app/courses/actions';
import type { CatalogCourse, LessonContent, LessonId } from '@/types/courses';

function LockedPanel({ course, signedIn, onSignIn }: { course: CatalogCourse; signedIn: boolean; onSignIn: () => void }) {
  return (
    <Card>
      <CardContent>
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 text-center">
          <Lock className="size-12 text-muted-foreground" aria-hidden />
          <p className="text-xl text-card-foreground">This lesson is part of {course.title}.</p>
          {signedIn ? (
            <Button asChild size="xl">
              <Link href={`/courses/${course.id}`}>Enroll to unlock</Link>
            </Button>
          ) : (
            <Button size="xl" onClick={onSignIn}>
              Sign in to continue
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function LessonBody({ content, onVideoEnded }: { content: LessonContent; onVideoEnded: () => void }) {
  if (content.type === 'article') {
    return content.body ? (
      <article className="text-lg text-foreground">
        <PortableBody value={content.body} />
      </article>
    ) : (
      <p className="text-muted-foreground">The written content of this lesson is coming soon.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
        <ReactPlayer
          key={content.playback.url}
          src={content.playback.url}
          controls
          width="100%"
          height="100%"
          onEnded={onVideoEnded}
        />
      </div>
      {content.playback.isPlaceholder ? (
        <p className="text-sm text-muted-foreground">
          The video for this lesson is being produced. A placeholder plays in the meantime.
        </p>
      ) : null}
      {content.notes ? (
        <article className="text-foreground">
          <PortableBody value={content.notes} />
        </article>
      ) : null}
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
  const earnedCertificate = certificateId ?? (isDone && !next ? access?.enrollment?.certificateId : null);

  return (
    <PageShell>
      <Section space="sm" width="wide">
        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="order-2 flex flex-col gap-4 lg:order-1 lg:col-span-1">
            <Link
              href={`/courses/${course.id}`}
              className="flex items-center gap-2 text-primary underline-offset-4 hover:underline"
            >
              <ArrowLeft className="size-4" aria-hidden /> {course.title}
            </Link>
            {access?.progress && enrolled ? <ProgressBar progress={access.progress} /> : null}
            <LiveCurriculum course={course} currentLessonId={lessonId} compact />
          </aside>

          <section className="order-1 flex min-w-0 flex-col gap-6 lg:order-2 lg:col-span-3">
            <header>
              <p className="text-sm text-muted-foreground">{section.title}</p>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-4xl">
                {lesson.title}
              </h1>
            </header>

            {earnedCertificate ? (
              <div className="flex flex-wrap items-center gap-3 rounded-lg bg-primary p-4 text-primary-foreground">
                <span className="text-lg">You completed {course.title}!</span>
                <Link href={`/certificates/${earnedCertificate}`} className="underline underline-offset-4">
                  View your certificate
                </Link>
              </div>
            ) : null}

            {content.isPending ? (
              <Skeleton className="aspect-video w-full" />
            ) : locked ? (
              <LockedPanel course={course} signedIn={!!user} onSignIn={() => loginWithGoogle()} />
            ) : content.error ? (
              <p className="text-destructive">{errorMessage(content.error)}</p>
            ) : (
              <LessonBody content={content.data} onVideoEnded={markComplete} />
            )}

            <Separator />
            <nav className="flex flex-wrap items-center justify-between gap-3" aria-label="Lessons">
              {previous ? (
                <Link
                  href={`/courses/${course.id}/learn/${previous.id}`}
                  className="flex items-center gap-2 text-primary underline-offset-4 hover:underline"
                >
                  <ArrowLeft className="size-4" aria-hidden /> {previous.title}
                </Link>
              ) : <span />}

              {enrolled ? (
                isDone ? (
                  <span className="flex items-center gap-2 text-primary">
                    <CircleCheck className="size-5" aria-hidden /> Completed
                  </span>
                ) : (
                  <Button onClick={markComplete} disabled={complete.isPending || !content.isSuccess}>
                    {complete.isPending ? 'Saving…' : 'Mark as complete'}
                  </Button>
                )
              ) : null}

              {next ? (
                <Link
                  href={`/courses/${course.id}/learn/${next.id}`}
                  className="flex items-center gap-2 text-primary underline-offset-4 hover:underline"
                >
                  {next.title} <ArrowRight className="size-4" aria-hidden />
                </Link>
              ) : <span />}
            </nav>
            {complete.error ? <p className="text-destructive">{errorMessage(complete.error)}</p> : null}
          </section>
        </div>
      </Section>
    </PageShell>
  );
}
