export type PaymentLinkKind = "one_time" | "recurring";
export type PaymentLinkStatus = "created" | "active" | "completed" | "expired" | "canceled";
export type PaymentLink = { id: string; clientId: string | null; dealId: string | null; stripePaymentLinkId: string; url: string; kind: PaymentLinkKind; status: PaymentLinkStatus; amountCents: number; currency: string; recurringInterval: "month" | "year" | null; installments: number; description: string; createdAt: string };
