import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getOsConfig } from './config.ts';
import { verifyCaptcha } from '../captcha.ts';
import { OsError } from './errors.ts';
import { safeAuthMessage } from './auth-policy.ts';
import {
  createRecoveryProof,
  verifyRecoveryProof,
  RECOVERY_COOKIE_NAME,
} from './auth-recovery.ts';
import type { EmailOtpType } from '@supabase/supabase-js';

export { createRecoveryProof, verifyRecoveryProof, RECOVERY_COOKIE_NAME };


export async function signup(input: {
  name: string;
  email: string;
  password: string;
  captchaToken: string;
  termsAccepted: true;
  noticeVersion: string;
}): Promise<void> {
  const config = getOsConfig();
  const captchaOk = await verifyCaptcha({ token: input.captchaToken });
  if (!captchaOk && config.hcaptchaSecret) {
    throw new OsError('invalid', 'Verificação de segurança falhou.');
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new OsError('unavailable', 'Serviço indisponível.');

  const { error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name,
        terms_accepted: true,
        notice_version: input.noticeVersion,
      },
      emailRedirectTo: `${config.appUrl}/auth/confirm`,
    },
  });

  if (error) {
    throw new OsError('invalid', safeAuthMessage(error));
  }
}

export async function login(input: {
  email: string;
  password: string;
  captchaToken: string;
}): Promise<void> {
  const config = getOsConfig();
  const captchaOk = await verifyCaptcha({ token: input.captchaToken });
  if (!captchaOk && config.hcaptchaSecret) {
    throw new OsError('invalid', 'Verificação de segurança falhou.');
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new OsError('unavailable', 'Serviço indisponível.');

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    throw new OsError('unauthenticated', safeAuthMessage(error));
  }

  if (!data.user.email_confirmed_at) {
    await supabase.auth.signOut();
    throw new OsError('unauthenticated', 'E-mail ainda não confirmado. Verifique sua caixa de entrada.');
  }
}

export async function resendConfirmation(input: {
  email: string;
  captchaToken: string;
}): Promise<void> {
  const config = getOsConfig();
  const captchaOk = await verifyCaptcha({ token: input.captchaToken });
  if (!captchaOk && config.hcaptchaSecret) {
    throw new OsError('invalid', 'Verificação de segurança falhou.');
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new OsError('unavailable', 'Serviço indisponível.');

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: input.email,
    options: {
      emailRedirectTo: `${config.appUrl}/auth/confirm`,
    },
  });

  if (error) {
    throw new OsError('invalid', safeAuthMessage(error));
  }
}

export async function recoverPassword(input: {
  email: string;
  captchaToken: string;
}): Promise<void> {
  const config = getOsConfig();
  const captchaOk = await verifyCaptcha({ token: input.captchaToken });
  if (!captchaOk && config.hcaptchaSecret) {
    throw new OsError('invalid', 'Verificação de segurança falhou.');
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new OsError('unavailable', 'Serviço indisponível.');

  const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
    redirectTo: `${config.appUrl}/auth/callback?type=recovery`,
  });

  if (error) {
    throw new OsError('invalid', safeAuthMessage(error));
  }
}

export async function setRecoveredPassword(password: string): Promise<void> {
  const cookieStore = await cookies();
  const proofToken = cookieStore.get(RECOVERY_COOKIE_NAME)?.value;
  const verified = verifyRecoveryProof(proofToken);

  if (!verified) {
    throw new OsError('forbidden', 'Sessão de recuperação expirada ou inválida. Solicite nova redefinição.');
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new OsError('unavailable', 'Serviço indisponível.');

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    throw new OsError('invalid', safeAuthMessage(error));
  }

  cookieStore.set(RECOVERY_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export async function verifyEmailConfirmation(
  token_hash: string,
  type: EmailOtpType
): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return false;
  const { error } = await supabase.auth.verifyOtp({ token_hash, type });
  return !error;
}

export async function exchangeCallbackCode(code: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return false;
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return !error;
}

export async function verifyRecoveryCallback(params: {
  code?: string | null;
  token_hash?: string | null;
}): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  let verifiedUser: { id: string; email?: string } | null = null;
  if (params.code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(params.code);
    if (!error && data.user) verifiedUser = data.user;
  } else if (params.token_hash) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: params.token_hash,
      type: 'recovery',
    });
    if (!error && data.user) verifiedUser = data.user;
  }

  if (verifiedUser?.email) {
    return createRecoveryProof(verifiedUser.id, verifiedUser.email);
  }
  return null;
}

export async function logout(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
}

