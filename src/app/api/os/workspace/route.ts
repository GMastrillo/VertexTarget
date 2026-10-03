import { NextResponse } from 'next/server';
import { getOsConfig } from '@/lib/os/config';
import { OsError } from '@/lib/os/errors';
import { readLimitedJson, requireCanonicalOrigin } from '@/lib/os/http';
import {
  ensureWorkspace,
  updateWorkspace,
  deleteWorkspaceAfterReauthentication,
} from '@/lib/os/workspace-repository';
import type { Journey } from '@/lib/os/types';

export async function POST(request: Request): Promise<NextResponse> {
  const config = getOsConfig();
  try {
    requireCanonicalOrigin(request, config.appUrl);
    const body = (await readLimitedJson(request, 8192)) as {
      name: string;
      journey: Journey;
      noticeVersion?: string;
      termsAccepted?: boolean;
    };

    if (!body?.name || !body?.journey || body.termsAccepted !== true) {
      return NextResponse.json({ error: 'Dados de workspace incompletos' }, { status: 400 });
    }

    const workspace = await ensureWorkspace({
      name: body.name,
      journey: body.journey,
      noticeVersion: body.noticeVersion || '2026-10-02',
      termsAccepted: true,
    });

    return NextResponse.json({ ok: true, workspace }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof OsError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Falha ao provisionar workspace.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request): Promise<NextResponse> {
  const config = getOsConfig();
  try {
    requireCanonicalOrigin(request, config.appUrl);
    const body = (await readLimitedJson(request, 8192)) as {
      name: string;
      journey: Journey;
    };

    if (!body?.name || !body?.journey) {
      return NextResponse.json({ error: 'Dados para atualização incompletos' }, { status: 400 });
    }

    const workspace = await updateWorkspace({
      name: body.name,
      journey: body.journey,
    });

    return NextResponse.json({ ok: true, workspace }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof OsError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Falha ao atualizar workspace.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const config = getOsConfig();
  try {
    requireCanonicalOrigin(request, config.appUrl);
    const body = (await readLimitedJson(request, 8192)) as { password?: string };

    if (!body?.password) {
      return NextResponse.json({ error: 'Senha de reautenticação necessária' }, { status: 400 });
    }

    await deleteWorkspaceAfterReauthentication(body.password);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof OsError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Falha ao excluir workspace.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
