import type { ParseResult, SearchResult, SearchSource, SearchSuggestion } from './types.ts';
import { isSafeHttpUrl } from './contact.ts';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function safeString(val: unknown, maxLen = 80): string {
  return typeof val === 'string' ? val.trim().slice(0, maxLen) : '';
}

function parseSources(sources: unknown): ParseResult<SearchSource[]> {
  if (!Array.isArray(sources) || sources.length === 0 || sources.length > 10) {
    return { ok: false, reason: 'Fontes devem conter entre 1 e 10 itens verificados' };
  }

  const parsed: SearchSource[] = [];
  for (const item of sources) {
    if (!isRecord(item)) {
      return { ok: false, reason: 'Fonte de pesquisa inválida' };
    }
    const url = typeof item.url === 'string' ? item.url.trim() : '';
    const title = typeof item.title === 'string' ? item.title.trim() : '';

    if (!url || !isSafeHttpUrl(url)) {
      return { ok: false, reason: 'URL da fonte deve ser um link HTTP/HTTPS válido' };
    }
    if (!title || title.length > 120) {
      return { ok: false, reason: 'Título da fonte deve ter até 120 caracteres' };
    }
    parsed.push({ url, title });
  }

  return { ok: true, value: parsed };
}

function parseSuggestionInfo(item: Record<string, unknown>): ParseResult<{
  name: string;
  sector: string;
  city: string;
  phone: string;
  hypothesis: string;
  website: string;
}> {
  const name = typeof item.name === 'string' ? item.name.trim() : '';
  if (!name || name.length > 120) {
    return { ok: false, reason: 'Nome da sugestão deve ter até 120 caracteres' };
  }

  const hypothesis = typeof item.hypothesis === 'string' ? item.hypothesis.trim() : '';
  if (!hypothesis || hypothesis.length > 500) {
    return { ok: false, reason: 'Hipótese deve ter até 500 caracteres' };
  }

  const website = typeof item.website === 'string' ? item.website.trim() : '';
  if (website && !isSafeHttpUrl(website)) {
    return { ok: false, reason: 'Website deve ser uma URL HTTP/HTTPS válida' };
  }

  return {
    ok: true,
    value: {
      name,
      sector: safeString(item.sector, 80),
      city: safeString(item.city, 80),
      phone: safeString(item.phone, 40),
      hypothesis,
      website,
    },
  };
}

function parseSuggestion(item: unknown): ParseResult<SearchSuggestion> {
  if (!isRecord(item)) {
    return { ok: false, reason: 'Sugestão inválida' };
  }

  const infoRes = parseSuggestionInfo(item);
  if (!infoRes.ok) return infoRes;

  const sourcesRes = parseSources(item.sources);
  if (!sourcesRes.ok) return sourcesRes;

  return {
    ok: true,
    value: {
      ...infoRes.value,
      sources: sourcesRes.value,
    },
  };
}

export function parseGroundedResult(input: unknown): ParseResult<SearchResult> {
  if (!isRecord(input)) {
    return { ok: false, reason: 'Resultado de busca inválido' };
  }

  if (!Array.isArray(input.suggestions) || input.suggestions.length === 0 || input.suggestions.length > 10) {
    return { ok: false, reason: 'Sugestões devem conter entre 1 e 10 itens' };
  }

  const suggestions: SearchSuggestion[] = [];
  for (const s of input.suggestions) {
    const parsed = parseSuggestion(s);
    if (!parsed.ok) return parsed;
    suggestions.push(parsed.value);
  }

  const searchedAt = typeof input.searchedAt === 'string' ? input.searchedAt : new Date().toISOString();
  const attributionHtml = typeof input.attributionHtml === 'string' ? input.attributionHtml : null;

  return {
    ok: true,
    value: {
      suggestions,
      searchedAt,
      attributionHtml,
    },
  };
}
