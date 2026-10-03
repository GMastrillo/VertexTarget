-- ════════════════════════════════════════════════════════════════════
-- MIGRATION 011: Workspace Lifecycle RPCs (Ensure, Update, Delete)
-- ════════════════════════════════════════════════════════════════════

create or replace function public.os_ensure_workspace(
  p_user_id uuid,
  p_name text,
  p_journey text,
  p_notice_version text
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_confirmed_at timestamptz;
  v_workspace public.os_workspaces%rowtype;
begin
  -- 1. Verify user exists and email is confirmed in auth.users
  select email_confirmed_at into v_confirmed_at
  from auth.users
  where id = p_user_id;

  if v_confirmed_at is null then
    raise exception 'E-mail do usuário não está confirmado';
  end if;

  -- 2. Validate input parameters
  if length(trim(p_name)) < 2 or length(trim(p_name)) > 120 then
    raise exception 'Nome do workspace deve ter entre 2 e 120 caracteres';
  end if;

  if p_journey not in ('business', 'professional') then
    raise exception 'Jornada inválida';
  end if;

  -- 3. Check existing workspace for this owner
  select * into v_workspace
  from public.os_workspaces
  where owner_id = p_user_id;

  if found then
    if v_workspace.status = 'suspended' then
      raise exception 'Workspace suspenso por moderação';
    end if;

    if v_workspace.status = 'deleted' then
      -- Reactivate tombstone workspace consciously
      update public.os_workspaces
      set
        name = trim(p_name),
        journey = p_journey,
        status = 'active',
        updated_at = now()
      where id = v_workspace.id
      returning * into v_workspace;

      insert into public.os_consents (user_id, workspace_id, notice_version, purpose)
      values (p_user_id, v_workspace.id, p_notice_version, 'workspace_reactivation');
    end if;

    return to_jsonb(v_workspace);
  end if;

  -- 4. Insert new workspace
  insert into public.os_workspaces (owner_id, name, journey, status, plan)
  values (p_user_id, trim(p_name), p_journey, 'active', 'free')
  returning * into v_workspace;

  -- 5. Record consent
  insert into public.os_consents (user_id, workspace_id, notice_version, purpose)
  values (p_user_id, v_workspace.id, p_notice_version, 'workspace_onboarding');

  return to_jsonb(v_workspace);
end;
$$;

create or replace function public.os_update_workspace(
  p_user_id uuid,
  p_name text,
  p_journey text
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_workspace public.os_workspaces%rowtype;
begin
  if length(trim(p_name)) < 2 or length(trim(p_name)) > 120 then
    raise exception 'Nome do workspace deve ter entre 2 e 120 caracteres';
  end if;

  if p_journey not in ('business', 'professional') then
    raise exception 'Jornada inválida';
  end if;

  update public.os_workspaces
  set
    name = trim(p_name),
    journey = p_journey,
    updated_at = now()
  where owner_id = p_user_id and status = 'active'
  returning * into v_workspace;

  if not found then
    raise exception 'Workspace ativo não encontrado';
  end if;

  return to_jsonb(v_workspace);
end;
$$;

create or replace function public.os_delete_workspace(
  p_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_workspace_id uuid;
begin
  select id into v_workspace_id
  from public.os_workspaces
  where owner_id = p_user_id and status = 'active';

  if not found then
    raise exception 'Workspace ativo não encontrado para exclusão';
  end if;

  -- 1. Cascade removal of projects, publications and prospects
  delete from public.os_publications where workspace_id = v_workspace_id;
  delete from public.os_projects where workspace_id = v_workspace_id;
  delete from public.os_prospects where workspace_id = v_workspace_id;

  -- 2. Mark workspace as deleted (tombstone) without destroying usage history
  update public.os_workspaces
  set
    status = 'deleted',
    updated_at = now()
  where id = v_workspace_id;
end;
$$;

-- Revoke default public execution privileges
revoke execute on function public.os_ensure_workspace(uuid, text, text, text) from public, anon, authenticated;
revoke execute on function public.os_update_workspace(uuid, text, text) from public, anon, authenticated;
revoke execute on function public.os_delete_workspace(uuid) from public, anon, authenticated;
