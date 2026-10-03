import { NextResponse, type NextRequest } from 'next/server';
import { verifyEmailConfirmation } from '@/lib/os/auth-service';
import type { EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') || '/os';

  if (token_hash && type) {
    const verified = await verifyEmailConfirmation(token_hash, type);
    if (verified) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(
    new URL('/os/entrar?error=confirm_failed', request.url)
  );
}
