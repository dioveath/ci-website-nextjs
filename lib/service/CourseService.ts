import { firebaseStore } from '../firebase';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import type { Course } from '../../types';

const CourseService = {

  getCourse: async (courseId?: string): Promise<Course | undefined> => {
    if(courseId === undefined) return undefined;

    const docRef = doc(firebaseStore, "courses", courseId);
    try {
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()){
        return docSnap.data() as Course;
      } else {
        console.log("No such course!");
        return undefined;
      }    
    } catch(e){
      console.log("Error: " + (e instanceof Error ? e.message : String(e)));
      return undefined;
    }
    
  },


};
