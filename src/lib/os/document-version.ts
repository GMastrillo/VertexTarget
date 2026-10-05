import type { SiteDocument, SiteDocumentV1, SiteDocumentV2 } from "./types.ts";
import type { RegionalPreferences } from "../region/types.ts";
import { normalizeBrazilianPhone } from "./contact.ts";
import { normalizeInternationalPhone } from "../region/validation.ts";

export const DEFAULT_DOCUMENT_REGION: RegionalPreferences = {
  locale: "pt-BR",
  country: "BR",
  timeZone: "UTC",
};

export function getDocumentRegion(document: SiteDocument): RegionalPreferences {
  if (document.schemaVersion === 2) {
    return {
      locale: document.locale,
      country: document.country,
      timeZone: document.timeZone,
    };
  }
  return DEFAULT_DOCUMENT_REGION;
}

export function upgradeDocument(
  document: SiteDocumentV1,
  preferences: RegionalPreferences,
): SiteDocumentV2 {
  let e164Phone = "";
  if (document.whatsapp) {
    const raw = document.whatsapp.trim();
    if (raw.startsWith("+")) {
      e164Phone = normalizeInternationalPhone(raw) || "";
    } else {
      const brDigits = normalizeBrazilianPhone(raw);
      e164Phone = brDigits ? `+${brDigits}` : "";
    }
  }

  return {
    ...document,
    schemaVersion: 2,
    locale: preferences.locale,
    country: preferences.country,
    timeZone: preferences.timeZone,
    whatsapp: e164Phone,
  };
}
