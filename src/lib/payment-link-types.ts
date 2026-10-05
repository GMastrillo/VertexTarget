import type { Money } from "./finance/types.ts";

export type PaymentLinkKind = "one_time" | "recurring";
export type PaymentLinkStatus =
  | "created"
  | "active"
  | "completed"
  | "expired"
  | "canceled";

export type PaymentLink = {
  id: string;
  clientId: string | null;
  dealId: string | null;
  stripePaymentLinkId: string;
  url: string;
  kind: PaymentLinkKind;
  status: PaymentLinkStatus;
  amountCents: number;
  currency: string;
  recurringInterval: "month" | "year" | null;
  installments: number;
  description: string;
  createdAt: string;
  requestId?: string | null;
};

export type PaymentOperationContext = {
  organizationId: string;
  userId: string;
};

export type PaymentResourceIds = {
  productId: string;
  priceId: string;
  linkId: string;
  url: string;
};

export type CheckoutPayment = {
  sessionId: string;
  paymentLinkId: string | null;
  integration: Money;
  presentment: Money | null;
  paymentStatus: string;
};
