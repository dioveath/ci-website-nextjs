import 'server-only';

import { Timestamp, type DocumentReference, type Transaction } from 'firebase-admin/firestore';

import { adminDb } from './firebaseAdmin';
import { fail } from './errors';
import { serialize } from './serialize';
import { enrollmentId } from '../courses/ids';
import { findLesson, isCourseComplete, resumeLessonId, summarizeProgress } from '../courses/progress';
import type {
  CatalogCourse,
  CertificateDoc,
  CertificateId,
  CourseAccess,
  EnrollmentDoc,
  EnrollmentDTO,
  EnrollmentId,
  EnrollmentSource,
  LessonId,
  ProgressSummary,
  Uid,
} from '../../types/courses';

export const ENROLLMENTS = 'enrollments';
export const CERTIFICATES = 'certificates';

export function enrollmentRef(courseId: string, uid: Uid): DocumentReference<EnrollmentDoc> {
  return adminDb()
    .collection(ENROLLMENTS)
    .doc(enrollmentId(courseId, uid)) as DocumentReference<EnrollmentDoc>;
}

export function hasActiveAccess(enrollment: EnrollmentDoc | null | undefined, now = Date.now()): boolean {
  if (!enrollment || enrollment.status !== 'active') return false;
  return !enrollment.expiresAt || enrollment.expiresAt.toMillis() > now;
}

export function toEnrollmentDTO(id: string, enrollment: EnrollmentDoc): EnrollmentDTO {
  return serialize(id as EnrollmentId, enrollment);
}

export async function getEnrollment(courseId: string, uid: Uid): Promise<EnrollmentDoc | null> {
  const snapshot = await enrollmentRef(courseId, uid).get();
  return snapshot.exists ? (snapshot.data() as EnrollmentDoc) : null;
}

export function describeAccess(
  course: CatalogCourse,
  enrollment: EnrollmentDoc | null,
  uid: Uid | null,
  pendingOrderId: string | null = null
): CourseAccess {
  if (!enrollment || !uid) {
    return { enrollment: null, pendingOrderId, hasAccess: false, progress: null, resumeLessonId: null };
  }
  const access = hasActiveAccess(enrollment);
  return {
    enrollment: toEnrollmentDTO(enrollmentId(course.id, uid), enrollment),
    pendingOrderId: access ? null : pendingOrderId,
    hasAccess: access,
    progress: summarizeProgress(course, enrollment.progress),
    resumeLessonId: access ? resumeLessonId(course, enrollment.progress, enrollment.lastLessonId) : null,
  };
}

export interface Student {
  uid: Uid;
  name: string;
  email: string | null;
}

/**
 * Gives `student` active access to `course` inside `transaction`. An ended
 * enrollment (refunded/revoked) is reactivated with its progress kept.
 * Returns false, changing nothing, when access is already active.
 *
 * Must be called after every read in the transaction (Firestore requires all
 * reads before writes); pass the snapshot read by the caller.
 */
export function activateEnrollment(
  transaction: Transaction,
  ref: DocumentReference<EnrollmentDoc>,
  existing: EnrollmentDoc | null,
  course: Pick<CatalogCourse, 'id' | 'title'>,
  student: Student,
  source: EnrollmentSource
): EnrollmentDoc | false {
  if (hasActiveAccess(existing)) return false;

  const now = Timestamp.now();
  const enrollment: EnrollmentDoc = {
    uid: student.uid,
    courseId: course.id,
    courseTitle: course.title,
    student: { name: student.name, email: student.email },
    source,
    status: 'active',
    enrolledAt: now,
    progress: existing?.progress ?? {},
    ...(existing?.lastLessonId && { lastLessonId: existing.lastLessonId }),
    ...(existing?.completedAt && { completedAt: existing.completedAt }),
    ...(existing?.certificateId && { certificateId: existing.certificateId }),
  };
  // set() replaces the document, which also clears endedAt/endReason.
  transaction.set(ref, enrollment);
  return enrollment;
}

/** Enrolls in a free course. Idempotent: an active enrollment is returned as is. */
export async function enrollInFreeCourse(course: CatalogCourse, student: Student): Promise<EnrollmentDTO> {
  if (course.price) fail('payment_required', 'This course has to be purchased.');
  if (!course.listed) fail('not_found', 'This course is no longer available.');

  const ref = enrollmentRef(course.id, student.uid);
  const enrollment = await adminDb().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const existing = snapshot.exists ? (snapshot.data() as EnrollmentDoc) : null;
    return activateEnrollment(transaction, ref, existing, course, student, { type: 'free' }) || existing!;
  });
  return toEnrollmentDTO(ref.id, enrollment);
}

export interface CompletionResult {
  progress: ProgressSummary;
  /** Set once every lesson is done; the certificate is issued exactly once. */
  certificateId: CertificateId | null;
}

/**
 * Marks a lesson complete for an enrolled student and, when it was the last
 * one, issues the course certificate in the same transaction.
 */
export async function completeLesson(
  course: CatalogCourse,
  student: Student,
  lessonId: LessonId
): Promise<CompletionResult> {
  if (!findLesson(course, lessonId)) fail('not_found', 'This lesson does not exist.');

  const db = adminDb();
  const ref = enrollmentRef(course.id, student.uid);

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const enrollment = snapshot.exists ? (snapshot.data() as EnrollmentDoc) : null;
    if (!hasActiveAccess(enrollment)) fail('not_enrolled', 'Enroll in this course to track your progress.');

    const now = Timestamp.now();
    const progress = { ...enrollment!.progress };
    if (!progress[lessonId]) progress[lessonId] = { completedAt: now };

    const updates: Partial<EnrollmentDoc> = { lastLessonId: lessonId };
    if (!enrollment!.progress[lessonId]) {
      (updates as Record<string, unknown>)[`progress.${lessonId}`] = { completedAt: now };
    }

    let certificateId = enrollment!.certificateId ?? null;
    if (!certificateId && isCourseComplete(course, progress)) {
      const certificateRef = db.collection(CERTIFICATES).doc();
      const certificate: CertificateDoc = {
        uid: student.uid,
        courseId: course.id,
        studentName: student.name,
        courseTitle: course.title,
        issuedAt: now,
      };
      transaction.create(certificateRef, certificate);
      certificateId = certificateRef.id;
      updates.certificateId = certificateId;
      updates.completedAt = now;
    }

    transaction.update(ref, updates as Record<string, unknown>);
    return { progress: summarizeProgress(course, progress), certificateId };
  });
}

/** Remembers the last lesson opened, for "Continue". Best effort. */
export async function rememberLesson(courseId: string, uid: Uid, lessonId: LessonId): Promise<void> {
  await enrollmentRef(courseId, uid)
    .update({ lastLessonId: lessonId })
    .catch((error) => console.warn('[enrollments] could not record last lesson:', error));
}

/** The caller's enrollments, newest first. */
export async function listEnrollmentsFor(uid: Uid): Promise<Array<{ id: string; enrollment: EnrollmentDoc }>> {
  const snapshot = await adminDb().collection(ENROLLMENTS).where('uid', '==', uid).get();
  return snapshot.docs
    .map((doc) => ({ id: doc.id, enrollment: doc.data() as EnrollmentDoc }))
    .sort((a, b) => b.enrollment.enrolledAt.toMillis() - a.enrollment.enrolledAt.toMillis());
}
