import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Charicha Institute',
  description: 'Charicha Institute Course'
};

import { notFound } from 'next/navigation';

import { getCourseById, getCourseIds } from '../../../lib/sanity/fetchers';
import CourseContent from './CourseContent';
import type { Course } from '../../../types';

export const revalidate = 60;

export async function generateStaticParams() {
  const ids = await getCourseIds();
  return ids.map((id) => ({ id: String(id) }));
}

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) notFound();
  return <CourseContent course={course as Course} />;
}
