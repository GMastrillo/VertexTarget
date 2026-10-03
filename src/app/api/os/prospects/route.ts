import { NextResponse } from 'next/server';
import { getOsConfig } from '@/lib/os/config';
import { OsError } from '@/lib/os/errors';
import { readLimitedJson, requireCanonicalOrigin } from '@/lib/os/http';
import { requireOsContext } from '@/lib/os/auth';
import {
  listProspects,
  createProspect,
  updateProspect,
  moveProspect,
  deleteProspect,
} from '@/lib/os/prospect-repository';
import type { ProspectInput, ProspectStatus, SearchSource } from '@/lib/os/types';

export async function GET(): Promise<NextResponse> {
  try {
    const ctx = await requireOsContext();
    const prospects = await listProspects(ctx);
    return NextResponse.json({ ok: true, prospects }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof OsError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }
    return NextResponse.json({ error: 'Falha ao buscar prospects.' }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const config = getOsConfig();
  try {
    requireCanonicalOrigin(request, config.appUrl);
    const ctx = await requireOsContext();
    const body = (await readLimitedJson(request, 16384)) as ProspectInput & {
      sources?: SearchSource[];
    };

    if (!body?.name) {
      return NextResponse.json({ error: 'Nome do prospect é obrigatório' }, { status: 400 });
    }

    const prospect = await createProspect(ctx, body);
    return NextResponse.json({ ok: true, prospect }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof OsError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Falha ao criar prospect.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request): Promise<NextResponse> {
  const config = getOsConfig();
  try {
    requireCanonicalOrigin(request, config.appUrl);
    const ctx = await requireOsContext();
    const body = (await readLimitedJson(request, 16384)) as {
      id: string;
      status?: ProspectStatus;
      data?: ProspectInput;
    };

    if (!body?.id) {
      return NextResponse.json({ error: 'ID do prospect é obrigatório' }, { status: 400 });
    }

    if (body.status) {
      await moveProspect(ctx, { id: body.id, status: body.status });
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (body.data) {
      const updated = await updateProspect(ctx, { id: body.id, data: body.data });
      return NextResponse.json({ ok: true, prospect: updated }, { status: 200 });
    }

    return NextResponse.json({ error: 'Nenhuma alteração informada' }, { status: 400 });
  } catch (err: unknown) {
    if (err instanceof OsError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Falha ao atualizar prospect.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const config = getOsConfig();
  try {
    requireCanonicalOrigin(request, config.appUrl);
    const ctx = await requireOsContext();
    const body = (await readLimitedJson(request, 8192)) as { id: string };

    if (!body?.id) {
      return NextResponse.json({ error: 'ID do prospect é obrigatório' }, { status: 400 });
    }

    await deleteProspect(ctx, body.id);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof OsError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Falha ao excluir prospect.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
