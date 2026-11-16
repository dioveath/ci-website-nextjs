'use client';

import Navbar from '../../components/Navbar';
import { useState } from 'react';
import styles from '../../styles/courses/Courses.module.css';
import { BsChevronDoubleDown } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';

import CourseCard from '../../components/course/CourseCard';
import 'pure-react-carousel/dist/react-carousel.es.css';
import Marginer from '../../components/utils/Marginer';
import Footer from '../../components/footer/Footer';


import { DropdownMenu } from '../../components/DropdownMenu/index';
import { coursesList } from '../../components/course/coursesList';
import { getCourses } from '../../lib/sanity/fetchers';
import ParticlesBackground from '../../components/ParticlesBackground';
import type { Course } from '../../types';


const AllCourses = ({ courses }: { courses: Course[] }) => {
  return (
    <div className={styles.levelCoursesContainer}>
      { courses.map((course: Course) => {
        return <CourseCard key={"all" + course.id} course={course}/>;
      })}
    </div>
  );
};

const BeginnerCourses = ({ courses }: { courses: Course[] }) => {
  return (
    <div className={styles.levelCoursesContainer}>
      { courses.filter((course: Course) => course.level === "Beginner").map((course: Course) => {
        return <CourseCard key={course.id} course={course}/>;
      })}
    </div>
  );
};

const IntermediateCourses = ({ courses }: { courses: Course[] }) => {
  return (
    <div className={styles.levelCoursesContainer}>
      { courses.filter((course: Course) => course.level === "Intermediate").map((course: Course) => {
        return <CourseCard key={course.id} course={course}/>;
      })}
    </div>
  );
};

const AdvanceCourses = ({ courses }: { courses: Course[] }) => {
  return (
    <div className={styles.levelCoursesContainer}>
      { courses.filter((course: Course) => course.level === "Advance").map((course: Course) => {
        return <CourseCard key={course.id} course={course}/>;
      })}
    </div>
  );
};



export default function CoursesContent({ courses = coursesList }: { courses?: Course[] }){
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);

  return (
    <div className={styles.container}>


      <main className={'bg-linear-[-45deg] from-eggblue to-slategray'}>
        <Navbar path={'/courses'}/>
        <ParticlesBackground/>

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
            <AllCourses courses={courses}/>
          </div>

          <div className={
            `${styles.tabContent} ${currentTabIndex == 1 && (previousIndex > currentTabIndex ? styles.tabActiveLeftToRight : styles.tabActiveRightToLeft)}`
          }>
            <BeginnerCourses courses={courses}/>
          </div>

          <div className={
            `${styles.tabContent} ${currentTabIndex == 2 && (previousIndex > currentTabIndex ? styles.tabActiveLeftToRight : styles.tabActiveRightToLeft)}`
          }>
            <IntermediateCourses courses={courses}/>
          </div>
          <div className={
            `${styles.tabContent} ${currentTabIndex == 3 && (previousIndex > currentTabIndex ? styles.tabActiveLeftToRight : styles.tabActiveRightToLeft)}`
          }>
            <AdvanceCourses courses={courses}/>
          </div>
        </div>

      </main>

      <Footer/>

    </div>
  );

}

