import type Stripe from "stripe";
import { parseCheckoutPayment } from "./stripe-event-validation.ts";

export type StripeWebhookRepository = {
  resolveOrganization: (event: Stripe.Event) => Promise<string | null>;
  applyEvent: (input: {
    eventId: string;
    eventType: string;
    organizationId: string;
    payload: Record<string, unknown>;
  }) => Promise<{ duplicate: boolean }>;
};

function buildEventPayload(event: Stripe.Event): Record<string, unknown> {
  const obj = event.data.object as unknown as Record<string, unknown>;

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const payment = parseCheckoutPayment(obj);
    const isPaid = payment?.paymentStatus === "paid";
    return {
      object: obj,
      checkoutPayment: payment,
      settledPayment: isPaid ? payment : null,
    };
  }

  return { object: obj };
}

export async function processStripeEvent(
  event: Stripe.Event,
  repository: StripeWebhookRepository
): Promise<{ duplicate: boolean }> {
  const organizationId = await repository.resolveOrganization(event);
  if (!organizationId) {
    throw new Error("Organização não identificada para este evento.");
  }

  const payload = buildEventPayload(event);

  return repository.applyEvent({
    eventId: event.id,
    eventType: event.type,
    organizationId,
    payload,
  });
}
