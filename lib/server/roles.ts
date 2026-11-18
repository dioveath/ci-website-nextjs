import 'server-only';

import { FieldValue } from 'firebase-admin/firestore';
import type { UserRecord } from 'firebase-admin/auth';

import { adminAuth, adminDb } from './firebaseAdmin';
import { fail } from './errors';
import type { AdminUserRow, Uid } from '../../types/courses';

const USERS = 'ci_users';

/**
 * Grants or removes the `admin` custom claim, the only source of admin access
 * (firestore.rules and lib/server/authz.ts both read it from the token).
 *
 * Removing it also revokes the user's refresh tokens, so the old token stops
 * working at the next check instead of up to an hour later. The `roles` copy
 * on the public profile is kept in step for display only.
 */
export async function setAdminRole(uid: Uid, grant: boolean): Promise<void> {
  const auth = adminAuth();
  const user = await auth.getUser(uid).catch(() => null);
  if (!user) fail('not_found', 'No user with that id.');

  const claims = { ...(user.customClaims ?? {}) };
  if (grant) claims.admin = true;
  else delete claims.admin;
  await auth.setCustomUserClaims(uid, Object.keys(claims).length ? claims : null);
  if (!grant) await auth.revokeRefreshTokens(uid);

  const profile = adminDb().collection(USERS).doc(uid);
  if ((await profile.get()).exists) {
    await profile.update({ 'roles.admin': grant ? true : FieldValue.delete() });
  }
}

/** Accepts a uid or an email address. */
export async function findUser(uidOrEmail: string): Promise<UserRecord | null> {
  const auth = adminAuth();
  const lookup = uidOrEmail.includes('@') ? auth.getUserByEmail(uidOrEmail) : auth.getUser(uidOrEmail);
  return lookup.catch(() => null);
}

export function toAdminUserRow(user: UserRecord): AdminUserRow {
  const created = Date.parse(user.metadata.creationTime);
  return {
    uid: user.uid,
    name: user.displayName || user.email?.split('@')[0] || user.uid,
    email: user.email ?? null,
    photoURL: user.photoURL ?? null,
    isAdmin: user.customClaims?.admin === true,
    createdAt: Number.isNaN(created) ? null : created,
  };
}

/** Every account, newest first. Pages through Auth 1,000 users at a time. */
export async function listAllUsers(max = 5000): Promise<AdminUserRow[]> {
  const rows: AdminUserRow[] = [];
  let pageToken: string | undefined;
  do {
    const page = await adminAuth().listUsers(1000, pageToken);
    rows.push(...page.users.map(toAdminUserRow));
    pageToken = page.pageToken;
  } while (pageToken && rows.length < max);
  return rows.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}
