import 'server-only';

import { Timestamp } from 'firebase-admin/firestore';

import { adminDb } from './firebaseAdmin';
import { fail } from './errors';
import { activateEnrollment, enrollmentRef, ENROLLMENTS, hasActiveAccess, toEnrollmentDTO } from './enrollments';
import { ORDERS, toOrderDTO } from './orders';
import { findUser } from './roles';
import { parseEnrollmentId } from '../courses/ids';
import type {
  CatalogCourse,
  CourseId,
  EnrollmentDoc,
  EnrollmentDTO,
  OrderDoc,
  OrderDTO,
  OrderStatus,
  Uid,
} from '../../types/courses';

/*
 * Course administration. Callers must already be verified admins
 * (app/admin/courseActions.ts).
 */

const ORDER_STATUSES: readonly OrderStatus[] = ['pending', 'paid', 'failed', 'refunded'];

export async function recentOrders(status?: OrderStatus, limit = 100): Promise<OrderDTO[]> {
  if (status && !ORDER_STATUSES.includes(status)) fail('invalid', 'Unknown order status.');
  // Filtering by status in Firestore while ordering by date would need a
  // composite index; filter a wider window of recent orders instead.
  const snapshot = await adminDb()
    .collection(ORDERS)
    .orderBy('createdAt', 'desc')
    .limit(status ? limit * 5 : limit)
    .get();
  return snapshot.docs
    .map((doc) => toOrderDTO(doc.id, doc.data() as OrderDoc))
    .filter((order) => !status || order.status === status)
    .slice(0, limit);
}

export async function enrollmentsForCourse(courseId?: CourseId, limit = 200): Promise<EnrollmentDTO[]> {
  const collection = adminDb().collection(ENROLLMENTS);
  const snapshot = courseId
    ? await collection.where('courseId', '==', courseId).get()
    : await collection.orderBy('enrolledAt', 'desc').limit(limit).get();
  return snapshot.docs
    .map((doc) => toEnrollmentDTO(doc.id, doc.data() as EnrollmentDoc))
    .sort((a, b) => b.enrolledAt - a.enrolledAt)
    .slice(0, limit);
}

/** Gives a user access without payment (scholarship, bank transfer, support). */
export async function grantAccess(
  course: CatalogCourse,
  userUidOrEmail: string,
  grantedBy: Uid,
  reason?: string
): Promise<EnrollmentDTO> {
  const user = await findUser(userUidOrEmail.trim());
  if (!user) fail('not_found', 'No account matches that email or id. The student must sign in once first.');

  const ref = enrollmentRef(course.id, user.uid);
  const enrollment = await adminDb().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const existing = snapshot.exists ? (snapshot.data() as EnrollmentDoc) : null;
    const created = activateEnrollment(
      transaction,
      ref,
      existing,
      course,
      { uid: user.uid, name: user.displayName || user.email?.split('@')[0] || 'Student', email: user.email ?? null },
      { type: 'grant', grantedBy, ...(reason?.trim() && { reason: reason.trim().slice(0, 200) }) }
    );
    if (!created) fail('already_enrolled', 'That student already has access to this course.');
    return created;
  });
  return toEnrollmentDTO(ref.id, enrollment);
}

/**
 * Ends a student's access. With `refunded`, the purchase order is marked
 * refunded too; the money itself is returned from the eSewa/Khalti merchant
 * dashboard.
 */
export async function endAccess(
  enrollmentId: string,
  endedBy: Uid,
  { refunded, reason }: { refunded: boolean; reason: string }
): Promise<EnrollmentDTO> {
  const ids = parseEnrollmentId(enrollmentId);
  if (!ids) fail('invalid', 'Invalid enrollment.');
  const ref = enrollmentRef(ids.courseId, ids.uid);
  const db = adminDb();

  const enrollment = await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) fail('not_found', 'Enrollment not found.');
    const current = snapshot.data() as EnrollmentDoc;
    if (!hasActiveAccess(current)) fail('invalid', 'This enrollment is not active.');

    const orderRef = current.source.type === 'purchase' ? db.collection(ORDERS).doc(current.source.orderId) : null;
    const order = orderRef ? await transaction.get(orderRef) : null;
    if (refunded && !order?.exists) fail('invalid', 'Only purchased enrollments can be refunded.');

    const now = Timestamp.now();
    const updates = {
      status: refunded ? ('refunded' as const) : ('revoked' as const),
      endedAt: now,
      endedBy,
      endReason: reason.trim().slice(0, 200) || (refunded ? 'Refunded' : 'Revoked'),
    };
    transaction.update(ref, updates);
    if (refunded && orderRef) transaction.update(orderRef, { status: 'refunded', refundedAt: now });
    return { ...current, ...updates };
  });
  return toEnrollmentDTO(ref.id, enrollment);
}
