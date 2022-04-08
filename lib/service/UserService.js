import { useState } from 'react';
import { firebaseStore } from '../firebase.js';
import { doc, collection, setDoc, getDoc, updateDoc } from 'firebase/firestore';


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
        return {
          error: "No such user!"
        };
      }    
    } catch(e){
      return {
        error: e.message
      };
    }    
  },

  addNewUser: async (userData) => {
    try {
      const { id, firstName, lastName, photoURL } = userData;
      const newUserData = {
        id: id,
        firstName: firstName ?? "",
        lastName: lastName ?? "",
        photoURL: photoURL ?? "",
        coverURL: "",
        address: "Charicha Chowk",
        phoneNumber: 9999999999,
        phoneVerified: false,
        expPoints: 0,
        hearts: 0,
        roles: {
          guest: true
        },
        profileVisits: 0,
        courses: {},
        joinedAt: Date.now(),
      };
      await setDoc(doc(firebaseStore, "ci_users", userData.id), newUserData);
      return {
        newUserData: newUserData
      };
    } catch(e){
      console.log("Error: " + e.message);
      return {
        error: e.message
      };
    } 
  },

  updateUser: async (userId, userData) => {
    try {
      const docRef = doc(firebaseStore, 'ci_users', userId);
      await updateDoc(docRef, userData);
      return true;
    } catch (e){
      console.log("Error: " + e.message);
      return {
        error: e.message
      };
    }
  }

};

export { UserService };
