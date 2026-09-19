/* eslint-disable complexity -- provider verification and parsing are one atomic webhook boundary. */
import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { persistInboundWhatsAppMessage, persistWhatsAppEvent, type InboundWhatsAppMessage } from "@/lib/whatsapp-webhook-repository";
import type { WhatsAppProvider } from "@/lib/whatsapp-types";

function equalSignature(expected: string, received: string) { const a = Buffer.from(expected); const b = Buffer.from(received); return a.length === b.length && timingSafeEqual(a, b); }
function providerOf(request: Request): WhatsAppProvider { return request.headers.get("x-whatsapp-provider") === "unofficial" ? "unofficial" : "official"; }
function officialValue(payload: Record<string, unknown>) { const entry = Array.isArray(payload.entry) ? payload.entry[0] as Record<string, unknown> | undefined : undefined; const changes = entry && Array.isArray(entry.changes) ? changesAt(entry.changes) : undefined; return changes?.value as Record<string, unknown> | undefined; }
function changesAt(changes: unknown[]) { return changes[0] as Record<string, unknown> | undefined; }
function officialPhoneId(payload: Record<string, unknown>) { const metadata = officialValue(payload)?.metadata as Record<string, unknown> | undefined; return typeof metadata?.phone_number_id === "string" ? metadata.phone_number_id : ""; }
function officialMessages(payload: Record<string, unknown>): InboundWhatsAppMessage[] { const messages = officialValue(payload)?.messages; if (!Array.isArray(messages)) return []; return messages.flatMap((item) => { const message = item as Record<string, unknown>; const text = message.text as Record<string, unknown> | undefined; if (typeof message.id !== "string" || typeof message.from !== "string" || typeof text?.body !== "string") return []; return [{ providerMessageId: message.id, sender: message.from, body: text.body, occurredAt: typeof message.timestamp === "string" ? new Date(Number(message.timestamp) * 1000).toISOString() : undefined }]; }); }
function unofficialMessage(payload: Record<string, unknown>): InboundWhatsAppMessage[] { const message = payload.message as Record<string, unknown> | undefined; const source = message ?? payload; const providerMessageId = source.id ?? source.messageId ?? payload.event_id; const sender = source.from ?? source.sender; const body = source.body ?? source.text; if (typeof providerMessageId !== "string" || typeof sender !== "string" || typeof body !== "string") return []; return [{ providerMessageId, sender, body, occurredAt: typeof source.timestamp === "string" ? source.timestamp : undefined }]; }

export async function GET(request: Request) { const url = new URL(request.url); if (url.searchParams.get("hub.verify_token") !== process.env.WHATSAPP_META_VERIFY_TOKEN) return new NextResponse("Forbidden", { status: 403 }); return new NextResponse(url.searchParams.get("hub.challenge") ?? "", { status: 200 }); }

export async function POST(request: Request) {
  const raw = await request.text(); const provider = providerOf(request);
  if (provider === "official") { const secret = process.env.WHATSAPP_META_APP_SECRET; const signature = request.headers.get("x-hub-signature-256")?.replace(/^sha256=/, ""); if (!secret || !signature || !equalSignature(createHmac("sha256", secret).update(raw).digest("hex"), signature)) return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 }); }
  else if (!process.env.WHATSAPP_UNOFFICIAL_WEBHOOK_KEY || request.headers.get("x-whatsapp-webhook-key") !== process.env.WHATSAPP_UNOFFICIAL_WEBHOOK_KEY) return NextResponse.json({ error: "Webhook não autorizado." }, { status: 401 });
  let payload: Record<string, unknown>;
  try { const parsed: unknown = JSON.parse(raw); if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error(); payload = parsed as Record<string, unknown>; } catch { return NextResponse.json({ error: "Payload inválido." }, { status: 400 }); }
  const externalId = provider === "official" ? officialPhoneId(payload) : typeof payload.instance_id === "string" ? payload.instance_id : typeof payload.instanceId === "string" ? payload.instanceId : "";
  if (!externalId) return NextResponse.json({ received: true });
  try {
    const messages = provider === "official" ? officialMessages(payload) : unofficialMessage(payload);
    await persistWhatsAppEvent({ provider, externalId, eventType: provider === "official" ? "meta.webhook" : String(payload.event ?? "provider.webhook"), providerEventId: String(payload.id ?? payload.event_id ?? ""), payload });
    for (const message of messages) await persistInboundWhatsAppMessage({ provider, externalId, eventType: "message.inbound", providerEventId: message.providerMessageId, payload, message });
    return NextResponse.json({ received: true, messages: messages.length });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Webhook não persistido." }, { status: 500 }); }
}
