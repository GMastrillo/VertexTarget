import type { ConfirmedIdentity, OsWorkspace, OsContext } from './types.ts';
import { OsError } from './errors.ts';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function confirmedIdentity(input: unknown): ConfirmedIdentity | null {
  if (!isRecord(input)) {
    return null;
  }

  const userId = typeof input.id === 'string' ? input.id.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const confirmedAt = typeof input.email_confirmed_at === 'string' ? input.email_confirmed_at.trim() : '';

  if (!userId || !email || !confirmedAt) {
    return null;
  }

  return {
    userId,
    email,
  };
}

export function assertActiveWorkspace(
  identity: ConfirmedIdentity,
  workspace: OsWorkspace | null
): OsContext {
  if (!workspace || workspace.status === 'deleted') {
    throw new OsError('not-found', 'Workspace não encontrado ou excluído');
  }

  if (workspace.status === 'suspended') {
    throw new OsError('forbidden', 'Workspace suspenso por moderação ou violação de termos');
  }

  return {
    ...identity,
    workspace,
  };
}

/**
 * Validates return URL parameter strictly to paths starting with /os.
 * Prevents open redirects, protocol-relative attacks, backslash escapes and admin routes.
 */
export function allowedOsReturnPath(input: unknown): string {
  if (typeof input !== 'string') {
    return '/os';
  }

  const trimmed = input.trim();
  if (
    !trimmed.startsWith('/os') ||
    trimmed.startsWith('//') ||
    trimmed.includes('\\') ||
    trimmed.startsWith('/admin')
  ) {
    return '/os';
  }

  // Reject URLs with schemes (e.g. javascript:, https:, etc.)
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)) {
    return '/os';
  }

  return trimmed;
}

/**
 * Sanitizes auth errors to prevent leaking raw server messages, database schemas or secrets.
 */
export function safeAuthMessage(error: unknown): string {
  if (!error) {
    return 'Ocorreu um erro na autenticação. Tente novamente.';
  }

  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();

  if (lower.includes('invalid login credentials') || lower.includes('invalid credentials')) {
    return 'E-mail ou senha incorretos.';
  }

  if (lower.includes('user already registered') || lower.includes('already exists')) {
    return 'Este endereço de e-mail já está cadastrado.';
  }

  if (lower.includes('email not confirmed')) {
    return 'E-mail ainda não confirmado. Verifique seu e-mail para ativar sua conta.';
  }

  if (lower.includes('rate limit') || lower.includes('too many requests')) {
    return 'Muitas tentativas em pouco tempo. Aguarde alguns instantes.';
  }

  if (lower.includes('password should be at least')) {
    return 'A senha deve possuir no mínimo 12 caracteres.';
  }

  return 'Não foi possível concluir a operação de autenticação. Verifique os dados informados.';
}
