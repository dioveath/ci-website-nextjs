import Head from 'next/head';
import Image from 'next/image';
import Navbar from '../../components/Navbar.js';
import styles from '../../styles/courses/Courses.module.css';
import { BsFillArrowDownCircleFill } from 'react-icons/bs';
import { AiFillDownCircle } from 'react-icons/ai';
import { Accordian } from '../../components/Accordian.js';

import CourseCard from '../../components/course/CourseCard.js';
import TestimonialCard from '../../components/testimonial/TestimonialCard.js';

import Collapsible from 'react-collapsible';

import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';



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
        <h2> Our Courses </h2>
        <BsFillArrowDownCircleFill size={24}/>

        <div style={{height: "30px"}}></div>

        <Collapsible trigger={ <Trigger title="Level 1 Courses"/>}>
          <div className={styles["level-courses"]}>
            <CourseCard title="Computer Operator" bgColor="#FFEFE4" contents={
              [
                "Computer Advance Fundamentals",
                "Microsoft Office Training",
                "Image Manipulation Basics",
                "Internet & Web Fundamentals",
                "Lok Shewa Preparation"
              ]}/>
            <CourseCard title="Accounting Package" bgColor="#E4FFF0" contents={
              [
                "Microsoft Office Training",
                "Tally Accounting",
                "Advance Microsoft Excel",
                "Internet & Web Official Workds Fundamentals"
              ]
            }/>
          </div>          
        </Collapsible>

        <Collapsible trigger={ <Trigger title="Level 2 Courses"/>}>
          <div className={styles["level-courses"]}>
            <CourseCard title="Computer Operator" bgColor="#FFEFE4" contents={
              [
                "Computer Advance Fundamentals",
                "Microsoft Office Training",
                "Image Manipulation Basics",
                "Internet & Web Fundamentals",
                "Lok Shewa Preparation"
              ]}/>
            <CourseCard title="Accounting Package" bgColor="#E4FFF0" contents={
              [
                "Microsoft Office Training",
                "Tally Accounting",
                "Advance Microsoft Excel",
                "Internet & Web Official Workds Fundamentals"
              ]
            }/>
          </div>
        </Collapsible>


        <Collapsible trigger={ <Trigger title="Level 3 Courses"/>}>
          <div className={styles["level-courses"]}>
            <CourseCard title="Computer Operator" bgColor="#FFEFE4" contents={
              [
                "Computer Advance Fundamentals",
                "Microsoft Office Training",
                "Image Manipulation Basics",
                "Internet & Web Fundamentals",
                "Lok Shewa Preparation"
              ]}/>
            <CourseCard title="Accounting Package" bgColor="#E4FFF0" contents={
              [
                "Microsoft Office Training",
                "Tally Accounting",
                "Advance Microsoft Excel",
                "Internet & Web Official Workds Fundamentals"
              ]
            }/>
          </div>

        </Collapsible>

        <div style={{height: "30px"}}></div>

        <TestimonialCard
          content={"Viverra aliquet eget sit amet tellus. Sit amet, consectetur adipiscing elit pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas integer eget aliquet nibh praesent tristique."}
          reviewer={"Ful Maya"}
        />


      </main>

      <div style={{height: "30px"}}></div>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>    
  );
  
}
