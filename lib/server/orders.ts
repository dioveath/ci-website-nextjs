import 'server-only';

import { Timestamp, type DocumentReference } from 'firebase-admin/firestore';

import { adminDb } from './firebaseAdmin';
import { fail } from './errors';
import { serialize } from './serialize';
import { activateEnrollment, enrollmentRef, getEnrollment, hasActiveAccess, type Student } from './enrollments';
import { isSampleCatalog } from './catalog';
import { gatewayFor } from './payments';
import { paymentsEnv, siteUrl } from './payments/config';
import type { GatewayOrder } from './payments/gateway';
import type {
  CatalogCourse,
  CheckoutRedirect,
  CourseId,
  EnrollmentDoc,
  OrderDoc,
  OrderDTO,
  OrderId,
  OrderStatus,
  PaymentProvider,
  Uid,
} from '../../types/courses';

export const ORDERS = 'orders';

// A student who never reaches the payment step leaves a pending order
// behind. After this long it is closed as failed.
const ABANDONED_AFTER_MS = 30 * 60 * 1000;
const ORDER_ID_PATTERN = /^[A-Za-z0-9]{10,40}$/;

export function isOrderId(value: unknown): value is OrderId {
  return typeof value === 'string' && ORDER_ID_PATTERN.test(value);
}

function orderRef(orderId: OrderId): DocumentReference<OrderDoc> {
  return adminDb().collection(ORDERS).doc(orderId) as DocumentReference<OrderDoc>;
}

function toGatewayOrder(id: OrderId, order: OrderDoc): GatewayOrder {
  return { id, amount: order.amount, courseTitle: order.courseTitle, student: order.student, payment: order.payment };
}

export function toOrderDTO(id: OrderId, order: OrderDoc): OrderDTO {
  return serialize(id, order);
}

/**
 * Creates a pending order for `course` at its current price (read by the
 * server, never sent by the browser) and starts the payment with `provider`.
 */
export async function startCheckout(
  course: CatalogCourse,
  student: Student,
  provider: PaymentProvider
): Promise<{ orderId: OrderId; checkout: CheckoutRedirect }> {
  if (!course.price) fail('invalid', 'This course is free. Enroll directly.');
  if (!course.listed) fail('not_found', 'This course is no longer for sale.');
  if (isSampleCatalog() && paymentsEnv() === 'live') {
    // Never take real money for the bundled sample catalog.
    fail('payment_unavailable', 'Payments are not available right now.');
  }

  const gateway = gatewayFor(provider);
  const base = siteUrl();
  if (!gateway.isConfigured() || !base) {
    if (!base) console.error('[orders] SITE_URL is not set; cannot build payment return URLs.');
    fail('payment_unavailable', `${gateway.label} payments are not available right now.`);
  }

  if (hasActiveAccess(await getEnrollment(course.id, student.uid))) {
    fail('already_enrolled', 'You already have access to this course.');
  }

  const ref = adminDb().collection(ORDERS).doc() as DocumentReference<OrderDoc>;
  const order: OrderDoc = {
    uid: student.uid,
    courseId: course.id,
    courseTitle: course.title,
    student: { name: student.name, email: student.email },
    amount: course.price,
    status: 'pending',
    payment: { provider },
    createdAt: Timestamp.now(),
  };
  await ref.create(order);

  const returnUrl = `${base}/api/payments/${provider}/return/${ref.id}`;
  try {
    const { checkout, ref: paymentRef } = await gateway.initiate(toGatewayOrder(ref.id, order), {
      returnUrl,
      cancelUrl: `${returnUrl}?cancelled=1`,
      websiteUrl: base,
    });
    await ref.update({ payment: paymentRef });
    return { orderId: ref.id, checkout };
  } catch (error) {
    console.error(`[orders] ${provider} initiate failed for ${ref.id}:`, error);
    await ref.update({ status: 'failed', failedAt: Timestamp.now(), failureReason: 'Could not start payment.' });
    fail('payment_unavailable', `Could not reach ${gateway.label}. Please try again or choose another method.`);
  }
}

/**
 * Asks the provider what happened to a pending order and records the answer:
 * paid orders grant access (in one transaction with the order update), and
 * abandoned or cancelled ones are closed. Safe to call any number of times,
 * from any trigger (return redirect, page visit, admin re-check).
 */
export async function settleOrder(
  orderId: OrderId,
  { cancelled = false }: { cancelled?: boolean } = {}
): Promise<{ status: OrderStatus; courseId: CourseId } | null> {
  const ref = orderRef(orderId);
  const snapshot = await ref.get();
  if (!snapshot.exists) return null;
  const order = snapshot.data() as OrderDoc;
  if (order.status !== 'pending') return { status: order.status, courseId: order.courseId };

  const gateway = gatewayFor(order.payment.provider);
  if (!gateway.isConfigured()) return { status: 'pending', courseId: order.courseId };

  let outcome;
  try {
    outcome = await gateway.verify(toGatewayOrder(orderId, order));
  } catch (error) {
    console.error(`[orders] verifying ${orderId} failed:`, error);
    return { status: 'pending', courseId: order.courseId };
  }

  if (outcome.status === 'pending') {
    const stale = Date.now() - order.createdAt.toMillis() > ABANDONED_AFTER_MS;
    if (outcome.started || (!cancelled && !stale)) return { status: 'pending', courseId: order.courseId };
    outcome = { status: 'failed' as const, reason: cancelled ? 'Payment was cancelled.' : 'Payment was not completed.' };
  }

  if (outcome.status === 'failed') {
    const reason = outcome.reason;
    const closed = await adminDb().runTransaction(async (transaction) => {
      const current = (await transaction.get(ref)).data() as OrderDoc;
      if (current.status !== 'pending') return current.status;
      transaction.update(ref, { status: 'failed', failedAt: Timestamp.now(), failureReason: reason });
      return 'failed' as const;
    });
    if (reason.startsWith('Amount mismatch')) console.error(`[orders] ${orderId}: ${reason}`);
    return { status: closed, courseId: order.courseId };
  }

  const paymentRef = outcome.ref;
  const enrollment = enrollmentRef(order.courseId, order.uid);
  const status = await adminDb().runTransaction(async (transaction) => {
    const current = (await transaction.get(ref)).data() as OrderDoc;
    const existing = await transaction.get(enrollment);
    if (current.status !== 'pending') return current.status;

    transaction.update(ref, {
      status: 'paid',
      paidAt: Timestamp.now(),
      payment: { ...current.payment, ...paymentRef },
    });
    activateEnrollment(
      transaction,
      enrollment,
      existing.exists ? (existing.data() as EnrollmentDoc) : null,
      { id: order.courseId, title: order.courseTitle },
      { uid: order.uid, ...order.student },
      { type: 'purchase', orderId }
    );
    return 'paid' as const;
  });
  return { status, courseId: order.courseId };
}

/** The user's pending orders (optionally for one course), oldest first. */
async function pendingOrdersFor(uid: Uid, courseId?: CourseId) {
  let query = adminDb().collection(ORDERS).where('uid', '==', uid).where('status', '==', 'pending');
  if (courseId) query = query.where('courseId', '==', courseId);
  const snapshot = await query.get();
  return snapshot.docs
    .map((doc) => ({ id: doc.id, order: doc.data() as OrderDoc }))
    .sort((a, b) => a.order.createdAt.toMillis() - b.order.createdAt.toMillis());
}

/**
 * Settles the user's pending orders. Covers students who paid but closed the
 * tab before being redirected back. Returns the id of an order that is still
 * awaiting confirmation, if any.
 */
export async function reconcilePendingOrders(uid: Uid, courseId?: CourseId): Promise<OrderId | null> {
  let stillPending: OrderId | null = null;
  for (const { id } of await pendingOrdersFor(uid, courseId)) {
    const result = await settleOrder(id).catch((error) => {
      console.error(`[orders] reconcile ${id} failed:`, error);
      return null;
    });
    if (result?.status === 'pending') stillPending = id;
  }
  return stillPending;
}
