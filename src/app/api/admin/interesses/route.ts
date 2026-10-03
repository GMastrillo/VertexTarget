import { NextResponse } from 'next/server';
import { OsError } from '@/lib/os/errors';
import { listTeamInterests } from '@/lib/interests/service';

export async function GET(): Promise<NextResponse> {
  try {
    const interests = await listTeamInterests();
    return NextResponse.json({ ok: true, interests }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof OsError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }

    const message = err instanceof Error ? err.message : 'Falha ao carregar lista de interesses.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
