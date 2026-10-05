import "server-only";
import type Stripe from "stripe";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import type { CheckoutPayment } from "./payment-link-types.ts";
import type { StripeWebhookRepository } from "./stripe-webhook-service.ts";

type SupabaseAdmin = NonNullable<ReturnType<typeof createSupabaseAdminClient>>;

function getEventObject(event: Stripe.Event): Record<string, unknown> {
  return event.data.object as unknown as Record<string, unknown>;
}

function resolveOrgFromMetadata(event: Stripe.Event): string | null {
  const obj = getEventObject(event);
  const metadata = obj.metadata as Record<string, unknown> | undefined;
  if (typeof metadata?.organization_id === "string") {
    return metadata.organization_id;
  }
  const subDetails = obj.subscription_details as { metadata?: Record<string, unknown> } | undefined;
  if (typeof subDetails?.metadata?.organization_id === "string") {
    return subDetails.metadata.organization_id;
  }
  return null;
}

async function resolveOrgFromLink(
  supabase: SupabaseAdmin,
  event: Stripe.Event
): Promise<string | null> {
  const obj = getEventObject(event);
  const linkId = typeof obj.payment_link === "string" ? obj.payment_link : null;
  if (!linkId) return null;

  const { data } = await supabase
    .from("stripe_payment_links")
    .select("organization_id")
    .eq("stripe_payment_link_id", linkId)
    .maybeSingle();

  return data?.organization_id ? String(data.organization_id) : null;
}

async function applySettledPayment(
  supabase: SupabaseAdmin,
  orgId: string,
  payment: CheckoutPayment
): Promise<void> {
  await supabase.from("stripe_checkout_payments").upsert(
    {
      organization_id: orgId,
      checkout_session_id: payment.sessionId,
      stripe_payment_link_id: payment.paymentLinkId,
      amount_cents: payment.integration.amountMinor,
      currency: payment.integration.currency,
      presentment_amount_cents: payment.presentment?.amountMinor ?? null,
      presentment_currency: payment.presentment?.currency ?? null,
      payment_status: payment.paymentStatus,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "checkout_session_id" }
  );
}

async function applyInvoice(
  supabase: SupabaseAdmin,
  orgId: string,
  event: Stripe.Event
): Promise<void> {
  const invoice = event.data.object as Stripe.Invoice;
  const status =
    event.type === "invoice.paid"
      ? "paid"
      : event.type === "invoice.payment_failed"
      ? "payment_failed"
      : "open";

  const paidAt = invoice.status_transitions?.paid_at
    ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
    : null;

  await supabase.from("invoices").upsert(
    {
      stripe_invoice_id: invoice.id,
      organization_id: orgId,
      amount_cents: invoice.amount_paid || invoice.amount_due || 0,
      currency: invoice.currency,
      status,
      paid_at: paidAt,
    },
    { onConflict: "stripe_invoice_id" }
  );
}

export function createStripeWebhookRepository(): StripeWebhookRepository {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Supabase admin client não configurado.");
  }

  return {
    async resolveOrganization(event: Stripe.Event): Promise<string | null> {
      const fromMeta = resolveOrgFromMetadata(event);
      if (fromMeta) return fromMeta;

      const fromLink = await resolveOrgFromLink(supabase, event);
      if (fromLink) return fromLink;

      const { data: defaultOrg } = await supabase
        .from("organizations")
        .select("id")
        .eq("slug", "vertex-target")
        .maybeSingle();

      return defaultOrg?.id ? String(defaultOrg.id) : null;
    },

    async applyEvent(input): Promise<{ duplicate: boolean }> {
      const { data: existing } = await supabase
        .from("stripe_webhook_events")
        .select("id")
        .eq("stripe_event_id", input.eventId)
        .maybeSingle();

      if (existing) {
        return { duplicate: true };
      }

      const settled = input.payload.settledPayment as CheckoutPayment | null | undefined;
      if (settled) {
        await applySettledPayment(supabase, input.organizationId, settled);
      }

      if (["invoice.paid", "invoice.payment_failed", "invoice.finalized"].includes(input.eventType)) {
        await applyInvoice(supabase, input.organizationId, {
          id: input.eventId,
          type: input.eventType,
          data: { object: input.payload.object as Stripe.Invoice },
        } as Stripe.Event);
      }

      await supabase.from("stripe_webhook_events").insert({
        stripe_event_id: input.eventId,
        organization_id: input.organizationId,
        event_type: input.eventType,
      });

      return { duplicate: false };
    },
  };
}
