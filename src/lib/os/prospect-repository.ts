import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase-server';
import { OsError } from './errors.ts';
import { parseProspectInput } from './validation.ts';
import type { OsContext, OsProspect, ProspectInput, ProspectStatus, SearchSource } from './types.ts';

function mapProspectRow(row: Record<string, unknown>): OsProspect {
  return {
    id: String(row.id),
    name: String(row.name),
    sector: String(row.sector || ''),
    city: String(row.city || ''),
    website: String(row.website || ''),
    email: String(row.email || ''),
    phone: String(row.phone || ''),
    notes: String(row.notes || ''),
    status: row.status as ProspectStatus,
    sources: (row.sources as SearchSource[]) || [],
  };
}

export async function listProspects(ctx: OsContext): Promise<OsProspect[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new OsError('unavailable', 'Serviço indisponível.');

  const { data, error } = await supabase
    .from('os_prospects')
    .select('id, name, sector, city, website, email, phone, notes, status, sources, updated_at')
    .eq('workspace_id', ctx.workspace.id)
    .order('updated_at', { ascending: false });

  if (error) {
    throw new OsError('invalid', error.message || 'Falha ao listar prospects.');
  }

  return (data || []).map(mapProspectRow);
}

export async function createProspect(
  ctx: OsContext,
  input: ProspectInput & { sources?: SearchSource[] }
): Promise<OsProspect> {
  const parsed = parseProspectInput(input);
  if (!parsed.ok) {
    throw new OsError('invalid', parsed.reason);
  }

  const admin = createSupabaseAdminClient();
  if (!admin) throw new OsError('unavailable', 'Serviço indisponível.');

  const { data, error } = await admin.rpc('os_create_prospect', {
    p_user_id: ctx.userId,
    p_input: {
      ...parsed.value,
      sources: input.sources || [],
    },
  });

  if (error) {
    if (error.message?.includes('PROSPECT_LIMIT_EXCEEDED')) {
      throw new OsError('limited', 'Limite de 50 prospects do plano gratuito atingido.');
    }
    throw new OsError('invalid', error.message || 'Falha ao criar prospect.');
  }

  return mapProspectRow(data as Record<string, unknown>);
}

export async function updateProspect(
  ctx: OsContext,
  input: { id: string; data: ProspectInput }
): Promise<OsProspect> {
  const parsed = parseProspectInput(input.data);
  if (!parsed.ok) {
    throw new OsError('invalid', parsed.reason);
  }

  const admin = createSupabaseAdminClient();
  if (!admin) throw new OsError('unavailable', 'Serviço indisponível.');

  const { data, error } = await admin.rpc('os_update_prospect', {
    p_user_id: ctx.userId,
    p_id: input.id,
    p_input: parsed.value,
  });

  if (error) {
    if (error.message?.includes('PROSPECT_NOT_FOUND')) {
      throw new OsError('not-found', 'Prospect não encontrado.');
    }
    throw new OsError('invalid', error.message || 'Falha ao atualizar prospect.');
  }

  return mapProspectRow(data as Record<string, unknown>);
}

export async function moveProspect(
  ctx: OsContext,
  input: { id: string; status: ProspectStatus }
): Promise<void> {
  const admin = createSupabaseAdminClient();
  if (!admin) throw new OsError('unavailable', 'Serviço indisponível.');

  const { error } = await admin.rpc('os_move_prospect', {
    p_user_id: ctx.userId,
    p_id: input.id,
    p_status: input.status,
  });

  if (error) {
    if (error.message?.includes('PROSPECT_NOT_FOUND')) {
      throw new OsError('not-found', 'Prospect não encontrado.');
    }
    if (error.message?.includes('INVALID_STATUS')) {
      throw new OsError('invalid', 'Status de prospect inválido.');
    }
    throw new OsError('invalid', error.message || 'Falha ao mover prospect.');
  }
}

export async function deleteProspect(ctx: OsContext, id: string): Promise<void> {
  const admin = createSupabaseAdminClient();
  if (!admin) throw new OsError('unavailable', 'Serviço indisponível.');

  const { error } = await admin.rpc('os_delete_prospect', {
    p_user_id: ctx.userId,
    p_id: id,
  });

  if (error) {
    if (error.message?.includes('PROSPECT_NOT_FOUND')) {
      throw new OsError('not-found', 'Prospect não encontrado.');
    }
    throw new OsError('invalid', error.message || 'Falha ao excluir prospect.');
  }
}
