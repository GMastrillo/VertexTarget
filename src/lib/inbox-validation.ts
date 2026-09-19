export type InboxAction =
  | { action: "message.send"; conversationId: string; body: string; internalNote?: boolean }
  | { action: "conversation.update"; conversationId: string; status?: "open" | "pending" | "resolved"; assigneeId?: string | null }
  | { action: "ticket.create"; title: string; priority: "low" | "normal" | "high" | "urgent"; conversationId?: string }
  | { action: "ticket.update"; ticketId: string; status?: "open" | "pending" | "resolved"; assigneeId?: string | null };

type Raw = Record<string, unknown>;
type Result = { ok: true; value: InboxAction } | { ok: false; reason: string };
const id = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f-]{36}$/i.test(value);
const text = (value: unknown, max: number) => typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;
const status = (value: unknown): value is "open" | "pending" | "resolved" => value === undefined || value === "open" || value === "pending" || value === "resolved";
const priority = (value: unknown): value is "low" | "normal" | "high" | "urgent" => value === "low" || value === "normal" || value === "high" || value === "urgent";
const optionalId = (value: unknown): value is string | null | undefined => value === undefined || value === null || id(value);

export function parseInboxAction(input: unknown): Result {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, reason: "body" };
  const body = input as Raw;
  if (Object.prototype.hasOwnProperty.call(body, "organization_id")) return { ok: false, reason: "organization_id is server-owned" };
  if (body.action === "message.send" && id(body.conversationId) && text(body.body, 5000)) return { ok: true, value: { action: body.action, conversationId: body.conversationId, body: body.body as string, internalNote: body.internalNote === true } };
  if (body.action === "conversation.update" && id(body.conversationId) && status(body.status) && optionalId(body.assigneeId)) return { ok: true, value: { action: body.action, conversationId: body.conversationId, status: body.status, assigneeId: body.assigneeId } };
  if (body.action === "ticket.create" && text(body.title, 180) && priority(body.priority) && (body.conversationId === undefined || id(body.conversationId))) return { ok: true, value: { action: body.action, title: body.title as string, priority: body.priority, conversationId: body.conversationId } };
  if (body.action === "ticket.update" && id(body.ticketId) && status(body.status) && optionalId(body.assigneeId)) return { ok: true, value: { action: body.action, ticketId: body.ticketId, status: body.status, assigneeId: body.assigneeId } };
  return { ok: false, reason: "payload" };
}
