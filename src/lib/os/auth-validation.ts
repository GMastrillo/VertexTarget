import type { ParseResult } from './types.ts';
import { isRecord, hasOnlyAllowedKeys, validateLength } from './validation-utils.ts';

export type AuthInput =
  | {
      action: 'signup';
      name: string;
      email: string;
      password: string;
      termsAccepted: true;
      noticeVersion: string;
      captchaToken: string;
    }
  | {
      action: 'login';
      email: string;
      password: string;
      captchaToken: string;
    }
  | {
      action: 'resend';
      email: string;
      captchaToken: string;
    }
  | {
      action: 'recover';
      email: string;
      captchaToken: string;
    }
  | {
      action: 'password';
      password: string;
    }
  | {
      action: 'logout';
    };

function isValidEmail(val: unknown): val is string {
  if (typeof val !== 'string') return false;
  const trimmed = val.trim();
  return trimmed.length > 3 && trimmed.length <= 254 && trimmed.includes('@');
}

function parseSignup(input: Record<string, unknown>): ParseResult<AuthInput> {
  const allowed = new Set(['action', 'name', 'email', 'password', 'termsAccepted', 'noticeVersion', 'captchaToken']);
  if (!hasOnlyAllowedKeys(input, allowed)) {
    return { ok: false, reason: 'Propriedades extras não permitidas no cadastro' };
  }

  const nameRes = validateLength(input.name, 2, 120, 'Nome');
  if (!nameRes.ok) return nameRes;

  if (!isValidEmail(input.email)) {
    return { ok: false, reason: 'E-mail inválido' };
  }

  const pwdRes = validateLength(input.password, 12, 128, 'Senha');
  if (!pwdRes.ok) return pwdRes;

  if (input.termsAccepted !== true) {
    return { ok: false, reason: 'Você precisa aceitar os termos de serviço e privacidade' };
  }

  const notice = typeof input.noticeVersion === 'string' ? input.noticeVersion.trim() : '';
  if (!notice) {
    return { ok: false, reason: 'Versão do termo de privacidade ausente' };
  }

  const token = typeof input.captchaToken === 'string' ? input.captchaToken.trim() : '';
  if (!token) {
    return { ok: false, reason: 'Verificação de segurança necessária' };
  }

  return {
    ok: true,
    value: {
      action: 'signup',
      name: nameRes.value,
      email: (input.email as string).trim().toLowerCase(),
      password: pwdRes.value,
      termsAccepted: true,
      noticeVersion: notice,
      captchaToken: token,
    },
  };
}

function parseLoginOrResend(input: Record<string, unknown>): ParseResult<AuthInput> {
  const action = input.action;

  if (!isValidEmail(input.email)) {
    return { ok: false, reason: 'E-mail inválido' };
  }
  const email = (input.email as string).trim().toLowerCase();

  const token = typeof input.captchaToken === 'string' ? input.captchaToken.trim() : '';
  if (!token) {
    return { ok: false, reason: 'Verificação de segurança necessária' };
  }

  if (action === 'resend') {
    return { ok: true, value: { action: 'resend', email, captchaToken: token } };
  }

  if (action === 'recover') {
    return { ok: true, value: { action: 'recover', email, captchaToken: token } };
  }

  const pwdRes = validateLength(input.password, 12, 128, 'Senha');
  if (!pwdRes.ok) return pwdRes;

  return { ok: true, value: { action: 'login', email, password: pwdRes.value, captchaToken: token } };
}

export function parseAuthInput(input: unknown): ParseResult<AuthInput> {
  if (!isRecord(input)) {
    return { ok: false, reason: 'Payload de autenticação deve ser um objeto' };
  }

  const action = input.action;
  if (action === 'logout') {
    return { ok: true, value: { action: 'logout' } };
  }

  if (action === 'signup') {
    return parseSignup(input);
  }

  if (action === 'login' || action === 'resend' || action === 'recover') {
    return parseLoginOrResend(input);
  }

  if (action === 'password') {
    const pwdRes = validateLength(input.password, 12, 128, 'Nova Senha');
    if (!pwdRes.ok) return pwdRes;
    return { ok: true, value: { action: 'password', password: pwdRes.value } };
  }

  return { ok: false, reason: 'Ação de autenticação não suportada' };
}
