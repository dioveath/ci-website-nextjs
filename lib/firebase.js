import dynamic from 'next/dynamic';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig.js";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

dynamic(() => {
  const { isSupported, getAnalytics, logEvent } = import("firebase/analytics");
  const firebaseAnalytics = isSupported(getAnalytics(firebaseApp));
  logEvent(firebaseAnalytics, 'analytics enabled!');
}, { ssr: false});

const firebaseApp = initializeApp(firebaseConfig);

const firebaseStore = getFirestore(firebaseApp);
const firebaseStorage = getStorage(firebaseApp);

export { firebaseApp, firebaseStore, firebaseStorage };
