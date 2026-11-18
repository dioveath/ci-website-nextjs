import 'server-only';

/*
 * Payment configuration, all from server-only environment variables
 * (.env.example, "Payments").
 *
 *   PAYMENTS_ENV   "sandbox" (default) or "live". Sandbox talks to the
 *                  providers' test systems; no real money moves.
 *   SITE_URL       Public origin of the site, e.g. https://charichainstitute.com.np.
 *                  Providers send students back to it after paying.
 */

export type PaymentsEnv = 'sandbox' | 'live';

export function paymentsEnv(): PaymentsEnv {
  return process.env.PAYMENTS_ENV === 'live' ? 'live' : 'sandbox';
}

export function siteUrl(): string | null {
  const configured = process.env.SITE_URL?.trim().replace(/\/+$/, '');
  if (configured) return configured;
  return process.env.NODE_ENV === 'production' ? null : 'http://localhost:3000';
}
