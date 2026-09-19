/* eslint-disable complexity, max-statements -- signature verification, idempotency and persistence share one webhook lifecycle. */
import "server-only";
import Stripe from "stripe";
import { NextResponse } from "next/server";
// Webhooks require the server-only admin client after Stripe signature validation.
// eslint-disable-next-line quality/no-direct-data-access
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { getStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";
const paymentLinkEvents = new Set(["payment_link.created", "payment_link.updated", "checkout.session.completed"]);
function objectOf(event: Stripe.Event) { return event.data.object as unknown as Record<string, unknown>; }
function paymentLinkId(event: Stripe.Event) { const object = objectOf(event); if (event.type.startsWith("payment_link.")) return typeof object.id === "string" ? object.id : null; return typeof object.payment_link === "string" ? object.payment_link : null; }
function paymentLinkStatus(event: Stripe.Event) { if (event.type === "checkout.session.completed") return "completed"; const object = objectOf(event); return object.active === false ? "canceled" : "active"; }
function metadataOrganization(event: Stripe.Event) { const metadata = objectOf(event).metadata; return metadata && typeof metadata === "object" && typeof (metadata as Record<string, unknown>).organization_id === "string" ? (metadata as Record<string, unknown>).organization_id : null; }

export async function POST(request: Request) {
  const stripe = getStripeClient(); const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET; const signature = request.headers.get("stripe-signature");
  if (!stripe || !webhookSecret || !signature) return NextResponse.json({ error: "Webhook não configurado." }, { status: 503 });
  const rawBody = await request.text(); let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret); } catch { return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 }); }
  const supabase = createSupabaseAdminClient(); if (!supabase) return NextResponse.json({ error: "Persistência não configurada." }, { status: 503 });
  const { data: existing } = await supabase.from("stripe_webhook_events").select("id").eq("stripe_event_id", event.id).maybeSingle();
  if (existing) return NextResponse.json({ received: true, duplicate: true });
  const orgId = metadataOrganization(event) ?? (await supabase.from("organizations").select("id").eq("slug", "vertex-target").maybeSingle()).data?.id;
  if (!orgId) return NextResponse.json({ error: "Organização padrão não configurada." }, { status: 503 });
  const linkId = paymentLinkId(event);
  if (paymentLinkEvents.has(event.type) && linkId) {
    const { error } = await supabase.from("stripe_payment_links").update({ status: paymentLinkStatus(event), updated_at: new Date().toISOString() }).eq("organization_id", orgId).eq("stripe_payment_link_id", linkId);
    if (error) return NextResponse.json({ error: "Falha ao sincronizar Payment Link." }, { status: 500 });
  }
  if (["invoice.paid", "invoice.payment_failed", "invoice.finalized"].includes(event.type)) {
    const invoice = event.data.object as Stripe.Invoice; const status = event.type === "invoice.paid" ? "paid" : event.type === "invoice.payment_failed" ? "payment_failed" : "open";
    const { error } = await supabase.from("invoices").upsert({ stripe_invoice_id: invoice.id, organization_id: orgId, amount_cents: invoice.amount_paid || invoice.amount_due || 0, currency: invoice.currency, status, paid_at: invoice.status_transitions.paid_at ? new Date(invoice.status_transitions.paid_at * 1000).toISOString() : null }, { onConflict: "stripe_invoice_id" });
    if (error) return NextResponse.json({ error: "Falha ao persistir fatura." }, { status: 500 });
  }
  const { error: eventError } = await supabase.from("stripe_webhook_events").insert({ stripe_event_id: event.id, organization_id: orgId, event_type: event.type, payment_link_id: linkId });
  if (eventError) { const { data: raced } = await supabase.from("stripe_webhook_events").select("id").eq("stripe_event_id", event.id).maybeSingle(); if (!raced) return NextResponse.json({ error: "Falha ao registrar evento." }, { status: 500 }); }
  return NextResponse.json({ received: true });
}
