import "server-only";
import Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";
import { context, insertPaymentLink, validatePaymentReferences } from "@/lib/payment-link-repository";
import type { PaymentLink } from "@/lib/payment-link-types";

type Input = { kind: PaymentLink["kind"]; amountCents: number; currency: "brl" | "usd" | "eur"; description: string; recurringInterval?: "month" | "year"; installments: number; clientId?: string; dealId?: string };
export async function createStripePaymentLink(input: Input) {
  const ctx = await context();
  const stripe = getStripeClient();
  if (!ctx) throw new Error("Workspace não disponível.");
  if (!stripe) throw new Error("Stripe não configurado no servidor.");
  await validatePaymentReferences(ctx, input.clientId, input.dealId);
  const product = await stripe.products.create({ name: input.description.trim(), metadata: { organization_id: ctx.organizationId, kind: input.kind } });
  const priceParams: Stripe.PriceCreateParams = { product: product.id, unit_amount: input.amountCents, currency: input.currency, metadata: { organization_id: ctx.organizationId, deal_id: input.dealId ?? "", client_id: input.clientId ?? "" } };
  if (input.kind === "recurring") priceParams.recurring = { interval: input.recurringInterval ?? "month" };
  const price = await stripe.prices.create(priceParams);
  const linkParams: Stripe.PaymentLinkCreateParams = { line_items: [{ price: price.id, quantity: 1 }], metadata: { organization_id: ctx.organizationId, kind: input.kind, deal_id: input.dealId ?? "", client_id: input.clientId ?? "" }, after_completion: { type: "hosted_confirmation" } };
  if (input.kind === "one_time" && input.installments > 1) linkParams.payment_method_options = { card: { installments: { enabled: true } } } as unknown as Stripe.PaymentLinkCreateParams["payment_method_options"];
  const link = await stripe.paymentLinks.create(linkParams);
  try { return await insertPaymentLink(ctx, { ...input, stripePaymentLinkId: link.id, stripePriceId: price.id, stripeProductId: product.id, url: link.url }); }
  catch (error) { await stripe.paymentLinks.update(link.id, { active: false }).catch(() => undefined); throw error; }
}
