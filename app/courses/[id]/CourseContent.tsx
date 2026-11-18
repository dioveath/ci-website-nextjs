'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Check, Layers } from 'lucide-react';

import PageShell from '../../../components/layout/PageShell';
import Section from '../../../components/layout/Section';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';

import useAuth from '../../../lib/hooks/Auth';
import { UserService } from '../../../lib/service/UserService';
import type { Course } from '../../../types';

function durationLabel(time: Course['time']) {
  const months = Math.floor(Number(time ?? 0) / 30);
  if (!Number.isFinite(months) || months < 1) return 'Short course';
  return `${months} ${months === 1 ? 'month' : 'months'}`;
}

function EnrolButton({ course }: { course: Course }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <Button asChild size="xl" variant="on-brand">
        <Link href="/login">Sign in to enrol</Link>
      </Button>
    );
  }

  return (
    <Button
      size="xl"
      variant="highlight"
      onClick={() => UserService.updateUser(user.uid, { [`courses.${course.id}`]: '' })}
    >
      Enrol now
    </Button>
  );
}

export default function CourseContent({ course }: { course: Course }) {
  const lessons = (course.lessons ?? []) as string[];

  return (
    <PageShell>
      <Section tone="brand" as="div">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-5">
            {course.level ? <Badge variant="on-brand">{course.level}</Badge> : null}

            <h1 className="text-4xl font-semibold tracking-tight text-on-brand md:text-5xl">
              {course.title}
            </h1>

            {course.description ? (
              <p className="max-w-xl text-base text-on-brand-muted md:text-lg">
                {course.description}
              </p>
            ) : null}

            <dl className="flex flex-wrap gap-6 text-on-brand-muted">
              <div>
                <dt className="sr-only">Lessons</dt>
                <dd className="flex items-center gap-2">
                  <Layers className="size-4" aria-hidden />
                  {lessons.length} lessons
                </dd>
              </div>
              <div>
                <dt className="sr-only">Duration</dt>
                <dd className="flex items-center gap-2">
                  <CalendarDays className="size-4" aria-hidden />
                  {durationLabel(course.time)}
                </dd>
              </div>
            </dl>

            <EnrolButton course={course} />
          </div>

          <div className="relative aspect-video overflow-hidden rounded-2xl shadow-pop">
            <Image
              src={course.coverImg || '/computer_course_cover_2.jpg'}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      <Section width="narrow">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Lessons you&apos;ll learn
        </h2>

        <Card className="mt-8">
          <CardContent>
            <ul className="flex flex-col gap-3">
              {lessons.map((lesson) => (
                <li key={lesson} className="flex items-start gap-3 text-card-foreground">
                  <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  {lesson}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </Section>
    </PageShell>
  );
}
