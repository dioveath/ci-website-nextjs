import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaLayerGroup } from 'react-icons/fa';
import { AiOutlineClockCircle } from 'react-icons/ai';

import Navbar from '../../../components/Navbar';
import Footer from '../../../components/footer/Footer';
import LiveCurriculum from '../../../components/course/LiveCurriculum';
import CourseActions from '../../../components/course/CourseActions';
import { formatDuration, formatMoney } from '../../../lib/courses/format';
import type { CatalogCourse, PaymentOption } from '../../../types/courses';

interface CourseContentProps {
  course: CatalogCourse;
  prerequisites: CatalogCourse[];
  paymentOptions: PaymentOption[];
}

export default function CourseContent({ course, prerequisites, paymentOptions }: CourseContentProps) {
  const duration = formatDuration(course.totalDurationSec);

  return (
    <div className="bg-slategray min-h-screen">
      <Navbar path="/courses" />

      <main>
        <section className="relative">
          <div className="max-h-[60vh] overflow-hidden brightness-50">
            <Image
              alt=""
              src={course.coverImg}
              width={1600}
              height={900}
              priority
              className="w-full h-auto object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 flex items-end">
            <div className="w-full px-5 lg:px-48 pb-8 flex flex-col gap-3 text-white">
              <p className="text-cheeseyellow uppercase tracking-wide text-sm">{course.level}</p>
              <h1 className="text-3xl lg:text-5xl font-bold">{course.title}</h1>
              <div className="flex flex-wrap gap-6 text-gray-200">
                <span className="flex items-center gap-2">
                  <FaLayerGroup aria-hidden /> {course.totalLessons} lessons
                </span>
                {duration && (
                  <span className="flex items-center gap-2">
                    <AiOutlineClockCircle aria-hidden /> {duration} of content
                  </span>
                )}
                <span className="font-semibold text-white">{formatMoney(course.price)}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="px-5 lg:px-48 py-10 grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-10">
            {course.description && (
              <section>
                <h2 className="text-white text-2xl font-bold mb-3">About this course</h2>
                <p className="text-gray-200 whitespace-pre-line">{course.description}</p>
              </section>
            )}

            <section>
              <h2 className="text-white text-2xl font-bold mb-4">Curriculum</h2>
              <LiveCurriculum course={course} />
            </section>
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
            {/* CourseActions reads ?payment=; the page itself stays static. */}
            <Suspense>
              <CourseActions course={course} paymentOptions={paymentOptions} />
            </Suspense>
            {prerequisites.length > 0 && (
              <section className="rounded-lg bg-timbergreen/60 p-5">
                <h2 className="text-white font-semibold mb-2">Recommended first</h2>
                <ul className="flex flex-col gap-1">
                  {prerequisites.map((prerequisite) => (
                    <li key={prerequisite.id}>
                      <Link href={`/courses/${prerequisite.id}`} className="text-aquamarine hover:underline">
                        {prerequisite.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
