-- ════════════════════════════════════════════════════════════════════
-- MIGRATION 012: Project Management RPCs (Create, Save with Versioning, Delete)
-- ════════════════════════════════════════════════════════════════════

-- 1. RPC: Create Project
create or replace function public.os_create_project(
  p_user_id uuid,
  p_briefing jsonb,
  p_document jsonb,
  p_prospect_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_workspace public.os_workspaces%rowtype;
  v_count integer;
  v_project public.os_projects%rowtype;
begin
  -- 1. Find active workspace for user
  select * into v_workspace
  from public.os_workspaces
  where owner_id = p_user_id and status = 'active';

  if not found then
    raise exception 'Workspace ativo não encontrado para o usuário';
  end if;

  -- 2. Enforce free limit: 1 project per workspace
  select count(*) into v_count
  from public.os_projects
  where workspace_id = v_workspace.id;

  if v_count >= 1 then
    raise exception 'Limite do plano gratuito atingido: 1 projeto permitido';
  end if;

  -- 3. Verify prospect belongs to the same workspace if supplied
  if p_prospect_id is not null then
    if not exists (
      select 1 from public.os_prospects
      where id = p_prospect_id and workspace_id = v_workspace.id
    ) then
      raise exception 'Prospect vinculado não pertence ao workspace atual';
    end if;
  end if;

  -- 4. Insert project
  insert into public.os_projects (
    workspace_id,
    briefing,
    document,
    version,
    prospect_id
  ) values (
    v_workspace.id,
    p_briefing,
    p_document,
    1,
    p_prospect_id
  )
  returning * into v_project;

  return jsonb_build_object(
    'id', v_project.id,
    'workspaceId', v_project.workspace_id,
    'briefing', v_project.briefing,
    'document', v_project.document,
    'version', v_project.version,
    'updatedAt', to_char(v_project.updated_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
  );
end;
$$;

-- 2. RPC: Save Project with Optimistic Locking
create or replace function public.os_save_project(
  p_user_id uuid,
  p_project_id uuid,
  p_expected_version integer,
  p_document jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_workspace public.os_workspaces%rowtype;
  v_project public.os_projects%rowtype;
begin
  select * into v_workspace
  from public.os_workspaces
  where owner_id = p_user_id and status = 'active';

  if not found then
    raise exception 'Workspace ativo não encontrado';
  end if;

  -- Lock row for concurrency check
  select * into v_project
  from public.os_projects
  where id = p_project_id and workspace_id = v_workspace.id
  for update;

  if not found then
    raise exception 'Projeto não encontrado';
  end if;

  if v_project.version != p_expected_version then
    raise exception 'Conflito de versão: o documento foi atualizado em outra sessão (versão atual: %, esperada: %)',
      v_project.version, p_expected_version;
  end if;

  update public.os_projects
  set
    document = p_document,
    version = version + 1,
    updated_at = now()
  where id = p_project_id and workspace_id = v_workspace.id
  returning * into v_project;

  return jsonb_build_object(
    'id', v_project.id,
    'workspaceId', v_project.workspace_id,
    'briefing', v_project.briefing,
    'document', v_project.document,
    'version', v_project.version,
    'updatedAt', to_char(v_project.updated_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
  );
end;
$$;

-- 3. RPC: Delete Project
create or replace function public.os_delete_project(
  p_user_id uuid,
  p_project_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_workspace public.os_workspaces%rowtype;
begin
  select * into v_workspace
  from public.os_workspaces
  where owner_id = p_user_id and status = 'active';

  if not found then
    raise exception 'Workspace ativo não encontrado';
  end if;

  -- Cascade delete publication in transaction
  delete from public.os_publications
  where project_id = p_project_id and workspace_id = v_workspace.id;

  delete from public.os_projects
  where id = p_project_id and workspace_id = v_workspace.id;
end;
$$;

-- Security Grants
revoke execute on function public.os_create_project(uuid, jsonb, jsonb, uuid) from anon, authenticated;
grant execute on function public.os_create_project(uuid, jsonb, jsonb, uuid) to service_role;

revoke execute on function public.os_save_project(uuid, uuid, integer, jsonb) from anon, authenticated;
grant execute on function public.os_save_project(uuid, uuid, integer, jsonb) to service_role;

revoke execute on function public.os_delete_project(uuid, uuid) from anon, authenticated;
grant execute on function public.os_delete_project(uuid, uuid) to service_role;
