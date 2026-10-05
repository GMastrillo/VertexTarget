import type { BaseCurrency } from "./finance/types.ts";

export type PaymentLinkAction = {
  action: "payment-link.create";
  kind: "one_time" | "recurring";
  amountCents: number;
  currency: BaseCurrency;
  description: string;
  recurringInterval?: "month" | "year";
  installments?: number;
  clientId?: string;
  dealId?: string;
  requestId?: string;
};

const uuid = (value: unknown): value is string =>
  typeof value === "string" && /^[0-9a-f-]{36}$/i.test(value);

const text = (value: unknown, max: number): value is string =>
  typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;

const isBaseCurrency = (value: unknown): value is BaseCurrency =>
  value === "brl" || value === "usd" || value === "eur";

function validateAmount(body: Record<string, unknown>): number | null {
  const amount = Number(body.amountCents);
  if (!Number.isInteger(body.amountCents) || amount < 1 || amount > 100_000_000_00) {
    return null;
  }
  return amount;
}

function validateUuids(body: Record<string, unknown>): { ok: true } | { ok: false; reason: string } {
  if (body.clientId !== undefined && !uuid(body.clientId)) {
    return { ok: false, reason: "payload" };
  }
  if (body.dealId !== undefined && !uuid(body.dealId)) {
    return { ok: false, reason: "payload" };
  }
  if (body.requestId !== undefined && !uuid(body.requestId)) {
    return { ok: false, reason: "request_id" };
  }
  return { ok: true };
}

function validateOptions(
  kind: "one_time" | "recurring",
  interval: "month" | "year" | undefined,
  installmentsRaw: unknown
): { ok: true } | { ok: false; reason: string } {
  const installments = installmentsRaw === undefined ? 1 : installmentsRaw;
  if (installments !== 1) {
    return { ok: false, reason: "installments_not_supported" };
  }
  if (kind === "recurring" && !interval) {
    return { ok: false, reason: "recurring_options" };
  }
  if (kind === "one_time" && interval) {
    return { ok: false, reason: "one_time_options" };
  }
  return { ok: true };
}

function parseBaseFields(
  body: Record<string, unknown>
): { kind: "one_time" | "recurring"; currency: BaseCurrency } | null {
  if (body.action !== "payment-link.create" || !text(body.description, 240)) {
    return null;
  }
  const kind = body.kind === "one_time" || body.kind === "recurring" ? body.kind : null;
  const currency = isBaseCurrency(body.currency) ? body.currency : null;
  if (!kind || !currency) return null;
  return { kind, currency };
}

function parseInterval(body: Record<string, unknown>): "month" | "year" | undefined {
  if (body.recurringInterval === "month" || body.recurringInterval === "year") {
    return body.recurringInterval;
  }
  return undefined;
}

export function parsePaymentLinkAction(
  input: unknown
): { ok: true; value: PaymentLinkAction } | { ok: false; reason: string } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, reason: "body" };
  }
  const body = input as Record<string, unknown>;
  if (Object.prototype.hasOwnProperty.call(body, "organization_id")) {
    return { ok: false, reason: "organization_id is server-owned" };
  }

  const base = parseBaseFields(body);
  if (!base) return { ok: false, reason: "payload" };

  const amount = validateAmount(body);
  if (amount === null) return { ok: false, reason: "payload" };

  const idCheck = validateUuids(body);
  if (!idCheck.ok) return idCheck;

  const interval = parseInterval(body);
  const optCheck = validateOptions(base.kind, interval, body.installments);
  if (!optCheck.ok) return optCheck;

  return {
    ok: true,
    value: {
      action: "payment-link.create",
      kind: base.kind,
      amountCents: amount,
      currency: base.currency,
      description: (body.description as string).trim(),
      recurringInterval: interval,
      installments: 1,
      clientId: body.clientId as string | undefined,
      dealId: body.dealId as string | undefined,
      requestId: body.requestId as string | undefined,
    },
  };
}
