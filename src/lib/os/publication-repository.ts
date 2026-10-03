import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase-server';
import { OsError } from './errors.ts';
import { generateSlug, publicDocument } from './publication-utils.ts';
import { parseSiteDocument } from './validation.ts';
import type { OsContext, PublishedSite } from './types.ts';

interface PublishInput {
  id: string;
  expectedVersion: number;
  contentAccepted: true;
}

export async function publishProject(ctx: OsContext, input: PublishInput): Promise<PublishedSite> {
  if (input.contentAccepted !== true) {
    throw new OsError('invalid', 'É necessário aceitar os termos do conteúdo para publicar.');
  }

  const admin = createSupabaseAdminClient();
  if (!admin) throw new OsError('unavailable', 'Serviço indisponível.');

  const candidateSlug = generateSlug(ctx.workspace.name);

  const { data, error } = await admin.rpc('os_publish_project', {
    p_user_id: ctx.userId,
    p_project_id: input.id,
    p_expected_version: input.expectedVersion,
    p_slug: candidateSlug,
  });

  if (error) {
    if (error.message?.includes('VERSION_CONFLICT')) {
      throw new OsError('conflict', 'O projeto foi modificado por outra sessão. Recarregue a página.');
    }
    if (error.message?.includes('PROJECT_NOT_FOUND')) {
      throw new OsError('not-found', 'Projeto não encontrado.');
    }
    throw new OsError('invalid', error.message || 'Falha ao publicar projeto.');
  }

  const rawDoc = (data as Record<string, unknown>).document;
  const parsed = parseSiteDocument(rawDoc);
  if (!parsed.ok) {
    throw new OsError('invalid', 'Documento publicado inválido: ' + parsed.reason);
  }

  return {
    slug: String((data as Record<string, unknown>).slug),
    document: publicDocument(parsed.value),
    publishedAt: String((data as Record<string, unknown>).publishedAt),
  };
}

export async function unpublishProject(ctx: OsContext, id: string): Promise<void> {
  const admin = createSupabaseAdminClient();
  if (!admin) throw new OsError('unavailable', 'Serviço indisponível.');

  const { error } = await admin.rpc('os_unpublish_project', {
    p_user_id: ctx.userId,
    p_project_id: id,
  });

  if (error) {
    throw new OsError('invalid', error.message || 'Falha ao despublicar projeto.');
  }
}

export async function getPublishedSite(slug: string): Promise<PublishedSite | null> {
  const admin = createSupabaseAdminClient();
  if (!admin) throw new OsError('unavailable', 'Serviço indisponível.');

  const { data, error } = await admin.rpc('os_read_publication', {
    p_slug: slug,
  });

  if (error || !data) return null;

  const record = data as Record<string, unknown>;
  const parsed = parseSiteDocument(record.document);
  if (!parsed.ok) return null;

  return {
    slug: String(record.slug),
    document: publicDocument(parsed.value),
    publishedAt: String(record.publishedAt),
  };
}

export async function getWorkspacePublication(ctx: OsContext): Promise<PublishedSite | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('os_publications')
    .select('slug, snapshot, published_at')
    .eq('workspace_id', ctx.workspace.id)
    .eq('status', 'active')
    .maybeSingle();

  if (error || !data) return null;

  const parsed = parseSiteDocument(data.snapshot);
  if (!parsed.ok) return null;

  return {
    slug: String(data.slug),
    document: publicDocument(parsed.value),
    publishedAt: String(data.published_at),
  };
}
