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
  return {
    title: course ? `${course.title} | Charicha Institute` : 'Charicha Institute',
    description: course?.description ?? 'Charicha Institute Course',
  };
}

export default async function CoursePage({ params }: Params) {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) notFound();
  const prerequisites = await getCoursesByIds(course.prerequisiteIds);
  return <CourseContent course={course} prerequisites={prerequisites} paymentOptions={paymentOptions()} />;
}
