'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import useAuth from '../../lib/hooks/Auth';
import queryClient from '../../lib/queryclient';
import { enrollFree, startCheckout } from '../../app/courses/actions';
import { errorMessage, unwrap } from '../../lib/actions/result';
import { followCheckout } from '../../lib/actions/checkout';
import { formatMoney } from '../../lib/courses/format';
import { allLessons, findLesson } from '../../lib/courses/progress';
import { useCourseAccess } from './useCourseAccess';
import ProgressBar from './ProgressBar';
import type { CatalogCourse, CourseAccess, PaymentOption, PaymentProvider } from '../../types/courses';

const buttonClass =
  'w-full text-center text-white text-lg py-3 rounded-lg shadow-md transition-colors bg-eggblue hover:bg-greenpea disabled:bg-riverbed disabled:animate-pulse';

const PAYMENT_MESSAGES = {
  success: { tone: 'bg-greenpea', text: 'Payment received. Welcome to the course!' },
  pending: { tone: 'bg-riverbed', text: 'We are confirming your payment. This page updates on its own.' },
  failed: { tone: 'bg-red-900', text: 'The payment did not go through. You have not been charged; please try again.' },
} as const;

/**
 * After a provider redirects back (?payment=...), the live access state is
 * the truth: say nothing until it has loaded, then report what it shows.
 */
function paymentBanner(param: string | null, access: CourseAccess | null) {
  if (access?.pendingOrderId) return PAYMENT_MESSAGES.pending;
  if (!param || !access) return null;
  if (access.hasAccess) return param === 'failed' ? null : PAYMENT_MESSAGES.success;
  return PAYMENT_MESSAGES.failed;
}

/** The enroll / buy / continue box on a course page. */
export default function CourseActions({
  course,
  paymentOptions,
}: {
  course: CatalogCourse;
  paymentOptions: PaymentOption[];
}) {
  const { getIdToken, loginWithGoogle, fetching } = useAuth();
  const { access, signedIn, loading, error } = useCourseAccess(course.id);
  const paymentParam = useSearchParams().get('payment');

  const enroll = useMutation({
    mutationFn: async () => unwrap(await enrollFree((await getIdToken()) ?? '', { courseId: course.id })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['course_access', course.id] }),
  });

  const checkout = useMutation({
    mutationFn: async (provider: PaymentProvider) =>
      unwrap(await startCheckout((await getIdToken()) ?? '', { courseId: course.id, provider })),
    onSuccess: ({ checkout: redirect }) => followCheckout(redirect),
  });

  const firstLesson = allLessons(course)[0];
  const resume = access?.resumeLessonId ? findLesson(course, access.resumeLessonId)?.lesson : null;

  const banner = paymentBanner(paymentParam, access);

  let body: React.ReactNode;
  if (loading) {
    body = <button type="button" disabled className={buttonClass}>Loading…</button>;
  } else if (access?.hasAccess) {
    const started = (access.progress?.completed ?? 0) > 0;
    const target = resume ?? firstLesson;
    body = (
      <>
        {access.progress && <ProgressBar progress={access.progress} />}
        {access.enrollment?.certificateId && (
          <Link href={`/certificates/${access.enrollment.certificateId}`} className="text-cheeseyellow hover:underline">
            View your certificate
          </Link>
        )}
        {target ? (
          <Link href={`/courses/${course.id}/learn/${target.id}`} className={buttonClass}>
            {started ? `Continue: ${target.title}` : 'Start the course'}
          </Link>
        ) : (
          <p className="text-gray-300">Lessons are being prepared.</p>
        )}
      </>
    );
  } else if (!signedIn) {
    body = (
      <button type="button" className={buttonClass} disabled={fetching} onClick={() => loginWithGoogle()}>
        Sign in to enroll
      </button>
    );
  } else if (!course.price) {
    body = (
      <button type="button" className={buttonClass} disabled={enroll.isPending} onClick={() => enroll.mutate()}>
        {enroll.isPending ? 'Enrolling…' : 'Enroll for free'}
      </button>
    );
  } else if (access?.pendingOrderId) {
    body = <button type="button" disabled className={buttonClass}>Confirming payment…</button>;
  } else if (paymentOptions.length === 0) {
    body = <p className="text-gray-200">Online payment is not available right now. Please contact us to enroll.</p>;
  } else {
    const busy = checkout.isPending || checkout.isSuccess;
    body = (
      <div className="flex flex-col gap-2">
        {paymentOptions.map((option) => (
          <button
            key={option.provider}
            type="button"
            className={buttonClass}
            disabled={busy}
            onClick={() => checkout.mutate(option.provider)}
          >
            {busy && checkout.variables === option.provider ? `Opening ${option.label}…` : `Pay with ${option.label}`}
          </button>
        ))}
      </div>
    );
  }

  const ended = access?.enrollment && !access.hasAccess;
  const actionError = enroll.error ?? checkout.error ?? error;

  return (
    <section className="rounded-lg bg-timbergreen/60 p-5 flex flex-col gap-4 text-white">
      {banner && <p className={`rounded-md p-3 text-sm ${banner.tone}`} role="status">{banner.text}</p>}
      <p className="text-3xl font-bold">{formatMoney(course.price)}</p>
      {ended && (
        <p className="text-sm text-cheeseyellow">
          Your access to this course has ended. Contact us if you think this is a mistake.
        </p>
      )}
      {body}
      {actionError && <p className="text-sm text-red-300">{errorMessage(actionError)}</p>}
      <p className="text-sm text-gray-300">
        {course.totalLessons} lessons · self-paced · lifetime access
      </p>
    </section>
  );
}
