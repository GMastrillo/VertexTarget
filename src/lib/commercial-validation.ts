export type CommercialAction =
  | { action: "company.create"; name: string; industry?: string; email?: string; phone?: string; website?: string }
  | { action: "contact.create"; companyId: string; name: string; email?: string; phone?: string; jobTitle?: string }
  | { action: "deal.create"; title: string; companyId: string; contactId?: string; pipelineId: string; stageId: string; amountCents?: number; expectedCloseDate?: string }
  | { action: "deal.update"; dealId: string; title: string; amountCents: number }
  | { action: "deal.move"; dealId: string; stageId: string }
  | { action: "task.create"; title: string; companyId?: string; contactId?: string; dealId?: string; dueDate?: string; priority?: "low" | "medium" | "high" }
  | { action: "task.toggle"; taskId: string; done: boolean };

type Invalid = { ok: false; reason: string };
type Valid = { ok: true; value: CommercialAction };
type Raw = Record<string, unknown>;
const uuid = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f-]{36}$/i.test(value);
const text = (value: unknown, max = 180): value is string => typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;
const optional = (value: unknown, max = 300): value is string | undefined => value === undefined || (typeof value === "string" && value.length <= max);
const optionalId = (value: unknown): value is string | undefined => value === undefined || uuid(value);
const date = (value: unknown): value is string | undefined => value === undefined || (typeof value === "string" && (/^\d{4}-\d{2}-\d{2}$/.test(value) || value === ""));
const validEmail = (value: unknown) => optional(value, 254) && (value === undefined || value === "" || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value));
const validUrl = (value: unknown) => optional(value) && (value === undefined || value === "" || /^https?:\/\//.test(value));
const object = (value: unknown): value is Raw => Boolean(value && typeof value === "object" && !Array.isArray(value));
const result = (value: CommercialAction): Valid => ({ ok: true, value });
const invalid = (reason: string): Invalid => ({ ok: false, reason });

export function parseCommercialAction(input: unknown): Valid | Invalid {
  if (!object(input)) return invalid("body");
  const body = input;
  if (Object.prototype.hasOwnProperty.call(body, "organization_id")) return invalid("organization_id is server-owned");
  const amount = typeof body.amountCents === "number" ? body.amountCents : undefined;
  const priority = typeof body.priority === "string" && ["low", "medium", "high"].includes(body.priority) ? body.priority as "low" | "medium" | "high" : undefined;

  if (body.action === "company.create" && text(body.name) && optional(body.industry, 120) && validEmail(body.email) && optional(body.phone, 40) && validUrl(body.website)) return result({ action: body.action, name: body.name, industry: body.industry as string | undefined, email: body.email as string | undefined, phone: body.phone as string | undefined, website: body.website as string | undefined });
  if (body.action === "contact.create" && uuid(body.companyId) && text(body.name) && validEmail(body.email) && optional(body.phone, 40) && optional(body.jobTitle, 120)) return result({ action: body.action, companyId: body.companyId, name: body.name, email: body.email as string | undefined, phone: body.phone as string | undefined, jobTitle: body.jobTitle as string | undefined });
  if (body.action === "deal.create" && text(body.title) && uuid(body.companyId) && optionalId(body.contactId) && uuid(body.pipelineId) && uuid(body.stageId) && (amount === undefined || (Number.isInteger(amount) && amount >= 0)) && date(body.expectedCloseDate)) return result({ action: body.action, title: body.title, companyId: body.companyId, contactId: body.contactId as string | undefined, pipelineId: body.pipelineId, stageId: body.stageId, amountCents: amount, expectedCloseDate: body.expectedCloseDate as string | undefined });
  if (body.action === "deal.update" && uuid(body.dealId) && text(body.title) && amount !== undefined && Number.isInteger(amount) && amount >= 0) return result({ action: body.action, dealId: body.dealId, title: body.title, amountCents: amount });
  if (body.action === "deal.move" && uuid(body.dealId) && uuid(body.stageId)) return result({ action: body.action, dealId: body.dealId, stageId: body.stageId });
  if (body.action === "task.create" && text(body.title) && optionalId(body.companyId) && optionalId(body.contactId) && optionalId(body.dealId) && date(body.dueDate) && (body.priority === undefined || priority !== undefined)) return result({ action: body.action, title: body.title, companyId: body.companyId as string | undefined, contactId: body.contactId as string | undefined, dealId: body.dealId as string | undefined, dueDate: body.dueDate as string | undefined, priority });
  if (body.action === "task.toggle" && uuid(body.taskId) && typeof body.done === "boolean") return result({ action: body.action, taskId: body.taskId, done: body.done });
  return invalid("payload");
}
