import Head from 'next/head';
import Image from 'next/image';
import Navbar from '../../components/Navbar.js';
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


const Trigger = (props) => {
  return <div className={styles["course-level"]}>
           { props.title } <AiFillDownCircle/>
         </div>;
};


export default function Courses(){

  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Insitute </title>
        <meta name="description" content="Generated by create next app" />
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
            <input name="" type="text" value="" className={styles.searchInput}/>
          </div>
          <ul className={styles.tabItems}>
            <li className={styles.tabItemActive}> All </li>
            <li className={styles.tabItem}> Beginner </li>
            <li className={styles.tabItem}> Intermediate </li>
            <li className={styles.tabItem}> Advance </li>            
          </ul>
          <div className={styles.extras}>
            <div className={styles.smallIcon}>
              Sort
              <Marginer/>
              <GrSort size={20}/> </div>
          </div>
        </div>

        <Marginer vertical="40px"/>

        <div className={styles.levelCoursesContainer}>

          <div className={styles.courseCard}>
            <img alt="" src="/george.jpg" className={styles.courseImg}/>
            <div className={styles.courseDetails}>
              <p className={styles.captionText}> Beginner </p>
              <Marginer vertical="5px"/>
              <p className={styles.titleText}> Computer Basics </p>
              <Marginer vertical="50px"/>
              {/* <p> Sit amet, mattis vulputate enim nulla aliquet porttitor lacus, luctus accumsan tortor posuere ac ut. Amet est placerat in egestas erat imperdiet sed euismod nisi porta lorem mollis aliquam ut? </p> */}
              <div className={styles.courseTimings}>
                <div className={styles.lessons}> <FaLayerGroup/> <Marginer/> 23 Lessons </div>
                <div className={styles.lessons}> <AiOutlineCalendar/> <Marginer/> 3 Months </div>
              </div>
            </div>
          </div>

          <div className={styles.courseCard}>
            <img alt="" src="/george.jpg" className={styles.courseImg}/>
            <div className={styles.courseDetails}>
              <p className={styles.captionText}> Beginner </p>
              <Marginer vertical="5px"/>
              <p className={styles.titleText}> Advance Basics </p>
              <Marginer vertical="50px"/>
              {/* <p> Sit amet, mattis vulputate enim nulla aliquet porttitor lacus, luctus accumsan tortor posuere ac ut. Amet est placerat in egestas erat imperdiet sed euismod nisi porta lorem mollis aliquam ut? </p> */}
              <div className={styles.courseTimings}>
                <div className={styles.lessons}> <FaLayerGroup/> <Marginer/> 23 Lessons </div>
                <div className={styles.lessons}> <AiOutlineCalendar/> <Marginer/> 3 Months </div>
              </div>
            </div>
          </div>

          <div className={styles.courseCard}>
            <img alt="" src="/george.jpg" className={styles.courseImg}/>
            <div className={styles.courseDetails}>
              <p className={styles.captionText}> Beginner </p>
              <Marginer vertical="5px"/>
              <p className={styles.titleText}> Computer Operator </p>
              <Marginer vertical="50px"/>
              {/* <p> Sit amet, mattis vulputate enim nulla aliquet porttitor lacus, luctus accumsan tortor posuere ac ut. Amet est placerat in egestas erat imperdiet sed euismod nisi porta lorem mollis aliquam ut? </p> */}
              <div className={styles.courseTimings}>
                <div className={styles.lessons}> <FaLayerGroup/> <Marginer/> 23 Lessons </div>
                <div className={styles.lessons}> <AiOutlineCalendar/> <Marginer/> 3 Months </div>
              </div>
            </div>
          </div>
          

        </div>    

        <Marginer vertical="30px"/>

      </main>

      <div style={{height: "30px"}}></div>

      <Footer/>

    </div>    
  );
  
}
