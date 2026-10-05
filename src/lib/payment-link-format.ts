import type { Locale } from "./i18n/routing.ts";
import type { BaseCurrency, Money } from "./finance/types.ts";
import { formatMoney, parseBaseAmount } from "./finance/money.ts";

export { formatMoney, parseBaseAmount };

export function formatMoneyAmount(
  amountCents: number,
  currency: string,
  locale: Locale = "pt-BR"
): string {
  const money: Money = {
    amountMinor: amountCents,
    currency: currency.toLowerCase(),
  };
  return formatMoney(money, locale);
}

export function parseCurrencyToCents(
  value: string,
  locale: Locale = "pt-BR",
  currency: BaseCurrency = "brl"
): number {
  const result = parseBaseAmount(value, locale, currency);
  if (result.ok) {
    return result.amountMinor;
  }
  // Fallback for legacy input only if it parses cleanly as numbers
  const cleaned = value.trim().replace(/[^0-9,.-]/g, "");
  if (!cleaned) return 0;
  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");
  const decimalIndex = Math.max(lastComma, lastDot);
  const hasDecimal = decimalIndex >= 0 && cleaned.length - decimalIndex - 1 <= 2;
  const normalized = hasDecimal
    ? `${cleaned.slice(0, decimalIndex).replace(/[.,]/g, "")}.${cleaned.slice(decimalIndex + 1)}`
    : cleaned.replace(/[.,]/g, "");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? Math.round(amount * 100) : 0;
}
