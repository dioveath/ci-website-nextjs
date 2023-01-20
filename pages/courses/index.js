import Head from 'next/head';
import Navbar from '../../components/Navbar.js';
import { useState } from 'react';
import styles from '../../styles/courses/Courses.module.css';
import { BsChevronDoubleDown } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';

import CourseCard from '../../components/course/CourseCard.js';
import 'pure-react-carousel/dist/react-carousel.es.css';
import Marginer from '../../components/utils/Marginer.js';
import Footer from '../../components/footer/Footer.js';


import { DropdownMenu } from '../../components/DropdownMenu/index.js';
import { coursesList } from '../../components/course/coursesList.js';

import { useCallback } from 'react';
import { loadFull } from 'tsparticles';
import Particles from 'react-particles';
import { particleConfig } from '../../lib/particle_config';

const AllCourses = (props) => {
  return (
    <div className={styles.levelCoursesContainer}>
      { coursesList.map((course) => {
        return <CourseCard key={"all" + course.id} course={course}/>;
      })}
    </div>
  );
};

const BeginnerCourses = (props) => {
  return (
    <div className={styles.levelCoursesContainer}>
      { coursesList.filter((course) => course.level === "Beginner").map((course) => {
        return <CourseCard key={course.id} course={course}/>;
      })}
    </div>
  );
};

const IntermediateCourses = (props) => {
  return (
    <div className={styles.levelCoursesContainer}>
      { coursesList.filter((course) => course.level === "Intermediate").map((course) => {
        return <CourseCard key={course.id} course={course}/>;
      })}
    </div>
  );
};

const AdvanceCourses = (props) => {
  return (
    <div className={styles.levelCoursesContainer}>
      { coursesList.filter((course) => course.level === "Advance").map((course) => {
        return <CourseCard key={course.id} course={course}/>;
      })}
    </div>
  );
};



export default function Courses(){
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);

  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    console.log(container);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Insitute </title>
        <meta name="description" content="Charicha Institute Courses" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main className={'bg-gradient-[-45deg] from-eggblue to-slategray'}>
        <Navbar path={'/courses'}/>
        <Particles init={particlesInit} loaded={particlesLoaded} options={particleConfig}/>        

	<div className='w-full flex flex-col justify-center items-center'>
          <h2 className='text-[40px] text-white'> Our Courses </h2>
        </div>
        <div className="w-full flex justify-center mt-6 mb-6">
          <BsChevronDoubleDown className="text-white text-[40px] animate-bounce"/>
        </div>        


        <div className={styles.tabNavBar}>
          <div className={'flex gap-4 items-center'}>
            <input className='bg-gray-100 p-2 px-8 rounded-2xl outline-none' name="" placeholder="Search..." type="text"/>
            <FiSearch className='text-2xl text-gray-100 hover:text-aquamarine cursor-pointer'/>
          </div>
          <ul className={styles.tabItems}>
            <li className={currentTabIndex == 0 ? styles.tabItemActive : styles.tabItem}
                onClick={
                  () => {
                    setPreviousIndex(currentTabIndex);
                    setCurrentTabIndex(0);
                  }
                }> All </li>
            <li className={currentTabIndex == 1 ? styles.tabItemActive : styles.tabItem}
                onClick={
                  () => {
                    setPreviousIndex(currentTabIndex);                    
                    setCurrentTabIndex(1);
                  }
                }
            > Beginner </li>
            <li className={currentTabIndex == 2 ? styles.tabItemActive : styles.tabItem}
                onClick={
                  () => {
                    setPreviousIndex(currentTabIndex);                                        
                    setCurrentTabIndex(2);
                  }
                }
            > Intermediate </li>
            <li className={currentTabIndex == 3 ? styles.tabItemActive : styles.tabItem}
                onClick={
                  () => {
                    setPreviousIndex(currentTabIndex);                                                            
                    setCurrentTabIndex(3);
                  }
                }
            > Advance </li>            
          </ul>
          <div className={styles.extras}>

            <DropdownMenu
              title={
                <div className={'text-white flex gap-2'}>
                  Sort
                </div>              
              }
              itemList={
                [
                  {
                    name: "A-z",
                    onClick: () => { console.log("A-z"); }
                  },
                  {
                    name: "Lessons",
                    onClick: () => { console.log("Lessons"); }
                  },
                  {
                    name: "Time",
                    onClick: () => { console.log("Time"); }
                  }
                ]
              }
            />

          </div>
        </div>

        <Marginer vertical="40px"/>

        <div className={styles.tabContentsContainer}>
          <div className={
            `${styles.tabContent} ${currentTabIndex == 0 && (previousIndex > currentTabIndex ? styles.tabActiveLeftToRight : styles.tabActiveRightToLeft)}`
          }>
            <AllCourses/>
          </div>

          <div className={
            `${styles.tabContent} ${currentTabIndex == 1 && (previousIndex > currentTabIndex ? styles.tabActiveLeftToRight : styles.tabActiveRightToLeft)}`
          }>
            <BeginnerCourses/>
          </div>

          <div className={
            `${styles.tabContent} ${currentTabIndex == 2 && (previousIndex > currentTabIndex ? styles.tabActiveLeftToRight : styles.tabActiveRightToLeft)}`                 
          }>
            <IntermediateCourses/>
          </div>
          <div className={
            `${styles.tabContent} ${currentTabIndex == 3 && (previousIndex > currentTabIndex ? styles.tabActiveLeftToRight : styles.tabActiveRightToLeft)}`
          }>
            <AdvanceCourses/>
          </div>
        </div>

      </main>

      <Footer/>

    </div>    
  );
  
}
