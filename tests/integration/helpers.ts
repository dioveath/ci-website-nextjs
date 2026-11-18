/*
 * Shared setup for integration tests: they call the real server actions
 * against the Auth and Firestore emulators (npm run test:integration).
 */
import { adminAuth, adminDb } from '../../lib/server/firebaseAdmin';

export const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || 'demo-charicha-test';

if (!process.env.FIRESTORE_EMULATOR_HOST || !process.env.FIREBASE_AUTH_EMULATOR_HOST) {
  throw new Error('Integration tests must run against the emulators: npm run test:integration');
}
if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  throw new Error('Unset NEXT_PUBLIC_SANITY_PROJECT_ID: integration tests use the bundled sample catalog.');
}

/** Creates (or reuses) an Auth emulator user and returns a real ID token for it. */
export async function signIn(uid: string, claims?: Record<string, unknown>): Promise<string> {
  const auth = adminAuth();
  const email = `${uid}@example.com`;
  await auth.createUser({ uid, email, password: 'password123', displayName: `User ${uid}` }).catch(() => {});
  await auth.setCustomUserClaims(uid, claims ?? null);
  const response = await fetch(
    `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123', returnSecureToken: true }),
    }
  );
  const body = (await response.json()) as { idToken?: string };
  if (!body.idToken) throw new Error(`Emulator sign-in failed: ${JSON.stringify(body)}`);
  return body.idToken;
}

export async function resetFirestore(): Promise<void> {
  const response = await fetch(
    `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`,
    { method: 'DELETE' }
  );
  if (!response.ok) throw new Error(`Could not clear Firestore: ${response.status}`);
}

export { adminDb };
