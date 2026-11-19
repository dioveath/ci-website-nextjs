import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Layers, Wallet } from 'lucide-react';

import PageShell from '@/components/layout/PageShell';
import Section from '@/components/layout/Section';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import LiveCurriculum from '@/components/course/LiveCurriculum';
import CourseActions from '@/components/course/CourseActions';
import { formatDuration, formatMoney } from '@/lib/courses/format';
import type { CatalogCourse, PaymentOption } from '@/types/courses';

interface CourseContentProps {
  course: CatalogCourse;
  prerequisites: CatalogCourse[];
  paymentOptions: PaymentOption[];
}

export default function CourseContent({ course, prerequisites, paymentOptions }: CourseContentProps) {
  const duration = formatDuration(course.totalDurationSec);

  return (
    <PageShell>
      <Section tone="brand" as="div">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-5">
            <Badge variant="on-brand">{course.level}</Badge>

            <h1 className="text-4xl font-semibold tracking-tight text-on-brand md:text-5xl">
              {course.title}
            </h1>

            <dl className="flex flex-wrap gap-6 text-on-brand-muted">
              <div>
                <dt className="sr-only">Lessons</dt>
                <dd className="flex items-center gap-2">
                  <Layers className="size-4" aria-hidden />
                  {course.totalLessons} {course.totalLessons === 1 ? 'lesson' : 'lessons'}
                </dd>
              </div>
              {duration ? (
                <div>
                  <dt className="sr-only">Video time</dt>
                  <dd className="flex items-center gap-2">
                    <Clock className="size-4" aria-hidden />
                    {duration} of content
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="sr-only">Price</dt>
                <dd className="flex items-center gap-2 font-semibold text-on-brand">
                  <Wallet className="size-4" aria-hidden />
                  {formatMoney(course.price)}
                </dd>
              </div>
            </dl>
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

      <Section>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="flex flex-col gap-10 lg:col-span-2">
            {course.description ? (
              <section>
                <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                  About this course
                </h2>
                <p className="mt-4 whitespace-pre-line text-muted-foreground">{course.description}</p>
              </section>
            ) : null}

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">Curriculum</h2>
              <div className="mt-6">
                <LiveCurriculum course={course} />
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
            {/* CourseActions reads ?payment=; the page itself stays static. */}
            <Suspense>
              <CourseActions course={course} paymentOptions={paymentOptions} />
            </Suspense>

            {prerequisites.length > 0 ? (
              <Card>
                <CardContent>
                  <h2 className="font-semibold text-card-foreground">Recommended first</h2>
                  <ul className="mt-2 flex flex-col gap-1">
                    {prerequisites.map((prerequisite) => (
                      <li key={prerequisite.id}>
                        <Link
                          href={`/courses/${prerequisite.id}`}
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          {prerequisite.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : null}
          </aside>
        </div>
      </Section>
    </PageShell>
  );
}
