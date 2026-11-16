'use client';

import Image from 'next/image';
import styles from './coursecard.module.css';
import Marginer from '../../components/utils/Marginer';
import { FaLayerGroup } from 'react-icons/fa';
import { AiOutlineCalendar } from 'react-icons/ai';

import Link from 'next/link';
import type { Course } from '../../types';

export default function CourseCard(props: { course: Course }) {
  return (
    <Link href={"/courses/" + props.course.id}>

      <div className={styles.courseCard} onClick={() => { }}>
	<div className={styles.courseImg}>
          <Image alt="" src={props.course.coverImg} width={350} height={240} className="w-full h-auto object-cover"/>
        </div>
        <div className={styles.courseDetails}>
          <p className={styles.captionText}>  {props.course.level} </p>
          <Marginer vertical="5px"/>
          <p className={styles.titleText}> {props.course.title} </p>
          <Marginer vertical="50px"/>
          <div className={styles.courseTimings}>
            <div className={styles.lessons}> <FaLayerGroup/> <Marginer/> {props.course.lessons?.length ?? 0} Lessons </div>
            <div className={styles.lessons}> <AiOutlineCalendar/> <Marginer/> {Math.floor(Number(props.course.time) / 30)} Months </div>
          </div>
        </div>
      </div> 
      
    </Link>
  );

}
