import type { ParseResult, SiteService } from './types.ts';

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function hasOnlyAllowedKeys(
  obj: Record<string, unknown>,
  allowedKeys: Set<string>
): boolean {
  return Object.keys(obj).every((key) => allowedKeys.has(key));
}

export function validateLength(
  val: unknown,
  min: number,
  max: number,
  label: string
): ParseResult<string> {
  const str = typeof val === 'string' ? val.trim() : '';
  if (str.length < min || str.length > max) {
    const msg = min > 0
      ? `${label} deve ter entre ${min} e ${max} caracteres`
      : `${label} deve ter no máximo ${max} caracteres`;
    return { ok: false, reason: msg };
  }
  return { ok: true, value: str };
}

function parseSingleService(s: unknown): ParseResult<SiteService> {
  if (!isRecord(s)) {
    return { ok: false, reason: 'Serviço deve ser um objeto' };
  }
  const titleRes = validateLength(s.title, 1, 80, 'Título do serviço');
  if (!titleRes.ok) return titleRes;

  const descRes = validateLength(s.description, 0, 240, 'Descrição do serviço');
  if (!descRes.ok) return descRes;

  return { ok: true, value: { title: titleRes.value, description: descRes.value } };
}

export function parseServices(services: unknown): ParseResult<SiteService[]> {
  if (!Array.isArray(services)) {
    return { ok: false, reason: 'Lista de serviços deve ser um array' };
  }
  if (services.length > 6) {
    return { ok: false, reason: 'Máximo de 6 serviços permitidos' };
  }

  const parsed: SiteService[] = [];
  for (const s of services) {
    const res = parseSingleService(s);
    if (!res.ok) return res;
    parsed.push(res.value);
  }
  return { ok: true, value: parsed };
}
