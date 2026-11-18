import type { Metadata } from 'next';

import PageShell from '../../components/layout/PageShell';
import Section from '../../components/layout/Section';
import SectionHeading from '../../components/layout/SectionHeading';
import { getCourses } from '../../lib/sanity/fetchers';
import CoursesContent from './CoursesContent';

export const metadata: Metadata = {
  title: 'Courses',
  description:
    'Beginner to advanced computer courses at Charicha Institute, taught in person in Belbari, Morang.'
};

export const revalidate = 60;

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <PageShell>
      <Section tone="brand" space="sm" as="div">
        <SectionHeading
          level={1}
          tone="brand"
          eyebrow="Courses"
          title="Our courses"
          description="Pick a level, or search for the skill you are after."
        />
      </Section>

      <Section>
        <CoursesContent courses={courses} />
      </Section>
    </PageShell>
  );
}
