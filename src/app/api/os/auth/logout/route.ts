import { NextResponse } from 'next/server';
import { getOsConfig } from '@/lib/os/config';
import { requireCanonicalOrigin } from '@/lib/os/http';
import { logout } from '@/lib/os/auth-service';

export async function POST(request: Request): Promise<NextResponse> {
  const config = getOsConfig();
  try {
    requireCanonicalOrigin(request, config.appUrl);
    await logout();
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Falha ao encerrar sessão.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
