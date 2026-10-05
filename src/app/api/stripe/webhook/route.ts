import "server-only";
import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { createStripeWebhookRepository } from "@/lib/stripe-webhook-repository";
import { processStripeEvent } from "@/lib/stripe-webhook-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!stripe || !webhookSecret || !signature) {
    return NextResponse.json({ error: "Webhook não configurado." }, { status: 503 });
  }

  const rawBody = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  try {
    const repository = createStripeWebhookRepository();
    const result = await processStripeEvent(event, repository);
    return NextResponse.json({ received: true, duplicate: result.duplicate });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao processar webhook.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
