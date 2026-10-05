import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase-server';
import { getConfirmedIdentity } from './auth.ts';
import { OsError } from './errors.ts';
import type { OsWorkspace, Journey } from './types.ts';
import type { RegionalPreferences } from '../region/types.ts';
import { normalizeLocale } from '../i18n/locales.ts';
import { isValidCountryCode, isValidTimeZone } from '../region/validation.ts';

interface WorkspaceRow {
  id: string;
  name: string;
  journey: Journey;
  status: 'active' | 'suspended' | 'deleted';
  plan: 'free';
  locale?: string | null;
  country_code?: string | null;
  time_zone?: string | null;
}

function mapWorkspaceRow(data: WorkspaceRow): OsWorkspace {
  const locale = normalizeLocale(data.locale) || 'pt-BR';
  const country = (data.country_code && isValidCountryCode(data.country_code)) ? data.country_code : 'BR';
  const timeZone = (data.time_zone && isValidTimeZone(data.time_zone)) ? data.time_zone : 'UTC';

  return {
    id: data.id,
    name: data.name,
    journey: data.journey,
    status: data.status,
    plan: data.plan,
    regionalPreferences: {
      locale,
      country,
      timeZone,
    },
  };
}

export async function getWorkspace(): Promise<OsWorkspace | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const identity = await getConfirmedIdentity();
  if (!identity) return null;

  const { data, error } = await supabase
    .from('os_workspaces')
    .select('id, name, journey, status, plan, locale, country_code, time_zone')
    .eq('owner_id', identity.userId)
    .neq('status', 'deleted')
    .maybeSingle();

  if (error || !data) return null;
  return mapWorkspaceRow(data as WorkspaceRow);
}

export async function ensureWorkspace(input: {
  name: string;
  journey: Journey;
  noticeVersion: string;
  termsAccepted: true;
  regionalPreferences?: RegionalPreferences;
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

  let workspace = mapWorkspaceRow(data as WorkspaceRow);

  if (input.regionalPreferences) {
    const { data: regData, error: regError } = await adminClient.rpc('os_set_regional_preferences', {
      p_user_id: identity.userId,
      p_locale: input.regionalPreferences.locale,
      p_country: input.regionalPreferences.country,
      p_time_zone: input.regionalPreferences.timeZone,
    });

    if (regError || !regData) {
      throw new OsError('invalid', regError?.message || 'Falha ao salvar preferências regionais');
    }
    workspace = mapWorkspaceRow(regData as WorkspaceRow);
  }

  return workspace;
}

export async function updateWorkspace(input: {
  name: string;
  journey: Journey;
  regionalPreferences?: RegionalPreferences;
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

  let workspace = mapWorkspaceRow(data as WorkspaceRow);

  if (input.regionalPreferences) {
    const { data: regData, error: regError } = await adminClient.rpc('os_set_regional_preferences', {
      p_user_id: identity.userId,
      p_locale: input.regionalPreferences.locale,
      p_country: input.regionalPreferences.country,
      p_time_zone: input.regionalPreferences.timeZone,
    });

    if (regError || !regData) {
      throw new OsError('invalid', regError?.message || 'Falha ao atualizar preferências regionais');
    }
    workspace = mapWorkspaceRow(regData as WorkspaceRow);
  }

  return workspace;
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
