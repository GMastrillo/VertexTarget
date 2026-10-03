import { NextResponse } from 'next/server';
import { getOsConfig } from '@/lib/os/config';
import { OsError } from '@/lib/os/errors';
import { readLimitedJson, requireCanonicalOrigin } from '@/lib/os/http';
import { requireOsContext } from '@/lib/os/auth';
import { publishProject, unpublishProject, getWorkspacePublication } from '@/lib/os/publication-repository';

export async function GET(): Promise<NextResponse> {
  try {
    const ctx = await requireOsContext();
    const publication = await getWorkspacePublication(ctx);
    return NextResponse.json({ ok: true, publication }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof OsError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }
    return NextResponse.json({ error: 'Falha ao buscar publicação.' }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const config = getOsConfig();
  try {
    requireCanonicalOrigin(request, config.appUrl);
    const ctx = await requireOsContext();
    const body = (await readLimitedJson(request, 16384)) as {
      id: string;
      expectedVersion: number;
      contentAccepted: true;
    };

    if (!body?.id || typeof body.expectedVersion !== 'number' || body.contentAccepted !== true) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos. É necessário confirmar o consentimento de conteúdo.' },
        { status: 400 }
      );
    }

    const publication = await publishProject(ctx, {
      id: body.id,
      expectedVersion: body.expectedVersion,
      contentAccepted: true,
    });

    return NextResponse.json({ ok: true, publication }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof OsError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Falha ao publicar projeto.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const config = getOsConfig();
  try {
    requireCanonicalOrigin(request, config.appUrl);
    const ctx = await requireOsContext();
    const body = (await readLimitedJson(request, 8192)) as { id: string };

    if (!body?.id || typeof body.id !== 'string') {
      return NextResponse.json({ error: 'ID do projeto é obrigatório' }, { status: 400 });
    }

    await unpublishProject(ctx, body.id);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof OsError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Falha ao despublicar projeto.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
