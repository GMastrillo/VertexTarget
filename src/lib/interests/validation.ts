import type { ParseResult, Journey } from '../os/types.ts';
import { normalizeBrazilianPhone } from '../os/contact.ts';
import type { InterestInput, InterestKind, InterestSource } from './types.ts';

const VALID_JOURNEYS = new Set<Journey>(['business', 'professional']);
const VALID_INTERESTS = new Set<InterestKind>(['solutions', 'education', 'community']);
const VALID_SOURCES = new Set<InterestSource>([
  'home-contact',
  'education',
  'community',
  'platform',
]);

const INTEREST_ALLOWED_KEYS = new Set([
  'name',
  'email',
  'whatsapp',
  'journey',
  'interest',
  'message',
  'marketingConsent',
  'noticeVersion',
  'source',
  'idempotencyKey',
  'honeypot',
  'captchaToken',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateInterestKeys(input: Record<string, unknown>): ParseResult<true> {
  for (const key of Object.keys(input)) {
    if (!INTEREST_ALLOWED_KEYS.has(key)) {
      return { ok: false, reason: `Propriedade não permitida: ${key}` };
    }
  }
  return { ok: true, value: true };
}

function parseContactFields(input: Record<string, unknown>): ParseResult<{
  name: string;
  email: string;
  whatsapp: string;
}> {
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  if (name.length < 2 || name.length > 120) {
    return { ok: false, reason: 'Nome deve ter entre 2 e 120 caracteres' };
  }

  const email = typeof input.email === 'string' ? input.email.trim() : '';
  if (!email || email.length > 254 || !email.includes('@') || !email.includes('.')) {
    return { ok: false, reason: 'E-mail inválido' };
  }

  const whatsappRaw = typeof input.whatsapp === 'string' ? input.whatsapp.trim() : '';
  let whatsapp = '';
  if (whatsappRaw) {
    const normalized = normalizeBrazilianPhone(whatsappRaw);
    if (!normalized) {
      return { ok: false, reason: 'Número de WhatsApp inválido' };
    }
    whatsapp = normalized;
  }

  return { ok: true, value: { name, email, whatsapp } };
}

function parseCategoricalFields(input: Record<string, unknown>): ParseResult<{
  journey: Journey;
  interest: InterestKind;
  source: InterestSource;
}> {
  if (typeof input.journey !== 'string' || !VALID_JOURNEYS.has(input.journey as Journey)) {
    return { ok: false, reason: 'Jornada inválida' };
  }
  if (typeof input.interest !== 'string' || !VALID_INTERESTS.has(input.interest as InterestKind)) {
    return { ok: false, reason: 'Tipo de interesse inválido' };
  }
  if (typeof input.source !== 'string' || !VALID_SOURCES.has(input.source as InterestSource)) {
    return { ok: false, reason: 'Origem de captação inválida' };
  }
  return {
    ok: true,
    value: {
      journey: input.journey as Journey,
      interest: input.interest as InterestKind,
      source: input.source as InterestSource,
    },
  };
}

function parseTokens(input: Record<string, unknown>): ParseResult<{
  noticeVersion: string;
  idempotencyKey: string;
  captchaToken: string;
}> {
  const noticeVersion = typeof input.noticeVersion === 'string' ? input.noticeVersion.trim() : '';
  if (!noticeVersion || noticeVersion.length > 50) {
    return { ok: false, reason: 'Versão do aviso de privacidade ausente ou inválida' };
  }

  const idempotencyKey = typeof input.idempotencyKey === 'string' ? input.idempotencyKey.trim() : '';
  if (!idempotencyKey || idempotencyKey.length > 64) {
    return { ok: false, reason: 'Chave de idempotência ausente ou inválida' };
  }

  const captchaToken = typeof input.captchaToken === 'string' ? input.captchaToken.trim() : '';
  if (!captchaToken || captchaToken.length > 2048) {
    return { ok: false, reason: 'Token de CAPTCHA ausente ou inválido' };
  }

  return { ok: true, value: { noticeVersion, idempotencyKey, captchaToken } };
}

export function parseInterestInput(input: unknown): ParseResult<InterestInput> {
  if (!isRecord(input)) {
    return { ok: false, reason: 'Payload de interesse deve ser um objeto' };
  }

  const keysValidation = validateInterestKeys(input);
  if (!keysValidation.ok) return keysValidation;

  const honeypot = typeof input.honeypot === 'string' ? input.honeypot.trim() : '';
  if (honeypot !== '') {
    return { ok: false, reason: 'Tentativa automatizada detectada (honeypot)' };
  }

  const contact = parseContactFields(input);
  if (!contact.ok) return contact;

  const categorical = parseCategoricalFields(input);
  if (!categorical.ok) return categorical;

  const tokens = parseTokens(input);
  if (!tokens.ok) return tokens;

  const message = typeof input.message === 'string' ? input.message.trim() : '';
  if (message.length > 2000) {
    return { ok: false, reason: 'Mensagem deve ter no máximo 2000 caracteres' };
  }

  return {
    ok: true,
    value: {
      ...contact.value,
      ...categorical.value,
      ...tokens.value,
      message,
      marketingConsent: input.marketingConsent === true,
      honeypot: '',
    },
  };
}
