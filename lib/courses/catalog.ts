import type {
  CatalogCourse,
  CourseLevel,
  CourseSection,
  LessonSummary,
  Money,
  VideoSource,
} from '../../types/courses';
import { COURSE_LEVELS } from '../../types/courses';
import { isCourseId, isLessonId } from './ids';

/*
 * The catalog arrives from two places: GROQ results from Sanity, and the
 * bundled fallback list used when Sanity is not configured. Both go through
 * normalizeCourse, so every consumer gets the same, fully populated shape and
 * a half-filled document in the Studio can never crash a page.
 */

export const DEFAULT_COVER_IMAGE = '/george.jpg';

type Maybe<T> = T | null | undefined;

export interface RawLesson {
  id?: Maybe<string>;
  title?: Maybe<string>;
  type?: Maybe<string>;
  durationSec?: Maybe<number>;
  isPreview?: Maybe<boolean>;
  video?: Maybe<{ provider?: Maybe<string>; videoUid?: Maybe<string> }>;
}

export interface RawSection {
  key?: Maybe<string>;
  title?: Maybe<string>;
  lessons?: Maybe<RawLesson[]>;
}

export interface RawCourse {
  id?: Maybe<string>;
  slug?: Maybe<string>;
  title?: Maybe<string>;
  level?: Maybe<string>;
  coverImg?: Maybe<string>;
  description?: Maybe<string>;
  sections?: Maybe<RawSection[]>;
  price?: Maybe<{ amount?: Maybe<number>; currency?: Maybe<string> }>;
  prerequisiteIds?: Maybe<Maybe<string>[]>;
  listed?: Maybe<boolean>;
}

function normalizeVideo(raw: RawLesson['video']): VideoSource {
  const uid = raw?.videoUid?.trim();
  return raw?.provider === 'cloudflare' && uid
    ? { provider: 'cloudflare', videoUid: uid }
    : { provider: 'placeholder' };
}

function normalizePrice(raw: RawCourse['price']): Money | null {
  const amount = raw?.amount;
  if (typeof amount !== 'number' || !Number.isInteger(amount) || amount <= 0) return null;
  return { amount, currency: 'NPR' };
}

function normalizeLevel(raw: Maybe<string>): CourseLevel {
  return COURSE_LEVELS.find((level) => level === raw) ?? 'Beginner';
}

export function normalizeCourse(raw: Maybe<RawCourse>): CatalogCourse | null {
  if (!raw || !isCourseId(raw.id) || !raw.title?.trim()) return null;

  // A lesson id appearing twice would make progress ambiguous: keep the first.
  const seen = new Set<string>();
  const sections: CourseSection[] = (raw.sections ?? []).map((section, sectionIndex) => {
    const lessons: LessonSummary[] = [];
    for (const lesson of section?.lessons ?? []) {
      if (!lesson || !isLessonId(lesson.id) || seen.has(lesson.id)) continue;
      seen.add(lesson.id);
      const type = lesson.type === 'article' ? 'article' : 'video';
      lessons.push({
        id: lesson.id,
        title: lesson.title?.trim() || 'Untitled lesson',
        type,
        durationSec:
          typeof lesson.durationSec === 'number' && lesson.durationSec > 0
            ? Math.round(lesson.durationSec)
            : null,
        isPreview: lesson.isPreview === true,
        video: type === 'video' ? normalizeVideo(lesson.video) : null,
      });
    }
    return {
      key: section?.key || `section-${sectionIndex}`,
      title: section?.title?.trim() || `Section ${sectionIndex + 1}`,
      lessons,
    };
  });

  const lessons = sections.flatMap((section) => section.lessons);

  return {
    id: raw.id,
    slug: raw.slug ?? null,
    title: raw.title.trim(),
    level: normalizeLevel(raw.level),
    coverImg: raw.coverImg || DEFAULT_COVER_IMAGE,
    description: raw.description ?? null,
    sections,
    totalLessons: lessons.length,
    totalDurationSec: lessons.reduce((sum, lesson) => sum + (lesson.durationSec ?? 0), 0),
    price: normalizePrice(raw.price),
    prerequisiteIds: (raw.prerequisiteIds ?? []).filter(isCourseId),
    listed: raw.listed !== false,
  };
}

export function normalizeCourses(raw: Maybe<Maybe<RawCourse>[]>): CatalogCourse[] {
  return (raw ?? []).map(normalizeCourse).filter((course): course is CatalogCourse => course !== null);
}
