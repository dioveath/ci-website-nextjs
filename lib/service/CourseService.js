import { firebaseStore } from '../firebase.js';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

const CourseService = {

  getCourse: async (courseId) => {
    if(courseId === undefined) return undefined;

    const docRef = doc(firebaseStore, "courses", courseId);
    try {
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()){
        return docSnap.data();
      } else {
        console.log("No such course!");
        return undefined;
      }    
    } catch(e){
      console.log("Error: " + e.message);
      return undefined;
    }
    
  },

};
