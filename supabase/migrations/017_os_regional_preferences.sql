-- ════════════════════════════════════════════════════════════════════
-- MIGRATION 017: Regional Preferences for OS Workspaces
-- ════════════════════════════════════════════════════════════════════

-- 1. Add additive columns to os_workspaces
alter table public.os_workspaces
  add column if not exists locale text default 'pt-BR',
  add column if not exists country_code text default 'BR',
  add column if not exists time_zone text default 'UTC';

-- 2. Add RPC to update regional preferences securely via service role
create or replace function public.os_set_regional_preferences(
  p_user_id uuid,
  p_locale text,
  p_country text,
  p_time_zone text
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_workspace public.os_workspaces%rowtype;
begin
  -- Validate supported locale
  if p_locale not in ('pt-BR', 'en', 'es', 'fr', 'de', 'it') then
    raise exception 'Idioma regional não suportado: %', p_locale;
  end if;

  -- Validate country ISO alpha-2 length
  if length(trim(p_country)) != 2 then
    raise exception 'Código de país deve conter exatamente 2 caracteres ISO 3166-1 alpha-2: %', p_country;
  end if;

  -- Validate time zone
  if length(trim(p_time_zone)) < 1 or length(trim(p_time_zone)) > 60 then
    raise exception 'Fuso horário inválido: %', p_time_zone;
  end if;

  -- Verify active workspace for user
  select * into v_workspace
  from public.os_workspaces
  where owner_id = p_user_id and status = 'active';

  if not found then
    raise exception 'Workspace ativo não encontrado para este usuário';
  end if;

  -- Update preferences
  update public.os_workspaces
  set
    locale = trim(p_locale),
    country_code = upper(trim(p_country)),
    time_zone = trim(p_time_zone),
    updated_at = now()
  where id = v_workspace.id
  returning * into v_workspace;

  return jsonb_build_object(
    'id', v_workspace.id,
    'name', v_workspace.name,
    'journey', v_workspace.journey,
    'status', v_workspace.status,
    'plan', v_workspace.plan,
    'locale', v_workspace.locale,
    'country_code', v_workspace.country_code,
    'time_zone', v_workspace.time_zone
  );
end;
$$;

revoke execute on function public.os_set_regional_preferences(uuid, text, text, text) from public, anon, authenticated;
grant execute on function public.os_set_regional_preferences(uuid, text, text, text) to service_role;
