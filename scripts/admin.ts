/*
 * Admin command line. Uses the Firebase Admin SDK with the credentials from
 * .env.local (FIREBASE_SERVICE_ACCOUNT, see .env.example), or the emulators
 * when FIRESTORE_EMULATOR_HOST / FIREBASE_AUTH_EMULATOR_HOST are set.
 *
 *   npm run admin -- set-admin <email|uid>      grant the admin role
 *   npm run admin -- remove-admin <email|uid>   remove it (and sign them out)
 *   npm run admin -- list-admins
 *   npm run admin -- migrate-users              dry run: show what would change
 *   npm run admin -- migrate-users --apply      apply it
 *
 * The first admin has to be created here: the admin panel can only be opened
 * by someone who is already an admin.
 */
import { existsSync } from 'node:fs';
import { FieldValue } from 'firebase-admin/firestore';

import { adminAuth, adminDb } from '../lib/server/firebaseAdmin';
import { findUser, listAllUsers, setAdminRole } from '../lib/server/roles';

const USERS = 'ci_users';
const CONTACT_FIELDS = ['email', 'phone_number', 'address'] as const;
const OBSOLETE_FIELDS = ['email_verified', 'phone_verified', 'courses'] as const;
// The old sign-up wrote this when the account had no phone number.
const PLACEHOLDER_PHONE = '0000000000';

function usage(): never {
  console.error('Usage: npm run admin -- <set-admin|remove-admin> <email|uid> | list-admins | migrate-users [--apply]');
  process.exit(1);
}

async function setRole(target: string | undefined, grant: boolean) {
  if (!target) usage();
  const user = await findUser(target);
  if (!user) throw new Error(`No Firebase Auth user matches "${target}".`);
  await setAdminRole(user.uid, grant);
  console.log(`${grant ? 'Granted' : 'Removed'} admin for ${user.email ?? user.uid} (${user.uid}).`);
  console.log(grant
    ? 'They get admin access the next time their sign-in refreshes (sign out and in to apply now).'
    : 'Their sessions were revoked; they must sign in again.');
}

async function listAdmins() {
  const admins = (await listAllUsers()).filter((user) => user.isAdmin);
  if (admins.length === 0) console.log('No admins yet. Create one with: npm run admin -- set-admin <email>');
  for (const admin of admins) console.log(`${admin.email ?? '(no email)'}\t${admin.uid}`);
}

/*
 * Brings every existing profile in line with firestore.rules:
 *   - email / phone_number / address move to ci_users/{uid}/private/contact
 *     (an existing contact document is never overwritten);
 *   - email_verified, phone_verified and the old `courses` enroll markers are
 *     removed (paid access now lives in `enrollments`);
 *   - legacy `roles.manager` becomes the `admin` custom claim, and `roles` is
 *     reset to a copy of the claims.
 */
async function migrateUsers(apply: boolean) {
  const auth = adminAuth();
  const db = adminDb();
  const snapshot = await db.collection(USERS).get();
  const stats = { profiles: snapshot.size, contactsMoved: 0, cleaned: 0, coursesDropped: 0, adminsGranted: 0, rolesReset: 0 };

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const uid = doc.id;
    const updates: Record<string, unknown> = {};
    const notes: string[] = [];

    const hasContact = CONTACT_FIELDS.some((field) => field in data);
    if (hasContact) {
      for (const field of CONTACT_FIELDS) updates[field] = FieldValue.delete();
      notes.push('move contact details to private/contact');
      stats.contactsMoved++;
    }
    for (const field of OBSOLETE_FIELDS) {
      if (field in data) updates[field] = FieldValue.delete();
    }
    if ('courses' in data) {
      notes.push(`drop ${Object.keys(data.courses ?? {}).length} old course marker(s)`);
      stats.coursesDropped++;
    }

    const authUser = await auth.getUser(uid).catch(() => null);
    const wasManager = data.roles?.manager === true;
    const grantAdmin = wasManager && authUser !== null && authUser.customClaims?.admin !== true;
    const isAdmin = authUser?.customClaims?.admin === true || (wasManager && authUser !== null);
    const roles = isAdmin ? { admin: true } : {};
    if (JSON.stringify(data.roles ?? {}) !== JSON.stringify(roles)) {
      updates.roles = roles;
      notes.push(`roles ${JSON.stringify(data.roles ?? {})} -> ${JSON.stringify(roles)}`);
      stats.rolesReset++;
    }
    if (grantAdmin) {
      notes.push('grant admin claim (was roles.manager)');
      stats.adminsGranted++;
    }
    if (wasManager && !authUser) notes.push('was manager, but has no Auth account: not granted');

    if (Object.keys(updates).length === 0 && !grantAdmin) continue;
    stats.cleaned++;
    console.log(`${uid}: ${notes.join('; ') || 'remove obsolete fields'}`);
    if (!apply) continue;

    if (grantAdmin) {
      await auth.setCustomUserClaims(uid, { ...(authUser!.customClaims ?? {}), admin: true });
    }
    const batch = db.batch();
    if (hasContact) {
      const contactRef = doc.ref.collection('private').doc('contact');
      if (!(await contactRef.get()).exists) {
        const phone = typeof data.phone_number === 'string' || typeof data.phone_number === 'number'
          ? String(data.phone_number)
          : '';
        batch.set(contactRef, {
          email: data.email ?? authUser?.email ?? null,
          phone_number: phone === PLACEHOLDER_PHONE ? '' : phone,
          address: typeof data.address === 'string' ? data.address : '',
        });
      }
    }
    batch.update(doc.ref, updates);
    await batch.commit();
  }

  console.log('\n' + JSON.stringify(stats, null, 2));
  console.log(apply ? 'Migration applied.' : 'Dry run: nothing was changed. Re-run with --apply.');
}

async function main() {
  // Same credentials as the site. Variables already set in the shell win.
  if (existsSync('.env.local')) process.loadEnvFile('.env.local');

  const [command, ...args] = process.argv.slice(2);
  switch (command) {
    case 'set-admin': return setRole(args[0], true);
    case 'remove-admin': return setRole(args[0], false);
    case 'list-admins': return listAdmins();
    case 'migrate-users': return migrateUsers(args.includes('--apply'));
    default: usage();
  }
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
);
