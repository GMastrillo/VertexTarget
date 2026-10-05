import type { Money } from "./finance/types.ts";
import type { CheckoutPayment } from "./payment-link-types.ts";

const isCurrencyCode = (val: unknown): val is string =>
  typeof val === "string" && /^[a-zA-Z]{3}$/.test(val.trim());

function parsePresentment(details: unknown): Money | null {
  if (!details || typeof details !== "object") return null;
  const d = details as Record<string, unknown>;
  const amount = d.amount_total;
  const currency = d.currency;
  if (
    typeof amount === "number" &&
    Number.isSafeInteger(amount) &&
    amount >= 0 &&
    isCurrencyCode(currency)
  ) {
    return {
      amountMinor: amount,
      currency: currency.toLowerCase(),
    };
  }
  return null;
}

function parseAmountTotal(amountTotal: unknown): number | null {
  if (
    typeof amountTotal !== "number" ||
    !Number.isSafeInteger(amountTotal) ||
    amountTotal < 0
  ) {
    return null;
  }
  return amountTotal;
}

export function parseCheckoutPayment(input: unknown): CheckoutPayment | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return null;
  }
  const obj = input as Record<string, unknown>;
  if (typeof obj.id !== "string" || !obj.id.trim()) {
    return null;
  }

  const amountTotal = parseAmountTotal(obj.amount_total);
  if (amountTotal === null || !isCurrencyCode(obj.currency)) {
    return null;
  }

  const paymentStatus = typeof obj.payment_status === "string" ? obj.payment_status : "unpaid";
  const paymentLinkId = typeof obj.payment_link === "string" ? obj.payment_link : null;

  return {
    sessionId: obj.id,
    paymentLinkId,
    integration: {
      amountMinor: amountTotal,
      currency: obj.currency.toLowerCase(),
    },
    presentment: parsePresentment(obj.presentment_details ?? obj.presentment),
    paymentStatus,
  };
}
