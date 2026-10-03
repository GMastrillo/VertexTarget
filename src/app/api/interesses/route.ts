import { NextResponse } from 'next/server';
import { getOsConfig } from '@/lib/os/config';
import { OsError } from '@/lib/os/errors';
import { readLimitedJson, requireCanonicalOrigin } from '@/lib/os/http';
import { parseInterestInput } from '@/lib/interests/validation';
import { submitInterest } from '@/lib/interests/service';

export async function POST(request: Request): Promise<NextResponse> {
  const config = getOsConfig();

  try {
    requireCanonicalOrigin(request, config.appUrl);

    const body = await readLimitedJson(request, 8192);
    const parsed = parseInterestInput(body);

    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.reason }, { status: 400 });
    }

    await submitInterest(request, parsed.value);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof OsError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }

    const message = err instanceof Error ? err.message : 'Erro interno ao processar interesse.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
