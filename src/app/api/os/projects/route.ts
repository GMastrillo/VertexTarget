import { NextResponse } from 'next/server';
import { getOsConfig } from '@/lib/os/config';
import { OsError } from '@/lib/os/errors';
import { readLimitedJson, requireCanonicalOrigin } from '@/lib/os/http';
import { requireOsContext } from '@/lib/os/auth';
import { createProject, saveProject, deleteProject } from '@/lib/os/project-repository';
import type { ProjectBriefing, SiteDocument } from '@/lib/os/types';

export async function POST(request: Request): Promise<NextResponse> {
  const config = getOsConfig();
  try {
    requireCanonicalOrigin(request, config.appUrl);
    const ctx = await requireOsContext();
    const body = (await readLimitedJson(request, 32768)) as {
      briefing: ProjectBriefing;
      prospectId?: string;
    };

    if (!body || !body.briefing) {
      return NextResponse.json({ error: 'Briefing do projeto é obrigatório' }, { status: 400 });
    }

    const project = await createProject(ctx, {
      briefing: body.briefing,
      prospectId: body.prospectId,
    });

    return NextResponse.json({ ok: true, project }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof OsError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Falha ao criar projeto.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request): Promise<NextResponse> {
  const config = getOsConfig();
  try {
    requireCanonicalOrigin(request, config.appUrl);
    const ctx = await requireOsContext();
    const body = (await readLimitedJson(request, 32768)) as {
      id: string;
      expectedVersion: number;
      document: SiteDocument;
    };

    if (!body?.id || typeof body.expectedVersion !== 'number' || !body.document) {
      return NextResponse.json({ error: 'Parâmetros de salvamento inválidos' }, { status: 400 });
    }

    const project = await saveProject(ctx, {
      id: body.id,
      expectedVersion: body.expectedVersion,
      document: body.document,
    });

    return NextResponse.json({ ok: true, project }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof OsError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Falha ao salvar projeto.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const config = getOsConfig();
  try {
    requireCanonicalOrigin(request, config.appUrl);
    const ctx = await requireOsContext();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID do projeto não fornecido' }, { status: 400 });
    }

    await deleteProject(ctx, id);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof OsError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Falha ao excluir projeto.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
