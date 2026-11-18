'use server';

import { requireAdmin } from '../../lib/server/authz';
import { fail, runAction } from '../../lib/server/actions';
import { allCourses, requireCourse } from '../../lib/server/catalog';
import { endAccess, enrollmentsForCourse, grantAccess, recentOrders } from '../../lib/server/courseAdmin';
import { isOrderId, settleOrder } from '../../lib/server/orders';
import { isCourseId } from '../../lib/courses/ids';
import type {
  ActionResult,
  CourseId,
  EnrollmentDTO,
  OrderDTO,
  OrderStatus,
} from '../../types/courses';

/*
 * Admin panel "Manage Courses". Every action re-checks the caller's admin
 * claim (with revocation).
 */

export async function listCatalog(idToken: string): Promise<ActionResult<Array<{ id: CourseId; title: string; listed: boolean }>>> {
  return runAction('listCatalog', async () => {
    await requireAdmin(idToken);
    return (await allCourses()).map(({ id, title, listed }) => ({ id, title, listed }));
  });
}

export async function listOrders(idToken: string, input: { status?: OrderStatus } = {}): Promise<ActionResult<OrderDTO[]>> {
  return runAction('listOrders', async () => {
    await requireAdmin(idToken);
    return recentOrders(input.status || undefined);
  });
}

export async function listEnrollments(
  idToken: string,
  input: { courseId?: CourseId } = {}
): Promise<ActionResult<EnrollmentDTO[]>> {
  return runAction('listEnrollments', async () => {
    await requireAdmin(idToken);
    if (input.courseId && !isCourseId(input.courseId)) fail('invalid', 'Invalid course.');
    return enrollmentsForCourse(input.courseId || undefined);
  });
}

export async function grantCourseAccess(
  idToken: string,
  input: { courseId: CourseId; user: string; reason?: string }
): Promise<ActionResult<EnrollmentDTO>> {
  return runAction('grantCourseAccess', async () => {
    const admin = await requireAdmin(idToken);
    if (typeof input?.user !== 'string' || !input.user.trim()) fail('invalid', 'Enter the student\'s email.');
    const course = await requireCourse(input.courseId);
    return grantAccess(course, input.user, admin.uid, input.reason);
  });
}

export async function endCourseAccess(
  idToken: string,
  input: { enrollmentId: string; refunded: boolean; reason: string }
): Promise<ActionResult<EnrollmentDTO>> {
  return runAction('endCourseAccess', async () => {
    const admin = await requireAdmin(idToken);
    if (typeof input?.reason !== 'string' || typeof input.refunded !== 'boolean') fail('invalid', 'Invalid request.');
    return endAccess(input.enrollmentId, admin.uid, input);
  });
}

/** Asks the provider again about a pending order. */
export async function recheckOrder(idToken: string, input: { orderId: string }): Promise<ActionResult<OrderStatus>> {
  return runAction('recheckOrder', async () => {
    await requireAdmin(idToken);
    if (!isOrderId(input?.orderId)) fail('invalid', 'Invalid order.');
    const result = await settleOrder(input.orderId);
    if (!result) fail('not_found', 'Order not found.');
    return result.status;
  });
}
