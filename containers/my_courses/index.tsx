'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import useAuth from '../../lib/hooks/Auth';
import { errorMessage, unwrap } from '../../lib/actions/result';
import { findLesson } from '../../lib/courses/progress';
import ProgressBar from '../../components/course/ProgressBar';
import { getMyCourses } from '../../app/courses/actions';
import type { MyCourseView } from '../../types/courses';

function MyCourseCard({ item }: { item: MyCourseView }) {
  const { course, enrollment, progress, resumeLessonId } = item;
  const title = course?.title ?? enrollment.courseTitle;
  const resume = course && resumeLessonId ? findLesson(course, resumeLessonId)?.lesson : null;

  return (
    <div className="w-full max-w-sm rounded-lg overflow-hidden bg-timbergreen text-white flex flex-col">
      {course && (
        <Image alt="" src={course.coverImg} width={384} height={200} className="w-full h-40 object-cover" />
      )}
      <div className="p-4 flex flex-col gap-3 grow">
        <p className="text-xl font-semibold">{title}</p>
        {course ? (
          <>
            <ProgressBar progress={progress} />
            <div className="mt-auto flex flex-wrap gap-3 items-center">
              {resume && (
                <Link
                  href={`/courses/${course.id}/learn/${resume.id}`}
                  className="px-4 py-2 rounded-lg bg-eggblue hover:bg-greenpea"
                >
                  {progress.completed > 0 ? 'Continue' : 'Start'}
                </Link>
              )}
              {enrollment.certificateId && (
                <Link href={`/certificates/${enrollment.certificateId}`} className="text-cheeseyellow hover:underline">
                  Certificate
                </Link>
              )}
            </div>
          </>
        ) : (
          <p className="text-gray-300 text-sm">This course is no longer available.</p>
        )}
      </div>
    </div>
  );
}

export default function MyCoursesContainer() {
  const { user, getIdToken } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ['my_courses', user?.uid],
    queryFn: async () => unwrap(await getMyCourses((await getIdToken()) ?? '')),
    enabled: !!user,
    refetchOnMount: 'always',
  });

  return (
    <div className="text-white flex flex-col gap-4 px-4">
      <div>
        <p className="uppercase font-light text-3xl">My courses</p>
        <p className="font-light">{new Date().toDateString()}</p>
      </div>

      {isLoading && <p>Loading…</p>}
      {error && <p className="text-red-300">{errorMessage(error)}</p>}

      {data && data.length === 0 && (
        <div className="flex flex-col gap-3 items-start">
          <p className="text-gray-300">You have not enrolled in any course yet.</p>
          <Link href="/courses" className="px-4 py-2 rounded-lg bg-eggblue hover:bg-greenpea">
            Browse courses
          </Link>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="flex flex-wrap gap-6">
          {data.map((item) => (
            <MyCourseCard key={item.enrollment.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
