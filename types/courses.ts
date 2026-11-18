/*
 * Course system types: digital, self-paced courses sold through eSewa and
 * Khalti. See COURSES.md for how the pieces fit together.
 *
 *   Sanity (public dataset)   the catalog: courses, sections, lesson outlines
 *   Sanity (private dataset)  paid lesson bodies, read only by the server
 *   Firestore                 orders, enrollments (access + progress), certificates
 *
 * `*Doc` types are what is stored in Firestore and only ever touch the server.
 * `*DTO` types are what a server action hands to the browser: Timestamps are
 * converted to epoch milliseconds because class instances cannot cross the
 * server/client boundary.
 */
import type { PortableTextBlock } from '@portabletext/types';

/* ------------------------------------------------------------ primitives -- */

export type Uid = string;
/** Sanity `courseId`. Lowercase letters, digits and dashes; never changes once sold. */
export type CourseId = string;
/** Sanity `lessonId` slug, unique within its course; never changes once sold. */
export type LessonId = string;
export type OrderId = string;
/** `${courseId}_${uid}`: one enrollment per student per course. */
export type EnrollmentId = `${CourseId}_${Uid}`;
export type CertificateId = string;
export type EpochMs = number;

/** Satisfied by both the browser SDK's and the Admin SDK's Timestamp. */
export interface FirestoreTime {
  toMillis(): number;
}

/* ----------------------------------------------------------------- roles -- */

export type GlobalRole = 'admin';
/** Custom claims on the Firebase ID token. A missing key means "not granted". */
export type RoleClaims = Partial<Record<GlobalRole, true>>;
export interface RoleFlags {
  isAdmin: boolean;
}

/* ----------------------------------------------------- catalog (public) -- */

/** Matches the values stored in Sanity. */
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advance';
export const COURSE_LEVELS: readonly CourseLevel[] = ['Beginner', 'Intermediate', 'Advance'];

export type LessonType = 'video' | 'article';

export interface Money {
  /** Smallest unit (paisa), so there is never a rounding error. */
  amount: number;
  /** ISO 4217. Only NPR is sold today. */
  currency: 'NPR';
}

/**
 * Where a video lesson's video lives. A Cloudflare Stream uid is useless
 * without a signed token once the video requires signed URLs, so it can sit in
 * the public dataset.
 */
export type VideoSource =
  | { provider: 'placeholder' }
  | { provider: 'cloudflare'; videoUid: string };

export interface LessonSummary {
  id: LessonId;
  title: string;
  type: LessonType;
  durationSec: number | null;
  /** Free to open without buying the course. */
  isPreview: boolean;
  /** Video lessons only. */
  video: VideoSource | null;
}

export interface CourseSection {
  key: string;
  title: string;
  lessons: LessonSummary[];
}

export interface CatalogCourse {
  id: CourseId;
  slug: string | null;
  title: string;
  level: CourseLevel;
  coverImg: string;
  description: string | null;
  sections: CourseSection[];
  totalLessons: number;
  totalDurationSec: number;
  /** null = free. */
  price: Money | null;
  prerequisiteIds: CourseId[];
  /** false = hidden from /courses but still open to enrolled students. */
  listed: boolean;
}

/* ------------------------------- paid content (private dataset, server) -- */

export interface VideoPlayback {
  url: string;
  /** null when the URL does not expire (the placeholder). */
  expiresAt: EpochMs | null;
  isPlaceholder: boolean;
}

export type LessonContent =
  | { id: LessonId; type: 'video'; playback: VideoPlayback; notes: PortableTextBlock[] | null }
  | { id: LessonId; type: 'article'; body: PortableTextBlock[] | null };

/* -------------------------------------------------------------- payments -- */

export type PaymentProvider = 'esewa' | 'khalti';
export const PAYMENT_PROVIDERS: readonly PaymentProvider[] = ['khalti', 'esewa'];

/**
 * What each provider hands back. Our order id is sent as eSewa's
 * `transaction_uuid` and Khalti's `purchase_order_id`.
 */
export type ProviderRef =
  | { provider: 'esewa'; transactionCode?: string }
  | { provider: 'khalti'; pidx?: string; transactionId?: string };

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded';

/** orders/{orderId}. Created and changed only by the server. */
export interface OrderDoc {
  uid: Uid;
  courseId: CourseId;
  courseTitle: string;
  /** Copied onto the enrollment when the payment is confirmed. */
  student: { name: string; email: string | null };
  /** Read from Sanity by the server at checkout, never sent by the browser. */
  amount: Money;
  status: OrderStatus;
  payment: ProviderRef;
  createdAt: FirestoreTime;
  paidAt?: FirestoreTime;
  failedAt?: FirestoreTime;
  failureReason?: string;
  refundedAt?: FirestoreTime;
}

/** How the browser gets to the provider's payment page. */
export type CheckoutRedirect =
  | { kind: 'redirect'; url: string }
  | { kind: 'form-post'; url: string; fields: Record<string, string> };

/**
 * A provider's answer about one order. `pending` with `started: false` means
 * the student never got as far as paying (still on the provider's page, or
 * walked away); it becomes a failure once they cancel or the order goes stale.
 */
export type VerifiedPayment =
  | { status: 'paid'; ref: ProviderRef }
  | { status: 'pending'; started: boolean }
  | { status: 'failed'; reason: string };

export interface PaymentOption {
  provider: PaymentProvider;
  label: string;
}

/* ----------------------------------------------------------- enrollments -- */

export type EnrollmentStatus = 'active' | 'refunded' | 'revoked';

export type EnrollmentSource =
  | { type: 'purchase'; orderId: OrderId }
  | { type: 'free' }
  | { type: 'grant'; grantedBy: Uid; reason?: string };

export interface LessonProgress {
  completedAt: FirestoreTime;
}

/** enrollments/{courseId}_{uid}. An `active` one opens every lesson of the course. */
export interface EnrollmentDoc {
  uid: Uid;
  courseId: CourseId;
  /** Copied at enrollment so lists render without a Sanity round trip. */
  courseTitle: string;
  student: { name: string; email: string | null };
  source: EnrollmentSource;
  status: EnrollmentStatus;
  enrolledAt: FirestoreTime;
  /** Absent = lifetime access. */
  expiresAt?: FirestoreTime;
  progress: Partial<Record<LessonId, LessonProgress>>;
  lastLessonId?: LessonId;
  completedAt?: FirestoreTime;
  certificateId?: CertificateId;
  endedAt?: FirestoreTime;
  endedBy?: Uid;
  endReason?: string;
}

/** certificates/{certificateId}. Public, so a certificate link can be verified by anyone. */
export interface CertificateDoc {
  uid: Uid;
  courseId: CourseId;
  studentName: string;
  courseTitle: string;
  issuedAt: FirestoreTime;
}

/* ------------------------------------------------- serialised for clients -- */

export type Serialized<T> = {
  [K in keyof T]: T[K] extends FirestoreTime
    ? EpochMs
    : T[K] extends FirestoreTime | undefined
      ? EpochMs | undefined
      : T[K] extends Partial<Record<string, LessonProgress>>
        ? Partial<Record<string, { completedAt: EpochMs }>>
        : T[K];
};

export type OrderDTO = Serialized<OrderDoc> & { id: OrderId };
export type EnrollmentDTO = Serialized<EnrollmentDoc> & { id: EnrollmentId };
export type CertificateDTO = Serialized<CertificateDoc> & { id: CertificateId };

export interface ProgressSummary {
  completed: number;
  total: number;
  /** 0-100, rounded down so 100 means every lesson is done. */
  percent: number;
}

/** Course page: what the current visitor can do. */
export interface CourseAccess {
  enrollment: EnrollmentDTO | null;
  /** A checkout the provider has not confirmed yet ("we are confirming your payment"). */
  pendingOrderId: OrderId | null;
  hasAccess: boolean;
  progress: ProgressSummary | null;
  /** First lesson not yet completed, for "Continue". */
  resumeLessonId: LessonId | null;
}

/** Dashboard: "My courses". */
export interface MyCourseView {
  /** null when the course was removed from Sanity. */
  course: CatalogCourse | null;
  enrollment: EnrollmentDTO;
  progress: ProgressSummary;
  resumeLessonId: LessonId | null;
}

/* ---------------------------------------------------------------- admin -- */

export interface AdminUserRow {
  uid: Uid;
  name: string;
  email: string | null;
  photoURL: string | null;
  isAdmin: boolean;
  createdAt: EpochMs | null;
}

/* -------------------------------------------------------- server actions -- */

export type ActionError =
  | 'unauthenticated'
  | 'forbidden'
  | 'not_found'
  | 'invalid'
  | 'not_enrolled'
  | 'already_enrolled'
  | 'payment_required'
  | 'payment_unavailable'
  | 'payment_failed'
  | 'unavailable'
  | 'internal';

/**
 * Server actions return this instead of throwing: in production Next.js hides
 * thrown messages, so the UI could not tell "already enrolled" from "forbidden".
 */
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: ActionError; message: string };
