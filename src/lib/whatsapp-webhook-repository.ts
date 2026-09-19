import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import type { WhatsAppProvider } from "@/lib/whatsapp-types";

export async function persistWhatsAppEvent(input: { provider: WhatsAppProvider; externalId: string; eventType: string; providerEventId: string; payload: Record<string, unknown> }) {
  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error("Persistência não configurada.");
  const { data: instance } = await admin.from("whatsapp_instances").select("id,organization_id").eq("provider", input.provider).eq("external_id", input.externalId).maybeSingle();
  if (!instance) return false;
  const { error } = await admin.from("whatsapp_events").insert({ organization_id: instance.organization_id, instance_id: instance.id, provider: input.provider, event_type: input.eventType, provider_event_id: input.providerEventId, payload: input.payload });
  if (error) throw new Error("Evento não persistido.");
  return true;
}
