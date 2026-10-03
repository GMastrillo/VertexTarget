import { NextResponse } from 'next/server';
import { getOsConfig } from '@/lib/os/config';
import { OsError } from '@/lib/os/errors';
import { readLimitedJson, requireCanonicalOrigin } from '@/lib/os/http';
import { parseAuthInput } from '@/lib/os/validation';
import { login } from '@/lib/os/auth-service';

export async function POST(request: Request): Promise<NextResponse> {
  const config = getOsConfig();
  try {
    requireCanonicalOrigin(request, config.appUrl);
    const body = await readLimitedJson(request, 8192);
    const parsed = parseAuthInput(body);

    if (!parsed.ok || parsed.value.action !== 'login') {
      return NextResponse.json({ error: parsed.ok ? 'Ação inválida' : parsed.reason }, { status: 400 });
    }

    await login(parsed.value);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof OsError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Falha ao autenticar usuário.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
