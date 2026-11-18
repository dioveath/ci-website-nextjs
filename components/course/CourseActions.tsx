'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import useAuth from '@/lib/auth';
import queryClient from '@/lib/queryClient';
import { enrollFree, startCheckout } from '@/app/courses/actions';
import { errorMessage, unwrap } from '@/lib/actions/result';
import { followCheckout } from '@/lib/actions/checkout';
import { formatMoney } from '@/lib/courses/format';
import { allLessons, findLesson } from '@/lib/courses/progress';
import { cn } from '@/lib/utils';
import { useCourseAccess } from '@/components/course/useCourseAccess';
import ProgressBar from '@/components/course/ProgressBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { CatalogCourse, CourseAccess, PaymentOption, PaymentProvider } from '@/types/courses';

type BannerKind = 'success' | 'pending' | 'failed';

const PAYMENT_MESSAGES: Record<BannerKind, string> = {
  success: 'Payment received. Welcome to the course!',
  pending: 'We are confirming your payment. This page updates on its own.',
  failed: 'The payment did not go through. You have not been charged; please try again.',
};

/**
 * After a provider redirects back (?payment=...), the live access state is
 * the truth: say nothing until it has loaded, then report what it shows.
 */
function paymentBanner(param: string | null, access: CourseAccess | null): BannerKind | null {
  if (access?.pendingOrderId) return 'pending';
  if (!param || !access) return null;
  if (access.hasAccess) return param === 'failed' ? null : 'success';
  return 'failed';
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
    body = <Button size="xl" className="w-full" disabled>Loading…</Button>;
  } else if (access?.hasAccess) {
    const started = (access.progress?.completed ?? 0) > 0;
    const target = resume ?? firstLesson;
    body = (
      <>
        {access.progress ? <ProgressBar progress={access.progress} /> : null}
        {access.enrollment?.certificateId ? (
          <Link
            href={`/certificates/${access.enrollment.certificateId}`}
            className="text-primary underline-offset-4 hover:underline"
          >
            View your certificate
          </Link>
        ) : null}
        {target ? (
          <Button asChild size="xl" className="w-full">
            <Link href={`/courses/${course.id}/learn/${target.id}`}>
              {started ? `Continue: ${target.title}` : 'Start the course'}
            </Link>
          </Button>
        ) : (
          <p className="text-muted-foreground">Lessons are being prepared.</p>
        )}
      </>
    );
  } else if (!signedIn) {
    body = (
      <Button size="xl" className="w-full" disabled={fetching} onClick={() => loginWithGoogle()}>
        Sign in to enroll
      </Button>
    );
  } else if (!course.price) {
    body = (
      <Button size="xl" className="w-full" disabled={enroll.isPending} onClick={() => enroll.mutate()}>
        {enroll.isPending ? 'Enrolling…' : 'Enroll for free'}
      </Button>
    );
  } else if (access?.pendingOrderId) {
    body = <Button size="xl" className="w-full" disabled>Confirming payment…</Button>;
  } else if (paymentOptions.length === 0) {
    body = <p className="text-muted-foreground">Online payment is not available right now. Please contact us to enroll.</p>;
  } else {
    const busy = checkout.isPending || checkout.isSuccess;
    body = (
      <div className="flex flex-col gap-2">
        {paymentOptions.map((option) => (
          <Button
            key={option.provider}
            size="xl"
            className="w-full"
            disabled={busy}
            onClick={() => checkout.mutate(option.provider)}
          >
            {busy && checkout.variables === option.provider ? `Opening ${option.label}…` : `Pay with ${option.label}`}
          </Button>
        ))}
      </div>
    );
  }

  const ended = access?.enrollment && !access.hasAccess;
  const actionError = enroll.error ?? checkout.error ?? error;

  return (
    <Card>
      <CardContent>
        <section className="flex flex-col gap-4" aria-label="Enrollment">
          {banner ? (
            <p
              role="status"
              className={cn(
                'rounded-md p-3 text-sm',
                banner === 'success' && 'bg-primary text-primary-foreground',
                banner === 'pending' && 'bg-muted text-foreground',
                banner === 'failed' && 'bg-destructive text-destructive-foreground'
              )}
            >
              {PAYMENT_MESSAGES[banner]}
            </p>
          ) : null}
          <p className="text-3xl font-semibold text-card-foreground">{formatMoney(course.price)}</p>
          {ended ? (
            <p className="text-sm text-destructive">
              Your access to this course has ended. Contact us if you think this is a mistake.
            </p>
          ) : null}
          {body}
          {actionError ? <p className="text-sm text-destructive">{errorMessage(actionError)}</p> : null}
          <p className="text-sm text-muted-foreground">
            {course.totalLessons} lessons · self-paced · lifetime access
          </p>
        </section>
      </CardContent>
    </Card>
  );
}
