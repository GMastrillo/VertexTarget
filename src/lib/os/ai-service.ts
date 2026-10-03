import crypto from 'node:crypto';
import { OsError } from './errors.ts';
import { executeMetered } from './ai-execution.ts';
import { requestCopy, requestGroundedSearch } from './ai-provider.ts';
import { getProject } from './project-repository.ts';
import {
  reserveUsage,
  markUsageSent,
  completeUsage,
  releaseUnsentUsage,
} from './usage-repository.ts';
import type { OsContext, SearchInput, SearchResult, SiteDocument } from './types.ts';

function hashPayload(payload: unknown): string {
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

export async function generateCopy(
  ctx: OsContext,
  input: { projectId: string; expectedVersion: number; key: string }
): Promise<SiteDocument> {
  const project = await getProject(ctx, input.projectId);
  if (!project) {
    throw new OsError('not-found', 'Projeto não encontrado.');
  }

  if (project.version !== input.expectedVersion) {
    throw new OsError('conflict', 'O projeto foi modificado. Salve antes de gerar copy com IA.');
  }

  const payloadHash = hashPayload({
    projectId: input.projectId,
    version: input.expectedVersion,
    briefing: project.briefing,
  });

  return executeMetered<SiteDocument>({
    reserve: () => reserveUsage(ctx, { kind: 'copy', key: input.key, payloadHash }),
    markSent: (id) => markUsageSent(ctx, id),
    send: async () => {
      const { document, tokens } = await requestCopy({
        briefing: project.briefing,
        document: project.document,
      });
      return { value: document, tokens };
    },
    complete: (id, result) => completeUsage(ctx, id, result),
    release: (id) => releaseUnsentUsage(ctx, id),
    now: () => Date.now(),
  });
}

export async function searchProspects(
  ctx: OsContext,
  input: SearchInput & { key: string }
): Promise<SearchResult> {
  const sector = (input.sector || '').trim();
  const city = (input.city || '').trim();

  if (!sector || !city) {
    throw new OsError('invalid', 'Setor e cidade são obrigatórios para a busca de prospects.');
  }

  const payloadHash = hashPayload({ sector, city });

  return executeMetered<SearchResult>({
    reserve: () => reserveUsage(ctx, { kind: 'search', key: input.key, payloadHash }),
    markSent: (id) => markUsageSent(ctx, id),
    send: async () => {
      const { result, tokens } = await requestGroundedSearch({ sector, city });
      return { value: result, tokens };
    },
    complete: (id, result) => completeUsage(ctx, id, result),
    release: (id) => releaseUnsentUsage(ctx, id),
    now: () => Date.now(),
  });
}
