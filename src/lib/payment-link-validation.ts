export type PaymentLinkAction = { action: "payment-link.create"; kind: "one_time" | "recurring"; amountCents: number; currency: "brl" | "usd" | "eur"; description: string; recurringInterval?: "month" | "year"; installments?: number; clientId?: string; dealId?: string };
const uuid = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f-]{36}$/i.test(value);
const text = (value: unknown, max: number): value is string => typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;
export function parsePaymentLinkAction(input: unknown): { ok: true; value: PaymentLinkAction } | { ok: false; reason: string } {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, reason: "body" };
  const body = input as Record<string, unknown>;
  if (Object.prototype.hasOwnProperty.call(body, "organization_id")) return { ok: false, reason: "organization_id is server-owned" };
  const kind = body.kind === "one_time" || body.kind === "recurring" ? body.kind : null;
  const currency = body.currency === "brl" || body.currency === "usd" || body.currency === "eur" ? body.currency : null;
  const interval = body.recurringInterval === "month" || body.recurringInterval === "year" ? body.recurringInterval : undefined;
  const installments = body.installments === undefined ? 1 : body.installments;
  if (body.action !== "payment-link.create" || !kind || !currency || !text(body.description, 240) || !Number.isInteger(body.amountCents) || Number(body.amountCents) < 1 || Number(body.amountCents) > 100_000_000_00 || (body.clientId !== undefined && !uuid(body.clientId)) || (body.dealId !== undefined && !uuid(body.dealId))) return { ok: false, reason: "payload" };
  if (kind === "recurring" && (!interval || installments !== 1)) return { ok: false, reason: "recurring_options" };
  if (kind === "one_time" && (interval || !Number.isInteger(installments) || Number(installments) < 1 || Number(installments) > 12)) return { ok: false, reason: "one_time_options" };
  return { ok: true, value: { action: body.action, kind, amountCents: Number(body.amountCents), currency, description: body.description, recurringInterval: interval, installments: Number(installments), clientId: body.clientId as string | undefined, dealId: body.dealId as string | undefined } };
}
