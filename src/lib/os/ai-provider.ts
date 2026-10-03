import { GoogleGenAI } from '@google/genai';
import { getOsConfig } from './config.ts';
import { OsError } from './errors.ts';
import { parseSiteDocument } from './validation.ts';
import { parseGroundedResult } from './ai-validation.ts';
import type { ProjectBriefing, SearchInput, SearchResult, SiteDocument } from './types.ts';

function cleanJsonText(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith('```')) {
    const end = trimmed.lastIndexOf('```');
    const firstLineEnd = trimmed.indexOf('\n');
    if (firstLineEnd !== -1 && end > firstLineEnd) {
      return trimmed.slice(firstLineEnd + 1, end).trim();
    }
  }
  return trimmed;
}

function buildCopyMergedDocument(rawJson: Record<string, unknown>, baseDoc: SiteDocument): SiteDocument {
  return {
    schemaVersion: 1,
    templateId: baseDoc.templateId,
    themeId: baseDoc.themeId,
    businessName: typeof rawJson.businessName === 'string' ? rawJson.businessName : baseDoc.businessName,
    title: typeof rawJson.title === 'string' ? rawJson.title : baseDoc.title,
    subtitle: typeof rawJson.subtitle === 'string' ? rawJson.subtitle : baseDoc.subtitle,
    description: typeof rawJson.description === 'string' ? rawJson.description : baseDoc.description,
    services: Array.isArray(rawJson.services) ? (rawJson.services as SiteDocument['services']) : baseDoc.services,
    ctaLabel: typeof rawJson.ctaLabel === 'string' ? rawJson.ctaLabel : baseDoc.ctaLabel,
    email: baseDoc.email,
    whatsapp: baseDoc.whatsapp,
    city: baseDoc.city,
  };
}

export async function requestCopy(input: {
  briefing: ProjectBriefing;
  document: SiteDocument;
}): Promise<{ document: SiteDocument; tokens: number }> {
  const config = getOsConfig();
  if (!config.geminiKey) {
    throw new OsError('unavailable', 'Serviço de IA não configurado no servidor.');
  }

  const ai = new GoogleGenAI({ apiKey: config.geminiKey });
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  const systemInstruction = `Você é o redator do Vertex OS especializado em landing pages no Brasil.
Responda ESTRITAMENTE em formato JSON com o schema:
{
  "businessName": string,
  "title": string,
  "subtitle": string,
  "description": string,
  "services": [ { "title": string, "description": string } ],
  "ctaLabel": string
}`;

  const userPrompt = `Gere a copy para: ${input.briefing.businessName}, ${input.briefing.sector}, ${input.briefing.city}.
Descrição: ${input.briefing.description}. Template: ${input.document.templateId}.`;

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new OsError('unavailable', 'Tempo limite de IA excedido (45s).')), 45000)
  );

  const response = await Promise.race([
    ai.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: {
        maxOutputTokens: 2048,
        systemInstruction,
        responseMimeType: 'application/json',
      },
    }),
    timeoutPromise,
  ]);

  const rawText = cleanJsonText(response.text || '{}');
  let rawJson: Record<string, unknown>;
  try {
    rawJson = JSON.parse(rawText);
  } catch {
    throw new OsError('invalid', 'A IA retornou um formato JSON inválido.');
  }

  const merged = buildCopyMergedDocument(rawJson, input.document);
  const parsed = parseSiteDocument(merged);
  if (!parsed.ok) {
    throw new OsError('invalid', 'Copy gerada não atende aos limites: ' + parsed.reason);
  }

  const tokens = response.usageMetadata?.totalTokenCount || 500;
  return { document: parsed.value, tokens };
}

export async function requestGroundedSearch(input: SearchInput): Promise<{ result: SearchResult; tokens: number }> {
  const config = getOsConfig();
  if (!config.geminiKey) {
    throw new OsError('unavailable', 'Serviço de IA não configurado no servidor.');
  }

  const ai = new GoogleGenAI({ apiKey: config.geminiKey });
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  const systemInstruction = `Você é um pesquisador comercial para o Vertex OS.
Encontre entre 3 e 10 empresas reais no setor e cidade informados.
Para CADA empresa, retorne ao menos uma fonte real (URL e título).
Responda ESTRITAMENTE em formato JSON com o schema:
{
  "suggestions": [
    {
      "name": string,
      "sector": string,
      "city": string,
      "website": string,
      "phone": string,
      "hypothesis": string,
      "sources": [ { "url": string, "title": string } ]
    }
  ]
}`;

  const prompt = `Localize empresas ativas no setor "${input.sector}" em "${input.city}".`;

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new OsError('unavailable', 'Tempo limite de busca excedido (45s).')), 45000)
  );

  const response = await Promise.race([
    ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        maxOutputTokens: 2048,
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    }),
    timeoutPromise,
  ]);

  const rawText = cleanJsonText(response.text || '{}');
  let rawJson: Record<string, unknown>;
  try {
    rawJson = JSON.parse(rawText);
  } catch {
    throw new OsError('invalid', 'A busca retornou formato estruturado inválido.');
  }

  const parsed = parseGroundedResult({
    suggestions: rawJson.suggestions,
    searchedAt: new Date().toISOString(),
    attributionHtml: null,
  });

  if (!parsed.ok) {
    throw new OsError('invalid', 'Falha ao validar empresas encontradas: ' + parsed.reason);
  }

  const tokens = response.usageMetadata?.totalTokenCount || 600;
  return { result: parsed.value, tokens };
}
