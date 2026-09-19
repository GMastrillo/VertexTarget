import "server-only";
import { getAuthenticatedTeamUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getWhatsAppAdapter, getWhatsAppConfigurations, type WhatsAppProvider } from "@/lib/whatsapp";
import type { WhatsAppInstance } from "@/lib/whatsapp-types";

type Supabase = NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;
type Context = { supabase: Supabase; userId: string; organizationId: string };

async function context(): Promise<Context | null> { const user = await getAuthenticatedTeamUser(); const supabase = await createSupabaseServerClient(); return user?.organizationId && supabase ? { supabase, userId: user.id, organizationId: user.organizationId } : null; }
function map(row: Record<string, unknown>): WhatsAppInstance { return { id: String(row.id), provider: row.provider === "unofficial" ? "unofficial" : "official", name: String(row.name), phoneNumber: String(row.phone_number ?? ""), externalId: String(row.external_id), status: String(row.status), lastError: String(row.last_error ?? ""), lastSeenAt: row.last_seen_at ? String(row.last_seen_at) : null }; }

export async function getWhatsAppSnapshot() {
  const [ctx, configurations] = await Promise.all([context(), Promise.resolve(getWhatsAppConfigurations())]);
  if (!ctx) return { instances: [], configurations };
  const { data, error } = await ctx.supabase.from("whatsapp_instances").select("id,provider,name,phone_number,external_id,status,last_error,last_seen_at").eq("organization_id", ctx.organizationId).order("updated_at", { ascending: false });
  if (error) throw new Error("Falha ao carregar instâncias WhatsApp. A migration 006 pode ainda não estar aplicada.");
  return { instances: (data ?? []).map((row) => map(row as Record<string, unknown>)), configurations };
}

export async function createWhatsAppInstance(input: { provider: WhatsAppProvider; name: string; externalId: string; phoneNumber?: string }) {
  const ctx = await context(); if (!ctx) throw new Error("Workspace não disponível.");
  const { data, error } = await ctx.supabase.from("whatsapp_instances").insert({ organization_id: ctx.organizationId, provider: input.provider, name: input.name.trim(), external_id: input.externalId.trim(), phone_number: input.phoneNumber?.trim() ?? "", status: "disconnected" }).select("id,provider,name,phone_number,external_id,status,last_error,last_seen_at").single();
  if (error || !data) throw new Error("Não foi possível cadastrar a instância WhatsApp.");
  return map(data as Record<string, unknown>);
}

export async function checkWhatsAppInstance(instanceId: string) {
  const ctx = await context(); if (!ctx) throw new Error("Workspace não disponível.");
  const { data: instance } = await ctx.supabase.from("whatsapp_instances").select("id,provider,external_id").eq("organization_id", ctx.organizationId).eq("id", instanceId).maybeSingle();
  if (!instance) throw new Error("Instância não encontrada neste workspace.");
  try {
    const health = await getWhatsAppAdapter(instance.provider).health(instance.external_id);
    await ctx.supabase.from("whatsapp_instances").update({ status: health.connected ? "connected" : "error", phone_number: health.phoneNumber ?? "", last_error: health.connected ? "" : health.detail ?? "Não conectada.", last_seen_at: health.connected ? new Date().toISOString() : null, updated_at: new Date().toISOString() }).eq("organization_id", ctx.organizationId).eq("id", instanceId);
    return health;
  } catch { await ctx.supabase.from("whatsapp_instances").update({ status: "error", last_error: "Falha de comunicação com o provider.", updated_at: new Date().toISOString() }).eq("organization_id", ctx.organizationId).eq("id", instanceId); throw new Error("Provider WhatsApp indisponível."); }
}

export async function sendWhatsAppMessage(instanceId: string, recipient: string, body: string, conversationId?: string) {
  const ctx = await context(); if (!ctx) throw new Error("Workspace não disponível.");
  const { data: instance } = await ctx.supabase.from("whatsapp_instances").select("id,provider,external_id").eq("organization_id", ctx.organizationId).eq("id", instanceId).maybeSingle();
  if (!instance) throw new Error("Instância não encontrada neste workspace.");
  const sent = await getWhatsAppAdapter(instance.provider).send(instance.external_id, recipient, body.trim());
  const { error } = await ctx.supabase.from("whatsapp_messages").insert({ organization_id: ctx.organizationId, instance_id: instanceId, conversation_id: conversationId || null, provider_message_id: sent.providerMessageId, direction: "outbound", status: "sent", recipient, body: body.trim() });
  if (error) throw new Error("Mensagem enviada, mas não foi persistida.");
  return sent;
}
