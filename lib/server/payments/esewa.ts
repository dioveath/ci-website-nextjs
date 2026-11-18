import 'server-only';

import { createHmac } from 'node:crypto';

import { paymentsEnv } from './config';
import { toRupeeString } from '../../courses/format';
import type { PaymentGateway, GatewayOrder } from './gateway';
import type { VerifiedPayment } from '../../../types/courses';

/*
 * eSewa ePay v2.
 *
 * Checkout is a signed HTML form POSTed by the browser to eSewa. eSewa then
 * redirects to success_url (with a base64 `data` parameter) or failure_url.
 * Neither redirect is trusted: payment is confirmed only by the server-side
 * status check, which is given OUR stored amount, so a COMPLETE answer also
 * proves the amount.
 *
 *   ESEWA_PRODUCT_CODE   merchant code (sandbox default: EPAYTEST)
 *   ESEWA_SECRET_KEY     merchant secret (sandbox default: eSewa's public test key)
 *   ESEWA_FORM_URL / ESEWA_STATUS_URL  optional endpoint overrides
 */

// eSewa's published test merchant. Only ever used in sandbox mode.
const SANDBOX_PRODUCT_CODE = 'EPAYTEST';
const SANDBOX_SECRET_KEY = '8gBm/:&EnhH.1/q';

const ENDPOINTS = {
  sandbox: {
    form: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
    status: 'https://rc.esewa.com.np/api/epay/transaction/status/',
  },
  live: {
    form: 'https://epay.esewa.com.np/api/epay/main/v2/form',
    status: 'https://epay.esewa.com.np/api/epay/transaction/status/',
  },
} as const;

const SIGNED_FIELDS = 'total_amount,transaction_uuid,product_code';

function credentials(): { productCode: string; secretKey: string } | null {
  const productCode = process.env.ESEWA_PRODUCT_CODE?.trim();
  const secretKey = process.env.ESEWA_SECRET_KEY?.trim();
  if (productCode && secretKey) return { productCode, secretKey };
  if (paymentsEnv() === 'sandbox') return { productCode: SANDBOX_PRODUCT_CODE, secretKey: SANDBOX_SECRET_KEY };
  return null;
}

function endpoints() {
  const defaults = ENDPOINTS[paymentsEnv()];
  return {
    form: process.env.ESEWA_FORM_URL?.trim() || defaults.form,
    status: process.env.ESEWA_STATUS_URL?.trim() || defaults.status,
  };
}

/** HMAC-SHA256, base64, over "total_amount=…,transaction_uuid=…,product_code=…". */
export function esewaSignature(
  fields: { total_amount: string; transaction_uuid: string; product_code: string },
  secretKey: string
): string {
  const message = `total_amount=${fields.total_amount},transaction_uuid=${fields.transaction_uuid},product_code=${fields.product_code}`;
  return createHmac('sha256', secretKey).update(message).digest('base64');
}

interface StatusResponse {
  status?: string;
  ref_id?: string | null;
  total_amount?: number | string;
  transaction_uuid?: string;
}

/** Maps a status-check answer to our outcome. Only COMPLETE for the right amount is paid. */
export function interpretEsewaStatus(body: StatusResponse, expectedTotal: string): VerifiedPayment {
  switch (body.status) {
    case 'COMPLETE':
      if (body.total_amount !== undefined && Number(body.total_amount) !== Number(expectedTotal)) {
        return { status: 'failed', reason: `Amount mismatch: paid ${body.total_amount}, expected ${expectedTotal}` };
      }
      return { status: 'paid', ref: { provider: 'esewa', ...(body.ref_id ? { transactionCode: body.ref_id } : {}) } };
    case 'PENDING':
    case 'AMBIGUOUS':
      return { status: 'pending', started: true };
    case 'NOT_FOUND':
      // No payment for this order (yet): the student may still be on eSewa.
      return { status: 'pending', started: false };
    case 'CANCELED':
      return { status: 'failed', reason: 'Payment was cancelled.' };
    case 'FULL_REFUND':
    case 'PARTIAL_REFUND':
      return { status: 'failed', reason: 'Payment was refunded.' };
    default:
      return { status: 'pending', started: true };
  }
}

export const esewaGateway: PaymentGateway = {
  provider: 'esewa',
  label: 'eSewa',

  isConfigured: () => credentials() !== null,

  async initiate(order: GatewayOrder, urls) {
    const creds = credentials();
    if (!creds) throw new Error('eSewa is not configured');
    const total = toRupeeString(order.amount.amount);
    const fields = {
      amount: total,
      tax_amount: '0',
      product_service_charge: '0',
      product_delivery_charge: '0',
      total_amount: total,
      transaction_uuid: order.id,
      product_code: creds.productCode,
      success_url: urls.returnUrl,
      failure_url: urls.cancelUrl,
      signed_field_names: SIGNED_FIELDS,
    };
    return {
      checkout: {
        kind: 'form-post',
        url: endpoints().form,
        fields: { ...fields, signature: esewaSignature(fields, creds.secretKey) },
      },
      ref: { provider: 'esewa' },
    };
  },

  async verify(order: GatewayOrder) {
    const creds = credentials();
    if (!creds) throw new Error('eSewa is not configured');
    const total = toRupeeString(order.amount.amount);
    const url = new URL(endpoints().status);
    url.searchParams.set('product_code', creds.productCode);
    url.searchParams.set('total_amount', total);
    url.searchParams.set('transaction_uuid', order.id);

    const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(15_000) });
    if (!response.ok) {
      // A 4xx/5xx from the status API says nothing about the payment: try later.
      console.warn(`[esewa] status check for ${order.id} returned HTTP ${response.status}`);
      return { status: 'pending', started: true };
    }
    return interpretEsewaStatus((await response.json()) as StatusResponse, total);
  },
};
