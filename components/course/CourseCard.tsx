import Image from 'next/image';
import Link from 'next/link';
import { FaLayerGroup } from 'react-icons/fa';
import { AiOutlineClockCircle } from 'react-icons/ai';

import styles from './coursecard.module.css';
import Marginer from '../../components/utils/Marginer';
import { formatDuration, formatMoney } from '../../lib/courses/format';
import type { CatalogCourse } from '../../types/courses';

export default function CourseCard({ course }: { course: CatalogCourse }) {
  const duration = formatDuration(course.totalDurationSec);

  return (
    <Link href={`/courses/${course.id}`}>
      <div className={styles.courseCard}>
        <div className={styles.courseImg}>
          <Image alt="" src={course.coverImg} width={350} height={240} className="w-full h-auto object-cover"/>
        </div>
        <div className={styles.courseDetails}>
          <div className="flex justify-between items-center">
            <p className={styles.captionText}>{course.level}</p>
            <p className="font-semibold">{formatMoney(course.price)}</p>
          </div>
          <Marginer vertical="5px"/>
          <p className={styles.titleText}>{course.title}</p>
          <Marginer vertical="50px"/>
          <div className={styles.courseTimings}>
            <div className={styles.lessons}>
              <FaLayerGroup/> <Marginer/> {course.totalLessons} {course.totalLessons === 1 ? 'Lesson' : 'Lessons'}
            </div>
            {duration && (
              <div className={styles.lessons}>
                <AiOutlineClockCircle/> <Marginer/> {duration}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
