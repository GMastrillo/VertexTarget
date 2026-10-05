import type {
  ParseResult,
  SiteDocument,
  SiteDocumentV1,
  SiteDocumentV2,
  SiteService,
  TemplateId,
  ThemeId,
} from "./types.ts";
import { normalizeBrazilianPhone } from "./contact.ts";
import { normalizeInternationalPhone, isValidCountryCode, isValidTimeZone } from "../region/validation.ts";
import { normalizeLocale } from "../i18n/locales.ts";
import {
  isRecord,
  validateLength,
  parseServices,
} from "./validation-utils.ts";

const VALID_TEMPLATES = new Set<TemplateId>(["local-services", "commerce", "consulting"]);
const VALID_THEMES = new Set<ThemeId>(["cyan-dark", "warm-light", "forest-light"]);

const V1_ALLOWED_KEYS = new Set([
  "schemaVersion",
  "templateId",
  "themeId",
  "businessName",
  "title",
  "subtitle",
  "description",
  "services",
  "ctaLabel",
  "email",
  "whatsapp",
  "city",
]);

const V2_ALLOWED_KEYS = new Set([
  ...V1_ALLOWED_KEYS,
  "locale",
  "country",
  "timeZone",
]);

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

type DocumentHeadings = {
  businessName: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  city: string;
};

function validateHeadingsAndDetails(record: Record<string, unknown>): ParseResult<DocumentHeadings> {
  const nameRes = validateLength(record.businessName, 2, 120, "Nome do negócio");
  if (!nameRes.ok) return nameRes;

  const titleRes = validateLength(record.title, 1, 120, "Título");
  if (!titleRes.ok) return titleRes;

  const subtitleRes = validateLength(record.subtitle, 0, 280, "Subtítulo");
  if (!subtitleRes.ok) return subtitleRes;

  const descRes = validateLength(record.description, 0, 1200, "Descrição");
  if (!descRes.ok) return descRes;

  const ctaRes = validateLength(record.ctaLabel, 1, 40, "Rótulo do CTA");
  if (!ctaRes.ok) return ctaRes;

  const cityRes = validateLength(record.city, 1, 120, "Cidade");
  if (!cityRes.ok) return cityRes;

  return {
    ok: true,
    value: {
      businessName: nameRes.value,
      title: titleRes.value,
      subtitle: subtitleRes.value,
      description: descRes.value,
      ctaLabel: ctaRes.value,
      city: cityRes.value,
    },
  };
}

function checkDocumentKeys(input: Record<string, unknown>, version: number): ParseResult<true> {
  const allowedKeys = version === 1 ? V1_ALLOWED_KEYS : V2_ALLOWED_KEYS;
  for (const key of Object.keys(input)) {
    if (!allowedKeys.has(key)) {
      return { ok: false, reason: `Propriedade não permitida: ${key}` };
    }
  }
  return { ok: true, value: true };
}

function parseV1Whatsapp(raw: string): ParseResult<string> {
  if (!raw) return { ok: true, value: "" };
  const brDigits = normalizeBrazilianPhone(raw);
  if (!brDigits) {
    return { ok: false, reason: "WhatsApp brasileiro inválido" };
  }
  return { ok: true, value: brDigits };
}

function parseV2Whatsapp(raw: string): ParseResult<string> {
  if (!raw) return { ok: true, value: "" };
  const intlPhone = normalizeInternationalPhone(raw);
  if (!intlPhone) {
    return { ok: false, reason: "WhatsApp internacional inválido (deve conter + e código do país)" };
  }
  return { ok: true, value: intlPhone };
}

function buildV1Document(
  input: Record<string, unknown>,
  headings: DocumentHeadings,
  services: SiteService[],
): ParseResult<SiteDocumentV1> {
  const waResult = parseV1Whatsapp((input.whatsapp as string).trim());
  if (!waResult.ok) return waResult;

  return {
    ok: true,
    value: {
      schemaVersion: 1,
      templateId: input.templateId as TemplateId,
      themeId: input.themeId as ThemeId,
      services,
      email: (input.email as string).trim(),
      whatsapp: waResult.value,
      ...headings,
    },
  };
}

function buildV2Document(
  input: Record<string, unknown>,
  headings: DocumentHeadings,
  services: SiteService[],
): ParseResult<SiteDocumentV2> {
  const locale = normalizeLocale(input.locale);
  if (!locale) {
    return { ok: false, reason: "Idioma regional não suportado" };
  }
  if (!isValidCountryCode(input.country)) {
    return { ok: false, reason: "Código de país inválido" };
  }
  if (!isValidTimeZone(input.timeZone)) {
    return { ok: false, reason: "Fuso horário inválido" };
  }

  const waResult = parseV2Whatsapp((input.whatsapp as string).trim());
  if (!waResult.ok) return waResult;

  return {
    ok: true,
    value: {
      schemaVersion: 2,
      templateId: input.templateId as TemplateId,
      themeId: input.themeId as ThemeId,
      services,
      email: (input.email as string).trim(),
      whatsapp: waResult.value,
      locale,
      country: (input.country as string).trim().toUpperCase(),
      timeZone: (input.timeZone as string).trim(),
      ...headings,
    },
  };
}

function validateDocumentBasics(input: Record<string, unknown>): ParseResult<{
  headings: DocumentHeadings;
  services: SiteService[];
}> {
  if (typeof input.templateId !== "string" || !VALID_TEMPLATES.has(input.templateId as TemplateId)) {
    return { ok: false, reason: "Template desconhecido" };
  }
  if (typeof input.themeId !== "string" || !VALID_THEMES.has(input.themeId as ThemeId)) {
    return { ok: false, reason: "Tema desconhecido" };
  }

  const headings = validateHeadingsAndDetails(input);
  if (!headings.ok) return headings;

  const servicesRes = parseServices(input.services);
  if (!servicesRes.ok) return servicesRes;

  if (typeof input.email !== "string" || (input.email.trim() && !EMAIL_REGEX.test(input.email.trim()))) {
    return { ok: false, reason: "E-mail inválido" };
  }
  if (typeof input.whatsapp !== "string") {
    return { ok: false, reason: "WhatsApp deve ser texto" };
  }

  return { ok: true, value: { headings: headings.value, services: servicesRes.value } };
}

export function parseSiteDocument(input: unknown): ParseResult<SiteDocument> {
  if (!isRecord(input)) {
    return { ok: false, reason: "Documento deve ser um objeto" };
  }

  const version = input.schemaVersion;
  if (version !== 1 && version !== 2) {
    return { ok: false, reason: "schemaVersion inválido (deve ser 1 ou 2)" };
  }

  const keysRes = checkDocumentKeys(input, version);
  if (!keysRes.ok) return keysRes;

  const basics = validateDocumentBasics(input);
  if (!basics.ok) return basics;

  return version === 1
    ? buildV1Document(input, basics.value.headings, basics.value.services)
    : buildV2Document(input, basics.value.headings, basics.value.services);
}
