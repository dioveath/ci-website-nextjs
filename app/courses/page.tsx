import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Charicha Institute',
  description: 'Charicha Institute Courses'
};

import { getCourses } from '../../lib/sanity/fetchers';
import CoursesContent from './CoursesContent';

export const revalidate = 60;

export default async function CoursesPage() {
  const courses = await getCourses();
  return <CoursesContent courses={courses} />;
}
