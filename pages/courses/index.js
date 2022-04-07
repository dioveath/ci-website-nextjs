import Head from 'next/head';
import Image from 'next/image';
import Navbar from '../../components/Navbar.js';
import { useState } from 'react';
import styles from '../../styles/courses/Courses.module.css';
import { BsFillArrowDownCircleFill } from 'react-icons/bs';
import { AiFillDownCircle } from 'react-icons/ai';
import { FiSearch } from 'react-icons/fi';
import { Accordian } from '../../components/Accordian.js';

import CourseCard from '../../components/course/CourseCard.js';
import TestimonialCard from '../../components/testimonial/TestimonialCard.js';
import Collapsible from 'react-collapsible';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import Marginer from '../../components/utils/Marginer.js';
import Footer from '../../components/footer/Footer.js';
import { GrSort } from 'react-icons/gr';
import { FaLayerGroup } from 'react-icons/fa';
import { AiOutlineCalendar } from 'react-icons/ai';

import { DropdownMenu } from '../../components/DropdownMenu/index.js';

import { coursesList } from '../../components/course/coursesList.js';

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

  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Insitute </title>
        <meta name="description" content="Charicha Institute Courses" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar/>

      <main className={styles.main}>
        <Marginer vertical="20px"/>
        <h2> Our Courses </h2>
        <Marginer vertical="20px"/>        
        <BsFillArrowDownCircleFill size={24}/>
        <Marginer vertical="20px"/>        

        <div className={styles.tabNavBar}>
          <div className={styles.searchBar}>
            <FiSearch size={24}/>
            <Marginer/>
            {/* <input name="" type="text" value="" className={styles.searchInput}/> */}
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
                <div className={styles.smallIcon}>
                  Sort
                  <Marginer/>
                  <GrSort size={20}/>
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



        <Marginer vertical="30px"/>

      </main>

      <div style={{height: "30px"}}></div>

      <Footer/>

    </div>    
  );
  
}
