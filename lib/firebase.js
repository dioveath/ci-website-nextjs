import { initializeApp } from "firebase/app";
import { isSupported, getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "./firebaseConfig.js";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseApp = initializeApp(firebaseConfig);
// const firebaseAnalytics = isSupported(getAnalytics(firebaseApp));
const firebaseStore = getFirestore(firebaseApp);
const firebaseStorage = getStorage(firebaseApp);

export { firebaseApp, firebaseStore, firebaseStorage };
