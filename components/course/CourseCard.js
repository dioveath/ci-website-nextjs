import styles from './coursecard.module.css';
import { BsFillCircleFill } from 'react-icons/bs';
import Marginer from '../../components/utils/Marginer.js';
import { FaLayerGroup } from 'react-icons/fa';
import { AiOutlineCalendar } from 'react-icons/ai';

import Link from 'next/link';

export default function CourseCard(props) {
  return (
    <Link href={"/courses/" + props.course.id}>

      <div className={styles.courseCard} onClick={() => { }}>
        <img alt="" src={props.course.coverImg} className={styles.courseImg}/>
        <div className={styles.courseDetails}>
          <p className={styles.captionText}>  {props.course.level} </p>
          <Marginer vertical="5px"/>
          <p className={styles.titleText}> {props.course.title} </p>
          <Marginer vertical="50px"/>
          <div className={styles.courseTimings}>
            <div className={styles.lessons}> <FaLayerGroup/> <Marginer/> {props.course.lessons.length} Lessons </div>
            <div className={styles.lessons}> <AiOutlineCalendar/> <Marginer/> {parseInt(props.course.time/30)} Months </div>
          </div>
        </div>
      </div> 
      
    </Link>
  );

}
