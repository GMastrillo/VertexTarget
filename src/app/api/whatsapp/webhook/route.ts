/* eslint-disable complexity -- provider verification and parsing are one atomic webhook boundary. */
import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { persistWhatsAppEvent } from "@/lib/whatsapp-webhook-repository";

function equalSignature(expected: string, received: string) { const a = Buffer.from(expected); const b = Buffer.from(received); return a.length === b.length && timingSafeEqual(a, b); }
function providerOf(request: Request) { return request.headers.get("x-whatsapp-provider") === "unofficial" ? "unofficial" : "official"; }
function officialPhoneId(payload: Record<string, unknown>) {
  const entry = Array.isArray(payload.entry) ? payload.entry[0] as Record<string, unknown> | undefined : undefined;
  const changes = entry && Array.isArray(entry.changes) ? entry.changes[0] as Record<string, unknown> | undefined : undefined;
  const value = changes?.value as Record<string, unknown> | undefined;
  const metadata = value?.metadata as Record<string, unknown> | undefined;
  return typeof metadata?.phone_number_id === "string" ? metadata.phone_number_id : "";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("hub.verify_token") !== process.env.WHATSAPP_META_VERIFY_TOKEN) return new NextResponse("Forbidden", { status: 403 });
  return new NextResponse(url.searchParams.get("hub.challenge") ?? "", { status: 200 });
}

export async function POST(request: Request) {
  const raw = await request.text();
  const provider = providerOf(request);
  if (provider === "official") {
    const secret = process.env.WHATSAPP_META_APP_SECRET;
    const signature = request.headers.get("x-hub-signature-256")?.replace(/^sha256=/, "");
    if (!secret || !signature || !equalSignature(createHmac("sha256", secret).update(raw).digest("hex"), signature)) return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
  } else if (!process.env.WHATSAPP_UNOFFICIAL_WEBHOOK_KEY || request.headers.get("x-whatsapp-webhook-key") !== process.env.WHATSAPP_UNOFFICIAL_WEBHOOK_KEY) return NextResponse.json({ error: "Webhook não autorizado." }, { status: 401 });
  let payload: Record<string, unknown>;
  try { const parsed: unknown = JSON.parse(raw); if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error(); payload = parsed as Record<string, unknown>; } catch { return NextResponse.json({ error: "Payload inválido." }, { status: 400 }); }
  const externalId = provider === "official" ? officialPhoneId(payload) : typeof payload.instance_id === "string" ? payload.instance_id : typeof payload.instanceId === "string" ? payload.instanceId : "";
  if (!externalId) return NextResponse.json({ received: true });
  try { await persistWhatsAppEvent({ provider, externalId, eventType: provider === "official" ? "meta.webhook" : String(payload.event ?? "provider.webhook"), providerEventId: String(payload.id ?? payload.event_id ?? ""), payload }); return NextResponse.json({ received: true }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Webhook não persistido." }, { status: 500 }); }
}
