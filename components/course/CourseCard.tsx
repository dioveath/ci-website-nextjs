import Image from 'next/image';
import Link from 'next/link';
import { Clock, Layers } from 'lucide-react';

import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter } from '../ui/card';
import { formatDuration, formatMoney } from '../../lib/courses/format';
import type { CatalogCourse } from '../../types/courses';

export default function CourseCard({
  course,
  headingLevel = 3
}: {
  course: CatalogCourse;
  headingLevel?: 2 | 3;
}) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3';
  const lessons = course.totalLessons;
  const duration = formatDuration(course.totalDurationSec);

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
            <div className="flex w-full items-center justify-between gap-2">
              <Badge variant="highlight">{course.level}</Badge>
              <span className="font-semibold text-card-foreground">{formatMoney(course.price)}</span>
            </div>
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
          {duration ? (
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden />
              {duration}
            </span>
          ) : null}
        </CardFooter>
      </Link>
    </Card>
  );
}
