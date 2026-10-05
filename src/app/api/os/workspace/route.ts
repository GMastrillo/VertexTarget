import { NextResponse } from 'next/server';
import { getOsConfig } from '@/lib/os/config';
import { OsError } from '@/lib/os/errors';
import { readLimitedJson, requireCanonicalOrigin } from '@/lib/os/http';
import {
  ensureWorkspace,
  updateWorkspace,
  deleteWorkspaceAfterReauthentication,
} from '@/lib/os/workspace-repository';
import { parseWorkspaceInput } from '@/lib/os/workspace-validation';

export async function POST(request: Request): Promise<NextResponse> {
  const config = getOsConfig();
  try {
    requireCanonicalOrigin(request, config.appUrl);
    const rawBody = await readLimitedJson(request, 8192);
    const parsed = parseWorkspaceInput(rawBody, 'create');

    if (!parsed.ok) {
      return NextResponse.json(
        { error: 'Dados de workspace inválidos', code: parsed.code },
        { status: 400 }
      );
    }

    const workspace = await ensureWorkspace({
      name: parsed.value.name,
      journey: parsed.value.journey,
      noticeVersion: parsed.value.noticeVersion || '2026-10-02',
      termsAccepted: true,
      regionalPreferences: parsed.value.regionalPreferences,
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
    const rawBody = await readLimitedJson(request, 8192);
    const parsed = parseWorkspaceInput(rawBody, 'update');

    if (!parsed.ok) {
      return NextResponse.json(
        { error: 'Dados para atualização inválidos', code: parsed.code },
        { status: 400 }
      );
    }

    const workspace = await updateWorkspace({
      name: parsed.value.name,
      journey: parsed.value.journey,
      regionalPreferences: parsed.value.regionalPreferences,
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
