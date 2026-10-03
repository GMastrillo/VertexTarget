import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase-server';
import { OsError } from './errors.ts';
import { documentFromBriefing, parseProjectBriefing, parseSiteDocument } from './validation.ts';
import type { OsContext, OsProject, ProjectBriefing, SiteDocument } from './types.ts';

function mapProjectRow(row: Record<string, unknown>): OsProject {
  return {
    id: String(row.id),
    workspaceId: String(row.workspace_id || row.workspaceId),
    briefing: row.briefing as ProjectBriefing,
    document: row.document as SiteDocument,
    version: Number(row.version),
    updatedAt: String(row.updated_at || row.updatedAt),
  };
}

export async function listProjects(ctx: OsContext): Promise<OsProject[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new OsError('unavailable', 'Serviço indisponível.');

  const { data, error } = await supabase
    .from('os_projects')
    .select('id, workspace_id, briefing, document, version, updated_at')
    .eq('workspace_id', ctx.workspace.id)
    .order('updated_at', { ascending: false });

  if (error) {
    throw new OsError('invalid', error.message || 'Falha ao listar projetos.');
  }

  return (data || []).map(mapProjectRow);
}

export async function getProject(ctx: OsContext, id: string): Promise<OsProject | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new OsError('unavailable', 'Serviço indisponível.');

  const { data, error } = await supabase
    .from('os_projects')
    .select('id, workspace_id, briefing, document, version, updated_at')
    .eq('id', id)
    .eq('workspace_id', ctx.workspace.id)
    .maybeSingle();

  if (error || !data) return null;
  return mapProjectRow(data);
}

export async function createProject(
  ctx: OsContext,
  input: { briefing: ProjectBriefing; prospectId?: string }
): Promise<OsProject> {
  const briefingRes = parseProjectBriefing(input.briefing);
  if (!briefingRes.ok) {
    throw new OsError('invalid', briefingRes.reason);
  }

  const document = documentFromBriefing(briefingRes.value);
  const docRes = parseSiteDocument(document);
  if (!docRes.ok) {
    throw new OsError('invalid', docRes.reason);
  }

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) throw new OsError('unavailable', 'Serviço de banco de dados indisponível.');

  const { data, error } = await adminClient.rpc('os_create_project', {
    p_user_id: ctx.userId,
    p_briefing: briefingRes.value,
    p_document: docRes.value,
    p_prospect_id: input.prospectId || null,
  });

  if (error) {
    const msg = error.message || '';
    if (msg.includes('Limite')) {
      throw new OsError('limited', 'Limite do plano gratuito atingido: 1 projeto permitido.');
    }
    throw new OsError('invalid', msg || 'Falha ao criar projeto.');
  }

  return mapProjectRow(data as Record<string, unknown>);
}

export async function saveProject(
  ctx: OsContext,
  input: { id: string; expectedVersion: number; document: SiteDocument }
): Promise<OsProject> {
  const docRes = parseSiteDocument(input.document);
  if (!docRes.ok) {
    throw new OsError('invalid', docRes.reason);
  }

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) throw new OsError('unavailable', 'Serviço de banco de dados indisponível.');

  const { data, error } = await adminClient.rpc('os_save_project', {
    p_user_id: ctx.userId,
    p_project_id: input.id,
    p_expected_version: input.expectedVersion,
    p_document: docRes.value,
  });

  if (error) {
    const msg = error.message || '';
    if (msg.includes('Conflito de versão')) {
      throw new OsError('conflict', msg);
    }
    throw new OsError('invalid', msg || 'Falha ao salvar projeto.');
  }

  return mapProjectRow(data as Record<string, unknown>);
}

export async function deleteProject(ctx: OsContext, id: string): Promise<void> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) throw new OsError('unavailable', 'Serviço de banco de dados indisponível.');

  const { error } = await adminClient.rpc('os_delete_project', {
    p_user_id: ctx.userId,
    p_project_id: id,
  });

  if (error) {
    throw new OsError('invalid', error.message || 'Falha ao excluir projeto.');
  }
}
