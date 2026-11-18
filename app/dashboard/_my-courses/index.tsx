'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import useAuth from '@/lib/auth';
import { errorMessage, unwrap } from '@/lib/actions/result';
import { findLesson } from '@/lib/courses/progress';
import ProgressBar from '@/components/course/ProgressBar';
import CardGrid from '@/components/layout/CardGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getMyCourses } from '@/app/courses/actions';
import type { MyCourseView } from '@/types/courses';

function MyCourseCard({ item }: { item: MyCourseView }) {
  const { course, enrollment, progress, resumeLessonId } = item;
  const title = course?.title ?? enrollment.courseTitle;
  const resume = course && resumeLessonId ? findLesson(course, resumeLessonId)?.lesson : null;

  return (
    <Card className="h-full">
      {course ? (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image alt="" src={course.coverImg} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        </div>
      ) : null}
      <CardContent className="grow">
        <div className="flex h-full flex-col gap-3">
        <h2 className="text-xl font-semibold text-card-foreground">{title}</h2>
        {course ? (
          <>
            <ProgressBar progress={progress} />
            <div className="mt-auto flex flex-wrap items-center gap-3">
              {resume ? (
                <Button asChild>
                  <Link href={`/courses/${course.id}/learn/${resume.id}`}>
                    {progress.completed > 0 ? 'Continue' : 'Start'}
                  </Link>
                </Button>
              ) : null}
              {enrollment.certificateId ? (
                <Link
                  href={`/certificates/${enrollment.certificateId}`}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Certificate
                </Link>
              ) : null}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">This course is no longer available.</p>
        )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function MyCoursesContainer() {
  const { user, getIdToken } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ['my_courses', user?.uid],
    queryFn: async () => unwrap(await getMyCourses((await getIdToken()) ?? '')),
    enabled: !!user,
    refetchOnMount: 'always',
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">My courses</h1>

      {isLoading ? <Skeleton className="h-40 w-full" /> : null}
      {error ? <p className="text-destructive">{errorMessage(error)}</p> : null}

      {data && data.length === 0 ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-muted-foreground">You have not enrolled in any course yet.</p>
          <Button asChild>
            <Link href="/courses">Browse courses</Link>
          </Button>
        </div>
      ) : null}

      {data && data.length > 0 ? (
        <CardGrid>
          {data.map((item) => (
            <MyCourseCard key={item.enrollment.id} item={item} />
          ))}
        </CardGrid>
      ) : null}
    </div>
  );
}
