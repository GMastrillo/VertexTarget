import type {
  ParseResult,
  SiteDocument,
  ProjectBriefing,
  ProspectInput,
  TemplateId,
} from './types.ts';
import { normalizeBrazilianPhone, isSafeHttpUrl } from './contact.ts';
import { normalizeInternationalPhone, parseRegionalPreferences } from '../region/validation.ts';
import {
  isRecord,
  hasOnlyAllowedKeys,
  validateLength,
  parseServices,
} from './validation-utils.ts';

export { parseSiteDocument } from './document-validation.ts';

const VALID_TEMPLATES = new Set<TemplateId>(['local-services', 'commerce', 'consulting']);

const BRIEFING_ALLOWED_KEYS = new Set([
  'businessName',
  'sector',
  'city',
  'objective',
  'description',
  'services',
  'email',
  'whatsapp',
  'templateId',
  'regionalPreferences',
]);

function parseBriefingInfo(input: Record<string, unknown>): ParseResult<{
  businessName: string;
  sector: string;
  city: string;
}> {
  const nameRes = validateLength(input.businessName, 2, 120, 'Nome do negócio');
  if (!nameRes.ok) return nameRes;

  const sectorRes = validateLength(input.sector, 2, 120, 'Setor');
  if (!sectorRes.ok) return sectorRes;

  const cityRes = validateLength(input.city, 1, 120, 'Cidade');
  if (!cityRes.ok) return cityRes;

  return {
    ok: true,
    value: {
      businessName: nameRes.value,
      sector: sectorRes.value,
      city: cityRes.value,
    },
  };
}

function parseBriefingText(input: Record<string, unknown>): ParseResult<{
  objective: string;
  description: string;
}> {
  const objRes = validateLength(input.objective, 0, 280, 'Objetivo');
  if (!objRes.ok) return objRes;

  const descRes = validateLength(input.description, 0, 1200, 'Descrição');
  if (!descRes.ok) return descRes;

  return {
    ok: true,
    value: {
      objective: objRes.value,
      description: descRes.value,
    },
  };
}

function parseBriefingContact(input: Record<string, unknown>): ParseResult<{
  email: string;
  whatsapp: string;
}> {
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  if (!email || email.length > 254 || !email.includes('@')) {
    return { ok: false, reason: 'E-mail inválido' };
  }
  const whatsappRaw = typeof input.whatsapp === 'string' ? input.whatsapp.trim() : '';
  if (whatsappRaw.startsWith('+')) {
    const intl = normalizeInternationalPhone(whatsappRaw);
    return { ok: true, value: { email, whatsapp: intl ?? '' } };
  }
  const normalizedWhatsapp = normalizeBrazilianPhone(whatsappRaw) ?? '';
  return { ok: true, value: { email, whatsapp: normalizedWhatsapp } };
}

function parseBriefingTemplate(templateId: unknown): ParseResult<TemplateId> {
  if (typeof templateId !== 'string' || !VALID_TEMPLATES.has(templateId as TemplateId)) {
    return { ok: false, reason: 'Template inválido' };
  }
  return { ok: true, value: templateId as TemplateId };
}

export function parseProjectBriefing(input: unknown): ParseResult<ProjectBriefing> {
  if (!isRecord(input) || !hasOnlyAllowedKeys(input, BRIEFING_ALLOWED_KEYS)) {
    return { ok: false, reason: 'Briefing inválido ou com propriedades extras' };
  }

  const info = parseBriefingInfo(input);
  if (!info.ok) return info;

  const text = parseBriefingText(input);
  if (!text.ok) return text;

  const contact = parseBriefingContact(input);
  if (!contact.ok) return contact;

  const template = parseBriefingTemplate(input.templateId);
  if (!template.ok) return template;

  const services = parseServices(input.services);
  if (!services.ok) return services;

  let regionalPreferences;
  if ('regionalPreferences' in input && input.regionalPreferences !== undefined) {
    const regResult = parseRegionalPreferences(input.regionalPreferences);
    if (!regResult.ok) {
      return { ok: false, reason: 'Preferências regionais inválidas no briefing' };
    }
    regionalPreferences = regResult.value;
  }

  return {
    ok: true,
    value: {
      ...info.value,
      ...text.value,
      ...contact.value,
      services: services.value,
      templateId: template.value,
      ...(regionalPreferences ? { regionalPreferences } : {}),
    },
  };
}

export function documentFromBriefing(briefing: ProjectBriefing): SiteDocument {
  const base = {
    templateId: briefing.templateId,
    themeId: 'cyan-dark' as const,
    businessName: briefing.businessName,
    title: `${briefing.businessName} — ${briefing.sector}`,
    subtitle: briefing.objective || `Soluções em ${briefing.sector} com atendimento em ${briefing.city}.`,
    description: briefing.description || `Atendimento de excelência em ${briefing.city} e região.`,
    services: briefing.services,
    ctaLabel: 'Solicitar proposta',
    email: briefing.email,
    city: briefing.city,
  };

  if (briefing.regionalPreferences) {
    const rawWa = briefing.whatsapp.trim();
    let normalizedWa = '';
    if (rawWa) {
      if (rawWa.startsWith('+')) {
        normalizedWa = normalizeInternationalPhone(rawWa) || '';
      } else {
        const br = normalizeBrazilianPhone(rawWa);
        normalizedWa = br ? `+${br}` : '';
      }
    }
    return {
      schemaVersion: 2,
      ...base,
      whatsapp: normalizedWa,
      locale: briefing.regionalPreferences.locale,
      country: briefing.regionalPreferences.country,
      timeZone: briefing.regionalPreferences.timeZone,
    };
  }

  return {
    schemaVersion: 1,
    ...base,
    whatsapp: briefing.whatsapp,
  };
}

const PROSPECT_ALLOWED_KEYS = new Set([
  'name',
  'sector',
  'city',
  'website',
  'email',
  'phone',
  'notes',
]);

function parseProspectContacts(input: Record<string, unknown>): ParseResult<{
  website: string;
  email: string;
  phone: string;
  notes: string;
}> {
  const website = typeof input.website === 'string' ? input.website.trim() : '';
  if (website && !isSafeHttpUrl(website)) {
    return { ok: false, reason: 'Website deve ser uma URL HTTP/HTTPS válida' };
  }
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  if (email && (email.length > 254 || !email.includes('@'))) {
    return { ok: false, reason: 'E-mail do prospect inválido' };
  }
  const phone = typeof input.phone === 'string' ? input.phone.trim() : '';
  const notes = typeof input.notes === 'string' ? input.notes.trim() : '';
  if (notes.length > 2000) {
    return { ok: false, reason: 'Notas devem ter no máximo 2000 caracteres' };
  }
  return { ok: true, value: { website, email, phone, notes } };
}

export function parseProspectInput(input: unknown): ParseResult<ProspectInput> {
  if (!isRecord(input) || !hasOnlyAllowedKeys(input, PROSPECT_ALLOWED_KEYS)) {
    return { ok: false, reason: 'Prospect inválido ou com propriedades extras' };
  }
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  if (!name || name.length > 120) {
    return { ok: false, reason: 'Nome é obrigatório e deve ter até 120 caracteres' };
  }
  const sector = typeof input.sector === 'string' ? input.sector.trim() : '';
  if (sector.length > 120) {
    return { ok: false, reason: 'Setor deve ter até 120 caracteres' };
  }
  const city = typeof input.city === 'string' ? input.city.trim() : '';
  if (city.length > 120) {
    return { ok: false, reason: 'Cidade deve ter até 120 caracteres' };
  }

  const contacts = parseProspectContacts(input);
  if (!contacts.ok) return contacts;

  return {
    ok: true,
    value: {
      name,
      sector,
      city,
      ...contacts.value,
    },
  };
}

export { parseAuthInput, type AuthInput } from './auth-validation.ts';
