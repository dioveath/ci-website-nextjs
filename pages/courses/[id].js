import Head from 'next/head';
import Image from 'next/image';
import Navbar from '../../components/Navbar.js';
import styles from '../../styles/courses/courses_page.module.css';

import { useRouter } from 'next/router';
import { coursesList } from '../../components/course/coursesList.js';
import PrimaryButton from '../../components/buttons/PrimaryButton.js';

import useAuth from '../../lib/hooks/Auth.js';
import { UserService } from '../../lib/service/UserService.js';

export default function CoursePage(props) {
  const router = useRouter();
  const { id } = router.query;
  const course = coursesList.find((course) => course.id == id);

  const {user, userData, registerWithEmailAndPassword} = useAuth();

  return (
    <div>
      <Head>
        <title> Charicha Institute </title>
        <meta name="description" content={"Charicha Institute - " + course?.title}/>
        <link rel="icon" href="/favicon.ico" />        
      </Head>

      <main className={styles.main}>
        <Navbar/>

        <h1> { course?.title }</h1>
        <p> { course?.description }</p>

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
