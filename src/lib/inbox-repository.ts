import "server-only";
import { getAuthenticatedTeamUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { InboxConversation, InboxMessage, InboxSnapshot, SupportTicket } from "@/lib/inbox-types";

type Supabase = NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;
type Context = { supabase: Supabase; userId: string; organizationId: string };

async function getContext(): Promise<Context | null> {
  const user = await getAuthenticatedTeamUser();
  const supabase = await createSupabaseServerClient();
  if (!user?.organizationId || !supabase) return null;
  return { supabase, userId: user.id, organizationId: user.organizationId };
}

function one(row: Record<string, unknown>, key: string) { const value = row[key]; return (Array.isArray(value) ? value[0] : value) as Record<string, unknown> | null; }
function mapMessage(row: Record<string, unknown>): InboxMessage { return { id: String(row.id), body: String(row.body), messageType: row.message_type === "internal_note" ? "internal_note" : "message", authorId: row.author_id ? String(row.author_id) : null, createdAt: String(row.created_at) }; }
function mapConversation(row: Record<string, unknown>, messages: InboxMessage[]): InboxConversation { const company = one(row, "companies"); const contact = one(row, "contacts"); return { id: String(row.id), subject: String(row.subject ?? ""), status: String(row.status) as InboxConversation["status"], priority: String(row.priority) as InboxConversation["priority"], companyName: String(company?.name ?? "Sem empresa"), contactName: String(contact?.name ?? "Sem contato"), assigneeId: row.assignee_id ? String(row.assignee_id) : null, lastMessageAt: String(row.last_message_at), messages }; }
function mapTicket(row: Record<string, unknown>): SupportTicket { return { id: String(row.id), title: String(row.title), status: String(row.status) as SupportTicket["status"], priority: String(row.priority) as SupportTicket["priority"], conversationId: row.conversation_id ? String(row.conversation_id) : null, assigneeId: row.assignee_id ? String(row.assignee_id) : null, slaDueAt: row.sla_due_at ? String(row.sla_due_at) : null, createdAt: String(row.created_at) }; }

export async function getInboxSnapshot(): Promise<InboxSnapshot> {
  const context = await getContext();
  if (!context) return { conversations: [], tickets: [] };
  const { supabase, organizationId } = context;
  const [conversations, messages, tickets] = await Promise.all([
    supabase.from("conversations").select("id,subject,status,priority,company_id,contact_id,assignee_id,last_message_at,companies(name),contacts(name)").eq("organization_id", organizationId).order("last_message_at", { ascending: false }).limit(100),
    supabase.from("conversation_messages").select("id,conversation_id,author_id,message_type,body,created_at").eq("organization_id", organizationId).order("created_at"),
    supabase.from("support_tickets").select("id,title,status,priority,conversation_id,assignee_id,sla_due_at,created_at").eq("organization_id", organizationId).order("created_at", { ascending: false }).limit(100),
  ]);
  if (conversations.error || messages.error || tickets.error) throw new Error("Falha ao carregar o Inbox e suporte.");
  const messageRows = messages.data ?? [];
  return { conversations: (conversations.data ?? []).map((row) => mapConversation(row as Record<string, unknown>, messageRows.filter((message) => message.conversation_id === row.id).map((message) => mapMessage(message as Record<string, unknown>)))), tickets: (tickets.data ?? []).map((row) => mapTicket(row as Record<string, unknown>)) };
}

export async function sendConversationMessage(conversationId: string, body: string, internalNote: boolean) {
  const context = await getContext();
  if (!context) throw new Error("Workspace não disponível.");
  const { data: conversation } = await context.supabase.from("conversations").select("id").eq("organization_id", context.organizationId).eq("id", conversationId).maybeSingle();
  if (!conversation) throw new Error("Conversa não encontrada neste workspace.");
  const { error } = await context.supabase.from("conversation_messages").insert({ organization_id: context.organizationId, conversation_id: conversationId, author_id: context.userId, message_type: internalNote ? "internal_note" : "message", body: body.trim() });
  if (error) throw new Error("Não foi possível enviar a mensagem.");
  const { error: updateError } = await context.supabase.from("conversations").update({ last_message_at: new Date().toISOString(), updated_at: new Date().toISOString(), status: "pending" }).eq("organization_id", context.organizationId).eq("id", conversationId);
  if (updateError) throw new Error("Mensagem criada, mas o status da conversa não foi atualizado.");
}

export async function updateConversation(conversationId: string, input: { status?: "open" | "pending" | "resolved"; assigneeId?: string | null }) {
  const context = await getContext();
  if (!context) throw new Error("Workspace não disponível.");
  const { error } = await context.supabase.from("conversations").update({ ...input, updated_at: new Date().toISOString() }).eq("organization_id", context.organizationId).eq("id", conversationId);
  if (error) throw new Error("Não foi possível atualizar a conversa.");
}

export async function createSupportTicket(input: { title: string; priority: "low" | "normal" | "high" | "urgent"; conversationId?: string }) {
  const context = await getContext();
  if (!context) throw new Error("Workspace não disponível.");
  const { data, error } = await context.supabase.from("support_tickets").insert({ organization_id: context.organizationId, title: input.title.trim(), priority: input.priority, conversation_id: input.conversationId || null, sla_due_at: input.priority === "urgent" ? new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() : null }).select("id,title,status,priority,conversation_id,assignee_id,sla_due_at,created_at").single();
  if (error || !data) throw new Error("Não foi possível criar o ticket.");
  return mapTicket(data as Record<string, unknown>);
}

export async function updateSupportTicket(ticketId: string, input: { status?: "open" | "pending" | "resolved"; assigneeId?: string | null }) {
  const context = await getContext();
  if (!context) throw new Error("Workspace não disponível.");
  const { error } = await context.supabase.from("support_tickets").update({ ...input, updated_at: new Date().toISOString() }).eq("organization_id", context.organizationId).eq("id", ticketId);
  if (error) throw new Error("Não foi possível atualizar o ticket.");
}
