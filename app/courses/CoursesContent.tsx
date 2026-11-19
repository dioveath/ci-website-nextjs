'use client';

import { useMemo, useState } from 'react';

import CardGrid from '../../components/layout/CardGrid';
import CourseCard from '../../components/course/CourseCard';
import { SearchField } from '../../components/ui/search-field';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import type { CatalogCourse } from '@/types/courses';

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advance'] as const;
type Level = (typeof LEVELS)[number];

/**
 * Filtering used to be four near-identical components -- AllCourses,
 * BeginnerCourses, IntermediateCourses, AdvanceCourses -- each rendering the
 * same grid behind a different `course.level ===` string, plus a hand-rolled
 * tab bar driving them with two pieces of index state. One predicate and the
 * Tabs primitive replace all of it, and the search box finally filters.
 */
function matches(course: CatalogCourse, level: Level, query: string) {
  if (level !== 'All' && course.level !== level) return false;
  if (!query) return true;

  const haystack = `${course.title} ${course.description ?? ''}`.toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}

export default function CoursesContent({ courses }: { courses: CatalogCourse[] }) {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<Level>('All');

  const visible = useMemo(
    () => courses.filter((course) => matches(course, level, query)),
    [courses, level, query]
  );

  return (
    <Tabs value={level} onValueChange={(value) => setLevel(value as Level)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <TabsList>
          {LEVELS.map((value) => (
            <TabsTrigger key={value} value={value}>
              {value}
            </TabsTrigger>
          ))}
        </TabsList>

        <SearchField
          id="course-search"
          label="Search courses"
          placeholder="Search courses"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full sm:w-64"
        />
      </div>

      {/*
        One panel per tab, as the Tabs contract requires, but all four render
        the same filtered list -- the predicate above already accounts for the
        active level.
      */}
      {LEVELS.map((value) => (
        <TabsContent key={value} value={value} className="mt-10">
          {visible.length ? (
            <CardGrid>
              {visible.map((course) => (
                <CourseCard key={course.id} course={course} headingLevel={2} />
              ))}
            </CardGrid>
          ) : (
            <p className="py-12 text-center text-muted-foreground">
              No courses match that search yet.
            </p>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
