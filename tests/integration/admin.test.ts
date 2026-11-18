import { before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { adminDb, resetFirestore, signIn } from './helpers';
import {
  endCourseAccess,
  grantCourseAccess,
  listCatalog,
  listEnrollments,
  listOrders,
  recheckOrder,
} from '../../app/admin/courseActions';
import { listUsers, setAdmin } from '../../app/admin/actions';
import { getCourseAccess } from '../../app/courses/actions';

const PAID_ID = '2';

let admin: string;
let alice: string;

before(async () => {
  admin = await signIn('admin', { admin: true });
  alice = await signIn('alice');
});

beforeEach(async () => {
  await resetFirestore();
});

describe('admin-only actions', () => {
  it('refuses students and anonymous callers', async () => {
    for (const token of [alice, '']) {
      const results = await Promise.all([
        listCatalog(token),
        listOrders(token),
        listEnrollments(token),
        listUsers(token),
        grantCourseAccess(token, { courseId: PAID_ID, user: 'alice@example.com' }),
        setAdmin(token, { uid: 'alice', grant: true }),
      ]);
      for (const result of results) {
        assert.equal(result.ok, false);
        assert.ok(!result.ok && ['forbidden', 'unauthenticated'].includes(result.error));
      }
    }
  });
});

describe('course access management', () => {
  it('grants access by email, refuses duplicates, and revokes', async () => {
    const granted = await grantCourseAccess(admin, { courseId: PAID_ID, user: 'alice@example.com', reason: 'Bank transfer' });
    assert.ok(granted.ok);
    assert.deepEqual(granted.data.source, { type: 'grant', grantedBy: 'admin', reason: 'Bank transfer' });
    const access = await getCourseAccess(alice, PAID_ID);
    assert.ok(access.ok && access.data.hasAccess);

    const twice = await grantCourseAccess(admin, { courseId: PAID_ID, user: 'alice' });
    assert.equal(twice.ok || twice.error, 'already_enrolled');
    const nobody = await grantCourseAccess(admin, { courseId: PAID_ID, user: 'nobody@example.com' });
    assert.equal(nobody.ok || nobody.error, 'not_found');

    const listed = await listEnrollments(admin, { courseId: PAID_ID });
    assert.ok(listed.ok && listed.data.length === 1);

    const refundGrant = await endCourseAccess(admin, { enrollmentId: `${PAID_ID}_alice`, refunded: true, reason: '' });
    assert.equal(refundGrant.ok || refundGrant.error, 'invalid', 'a grant was never paid, so it cannot be refunded');

    const revoked = await endCourseAccess(admin, { enrollmentId: `${PAID_ID}_alice`, refunded: false, reason: 'Abuse' });
    assert.ok(revoked.ok);
    assert.equal(revoked.data.status, 'revoked');
    assert.equal(revoked.data.endReason, 'Abuse');
    const after = await getCourseAccess(alice, PAID_ID);
    assert.ok(after.ok && !after.data.hasAccess);
  });

  it('marks the order refunded when a purchase is refunded', async () => {
    const now = new Date();
    await adminDb().doc('orders/order0000001').set({
      uid: 'alice', courseId: PAID_ID, courseTitle: 'Advance Basics', student: { name: 'Alice', email: 'alice@example.com' },
      amount: { amount: 150000, currency: 'NPR' }, status: 'paid', payment: { provider: 'esewa' }, createdAt: now, paidAt: now,
    });
    await adminDb().doc(`enrollments/${PAID_ID}_alice`).set({
      uid: 'alice', courseId: PAID_ID, courseTitle: 'Advance Basics', student: { name: 'Alice', email: 'alice@example.com' },
      source: { type: 'purchase', orderId: 'order0000001' }, status: 'active', enrolledAt: now, progress: {},
    });

    const refunded = await endCourseAccess(admin, { enrollmentId: `${PAID_ID}_alice`, refunded: true, reason: 'Asked for refund' });
    assert.ok(refunded.ok && refunded.data.status === 'refunded');
    const order = (await adminDb().doc('orders/order0000001').get()).data()!;
    assert.equal(order.status, 'refunded');

    const orders = await listOrders(admin, { status: 'refunded' });
    assert.ok(orders.ok && orders.data.length === 1 && orders.data[0].id === 'order0000001');
    const settled = await recheckOrder(admin, { orderId: 'order0000001' });
    assert.ok(settled.ok && settled.data === 'refunded', 'settled orders are left alone');
  });

  it('lists the catalog including unlisted courses', async () => {
    const catalog = await listCatalog(admin);
    assert.ok(catalog.ok);
    assert.equal(catalog.data.length, 9);
  });
});

describe('users', () => {
  it('lists accounts and toggles admin, but never self-demotes', async () => {
    const users = await listUsers(admin);
    assert.ok(users.ok);
    assert.ok(users.data.some((user) => user.uid === 'admin' && user.isAdmin));

    const self = await setAdmin(admin, { uid: 'admin', grant: false });
    assert.equal(self.ok || self.error, 'invalid');

    assert.ok((await setAdmin(admin, { uid: 'alice', grant: true })).ok);
    const promoted = await listUsers(admin);
    assert.ok(promoted.ok && promoted.data.find((user) => user.uid === 'alice')?.isAdmin);
    assert.ok((await setAdmin(admin, { uid: 'alice', grant: false })).ok);

    // Her old token is refused: as revoked when it was issued over a second
    // before the revocation (Firebase compares whole seconds), otherwise as
    // no longer admin.
    const revoked = await listOrders(alice);
    assert.ok(!revoked.ok && ['unauthenticated', 'forbidden'].includes(revoked.error));
    alice = await signIn('alice');
  });
});
