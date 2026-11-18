import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Layers } from 'lucide-react';

import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter } from '../ui/card';
import type { Course } from '../../types';

/** Days -> whole months, which is how the course length is advertised. */
function durationLabel(time: Course['time']) {
  const months = Math.floor(Number(time ?? 0) / 30);
  if (!Number.isFinite(months) || months < 1) return 'Short course';
  return `${months} ${months === 1 ? 'month' : 'months'}`;
}

export default function CourseCard({
  course,
  headingLevel = 3
}: {
  course: Course;
  headingLevel?: 2 | 3;
}) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3';
  const lessons = course.lessons?.length ?? 0;

  return (
    <Card interactive className="h-full">
      <Link href={`/courses/${course.id}`} className="flex h-full flex-col">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={course.coverImg}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <CardContent className="flex-1">
          <div className="flex flex-col items-start gap-2">
            {course.level ? <Badge variant="highlight">{course.level}</Badge> : null}
            <Heading className="text-lg font-semibold text-card-foreground">
              {course.title}
            </Heading>
            {course.description ? (
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {course.description}
              </p>
            ) : null}
          </div>
        </CardContent>

        <CardFooter variant="meta">
          <span className="flex items-center gap-1.5">
            <Layers className="size-4" aria-hidden />
            {lessons} {lessons === 1 ? 'lesson' : 'lessons'}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" aria-hidden />
            {durationLabel(course.time)}
          </span>
        </CardFooter>
      </Link>
    </Card>
  );
}
