import { NextResponse, type NextRequest } from 'next/server';

import { isOrderId, settleOrder } from '../../../../../../lib/server/orders';
import { isPaymentProvider } from '../../../../../../lib/server/payments';
import { siteUrl } from '../../../../../../lib/server/payments/config';

/*
 * Where eSewa and Khalti send the student after checkout:
 *   /api/payments/<provider>/return/<orderId>[?cancelled=1]
 *
 * The query parameters the providers append (eSewa's `data`, Khalti's
 * `status`, `pidx`, ...) are ignored on purpose: anyone can forge them. The
 * order is settled by asking the provider directly (settleOrder), so this
 * route is safe to hit any number of times, by anyone.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string; orderId: string }> }
) {
  const { provider, orderId } = await params;
  const base = siteUrl() ?? request.nextUrl.origin;

  if (!isPaymentProvider(provider) || !isOrderId(orderId)) {
    return NextResponse.redirect(new URL('/courses', base));
  }

  let outcome: 'success' | 'pending' | 'failed' = 'pending';
  let courseId: string | null = null;
  try {
    const result = await settleOrder(orderId, { cancelled: request.nextUrl.searchParams.has('cancelled') });
    if (!result) return NextResponse.redirect(new URL('/courses', base));
    courseId = result.courseId;
    outcome = result.status === 'paid' ? 'success' : result.status === 'pending' ? 'pending' : 'failed';
  } catch (error) {
    // Leave the order pending; the course page re-checks it on every visit.
    console.error(`[payments] settling ${orderId} on return failed:`, error);
  }

  const target = courseId ? `/courses/${courseId}?payment=${outcome}` : '/dashboard';
  return NextResponse.redirect(new URL(target, base), { status: 303 });
}
