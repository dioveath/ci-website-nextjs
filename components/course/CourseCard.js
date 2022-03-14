import styles from '../../styles/components/course/CourseCard.module.css';
import { BsFillCircleFill } from 'react-icons/bs';

export default function CourseCard(props){
  return (
    <div className={styles["course-card"]} style={{ backgroundColor: props.bgColor == undefined ? "#FFEF00" : props.bgColor}}>
      <div className={styles.title}> { props.title != undefined ? props.title : "Title"}</div>
      <ul className={styles.content}>
        {
        props.contents != undefined ?  
          props.contents.map((content) => {
            return <li className={styles["list-item"]} key={content}> <BsFillCircleFill size={6} color={"#0070f3"}/> { content } </li>;
          }) : <p> <BsFillCircleFill size={6} color={"#0070f3"}/> contents </p>
        }
      </ul>
      <div className={styles.enroll}> { "Enroll Now >> "} </div>
    </div>
  );
}
