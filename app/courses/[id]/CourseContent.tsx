'use client';

import Image from "next/image";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/footer/Footer";

import PrimaryButton from "../../../components/buttons/PrimaryButton";
import { getCourseById, getCourseIds } from "../../../lib/sanity/fetchers";

import useAuth from "../../../lib/hooks/Auth";
import { UserService } from "../../../lib/service/UserService";
import styles from "../../../styles/courses/courses_page.module.css";
import type { Course } from '../../../types';

export default function CourseContent({ course }: { course: Course }) {
  const { user, userData, registerWithEmailAndPassword } = useAuth();

  const CourseCoverImage = (props: { course: Course }) => {};

  return (
    <div>

      <main className={styles.main}>
        <Navbar />

	<div>
        </div>

        <div className={styles.heroContainer}>
          <div className={styles.coverImageContainer}>
            <Image
              alt={"Computer Course - " + course?.title}
              src={
                course?.coverImg === undefined
                  ? "/computer_course_cover_2.jpg"
                  : course.coverImg
              }
              width={100}
              height={100}
              className="object-center"
            />
          </div>
          <div className={styles.containerDivider}>
            <div className={styles.heroContentContainer}>
              <p className={styles.courseTitle}> {course?.title} </p>
              <p className={styles.courseDescription}>{course?.description}</p>
              <PrimaryButton text="Start Learning" />
            </div>
            {/* <div className={styles.heroContentContainer}> */}
            {/*   Welcome to the good night */}
            {/* </div> */}
          </div>
        </div>

        <div className={styles.detailsContainer}>
          <div>
            <p className={styles.headingTwo}> Lessons You&apos;ll learn </p>
          </div>

          <ul className={styles.lessonsContainer}>
            {(course?.lessons as string[] | undefined)?.map((lesson: string) => (
              <li key={lesson}> {lesson} </li>
            ))}
          </ul>

          {user != null ? (
            <PrimaryButton
              text="Enroll now"
              onClick={async () => {
                console.log(userData);
                UserService.updateUser(user.uid, {
                  [`courses.${course.id}`]: "",
                });
              }}
            />
          ) : (
            <PrimaryButton text="Login to enroll now"></PrimaryButton>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}


