import Head from 'next/head';
import Image from 'next/image';
import Navbar from '../../components/Navbar.js';

import { useRouter } from 'next/router';
import { coursesList } from '../../components/course/coursesList.js';
import PrimaryButton from '../../components/buttons/PrimaryButton.js';

import useAuth from '../../lib/hooks/Auth.js';
import { UserService } from '../../lib/service/UserService.js';
import styles from '../../styles/courses/courses_page.module.css';

export default function CoursePage(props) {
  const router = useRouter();
  const { id } = router.query;
  const course = coursesList.find((course) => course.id == id);

  const {user, userData, registerWithEmailAndPassword} = useAuth();

  const CourseCoverImage = (props) => {
  };

  return (
    <div>
      <Head>
        <title> Charicha Institute </title>
        <meta name="description" content={"Charicha Institute - " + course?.title}/>
        <link rel="icon" href="/favicon.ico" />        
      </Head>

      <main className={styles.main}>
        <Navbar/>

        <div styles={styles.heroContainer}>
          <Image alt={"Computer Course - " + course?.title}
                 src={course?.coverImg === undefined ? "/computer_course_cover_2.jpg" : course.coverImg }
                 width="100%" height="30vh"
                 layout="responsive" objectFit="cover"/>
          <div styles={styles.heroContentContainer}>
            <p className={styles.courseTitle}> {course?.title} </p>
            <p className={styles.courseDescription}> { course?.description } </p>
            <PrimaryButton text="Start Learning"/>            
          </div>
        </div>

        <div className={styles.lessonsContainer}>
        </div>


        <ol>
          { course?.lessons?.map((lesson) => <li key={lesson}> {lesson} </li>)}
        </ol>

        { user != null ? 
          <PrimaryButton text="Enroll now" onClick={async ()=> {
            UserService.updateUser(user.uid, {
              [`courses.${course.id}`]: ""
            });
        }}/> :
          <h2>
            Login to enroll now
          </h2>
        }
        
      </main>

    </div>
  );

}
