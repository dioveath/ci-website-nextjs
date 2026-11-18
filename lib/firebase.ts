import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseApp = initializeApp(firebaseConfig);
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

export { firebaseApp, firebaseStore, firebaseStorage };
