import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getCourseById, getCourseIds, getCoursesByIds } from '../../../lib/sanity/fetchers';
import { paymentOptions } from '../../../lib/server/payments';
import CourseContent from './CourseContent';

export const revalidate = 60;

type Params = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const ids = await getCourseIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) return { title: 'Course not found' };

  // The root layout's title template appends the site name.
  return {
    title: course.title,
    description:
      course.description ??
      `${course.title} at Charicha Institute — ${course.level} level.`,
    openGraph: {
      type: 'article',
      title: course.title,
      url: `/courses/${id}`,
      ...(course.coverImg ? { images: [{ url: course.coverImg, alt: course.title }] } : {})
    }
  };
}

export default async function CoursePage({ params }: Params) {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) notFound();
  const prerequisites = await getCoursesByIds(course.prerequisiteIds);
  return <CourseContent course={course} prerequisites={prerequisites} paymentOptions={paymentOptions()} />;
}
