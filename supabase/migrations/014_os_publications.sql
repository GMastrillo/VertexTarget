-- ════════════════════════════════════════════════════════════════════
-- MIGRATION 014: Vertex OS Publication RPCs & Snapshot Reader
-- ════════════════════════════════════════════════════════════════════

-- 1. Publish Project RPC
create or replace function public.os_publish_project(
  p_user_id uuid,
  p_project_id uuid,
  p_expected_version integer,
  p_slug text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_workspace_id uuid;
  v_project record;
  v_pub record;
  v_target_slug text;
begin
  -- Verify active workspace ownership
  select id into v_workspace_id
  from public.os_workspaces
  where owner_id = p_user_id and status = 'active';

  if v_workspace_id is null then
    raise exception 'WORKSPACE_NOT_ACTIVE';
  end if;

  -- Lock and fetch project
  select * into v_project
  from public.os_projects
  where id = p_project_id and workspace_id = v_workspace_id
  for update;

  if v_project.id is null then
    raise exception 'PROJECT_NOT_FOUND';
  end if;

  -- Optimistic concurrency check
  if v_project.version != p_expected_version then
    raise exception 'VERSION_CONFLICT';
  end if;

  -- Determine slug: preserve existing slug if project was already published
  select slug into v_target_slug
  from public.os_publications
  where workspace_id = v_workspace_id and project_id = p_project_id;

  if v_target_slug is null then
    v_target_slug := p_slug;
  end if;

  -- Upsert snapshot into os_publications (enforcing 1 active publication per workspace via UNIQUE)
  insert into public.os_publications (
    workspace_id,
    project_id,
    slug,
    snapshot,
    status,
    published_at
  ) values (
    v_workspace_id,
    p_project_id,
    v_target_slug,
    v_project.document,
    'active',
    now()
  )
  on conflict (workspace_id) do update set
    project_id = excluded.project_id,
    slug = excluded.slug,
    snapshot = excluded.snapshot,
    status = 'active',
    published_at = now()
  returning * into v_pub;

  return jsonb_build_object(
    'slug', v_pub.slug,
    'document', v_pub.snapshot,
    'publishedAt', v_pub.published_at
  );
end;
$$;

-- 2. Unpublish Project RPC
create or replace function public.os_unpublish_project(
  p_user_id uuid,
  p_project_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_workspace_id uuid;
begin
  select id into v_workspace_id
  from public.os_workspaces
  where owner_id = p_user_id and status = 'active';

  if v_workspace_id is null then
    raise exception 'WORKSPACE_NOT_ACTIVE';
  end if;

  delete from public.os_publications
  where workspace_id = v_workspace_id and project_id = p_project_id;
end;
$$;

-- 3. Public Safe Snapshot Reader (returns JSONB snapshot, never table set)
create or replace function public.os_read_publication(
  p_slug text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_result jsonb;
begin
  select jsonb_build_object(
    'slug', p.slug,
    'document', p.snapshot,
    'publishedAt', p.published_at
  )
  into v_result
  from public.os_publications p
  join public.os_workspaces w on w.id = p.workspace_id
  where p.slug = p_slug
    and p.status = 'active'
    and w.status = 'active';

  return v_result;
end;
$$;

-- Revoke dangerous privileges
revoke execute on function public.os_publish_project(uuid, uuid, integer, text) from public, anon, authenticated;
revoke execute on function public.os_unpublish_project(uuid, uuid) from public, anon, authenticated;
revoke execute on function public.os_read_publication(text) from public;

grant execute on function public.os_publish_project(uuid, uuid, integer, text) to service_role;
grant execute on function public.os_unpublish_project(uuid, uuid) to service_role;
grant execute on function public.os_read_publication(text) to anon, authenticated, service_role;
