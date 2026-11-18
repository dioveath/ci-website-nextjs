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
import { coursesFallback } from '@/lib/sanity/fallbacks';
import ParticlesBackground from '../../components/ParticlesBackground';
import type { Course } from '../../types';


const LEVELS = [null, 'Beginner', 'Intermediate', 'Advance'] as const;

const CourseGrid = ({ courses, level }: { courses: Course[]; level: string | null }) => {
  return (
    <div className={styles.levelCoursesContainer}>
      { courses.filter((course) => !level || course.level === level).map((course) => {
        return <CourseCard key={course.id} course={course}/>;
      })}
    </div>
  );
};



export default function CoursesContent({ courses = coursesFallback }: { courses?: Course[] }){
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
            {LEVELS.map((level, index) => (
              <li key={level ?? 'all'}
                  className={currentTabIndex == index ? styles.tabItemActive : styles.tabItem}
                  onClick={() => {
                    setPreviousIndex(currentTabIndex);
                    setCurrentTabIndex(index);
                  }}> {level ?? 'All'} </li>
            ))}
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
                  // Sorting is not implemented yet.
                  { name: "A-z", onClick: () => {} },
                  { name: "Lessons", onClick: () => {} },
                  { name: "Time", onClick: () => {} }
                ]
              }
            />

          </div>
        </div>

        <Marginer vertical="40px"/>

        <div className={styles.tabContentsContainer}>
          {LEVELS.map((level, index) => (
            <div key={level ?? 'all'} className={
              `${styles.tabContent} ${currentTabIndex == index && (previousIndex > currentTabIndex ? styles.tabActiveLeftToRight : styles.tabActiveRightToLeft)}`
            }>
              <CourseGrid courses={courses} level={level}/>
            </div>
          ))}
        </div>

      </main>

      <Footer/>

    </div>
  );

}

