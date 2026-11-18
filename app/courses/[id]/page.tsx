import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getCourseById, getCourseIds } from '../../../lib/sanity/fetchers';
import CourseContent from './CourseContent';
import type { Course } from '../../../types';

export const revalidate = 60;

export async function generateStaticParams() {
  const ids = await getCourseIds();
  return ids.map((id) => ({ id: String(id) }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const course = (await getCourseById(id)) as Course | null;
  if (!course) return { title: 'Course not found' };

  return {
    title: course.title,
    description:
      course.description ??
      `${course.title} at Charicha Institute — ${course.level ?? 'all levels'}.`,
    openGraph: {
      type: 'article',
      title: course.title,
      url: `/courses/${id}`,
      ...(course.coverImg ? { images: [{ url: course.coverImg, alt: course.title }] } : {})
    }
  };
}

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) notFound();
  return <CourseContent course={course as Course} />;
}
