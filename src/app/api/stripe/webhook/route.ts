/* eslint-disable complexity -- signature verification and persistence must remain one webhook lifecycle. */
import "server-only";
import Stripe from "stripe";
import { NextResponse } from "next/server";
// Webhooks require the server-only admin client after Stripe signature validation.
// eslint-disable-next-line quality/no-direct-data-access
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { getStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!stripe || !webhookSecret || !signature) return NextResponse.json({ error: "Webhook não configurado." }, { status: 503 });

  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    // Signature verification must receive the untouched request body.
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "Persistência não configurada." }, { status: 503 });

  if (["invoice.paid", "invoice.payment_failed", "invoice.finalized"].includes(event.type)) {
    const invoice = event.data.object as Stripe.Invoice;
    const status = event.type === "invoice.paid" ? "paid" : event.type === "invoice.payment_failed" ? "payment_failed" : "open";
    const { error } = await supabase.from("invoices").upsert({
      stripe_invoice_id: invoice.id,
      amount_cents: invoice.amount_paid || invoice.amount_due || 0,
      currency: invoice.currency,
      status,
      paid_at: invoice.status_transitions.paid_at ? new Date(invoice.status_transitions.paid_at * 1000).toISOString() : null,
    }, { onConflict: "stripe_invoice_id" });
    if (error) return NextResponse.json({ error: "Falha ao persistir evento." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
