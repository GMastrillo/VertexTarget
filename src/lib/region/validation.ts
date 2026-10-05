import { normalizeLocale } from "../i18n/locales.ts";
import { COUNTRY_CODE_SET } from "./countries.ts";
import type { RegionalPreferencesParseResult } from "./types.ts";

export function isValidCountryCode(code: unknown): code is string {
  if (typeof code !== "string") {
    return false;
  }
  return COUNTRY_CODE_SET.has(code.trim().toUpperCase());
}

export function isValidTimeZone(timeZone: unknown): timeZone is string {
  if (typeof timeZone !== "string") {
    return false;
  }
  const trimmed = timeZone.trim();
  if (trimmed.length === 0) {
    return false;
  }
  try {
    Intl.DateTimeFormat(undefined, { timeZone: trimmed });
    return true;
  } catch {
    return false;
  }
}

export function parseRegionalPreferences(input: unknown): RegionalPreferencesParseResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, code: "invalid_input" };
  }

  const record = input as Record<string, unknown>;

  const locale = normalizeLocale(record.locale);
  if (!locale) {
    return { ok: false, code: "locale" };
  }

  if (!isValidCountryCode(record.country)) {
    return { ok: false, code: "country" };
  }

  if (!isValidTimeZone(record.timeZone)) {
    return { ok: false, code: "timeZone" };
  }

  return {
    ok: true,
    value: {
      locale,
      country: (record.country as string).trim().toUpperCase(),
      timeZone: (record.timeZone as string).trim(),
    },
  };
}

export function normalizeInternationalPhone(input: unknown): string | null {
  if (!input || typeof input !== "string") {
    return null;
  }

  // Reject control characters, newlines or null bytes anywhere in raw input
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001F\u007F]/.test(input)) {
    return null;
  }

  const trimmed = input.trim();

  // Must begin with +
  if (!trimmed.startsWith("+")) {
    return null;
  }

  const afterPlus = trimmed.slice(1).trim();
  // Cannot have leading zero after country code indicator
  if (afterPlus.startsWith("0")) {
    return null;
  }

  // Disallow letters or words like "ext"
  if (/[a-zA-Z]/.test(afterPlus)) {
    return null;
  }

  // Visual separators allowed: spaces, parentheses, hyphens, periods
  const validCharsRegex = /^[\d\s().-]+$/;
  if (!validCharsRegex.test(afterPlus)) {
    return null;
  }

  const digits = afterPlus.replace(/\D/g, "");
  // ITU-T E.164: 2 to 15 digits total (country code + subscriber number)
  if (digits.length < 2 || digits.length > 15) {
    return null;
  }

  return `+${digits}`;
}
