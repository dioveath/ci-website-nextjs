import 'server-only';

import { applicationDefault, cert, getApps, initializeApp, type App, type Credential } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

import { ActionFailure } from './actions';

/*
 * Firebase Admin SDK: the server's trusted access to Auth and Firestore. It
 * bypasses Firestore security rules, so it is only ever used behind the
 * checks in lib/server/authz.ts.
 *
 * Credentials, first match wins:
 *   1. Emulators: FIRESTORE_EMULATOR_HOST / FIREBASE_AUTH_EMULATOR_HOST, set
 *      automatically by `npm run dev:emulators`. No credentials needed.
 *   2. FIREBASE_SERVICE_ACCOUNT: the service account JSON, on one line.
 *   3. FIREBASE_ADMIN_CLIENT_EMAIL + FIREBASE_ADMIN_PRIVATE_KEY.
 *   4. Application Default Credentials, when running on Google Cloud
 *      (Firebase App Hosting, Cloud Run) or with GOOGLE_APPLICATION_CREDENTIALS.
 */

const globalForAdmin = globalThis as typeof globalThis & {
  __ciAdmin?: { app: App; auth: Auth; db: Firestore };
};

function usingEmulators(): boolean {
  return Boolean(process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST);
}

function projectId(): string | undefined {
  return process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || undefined;
}

function resolveCredential(): Credential | null | 'emulator' {
  if (usingEmulators()) return 'emulator';

  const json = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (json) {
    const account = JSON.parse(json) as { project_id?: string; client_email?: string; private_key?: string };
    return cert({
      projectId: account.project_id ?? projectId(),
      clientEmail: account.client_email,
      privateKey: account.private_key,
    });
  }

  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (clientEmail && privateKey) {
    // Hosting dashboards usually store the key with literal "\n" sequences.
    return cert({ projectId: projectId(), clientEmail, privateKey: privateKey.replace(/\\n/g, '\n') });
  }

  const onGoogleCloud = Boolean(
    process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.K_SERVICE || process.env.FIREBASE_CONFIG
  );
  return onGoogleCloud ? applicationDefault() : null;
}

export function isAdminConfigured(): boolean {
  return resolveCredential() !== null;
}

function admin() {
  if (globalForAdmin.__ciAdmin) return globalForAdmin.__ciAdmin;

  const credential = resolveCredential();
  if (credential === null) {
    console.error(
      '[firebase-admin] Not configured. Set FIREBASE_SERVICE_ACCOUNT (see .env.example) to enable courses, payments and admin tools.'
    );
    throw new ActionFailure('unavailable', 'This feature is not available right now. Please try again later.');
  }

  const app =
    getApps()[0] ??
    initializeApp({
      projectId: projectId(),
      ...(credential === 'emulator' ? {} : { credential }),
    });

  // settings() may run only once per Firestore instance; the instance is
  // cached on globalThis below, so dev hot reloads never repeat it.
  const db = getFirestore(app);
  db.settings({ ignoreUndefinedProperties: true });
  globalForAdmin.__ciAdmin = { app, auth: getAuth(app), db };
  return globalForAdmin.__ciAdmin;
}

export function adminAuth(): Auth {
  return admin().auth;
}

export function adminDb(): Firestore {
  return admin().db;
}
