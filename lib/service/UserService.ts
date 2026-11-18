import { firebaseStore } from "../firebase";
import { doc, getDoc, getDocs, updateDoc, collection, query, limit, orderBy, arrayUnion, arrayRemove, writeBatch } from "firebase/firestore";
import { StorageService } from './StorageService';
import type { Media, NewUserInput, UserContact, UserData, UserProfileUpdate } from '../../types';

const USER_COLLECTION = "ci_users";
const DEFAULT_AVATAR_LINK =
  "https://firebasestorage.googleapis.com/v0/b/ciapp-34d14.appspot.com/o/profile%2FCI_Logo_Graphic_512.png?alt=media&token=b4394411-5726-4f77-b0b9-971228aa4521";

const UserService = {
  /*
   * @param {string} uid
   * @returns {Promise<User>}
   */
  getUser: async (userId: string): Promise<{ userData: UserData | null }> => {
    const docRef = doc(firebaseStore, USER_COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return { userData: null };
    return {
      userData: docSnap.data() as UserData,
    };
  },

  /*
   * Creates the public profile and the private contact document together.
   * Every privileged field starts at the value firestore.rules requires.
   */
  addNewUser: async (userData: NewUserInput): Promise<boolean> => {
    const { id, firstName, lastName, photoURL, email, phoneNumber } = userData;
    if (!id) throw new Error("id is required!");

    const profile: UserData = {
      id,
      first_name: firstName ?? "",
      last_name: lastName ?? "",
      profile_URL: photoURL ?? DEFAULT_AVATAR_LINK,
      cover_URL: "",
      exp_points: 0,
      hearts: 0,
      roles: {},
      profile_visits: 0,
      medias: [],
      joined_at: Date.now(),
      on_board: false
    };
    const contact: UserContact = {
      email: email ?? null,
      phone_number: phoneNumber ?? "",
      address: ""
    };

    const batch = writeBatch(firebaseStore);
    batch.set(doc(firebaseStore, USER_COLLECTION, id), profile);
    batch.set(doc(firebaseStore, USER_COLLECTION, id, "private", "contact"), contact);
    await batch.commit();
    return true;
  },

  /*
   * Only the fields in USER_EDITABLE_FIELDS; anything else is rejected by
   * firestore.rules, and by the compiler here.
   */
  updateUser: async (
    userId: string,
    userData: UserProfileUpdate,
    errorCallback?: (e: unknown) => void
  ): Promise<boolean> => {
    try {
      const docRef = doc(firebaseStore, USER_COLLECTION, userId);
      await updateDoc(docRef, userData);
      return true;
    } catch (e) {
      errorCallback?.(e);
      return false;
    }
  },

  addMedia: async(
    userId: string,
    file: File,
    onStateChange?: (percent: number) => void
  ): Promise<Media> => {
    const uploadedImage = await StorageService.uploadImage(file, onStateChange);

    try {
      const userRef = doc(firebaseStore, USER_COLLECTION, userId);
      await updateDoc(userRef, {
        medias: arrayUnion(uploadedImage)
      });
      return uploadedImage;
    } catch(e){
      await StorageService.deleteImage(uploadedImage.uid);
      throw e;
    }
  },

  removeMedia: async(userId: string, file: Media): Promise<void> => {
    await StorageService.deleteImage(file.uid);    
    const userRef = doc(firebaseStore, USER_COLLECTION, userId);

    await updateDoc(userRef, {
      medias: arrayRemove(file)
    });
  },

  // Admins only (firestore.rules). Profiles have `joined_at`, not `createdAt`:
  // ordering by the latter silently returned no users.
  listUsers: async(): Promise<UserData[]> => {
    const q = query(collection(firebaseStore, USER_COLLECTION), orderBy('joined_at', 'desc'), limit(100));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((snapshot) => snapshot.data() as UserData);
  }

};

export { UserService };
