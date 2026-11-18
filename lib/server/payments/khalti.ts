import 'server-only';

import { paymentsEnv } from './config';
import type { GatewayOrder, PaymentGateway } from './gateway';
import type { VerifiedPayment } from '../../../types/courses';

/*
 * Khalti ePayment (KPG-2).
 *
 * The server asks Khalti for a payment page (initiate) and redirects the
 * student to it. Khalti sends them back to return_url with query parameters
 * that are NOT trusted: the order is settled only by the server-side lookup
 * of the pidx stored at initiation.
 *
 *   KHALTI_SECRET_KEY   live key from admin.khalti.com, or the sandbox key
 *                       from test-admin.khalti.com when PAYMENTS_ENV=sandbox
 *   KHALTI_API_URL      optional base URL override
 */

const API = {
  sandbox: 'https://dev.khalti.com/api/v2/',
  live: 'https://khalti.com/api/v2/',
} as const;

function secretKey(): string | null {
  return process.env.KHALTI_SECRET_KEY?.trim() || null;
}

function apiUrl(path: string): string {
  return new URL(path, process.env.KHALTI_API_URL?.trim() || API[paymentsEnv()]).toString();
}

async function khaltiPost(path: string, body: unknown): Promise<{ status: number; json: Record<string, unknown> }> {
  const response = await fetch(apiUrl(path), {
    method: 'POST',
    headers: { Authorization: `Key ${secretKey()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  });
  const json = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  return { status: response.status, json };
}

/** Maps a lookup answer to our outcome. Only "Completed" for the right amount is paid. */
export function interpretKhaltiLookup(body: Record<string, unknown>, expectedPaisa: number): VerifiedPayment {
  const status = typeof body.status === 'string' ? body.status : '';
  switch (status) {
    case 'Completed': {
      if (body.total_amount !== undefined && Number(body.total_amount) !== expectedPaisa) {
        return { status: 'failed', reason: `Amount mismatch: paid ${body.total_amount}, expected ${expectedPaisa}` };
      }
      const transactionId = typeof body.transaction_id === 'string' ? body.transaction_id : undefined;
      const pidx = typeof body.pidx === 'string' ? body.pidx : undefined;
      return { status: 'paid', ref: { provider: 'khalti', pidx, ...(transactionId && { transactionId }) } };
    }
    case 'Initiated':
      return { status: 'pending', started: false };
    case 'Pending':
      return { status: 'pending', started: true };
    case 'Expired':
      return { status: 'failed', reason: 'The payment link expired.' };
    case 'User canceled':
      return { status: 'failed', reason: 'Payment was cancelled.' };
    case 'Refunded':
    case 'Partially Refunded':
      return { status: 'failed', reason: 'Payment was refunded.' };
    default:
      return { status: 'pending', started: true };
  }
}

export const khaltiGateway: PaymentGateway = {
  provider: 'khalti',
  label: 'Khalti',

  isConfigured: () => secretKey() !== null,

  async initiate(order: GatewayOrder, urls) {
    if (!secretKey()) throw new Error('Khalti is not configured');
    const { status, json } = await khaltiPost('epayment/initiate/', {
      return_url: urls.returnUrl,
      website_url: urls.websiteUrl,
      amount: order.amount.amount,
      purchase_order_id: order.id,
      purchase_order_name: order.courseTitle.slice(0, 100),
      customer_info: {
        name: order.student.name,
        ...(order.student.email && { email: order.student.email }),
      },
    });
    if (status !== 200 || typeof json.pidx !== 'string' || typeof json.payment_url !== 'string') {
      throw new Error(`Khalti initiate failed (HTTP ${status}): ${JSON.stringify(json)}`);
    }
    return {
      checkout: { kind: 'redirect', url: json.payment_url },
      ref: { provider: 'khalti', pidx: json.pidx },
    };
  },

  async verify(order: GatewayOrder) {
    if (!secretKey()) throw new Error('Khalti is not configured');
    const pidx = order.payment.provider === 'khalti' ? order.payment.pidx : undefined;
    // Initiation never succeeded, so there is nothing to pay.
    if (!pidx) return { status: 'failed', reason: 'Payment was never started.' };

    const { status, json } = await khaltiPost('epayment/lookup/', { pidx });
    // Expired and cancelled payments come back as HTTP 400 with a status.
    if (status === 200 || (status === 400 && typeof json.status === 'string')) {
      return interpretKhaltiLookup(json, order.amount.amount);
    }
    console.warn(`[khalti] lookup for ${order.id} returned HTTP ${status}`);
    return { status: 'pending', started: true };
  },
};
