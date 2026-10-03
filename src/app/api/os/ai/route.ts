import { NextResponse } from 'next/server';
import { getOsConfig } from '@/lib/os/config';
import { OsError } from '@/lib/os/errors';
import { readLimitedJson, requireCanonicalOrigin } from '@/lib/os/http';
import { requireOsContext } from '@/lib/os/auth';
import { generateCopy, searchProspects } from '@/lib/os/ai-service';
import type { OsContext } from '@/lib/os/types';

function parseAiRequestAction(body: unknown): { action: string; key: string } | null {
  if (typeof body !== 'object' || body === null) return null;
  const rec = body as Record<string, unknown>;
  const action = typeof rec.action === 'string' ? rec.action : '';
  const key = typeof rec.key === 'string' ? rec.key.trim() : '';
  if (!action || !key || key.length < 10) return null;
  return { action, key };
}

async function handleCopyAction(ctx: OsContext, body: Record<string, unknown>, key: string): Promise<NextResponse> {
  const projectId = typeof body.projectId === 'string' ? body.projectId : '';
  const expectedVersion = typeof body.expectedVersion === 'number' ? body.expectedVersion : -1;

  if (!projectId || expectedVersion < 1) {
    return NextResponse.json({ error: 'ID do projeto e versão esperada são obrigatórios' }, { status: 400 });
  }

  const document = await generateCopy(ctx, { projectId, expectedVersion, key });
  return NextResponse.json({ ok: true, document }, { status: 200 });
}

async function handleSearchAction(ctx: OsContext, body: Record<string, unknown>, key: string): Promise<NextResponse> {
  const sector = typeof body.sector === 'string' ? body.sector : '';
  const city = typeof body.city === 'string' ? body.city : '';

  if (!sector || !city) {
    return NextResponse.json({ error: 'Setor e cidade são obrigatórios para busca' }, { status: 400 });
  }

  const result = await searchProspects(ctx, { sector, city, key });
  return NextResponse.json({ ok: true, result }, { status: 200 });
}

export async function POST(request: Request): Promise<NextResponse> {
  const config = getOsConfig();
  try {
    requireCanonicalOrigin(request, config.appUrl);
    const ctx = await requireOsContext();
    const body = (await readLimitedJson(request, 16384)) as Record<string, unknown>;

    const parsedAction = parseAiRequestAction(body);
    if (!parsedAction) {
      return NextResponse.json({ error: 'Ação e chave de idempotência válidas são obrigatórias' }, { status: 400 });
    }

    if (parsedAction.action === 'copy') {
      return await handleCopyAction(ctx, body, parsedAction.key);
    }

    if (parsedAction.action === 'search') {
      return await handleSearchAction(ctx, body, parsedAction.key);
    }

    return NextResponse.json({ error: 'Ação desconhecida' }, { status: 400 });
  } catch (err: unknown) {
    if (err instanceof OsError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Falha na operação de IA.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
