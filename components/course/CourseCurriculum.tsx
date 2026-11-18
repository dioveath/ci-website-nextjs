import Link from 'next/link';
import { CircleCheck, CirclePlay, FileText, Lock } from 'lucide-react';

import { formatDuration } from '@/lib/courses/format';
import { cn } from '@/lib/utils';
import type { CatalogCourse, LessonId } from '@/types/courses';

interface CourseCurriculumProps {
  course: CatalogCourse;
  /** The student owns the course: every lesson opens. */
  hasAccess?: boolean;
  completed?: ReadonlySet<LessonId>;
  /** Highlights the lesson being viewed (lesson page sidebar). */
  currentLessonId?: LessonId;
  compact?: boolean;
}

export default function CourseCurriculum({
  course,
  hasAccess = false,
  completed,
  currentLessonId,
  compact = false,
}: CourseCurriculumProps) {
  if (course.totalLessons === 0) {
    return <p className="text-muted-foreground">Lessons are being prepared. Check back soon.</p>;
  }

  return (
    <ol className="flex flex-col gap-6">
      {course.sections.filter((section) => section.lessons.length > 0).map((section, index) => (
        <li key={section.key}>
          <p className={cn('mb-2 font-semibold text-foreground', compact ? 'text-base' : 'text-xl')}>
            {index + 1}. {section.title}
          </p>
          <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {section.lessons.map((lesson) => {
              const open = hasAccess || lesson.isPreview;
              const done = completed?.has(lesson.id) ?? false;
              const current = lesson.id === currentLessonId;
              const Icon = done ? CircleCheck : lesson.type === 'article' ? FileText : CirclePlay;
              const row = (
                <div
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 transition-colors',
                    current && 'bg-accent',
                    open ? 'hover:bg-accent' : 'opacity-70'
                  )}
                >
                  <Icon className={cn('size-5 shrink-0', done ? 'text-primary' : 'text-muted-foreground')} aria-hidden />
                  <span className="grow text-card-foreground">{lesson.title}</span>
                  {lesson.isPreview && !hasAccess ? (
                    <span className="text-xs tracking-wide text-primary uppercase">Preview</span>
                  ) : null}
                  {!compact && lesson.durationSec ? (
                    <span className="text-sm text-muted-foreground">{formatDuration(lesson.durationSec)}</span>
                  ) : null}
                  {!open ? <Lock className="size-4 shrink-0 text-muted-foreground" aria-label="Locked" /> : null}
                </div>
              );
              return (
                <li key={lesson.id}>
                  {open ? (
                    <Link
                      href={`/courses/${course.id}/learn/${lesson.id}`}
                      aria-current={current ? 'page' : undefined}
                    >
                      {row}
                    </Link>
                  ) : (
                    row
                  )}
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ol>
  );
}
