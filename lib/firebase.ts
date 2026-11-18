import { initializeApp } from "firebase/app";
import { isSupported, getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "./firebaseConfig";
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
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
if (process.env.FIREBASE_EMULATORS === '1' && !connected.has(firebaseStore)) {
  connected.add(firebaseStore);
  connectAuthEmulator(getAuth(firebaseApp), 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(firebaseStore, '127.0.0.1', 8085);
  connectStorageEmulator(firebaseStorage, '127.0.0.1', 9199);
}

/**
 * Auth, resolved on first use rather than at module evaluation.
 *
 * `getAuth()` throws `auth/invalid-api-key` the moment it runs without
 * FIREBASE_* configured. Calling it at module scope meant that throw happened
 * while the module graph was being evaluated -- which is during prerender, so
 * `next build` failed on /_not-found before rendering a single page, even
 * though nothing on that page touches auth. Deferring it to call time keeps
 * the static pages buildable without credentials and moves the error to the
 * code path that actually needs Firebase, matching how lib/sanity degrades.
 */
let authInstance: Auth | null = null;

function firebaseAuth(): Auth | null {
  if (!firebaseConfig.apiKey) return null;
  try {
    authInstance ??= getAuth(firebaseApp);
  } catch {
    return null;
  }
  return authInstance;
}

export { firebaseApp, firebaseStore, firebaseStorage, firebaseAuth };
