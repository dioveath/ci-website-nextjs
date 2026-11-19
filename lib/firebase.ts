import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// NEXT_PUBLIC_ values are inlined into the browser bundle at build time.
const firebaseApp = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
});
const firebaseStore = getFirestore(firebaseApp);
const firebaseStorage = getStorage(firebaseApp);

// Local development without Firebase credentials: `npm run dev:emulators`
// sets NEXT_PUBLIC_FIREBASE_EMULATORS=1 and points Auth, Firestore and Storage at the
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

if (process.env.NEXT_PUBLIC_FIREBASE_EMULATORS === '1' && !connected.has(firebaseStore)) {
  connected.add(firebaseStore);
  const [authHost, authPort] = emulatorAddress(process.env.FIREBASE_AUTH_EMULATOR_HOST, 9099);
  const [storeHost, storePort] = emulatorAddress(process.env.FIRESTORE_EMULATOR_HOST, 8085);
  const [storageHost, storagePort] = emulatorAddress(process.env.FIREBASE_STORAGE_EMULATOR_HOST, 9199);
  connectAuthEmulator(getAuth(firebaseApp), `http://${authHost}:${authPort}`, { disableWarnings: true });
  connectFirestoreEmulator(firebaseStore, storeHost, storePort);
  connectStorageEmulator(firebaseStorage, storageHost, storagePort);
}

/**
 * Auth, resolved on first use rather than at module evaluation, and only by
 * client code (lib/auth.tsx). getAuth() throws auth/invalid-api-key when the
 * NEXT_PUBLIC_FIREBASE_* config is missing; at module scope that throw ran
 * during prerender and failed `next build` on pages that never touch auth.
 * A missing or invalid config now reads as "signed out" instead of crashing,
 * matching how lib/sanity degrades.
 */
let authInstance: Auth | null = null;

function firebaseAuth(): Auth | null {
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return null;
  try {
    authInstance ??= getAuth(firebaseApp);
  } catch {
    return null;
  }
  return authInstance;
}

export { firebaseApp, firebaseStore, firebaseStorage, firebaseAuth };
