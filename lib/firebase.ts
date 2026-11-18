import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Injected at build time by the `env` block in next.config.js.
const firebaseApp = initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
});
const firebaseStore = getFirestore(firebaseApp);
const firebaseStorage = getStorage(firebaseApp);

// Local development without Firebase credentials: `npm run dev:emulators`
// sets FIREBASE_EMULATORS=1 and points Auth, Firestore and Storage at the
// Firebase Emulator Suite (ports match emulators/firebase.json). Never set in
// production.
//
// Guarded per instance, not per process: a dev hot-reload re-runs this module
// but gets the same (already connected) instances back, and the SDK rejects a
// second connect once an instance is in use. On the server, Next can load
// this module once per bundle layer, each with its own instances, and every
// one of those must connect.
const globalForEmulators = globalThis as typeof globalThis & { __ciFirebaseEmulators?: WeakSet<object> };
const connected = (globalForEmulators.__ciFirebaseEmulators ??= new WeakSet());
if (process.env.FIREBASE_EMULATORS === '1' && !connected.has(firebaseStore)) {
  connected.add(firebaseStore);
  connectAuthEmulator(getAuth(firebaseApp), 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(firebaseStore, '127.0.0.1', 8085);
  connectStorageEmulator(firebaseStorage, '127.0.0.1', 9199);
}

// Auth is initialised by lib/auth.tsx, in the browser only: getAuth() at
// module load would also run on the server, where it rejects a build without
// real credentials (auth/invalid-api-key).
export { firebaseApp, firebaseStore, firebaseStorage };
