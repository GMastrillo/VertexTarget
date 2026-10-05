import type { Locale } from "../i18n/routing.ts";
import type { BaseCurrency, Money, ParseAmountResult } from "./types.ts";

const ZERO_DECIMAL_CURRENCIES = new Set([
  "bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga",
  "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf",
]);

const THREE_DECIMAL_CURRENCIES = new Set(["bhd", "jod", "kwd", "omr", "tnd"]);

export function getCurrencyExponent(currency: string): number {
  const normalized = currency.toLowerCase().trim();
  if (ZERO_DECIMAL_CURRENCIES.has(normalized)) return 0;
  if (THREE_DECIMAL_CURRENCIES.has(normalized)) return 3;
  return 2;
}

export function formatMoney(money: Money, locale: Locale): string {
  if (!Number.isSafeInteger(money.amountMinor)) {
    throw new TypeError("formatMoney requires safe integer amountMinor");
  }
  const curr = money.currency.trim();
  if (!/^[A-Za-z]{3}$/.test(curr)) {
    throw new RangeError(`Invalid currency code: ${money.currency}`);
  }
  const exponent = getCurrencyExponent(curr);
  const factor = Math.pow(10, exponent);
  const value = factor === 1 ? money.amountMinor : money.amountMinor / factor;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: curr.toUpperCase(),
  }).format(value);
}

const MAX_BASE_AMOUNT_MINOR = 100_000_000_00; // 100,000,000.00 in scale 2

function parseEnParts(raw: string): { intPart: string; decPart: string } | null {
  // Reject if comma is used after dot or comma used as decimal
  if (/\.\d*,/.test(raw) || /,\d{1,2}$/.test(raw) && !raw.includes(".")) {
    return null;
  }
  const matchWithGrouping = /^\d{1,3}(,\d{3})*(\.\d{1,2})?$/.test(raw);
  const matchPlain = /^\d+(\.\d{1,2})?$/.test(raw);
  if (!matchWithGrouping && !matchPlain) return null;

  const [intPartRaw, decPartRaw = ""] = raw.split(".");
  return {
    intPart: intPartRaw.replace(/,/g, ""),
    decPart: decPartRaw.padEnd(2, "0"),
  };
}

function parseCommaDecimalParts(raw: string): { intPart: string; decPart: string } | null {
  // In comma locales (pt-BR, de, es, it, fr), dot/spaces are thousands, comma is decimal.
  // If dot is used with 1-2 digits at the end without comma, it's incompatible.
  if (/\.\d{1,2}$/.test(raw) && !raw.includes(",")) {
    return null;
  }
  const cleanedSpaces = raw.replace(/[\u00a0\u202f]/g, " ");
  const matchWithGrouping = /^\d{1,3}([. ]\d{3})*(,\d{1,2})?$/.test(cleanedSpaces);
  const matchPlain = /^\d+(,\d{1,2})?$/.test(cleanedSpaces);
  if (!matchWithGrouping && !matchPlain) return null;

  const [intPartRaw, decPartRaw = ""] = cleanedSpaces.split(",");
  return {
    intPart: intPartRaw.replace(/[. ]/g, ""),
    decPart: decPartRaw.padEnd(2, "0"),
  };
}

export function parseBaseAmount(
  value: string,
  locale: Locale,
  _currency: BaseCurrency
): ParseAmountResult {
  const trimmed = value.trim();
  if (!trimmed) return { ok: false, code: "format" };

  if (trimmed.startsWith("-")) {
    return { ok: false, code: "range" };
  }

  const parts = locale === "en" ? parseEnParts(trimmed) : parseCommaDecimalParts(trimmed);
  if (!parts) return { ok: false, code: "format" };

  const intNum = Number(parts.intPart);
  const decNum = Number(parts.decPart);
  if (!Number.isSafeInteger(intNum) || !Number.isSafeInteger(decNum)) {
    return { ok: false, code: "range" };
  }

  const amountMinor = intNum * 100 + decNum;
  if (amountMinor <= 0 || amountMinor > MAX_BASE_AMOUNT_MINOR) {
    return { ok: false, code: "range" };
  }

  return { ok: true, amountMinor };
}
