import { createSupabaseServerClient } from '@/lib/supabase-server';
import { confirmedIdentity, assertActiveWorkspace } from './auth-policy.ts';
import { getWorkspace } from './workspace-repository.ts';
import { OsError } from './errors.ts';
import type { ConfirmedIdentity, OsContext } from './types.ts';

export async function getConfirmedIdentity(): Promise<ConfirmedIdentity | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return confirmedIdentity(user);
}

export async function requireOsContext(): Promise<OsContext> {
  const identity = await getConfirmedIdentity();
  if (!identity) {
    throw new OsError('unauthenticated', 'Sessão não autenticada ou e-mail não confirmado');
  }

  const workspace = await getWorkspace();
  return assertActiveWorkspace(identity, workspace);
}
