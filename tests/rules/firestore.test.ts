/*
 * Firestore security rules tests. Run with `npm run test:rules`, which starts
 * the Firestore emulator and loads ../../firestore.rules.
 */
import { after, before, beforeEach, describe, it } from 'node:test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { setLogLevel } from 'firebase/firestore';

// Denied writes are the point of most assertions; keep the SDK from logging each one.
setLogLevel('silent');

let env: RulesTestEnvironment;

const [host, port] = (process.env.FIRESTORE_EMULATOR_HOST ?? '127.0.0.1:8085').split(':');

const newUser = (uid: string) => ({
  id: uid,
  first_name: 'Asha',
  last_name: 'Rai',
  profile_URL: '',
  cover_URL: '',
  exp_points: 0,
  hearts: 0,
  roles: {},
  profile_visits: 0,
  medias: [],
  joined_at: Date.now(),
  on_board: false,
});

const draft = (id: string, writtenBy: string) => ({
  id,
  title: 'Draft',
  writtenBy,
  body: '{}',
  createdAt: new Date(),
  heartsBy: {},
  thumbnail: { id: 't', downloadURL: 'https://example.com/t.png' },
  likes: 0,
  state: 'pending',
});

const db = (uid?: string, claims: Record<string, unknown> = {}) =>
  uid
    ? env.authenticatedContext(uid, { email: `${uid}@example.com`, ...claims }).firestore()
    : env.unauthenticatedContext().firestore();

async function seed(path: string, data: Record<string, unknown>) {
  await env.withSecurityRulesDisabled(async (context) => {
    await context.firestore().doc(path).set(data);
  });
}

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-charicha-rules',
    firestore: {
      rules: readFileSync(resolve(import.meta.dirname, '../../firestore.rules'), 'utf8'),
      host,
      port: Number(port),
    },
  });
});

beforeEach(async () => {
  await env.clearFirestore();
});

after(async () => {
  await env?.cleanup();
});

describe('ci_users', () => {
  it('lets a user create their own profile with starting values only', async () => {
    await assertSucceeds(db('alice').doc('ci_users/alice').set(newUser('alice')));
    await assertFails(db('alice').doc('ci_users/bob').set(newUser('bob')));
    await assertFails(db('alice').doc('ci_users/alice').set({ ...newUser('alice'), roles: { admin: true } }));
    await assertFails(db('alice').doc('ci_users/alice').set({ ...newUser('alice'), exp_points: 999 }));
    await assertFails(db('alice').doc('ci_users/alice').set({ ...newUser('alice'), email: 'a@example.com' }));
  });

  it('lets a user edit profile fields but not roles, points or courses', async () => {
    await seed('ci_users/alice', newUser('alice'));
    const alice = db('alice').doc('ci_users/alice');
    await assertSucceeds(alice.update({ first_name: 'A', medias: [{ uid: 'm1' }] }));
    await assertFails(alice.update({ roles: { admin: true } }));
    await assertFails(alice.update({ hearts: 10 }));
    await assertFails(alice.update({ 'courses.web-dev': '' }));
    await assertFails(db('bob').doc('ci_users/alice').update({ first_name: 'Hacked' }));
  });

  it('serves single public profiles to anyone but lists only to admins', async () => {
    await seed('ci_users/alice', newUser('alice'));
    await assertSucceeds(db().doc('ci_users/alice').get());
    await assertFails(db().collection('ci_users').get());
    await assertFails(db('bob').collection('ci_users').get());
    await assertSucceeds(db('admin', { admin: true }).collection('ci_users').get());
  });

  it('keeps contact details private to the user and admins', async () => {
    const contact = { email: 'alice@example.com', phone_number: '', address: '' };
    await assertSucceeds(db('alice').doc('ci_users/alice/private/contact').set(contact));
    await assertFails(db('alice').doc('ci_users/alice/private/contact2').set(contact));
    await assertFails(
      db('mallory').doc('ci_users/mallory/private/contact').set({ ...contact, email: 'not-mine@example.com' })
    );
    await assertSucceeds(db('alice').doc('ci_users/alice/private/contact').get());
    await assertSucceeds(db('admin', { admin: true }).doc('ci_users/alice/private/contact').get());
    await assertFails(db().doc('ci_users/alice/private/contact').get());
    await assertFails(db('bob').doc('ci_users/alice/private/contact').get());
    await assertSucceeds(db('alice').doc('ci_users/alice/private/contact').update({ address: 'Belbari' }));
    await assertFails(db('alice').doc('ci_users/alice/private/contact').update({ email: 'other@example.com' }));
  });
});

describe('articles', () => {
  it('creates only pending, self-authored articles', async () => {
    await assertSucceeds(db('alice').doc('articles/a1').set(draft('a1', 'alice')));
    await assertFails(db('alice').doc('articles/a2').set(draft('a2', 'bob')));
    await assertFails(db('alice').doc('articles/a3').set({ ...draft('a3', 'alice'), state: 'published' }));
    await assertFails(db('alice').doc('articles/a4').set({ ...draft('a4', 'alice'), likes: 50 }));
    await assertFails(db().doc('articles/a5').set(draft('a5', 'alice')));
  });

  it('hides drafts from the public but not from the author or admins', async () => {
    await seed('articles/d1', draft('d1', 'alice'));
    await seed('articles/p1', { ...draft('p1', 'alice'), state: 'published' });
    await assertFails(db().doc('articles/d1').get());
    await assertSucceeds(db().doc('articles/p1').get());
    await assertSucceeds(db('alice').doc('articles/d1').get());
    await assertSucceeds(db('admin', { admin: true }).doc('articles/d1').get());
    // /blog/<slug> probes Firebase before Sanity: a missing id must not throw.
    await assertSucceeds(db().doc('articles/some-sanity-slug').get());
  });

  it('allows the queries the site makes', async () => {
    await seed('articles/d1', draft('d1', 'alice'));
    await seed('articles/p1', { ...draft('p1', 'bob'), state: 'published' });
    await assertSucceeds(db().collection('articles').where('state', '==', 'published').get());
    await assertSucceeds(db('alice').collection('articles').where('writtenBy', '==', 'alice').get());
    await assertFails(db('bob').collection('articles').where('writtenBy', '==', 'alice').get());
    await assertFails(db().collection('articles').get());
    await assertSucceeds(db('admin', { admin: true }).collection('articles').get());
  });

  it('lets authors edit content, and only admins publish', async () => {
    await seed('articles/d1', draft('d1', 'alice'));
    await assertSucceeds(db('alice').doc('articles/d1').update({ title: 'Better', body: '{"x":1}' }));
    await assertFails(db('alice').doc('articles/d1').update({ state: 'published' }));
    await assertFails(db('bob').doc('articles/d1').update({ title: 'Mine now' }));
    await assertSucceeds(db('admin', { admin: true }).doc('articles/d1').update({ state: 'published' }));
    await assertFails(db('bob').doc('articles/d1').delete());
    await assertSucceeds(db('alice').doc('articles/d1').delete());
  });
});

describe('course records', () => {
  it('lets students read only their own enrollments and orders', async () => {
    await seed('enrollments/web-dev_alice', { uid: 'alice', courseId: 'web-dev', status: 'active' });
    await seed('orders/o1', { uid: 'alice', courseId: 'web-dev', status: 'paid' });
    await assertSucceeds(db('alice').doc('enrollments/web-dev_alice').get());
    await assertSucceeds(db('alice').collection('enrollments').where('uid', '==', 'alice').get());
    await assertFails(db('bob').doc('enrollments/web-dev_alice').get());
    await assertFails(db('bob').collection('enrollments').get());
    await assertFails(db().doc('enrollments/web-dev_alice').get());
    await assertSucceeds(db('alice').doc('orders/o1').get());
    await assertFails(db('bob').doc('orders/o1').get());
    await assertSucceeds(db('admin', { admin: true }).collection('orders').get());
  });

  it('never lets the browser grant access, record payments or issue certificates', async () => {
    await assertFails(db('alice').doc('enrollments/web-dev_alice').set({ uid: 'alice', status: 'active' }));
    await assertFails(db('alice').doc('orders/o1').set({ uid: 'alice', status: 'paid' }));
    await assertFails(db('alice').doc('certificates/c1').set({ uid: 'alice' }));
    await assertFails(db('admin', { admin: true }).doc('enrollments/web-dev_bob').set({ uid: 'bob' }));
    await seed('enrollments/web-dev_alice', { uid: 'alice', status: 'active', progress: {} });
    await assertFails(db('alice').doc('enrollments/web-dev_alice').update({ 'progress.x': 1 }));
  });

  it('makes certificates publicly verifiable', async () => {
    await seed('certificates/c1', { uid: 'alice', courseId: 'web-dev' });
    await assertSucceeds(db().doc('certificates/c1').get());
    await assertSucceeds(db().collection('certificates').where('uid', '==', 'alice').get());
  });

  it('denies everything else', async () => {
    await assertFails(db('alice').doc('courses/1').get());
    await assertFails(db('admin', { admin: true }).doc('anything/x').set({ a: 1 }));
  });
});
