import Link from 'next/link';
import { AiOutlinePlayCircle, AiOutlineFileText, AiFillLock, AiFillCheckCircle } from 'react-icons/ai';

import { formatDuration } from '../../lib/courses/format';
import type { CatalogCourse, LessonId } from '../../types/courses';

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
    return <p className="text-gray-300">Lessons are being prepared. Check back soon.</p>;
  }

  return (
    <ol className="flex flex-col gap-6">
      {course.sections.filter((section) => section.lessons.length > 0).map((section, index) => (
        <li key={section.key}>
          <p className={`text-white font-semibold ${compact ? 'text-base' : 'text-xl'} mb-2`}>
            {index + 1}. {section.title}
          </p>
          <ul className="flex flex-col rounded-lg overflow-hidden divide-y divide-white/10 bg-timbergreen/60">
            {section.lessons.map((lesson) => {
              const open = hasAccess || lesson.isPreview;
              const done = completed?.has(lesson.id) ?? false;
              const current = lesson.id === currentLessonId;
              const Icon = done ? AiFillCheckCircle : lesson.type === 'article' ? AiOutlineFileText : AiOutlinePlayCircle;
              const row = (
                <div
                  className={`flex items-center gap-3 px-4 py-3 ${current ? 'bg-eggblue/30' : ''} ${open ? 'hover:bg-eggblue/20' : 'opacity-70'} transition-colors`}
                >
                  <Icon className={`shrink-0 text-xl ${done ? 'text-eggblue' : 'text-aquamarine'}`} aria-hidden />
                  <span className="text-white grow">{lesson.title}</span>
                  {lesson.isPreview && !hasAccess && (
                    <span className="text-xs uppercase tracking-wide text-cheeseyellow">Preview</span>
                  )}
                  {!compact && lesson.durationSec && (
                    <span className="text-sm text-gray-300">{formatDuration(lesson.durationSec)}</span>
                  )}
                  {!open && <AiFillLock className="shrink-0 text-gray-300" aria-label="Locked" />}
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
