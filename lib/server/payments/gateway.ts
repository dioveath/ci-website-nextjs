import 'server-only';

import type {
  CheckoutRedirect,
  Money,
  OrderId,
  PaymentProvider,
  ProviderRef,
  VerifiedPayment,
} from '../../../types/courses';

/** What a gateway needs to know about an order. */
export interface GatewayOrder {
  id: OrderId;
  amount: Money;
  courseTitle: string;
  student: { name: string; email: string | null };
  payment: ProviderRef;
}

export interface PaymentGateway {
  provider: PaymentProvider;
  label: string;
  /** False when credentials are missing: the option is hidden and checkout refused. */
  isConfigured(): boolean;
  /** Starts a payment and says where to send the browser. */
  initiate(
    order: GatewayOrder,
    urls: { returnUrl: string; cancelUrl: string; websiteUrl: string }
  ): Promise<{ checkout: CheckoutRedirect; ref: ProviderRef }>;
  /**
   * Asks the provider, server to server, what happened to the order. Never
   * trusts redirect parameters. Network trouble is reported as pending.
   */
  verify(order: GatewayOrder): Promise<VerifiedPayment>;
}
