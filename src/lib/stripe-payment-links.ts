import "server-only";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";
import {
  claimPaymentOperation,
  completePaymentOperation,
  context,
  failPaymentOperation,
  validatePaymentReferences,
} from "@/lib/payment-link-repository";
import {
  createPaymentLink,
  type PaymentLinkServiceDependencies,
} from "@/lib/payment-link-service";
import type { PaymentLink } from "@/lib/payment-link-types";
import type { PaymentLinkAction } from "@/lib/payment-link-validation";

export async function createStripePaymentLink(
  input: PaymentLinkAction
): Promise<PaymentLink> {
  const ctx = await context();
  const stripe = getStripeClient();
  if (!stripe) {
    throw new Error("Stripe não configurado no servidor.");
  }

  await validatePaymentReferences(ctx, input.clientId, input.dealId);

  const dependencies: PaymentLinkServiceDependencies = {
    authorize: async () => ({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
    }),
    claimOperation: async (_c, requestId, payloadHash) =>
      claimPaymentOperation(ctx, requestId, payloadHash),
    createProduct: async (action, idempotencyKey) => {
      const prod = await stripe.products.create(
        {
          name: action.description.trim(),
          metadata: { organization_id: ctx.organizationId, kind: action.kind },
        },
        { idempotencyKey }
      );
      return { id: prod.id };
    },
    createPrice: async (action, productId, idempotencyKey) => {
      const priceParams: Stripe.PriceCreateParams = {
        product: productId,
        unit_amount: action.amountCents,
        currency: action.currency,
        metadata: {
          organization_id: ctx.organizationId,
          deal_id: action.dealId ?? "",
          client_id: action.clientId ?? "",
        },
      };
      if (action.kind === "recurring") {
        priceParams.recurring = {
          interval: action.recurringInterval ?? "month",
        };
      }
      const price = await stripe.prices.create(priceParams, { idempotencyKey });
      return { id: price.id };
    },
    createLink: async (action, priceId, idempotencyKey) => {
      const linkParams: Stripe.PaymentLinkCreateParams = {
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: {
          organization_id: ctx.organizationId,
          kind: action.kind,
          deal_id: action.dealId ?? "",
          client_id: action.clientId ?? "",
        },
        after_completion: { type: "hosted_confirmation" },
      };
      const link = await stripe.paymentLinks.create(linkParams, { idempotencyKey });
      return { id: link.id, url: link.url };
    },
    completeOperation: async (_c, opId, resources, action) =>
      completePaymentOperation(ctx, opId, resources, action),
    failOperation: async (_c, opId, code) =>
      failPaymentOperation(ctx, opId, code),
  };

  return createPaymentLink(input, dependencies);
}
