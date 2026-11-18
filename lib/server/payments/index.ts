import 'server-only';

import { esewaGateway } from './esewa';
import { khaltiGateway } from './khalti';
import type { PaymentGateway } from './gateway';
import type { PaymentOption, PaymentProvider } from '../../../types/courses';
import { PAYMENT_PROVIDERS } from '../../../types/courses';

const GATEWAYS: Record<PaymentProvider, PaymentGateway> = {
  esewa: esewaGateway,
  khalti: khaltiGateway,
};

export function isPaymentProvider(value: unknown): value is PaymentProvider {
  return typeof value === 'string' && (PAYMENT_PROVIDERS as readonly string[]).includes(value);
}

export function gatewayFor(provider: PaymentProvider): PaymentGateway {
  return GATEWAYS[provider];
}

/** The providers that can take payments right now, in display order. */
export function paymentOptions(): PaymentOption[] {
  return PAYMENT_PROVIDERS.filter((provider) => GATEWAYS[provider].isConfigured()).map((provider) => ({
    provider,
    label: GATEWAYS[provider].label,
  }));
}
