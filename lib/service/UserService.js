import { useState } from 'react';
import { firebaseStore } from '../firebase.js';
import { doc, collection, setDoc, getDoc } from 'firebase/firestore';


const UserService = {

  getUser: async (userId) => {
    try {
      const docRef = doc(firebaseStore, "ci_users", userId);
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()){
        return {
          userData: docSnap.data()
        };
      } else {
        console.log("No such user!");
        return {
          error: "No such user!"
        };
      }    
    } catch(e){
      console.log("Error: " + e.message);
      return {
        error: e.message
      };
    }    
  },

  addNewUser: async (userData) => {
    try {
      const newUserData = await setDoc(doc(firebaseStore, "ci_users", userData.id), userData);
      return {
        newUserData: userData
      };
    } catch(e){
      console.log("Error: " + e.message);
      return {
        error: e.message
      };
    } 
  },

  // updateUser: async (userId, userData) => {
  // }

};

export { UserService };
