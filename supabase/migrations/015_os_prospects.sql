-- ════════════════════════════════════════════════════════════════════
-- MIGRATION 015: Vertex OS Prospect Pipeline RPCs
-- ════════════════════════════════════════════════════════════════════

-- 1. Create Prospect RPC (Enforcing 50 limit via workspace lock)
create or replace function public.os_create_prospect(
  p_user_id uuid,
  p_input jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_workspace_id uuid;
  v_count integer;
  v_rec record;
begin
  select id into v_workspace_id
  from public.os_workspaces
  where owner_id = p_user_id and status = 'active'
  for update;

  if v_workspace_id is null then
    raise exception 'WORKSPACE_NOT_ACTIVE';
  end if;

  select count(*) into v_count
  from public.os_prospects
  where workspace_id = v_workspace_id;

  if v_count >= 50 then
    raise exception 'PROSPECT_LIMIT_EXCEEDED';
  end if;

  insert into public.os_prospects (
    workspace_id,
    name,
    sector,
    city,
    website,
    email,
    phone,
    notes,
    status,
    sources
  ) values (
    v_workspace_id,
    p_input->>'name',
    coalesce(p_input->>'sector', ''),
    coalesce(p_input->>'city', ''),
    coalesce(p_input->>'website', ''),
    coalesce(p_input->>'email', ''),
    coalesce(p_input->>'phone', ''),
    coalesce(p_input->>'notes', ''),
    coalesce(p_input->>'status', 'new'),
    coalesce(p_input->'sources', '[]'::jsonb)
  )
  returning * into v_rec;

  return jsonb_build_object(
    'id', v_rec.id,
    'name', v_rec.name,
    'sector', v_rec.sector,
    'city', v_rec.city,
    'website', v_rec.website,
    'email', v_rec.email,
    'phone', v_rec.phone,
    'notes', v_rec.notes,
    'status', v_rec.status,
    'sources', v_rec.sources
  );
end;
$$;

-- 2. Update Prospect RPC
create or replace function public.os_update_prospect(
  p_user_id uuid,
  p_id uuid,
  p_input jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_workspace_id uuid;
  v_rec record;
begin
  select id into v_workspace_id
  from public.os_workspaces
  where owner_id = p_user_id and status = 'active';

  if v_workspace_id is null then
    raise exception 'WORKSPACE_NOT_ACTIVE';
  end if;

  update public.os_prospects
  set
    name = coalesce(p_input->>'name', name),
    sector = coalesce(p_input->>'sector', sector),
    city = coalesce(p_input->>'city', city),
    website = coalesce(p_input->>'website', website),
    email = coalesce(p_input->>'email', email),
    phone = coalesce(p_input->>'phone', phone),
    notes = coalesce(p_input->>'notes', notes),
    updated_at = now()
  where id = p_id and workspace_id = v_workspace_id
  returning * into v_rec;

  if v_rec.id is null then
    raise exception 'PROSPECT_NOT_FOUND';
  end if;

  return jsonb_build_object(
    'id', v_rec.id,
    'name', v_rec.name,
    'sector', v_rec.sector,
    'city', v_rec.city,
    'website', v_rec.website,
    'email', v_rec.email,
    'phone', v_rec.phone,
    'notes', v_rec.notes,
    'status', v_rec.status,
    'sources', v_rec.sources
  );
end;
$$;

-- 3. Move Prospect Status RPC
create or replace function public.os_move_prospect(
  p_user_id uuid,
  p_id uuid,
  p_status text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_workspace_id uuid;
begin
  if p_status not in ('new', 'contacted', 'proposal', 'closed', 'discarded') then
    raise exception 'INVALID_STATUS';
  end if;

  select id into v_workspace_id
  from public.os_workspaces
  where owner_id = p_user_id and status = 'active';

  if v_workspace_id is null then
    raise exception 'WORKSPACE_NOT_ACTIVE';
  end if;

  update public.os_prospects
  set
    status = p_status,
    updated_at = now()
  where id = p_id and workspace_id = v_workspace_id;

  if not found then
    raise exception 'PROSPECT_NOT_FOUND';
  end if;
end;
$$;

-- 4. Delete Prospect RPC
create or replace function public.os_delete_prospect(
  p_user_id uuid,
  p_id uuid
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

  delete from public.os_prospects
  where id = p_id and workspace_id = v_workspace_id;

  if not found then
    raise exception 'PROSPECT_NOT_FOUND';
  end if;
end;
$$;

-- Revoke dangerous direct permissions and grant to service_role
revoke execute on function public.os_create_prospect(uuid, jsonb) from public, anon, authenticated;
revoke execute on function public.os_update_prospect(uuid, uuid, jsonb) from public, anon, authenticated;
revoke execute on function public.os_move_prospect(uuid, uuid, text) from public, anon, authenticated;
revoke execute on function public.os_delete_prospect(uuid, uuid) from public, anon, authenticated;

grant execute on function public.os_create_prospect(uuid, jsonb) to service_role;
grant execute on function public.os_update_prospect(uuid, uuid, jsonb) to service_role;
grant execute on function public.os_move_prospect(uuid, uuid, text) to service_role;
grant execute on function public.os_delete_prospect(uuid, uuid) to service_role;
