import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import type { WhatsAppProvider } from "@/lib/whatsapp-types";

export type InboundWhatsAppMessage = { providerMessageId: string; sender: string; body: string; occurredAt?: string };

type WebhookInput = { provider: WhatsAppProvider; externalId: string; eventType: string; providerEventId: string; payload: Record<string, unknown> };

async function getInstance(input: WebhookInput) {
  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error("Persistência não configurada.");
  const { data: instance } = await admin.from("whatsapp_instances").select("id,organization_id").eq("provider", input.provider).eq("external_id", input.externalId).maybeSingle();
  return { admin, instance };
}

export async function persistWhatsAppEvent(input: WebhookInput) {
  const { admin, instance } = await getInstance(input);
  if (!instance) return false;
  const { error } = await admin.from("whatsapp_events").insert({ organization_id: instance.organization_id, instance_id: instance.id, provider: input.provider, event_type: input.eventType, provider_event_id: input.providerEventId, payload: input.payload });
  if (error) throw new Error("Evento não persistido.");
  return true;
}

export async function persistInboundWhatsAppMessage(input: WebhookInput & { message: InboundWhatsAppMessage }) {
  const { admin, instance } = await getInstance(input);
  if (!instance) return false;
  const { data: existing } = await admin.from("whatsapp_messages").select("id").eq("organization_id", instance.organization_id).eq("instance_id", instance.id).eq("provider_message_id", input.message.providerMessageId).maybeSingle();
  if (existing) return true;
  const subject = `WhatsApp · ${input.message.sender}`;
  const { data: conversation, error: conversationError } = await admin.from("conversations").select("id").eq("organization_id", instance.organization_id).eq("subject", subject).maybeSingle();
  if (conversationError) throw new Error("Conversa inbound não consultada.");
  let conversationId = conversation?.id as string | undefined;
  if (!conversationId) {
    const created = await admin.from("conversations").insert({ organization_id: instance.organization_id, subject, status: "open", priority: "normal", last_message_at: input.message.occurredAt ?? new Date().toISOString() }).select("id").single();
    if (created.error || !created.data) throw new Error("Conversa inbound não criada.");
    conversationId = created.data.id;
  }
  const messageInsert = await admin.from("conversation_messages").insert({ organization_id: instance.organization_id, conversation_id: conversationId, message_type: "message", body: input.message.body, created_at: input.message.occurredAt ?? new Date().toISOString() });
  if (messageInsert.error) throw new Error("Mensagem inbound não persistida no Inbox.");
  const whatsappInsert = await admin.from("whatsapp_messages").insert({ organization_id: instance.organization_id, instance_id: instance.id, conversation_id: conversationId, provider_message_id: input.message.providerMessageId, direction: "inbound", status: "delivered", recipient: input.message.sender, body: input.message.body, created_at: input.message.occurredAt ?? new Date().toISOString() });
  if (whatsappInsert.error) throw new Error("Mensagem inbound não persistida no canal WhatsApp.");
  await admin.from("conversations").update({ last_message_at: input.message.occurredAt ?? new Date().toISOString(), updated_at: new Date().toISOString(), status: "open" }).eq("organization_id", instance.organization_id).eq("id", conversationId);
  return true;
}
