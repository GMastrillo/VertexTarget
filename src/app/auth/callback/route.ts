import { NextResponse, type NextRequest } from 'next/server';
import {
  RECOVERY_COOKIE_NAME,
  exchangeCallbackCode,
  verifyRecoveryCallback,
} from '@/lib/os/auth-service';
import { allowedOsReturnPath } from '@/lib/os/auth-policy';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const nextRaw = requestUrl.searchParams.get('next');
  const nextPath = allowedOsReturnPath(nextRaw);

  if (type === 'recovery') {
    const proof = await verifyRecoveryCallback({ code, token_hash });
    if (proof) {
      const response = NextResponse.redirect(new URL('/os/redefinir-senha', request.url));
      response.cookies.set(RECOVERY_COOKIE_NAME, proof, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600,
        path: '/',
      });
      return response;
    }
    return NextResponse.redirect(new URL('/os/recuperar?error=recovery_expired', request.url));
  }

  if (code) {
    const ok = await exchangeCallbackCode(code);
    if (ok) {
      return NextResponse.redirect(new URL(nextPath, request.url));
    }
  }

  return NextResponse.redirect(new URL('/os/entrar?error=auth_failed', request.url));
}
