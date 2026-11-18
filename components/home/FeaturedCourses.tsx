import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import CardGrid from '../layout/CardGrid';
import CourseCard from '../course/CourseCard';
import Section from '../layout/Section';
import SectionHeading from '../layout/SectionHeading';
import { Button } from '../ui/button';
import type { CatalogCourse } from '../../types/courses';

export default function FeaturedCourses({ courses }: { courses: CatalogCourse[] }) {
  if (!courses.length) return null;

  return (
    <Section tone="muted">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Courses"
          title="Start where you are"
          description="Beginner to advanced, taught in person by instructors who work in the field."
        />
        <Button asChild variant="outline" size="lg">
          <Link href="/courses">
            View all
            <ArrowRight />
          </Link>
        </Button>
      </div>

      <CardGrid className="mt-10">
        {courses.slice(0, 3).map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </CardGrid>
    </Section>
  );
}
