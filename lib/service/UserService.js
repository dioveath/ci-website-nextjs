import { firebaseStore } from "../firebase.js";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { StorageService } from './StorageService';

const USER_COLLECTION = "ci_users";
const DEFAULT_AVATAR_LINK =
  "https://firebasestorage.googleapis.com/v0/b/ciapp-34d14.appspot.com/o/profile%2FCI_Logo_Graphic_512.png?alt=media&token=b4394411-5726-4f77-b0b9-971228aa4521";

const UserService = {
  /*
   * @param {string} uid
   * @returns {Promise<User>}
   */
  getUser: async (userId) => {
    const docRef = doc(firebaseStore, USER_COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return { userData: null };
    return {
      userData: docSnap.data(),
    };
  },

  /*
   * @param {string} uid
   * @param {UserData} userData
   * @returns {Promise<Boolean>}
   */
  addNewUser: async (userData) => {
    const { id, firstName, lastName, photoURL, email, phoneNumber } = userData;
    if (!id) throw new Error("id is required!");

    const newUserData = {
      id: id,
      first_name: firstName ?? "",
      last_name: lastName ?? "",
      profile_URL: photoURL ?? DEFAULT_AVATAR_LINK,
      cover_URL: "",
      address: "",
      phone_number: phoneNumber ?? "0000000000",
      email: email,
      phone_verified: false,
      email_verified: false,
      exp_points: 0,
      hearts: 0,
      roles: {
        guest: true,
      },
      profile_visits: 0,
      courses: {},
      medias: [],
      joined_at: Date.now(),
      on_board: false
    };

    await setDoc(doc(firebaseStore, "ci_users", userData.id), newUserData);
    return true;
  },

  /*
   * @param {string} uid
   * @param {UserData} userData
   * @returns {Promise<Boolean>}
   */
  updateUser: async (userId, userData, errorCallback) => {
    try {
      const docRef = doc(firebaseStore, USER_COLLECTION, userId);
      await updateDoc(docRef, userData);
      return true;
    } catch (e) {
      errorCallback(e);
      return false;
    }
  },

  addMedia: async(userId, file, onStateChange) => {
    const uploadedImage = await StorageService.uploadImage(file, onStateChange);

    try {
      const userRef = doc(firebaseStore, USER_COLLECTION, userId);
      await updateDoc(userRef, {
        medias: arrayUnion(uploadedImage)
      });
    } catch(e){
      await StorageService.deleteImage(uploadedImage.uid);
      throw e;
    }
  },

  removeMedia: async(userId, file) => {
    await StorageService.deleteImage(file.uid);    
    const userRef = doc(firebaseStore, USER_COLLECTION, userId);

    await updateDoc(userRef, {
      medias: arrayRemove(file)
    });
  },

};

export { UserService };
