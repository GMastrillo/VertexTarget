export type WhatsAppAction =
  | { action: "instance.create"; provider: "official" | "unofficial"; name: string; externalId: string; phoneNumber?: string }
  | { action: "instance.check"; instanceId: string }
  | { action: "message.send"; instanceId: string; recipient: string; body: string; conversationId?: string };
const id = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f-]{36}$/i.test(value);
const text = (value: unknown, max: number) => typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;
export function parseWhatsAppAction(input: unknown): { ok: true; value: WhatsAppAction } | { ok: false; reason: string } {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, reason: "body" };
  const body = input as Record<string, unknown>;
  if (Object.prototype.hasOwnProperty.call(body, "organization_id")) return { ok: false, reason: "organization_id is server-owned" };
  if (body.action === "instance.create" && (body.provider === "official" || body.provider === "unofficial") && text(body.name, 100) && text(body.externalId, 200) && (body.phoneNumber === undefined || text(body.phoneNumber, 40))) return { ok: true, value: { action: body.action, provider: body.provider, name: body.name as string, externalId: body.externalId as string, phoneNumber: body.phoneNumber as string | undefined } };
  if (body.action === "instance.check" && id(body.instanceId)) return { ok: true, value: { action: body.action, instanceId: body.instanceId } };
  if (body.action === "message.send" && id(body.instanceId) && text(body.recipient, 40) && text(body.body, 5000) && (body.conversationId === undefined || id(body.conversationId))) return { ok: true, value: { action: body.action, instanceId: body.instanceId, recipient: body.recipient as string, body: body.body as string, conversationId: body.conversationId as string | undefined } };
  return { ok: false, reason: "payload" };
}
