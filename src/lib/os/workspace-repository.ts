import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase-server';
import { getConfirmedIdentity } from './auth.ts';
import { OsError } from './errors.ts';
import type { OsWorkspace, Journey } from './types.ts';

export async function getWorkspace(): Promise<OsWorkspace | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const identity = await getConfirmedIdentity();
  if (!identity) return null;

  const { data, error } = await supabase
    .from('os_workspaces')
    .select('id, name, journey, status, plan')
    .eq('owner_id', identity.userId)
    .neq('status', 'deleted')
    .maybeSingle();

  if (error || !data) return null;
  return data as OsWorkspace;
}

export async function ensureWorkspace(input: {
  name: string;
  journey: Journey;
  noticeVersion: string;
  termsAccepted: true;
}): Promise<OsWorkspace> {
  const identity = await getConfirmedIdentity();
  if (!identity) {
    throw new OsError('unauthenticated', 'Sessão necessária para criar workspace');
  }

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    throw new OsError('unavailable', 'Serviço de banco de dados indisponível');
  }

  const { data, error } = await adminClient.rpc('os_ensure_workspace', {
    p_user_id: identity.userId,
    p_name: input.name.trim(),
    p_journey: input.journey,
    p_notice_version: input.noticeVersion,
  });

  if (error || !data) {
    throw new OsError('invalid', error?.message || 'Falha ao provisionar workspace');
  }

  return data as OsWorkspace;
}

export async function updateWorkspace(input: {
  name: string;
  journey: Journey;
}): Promise<OsWorkspace> {
  const identity = await getConfirmedIdentity();
  if (!identity) {
    throw new OsError('unauthenticated', 'Sessão necessária');
  }

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    throw new OsError('unavailable', 'Serviço de banco de dados indisponível');
  }

  const { data, error } = await adminClient.rpc('os_update_workspace', {
    p_user_id: identity.userId,
    p_name: input.name.trim(),
    p_journey: input.journey,
  });

  if (error || !data) {
    throw new OsError('invalid', error?.message || 'Falha ao atualizar workspace');
  }

  return data as OsWorkspace;
}

export async function deleteWorkspaceAfterReauthentication(password: string): Promise<void> {
  const identity = await getConfirmedIdentity();
  if (!identity) {
    throw new OsError('unauthenticated', 'Sessão necessária');
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new OsError('unavailable', 'Serviço de autenticação indisponível');
  }

  const { error: authError } = await supabase.auth.signInWithPassword({
    email: identity.email,
    password,
  });

  if (authError) {
    throw new OsError('unauthenticated', 'Senha incorreta para confirmação de exclusão');
  }

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    throw new OsError('unavailable', 'Serviço de banco de dados indisponível');
  }

  const { error: rpcError } = await adminClient.rpc('os_delete_workspace', {
    p_user_id: identity.userId,
  });

  if (rpcError) {
    throw new OsError('invalid', rpcError.message || 'Falha ao excluir workspace');
  }
}
