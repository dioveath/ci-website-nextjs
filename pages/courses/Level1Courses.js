import styles from '../../styles/courses/Courses.module.css';
import CourseCard from '../../components/course/CourseCard.js';

export default function Level1Courses(){
  return <div className={styles["level-courses"]}>
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
         </div>;  
}
