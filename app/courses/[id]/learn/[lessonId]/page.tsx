import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getCourseById } from '../../../../../lib/sanity/fetchers';
import { findLesson } from '../../../../../lib/courses/progress';
import LessonView from './LessonView';

// The outline is public and cached; the lesson content itself is fetched by
// the browser through a server action that checks access.
export const revalidate = 60;

type Params = { params: Promise<{ id: string; lessonId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id, lessonId } = await params;
  const course = await getCourseById(id);
  const lesson = course ? findLesson(course, lessonId)?.lesson : null;
  return {
    title: lesson && course ? `${lesson.title} | ${course.title}` : 'Charicha Institute',
    robots: { index: false },
  };
}

export default async function LessonPage({ params }: Params) {
  const { id, lessonId } = await params;
  const course = await getCourseById(id);
  if (!course || !findLesson(course, lessonId)) notFound();
  return <LessonView course={course} lessonId={lessonId} />;
}
