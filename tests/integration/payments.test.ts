import { after, before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { adminDb, resetFirestore, signIn } from './helpers';
import { getCourseAccess, getMyCourses, startCheckout } from '../../app/courses/actions';
import { settleOrder } from '../../lib/server/orders';
import { esewaSignature } from '../../lib/server/payments/esewa';
import { normalizeCourse } from '../../lib/courses/catalog';
import { coursesList } from '../../components/course/coursesList';

/*
 * Checkout -> provider -> settlement, with the providers' HTTP APIs replaced
 * by a fake `fetch`. Firestore and Auth are the real emulators.
 */

const PAID = normalizeCourse(coursesList.find((course) => course.id === '2'))!; // Rs 1,500
const FREE_ID = '1';

process.env.KHALTI_SECRET_KEY = 'test-khalti-key';

type Answer = { status: number; body: unknown };
let answers: Record<string, Answer> = {};
const calls: Array<{ url: string; init?: RequestInit }> = [];

const realFetch = globalThis.fetch;
before(() => {
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('127.0.0.1')) return realFetch(input, init); // the emulators
    calls.push({ url, init });
    const key = Object.keys(answers).find((prefix) => url.includes(prefix));
    if (!key) throw new Error(`Unexpected request in test: ${url}`);
    return new Response(JSON.stringify(answers[key].body), { status: answers[key].status });
  }) as typeof fetch;
});
after(() => {
  globalThis.fetch = realFetch;
});

let alice: string;
before(async () => {
  alice = await signIn('alice');
});

beforeEach(async () => {
  answers = {};
  calls.length = 0;
  await resetFirestore();
});

async function order(id: string) {
  return (await adminDb().doc(`orders/${id}`).get()).data()!;
}

describe('checkout', () => {
  it('refuses bad input and free courses', async () => {
    const bad = await startCheckout(alice, { courseId: PAID.id, provider: 'paypal' as never });
    assert.equal(bad.ok || bad.error, 'invalid');
    const free = await startCheckout(alice, { courseId: FREE_ID, provider: 'esewa' });
    assert.equal(free.ok || free.error, 'invalid');
    const anonymous = await startCheckout('', { courseId: PAID.id, provider: 'esewa' });
    assert.equal(anonymous.ok || anonymous.error, 'unauthenticated');
  });

  it('builds a signed eSewa form for the server-side price', async () => {
    const result = await startCheckout(alice, { courseId: PAID.id, provider: 'esewa' });
    assert.ok(result.ok);
    const { orderId, checkout } = result.data;
    assert.equal(checkout.kind, 'form-post');
    assert.ok(checkout.kind === 'form-post');
    assert.match(checkout.url, /rc-epay\.esewa\.com\.np/, 'sandbox by default');
    assert.equal(checkout.fields.total_amount, '1500');
    assert.equal(checkout.fields.transaction_uuid, orderId);
    assert.equal(checkout.fields.success_url, `http://localhost:3000/api/payments/esewa/return/${orderId}`);
    assert.equal(
      checkout.fields.signature,
      esewaSignature(
        { total_amount: '1500', transaction_uuid: orderId, product_code: 'EPAYTEST' },
        '8gBm/:&EnhH.1/q'
      )
    );

    const stored = await order(orderId);
    assert.equal(stored.status, 'pending');
    assert.deepEqual(stored.amount, { amount: 150000, currency: 'NPR' });
    assert.equal(stored.uid, 'alice');
  });

  it('starts Khalti with the amount in paisa and keeps the pidx', async () => {
    answers['epayment/initiate/'] = {
      status: 200,
      body: { pidx: 'PIDX1', payment_url: 'https://test-pay.khalti.com/?pidx=PIDX1', expires_in: 1800 },
    };
    const result = await startCheckout(alice, { courseId: PAID.id, provider: 'khalti' });
    assert.ok(result.ok);
    assert.deepEqual(result.data.checkout, { kind: 'redirect', url: 'https://test-pay.khalti.com/?pidx=PIDX1' });

    const request = JSON.parse(String(calls[0].init?.body));
    assert.equal(request.amount, 150000);
    assert.equal(request.purchase_order_id, result.data.orderId);
    assert.match(calls[0].url, /dev\.khalti\.com/);
    assert.equal((calls[0].init?.headers as Record<string, string>).Authorization, 'Key test-khalti-key');
    assert.deepEqual((await order(result.data.orderId)).payment, { provider: 'khalti', pidx: 'PIDX1' });
  });

  it('closes the order when Khalti cannot be reached', async () => {
    answers['epayment/initiate/'] = { status: 500, body: { detail: 'down' } };
    const result = await startCheckout(alice, { courseId: PAID.id, provider: 'khalti' });
    assert.equal(result.ok || result.error, 'payment_unavailable');
    const orders = await adminDb().collection('orders').get();
    assert.equal(orders.docs[0].data().status, 'failed');
  });
});

describe('settlement', () => {
  async function pendingEsewaOrder() {
    const result = await startCheckout(alice, { courseId: PAID.id, provider: 'esewa' });
    assert.ok(result.ok);
    return result.data.orderId;
  }

  it('grants access once eSewa confirms the full amount, exactly once', async () => {
    const orderId = await pendingEsewaOrder();
    answers['transaction/status'] = { status: 200, body: { status: 'COMPLETE', ref_id: 'REF9', total_amount: 1500 } };

    assert.deepEqual(await settleOrder(orderId), { status: 'paid', courseId: PAID.id });
    assert.match(calls.at(-1)!.url, /total_amount=1500/, 'checked against our stored amount');

    const paid = await order(orderId);
    assert.equal(paid.status, 'paid');
    assert.equal(paid.payment.transactionCode, 'REF9');
    const enrollment = (await adminDb().doc(`enrollments/${PAID.id}_alice`).get()).data()!;
    assert.equal(enrollment.status, 'active');
    assert.deepEqual(enrollment.source, { type: 'purchase', orderId });

    calls.length = 0;
    assert.deepEqual(await settleOrder(orderId), { status: 'paid', courseId: PAID.id });
    assert.equal(calls.length, 0, 'a settled order is not re-verified');

    const again = await startCheckout(alice, { courseId: PAID.id, provider: 'esewa' });
    assert.equal(again.ok || again.error, 'already_enrolled');
  });

  it('rejects a payment for the wrong amount', async () => {
    const orderId = await pendingEsewaOrder();
    answers['transaction/status'] = { status: 200, body: { status: 'COMPLETE', ref_id: 'R', total_amount: 15 } };
    assert.equal((await settleOrder(orderId))?.status, 'failed');
    assert.equal((await adminDb().doc(`enrollments/${PAID.id}_alice`).get()).exists, false);
  });

  it('waits while the student may still be paying, and closes on cancel', async () => {
    const orderId = await pendingEsewaOrder();
    answers['transaction/status'] = { status: 200, body: { status: 'NOT_FOUND' } };
    assert.equal((await settleOrder(orderId))?.status, 'pending');
    assert.equal((await settleOrder(orderId, { cancelled: true }))?.status, 'failed');
  });

  it('closes abandoned orders after 30 minutes', async () => {
    const orderId = await pendingEsewaOrder();
    await adminDb().doc(`orders/${orderId}`).update({ createdAt: new Date(Date.now() - 31 * 60 * 1000) });
    answers['transaction/status'] = { status: 200, body: { status: 'NOT_FOUND' } };
    assert.equal((await settleOrder(orderId))?.status, 'failed');
  });

  it('treats provider outages as "still pending", never as paid or failed', async () => {
    const orderId = await pendingEsewaOrder();
    answers['transaction/status'] = { status: 503, body: {} };
    assert.equal((await settleOrder(orderId))?.status, 'pending');
  });

  it('settles a Khalti payment through the stored pidx', async () => {
    answers['epayment/initiate/'] = { status: 200, body: { pidx: 'PIDX2', payment_url: 'https://pay/x' } };
    const result = await startCheckout(alice, { courseId: PAID.id, provider: 'khalti' });
    assert.ok(result.ok);
    answers['epayment/lookup/'] = {
      status: 200,
      body: { pidx: 'PIDX2', status: 'Completed', total_amount: 150000, transaction_id: 'TX2' },
    };
    assert.equal((await settleOrder(result.data.orderId))?.status, 'paid');
    assert.deepEqual(JSON.parse(String(calls.at(-1)!.init?.body)), { pidx: 'PIDX2' });
    assert.equal((await order(result.data.orderId)).payment.transactionId, 'TX2');
  });

  it('records a cancelled Khalti payment (HTTP 400 lookup) as failed', async () => {
    answers['epayment/initiate/'] = { status: 200, body: { pidx: 'PIDX3', payment_url: 'https://pay/y' } };
    const result = await startCheckout(alice, { courseId: PAID.id, provider: 'khalti' });
    assert.ok(result.ok);
    answers['epayment/lookup/'] = { status: 400, body: { pidx: 'PIDX3', status: 'User canceled' } };
    assert.equal((await settleOrder(result.data.orderId))?.status, 'failed');
  });

  it('picks up a payment when the student returns without the redirect', async () => {
    const orderId = await pendingEsewaOrder();
    answers['transaction/status'] = { status: 200, body: { status: 'PENDING' } };
    const waiting = await getCourseAccess(alice, PAID.id);
    assert.ok(waiting.ok);
    assert.equal(waiting.data.pendingOrderId, orderId);
    assert.equal(waiting.data.hasAccess, false);

    answers['transaction/status'] = { status: 200, body: { status: 'COMPLETE', ref_id: 'R', total_amount: 1500 } };
    const mine = await getMyCourses(alice);
    assert.ok(mine.ok);
    assert.equal(mine.data.length, 1);
    assert.equal(mine.data[0].course?.id, PAID.id);
    const access = await getCourseAccess(alice, PAID.id);
    assert.ok(access.ok && access.data.hasAccess && access.data.pendingOrderId === null);
  });
});
