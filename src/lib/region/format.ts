import type { Locale } from "../i18n/types.ts";
import type { RegionalPreferences } from "./types.ts";

export function formatCountryName(countryCode: string, locale: Locale): string {
  const normalizedCode = countryCode.trim().toUpperCase();
  try {
    const displayNames = new Intl.DisplayNames([locale], { type: "region" });
    const name = displayNames.of(normalizedCode);
    if (name) {
      return name;
    }
  } catch {
    // Fallback if Intl.DisplayNames is not supported
  }
  return normalizedCode;
}

export function formatRegionalDate(
  dateInput: Date | string | number,
  preferences: RegionalPreferences,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = typeof dateInput === "object" && dateInput instanceof Date ? dateInput : new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: preferences.timeZone,
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    timeZone: preferences.timeZone,
  };

  try {
    const formatter = new Intl.DateTimeFormat(preferences.locale, finalOptions);
    return formatter.format(date);
  } catch {
    // Fallback to UTC if timezone is unrecognized
    const fallbackFormatter = new Intl.DateTimeFormat(preferences.locale, {
      ...finalOptions,
      timeZone: "UTC",
    });
    return fallbackFormatter.format(date);
  }
}
