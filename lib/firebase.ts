import { initializeApp } from "firebase/app";
import { isSupported, getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "./firebaseConfig";
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseApp = initializeApp(firebaseConfig);
// const firebaseAnalytics = isSupported(getAnalytics(firebaseApp));
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
//
// Addresses come from the variables `firebase emulators:exec` sets for the
// Admin SDK (passed to the browser by next.config.js), so the site and its
// server actions always talk to the same emulators, whatever ports they run on.
function emulatorAddress(hostPort: string | undefined, fallbackPort: number): [string, number] {
  const [host, port] = (hostPort || `127.0.0.1:${fallbackPort}`).split(':');
  return [host, Number(port) || fallbackPort];
}

if (process.env.FIREBASE_EMULATORS === '1' && !connected.has(firebaseStore)) {
  connected.add(firebaseStore);
  const [authHost, authPort] = emulatorAddress(process.env.FIREBASE_AUTH_EMULATOR_HOST, 9099);
  const [storeHost, storePort] = emulatorAddress(process.env.FIRESTORE_EMULATOR_HOST, 8085);
  const [storageHost, storagePort] = emulatorAddress(process.env.FIREBASE_STORAGE_EMULATOR_HOST, 9199);
  connectAuthEmulator(getAuth(firebaseApp), `http://${authHost}:${authPort}`, { disableWarnings: true });
  connectFirestoreEmulator(firebaseStore, storeHost, storePort);
  connectStorageEmulator(firebaseStorage, storageHost, storagePort);
}

export { firebaseApp, firebaseStore, firebaseStorage };
