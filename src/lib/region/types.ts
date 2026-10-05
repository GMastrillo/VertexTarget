import type { Locale } from "../i18n/types.ts";

export interface RegionalPreferences {
  locale: Locale;
  country: string;
  timeZone: string;
}

export type RegionalPreferencesErrorCode = "locale" | "country" | "timeZone" | "invalid_input";

export type RegionalPreferencesParseResult =
  | { ok: true; value: RegionalPreferences }
  | { ok: false; code: RegionalPreferencesErrorCode };
