-- ════════════════════════════════════════════════════════════════════
-- MIGRATION 016: Public Interests, Anti-Abuse Rate Limits and Team Query
-- ════════════════════════════════════════════════════════════════════

-- 1. Table: public_interests
create table if not exists public.public_interests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  whatsapp text not null,
  journey text not null check (journey in ('business', 'professional')),
  interest text not null check (interest in ('solutions', 'education', 'community')),
  message text not null default '',
  marketing_consent boolean not null default false,
  notice_version text not null,
  source text not null,
  idempotency_key uuid not null unique,
  payload_hash text not null,
  created_at timestamptz not null default now()
);

-- 2. Table: public_request_limits
create table if not exists public.public_request_limits (
  id uuid primary key default gen_random_uuid(),
  identifier_hash text not null,
  window_start timestamptz not null,
  request_count int not null default 1,
  kind text not null check (kind in ('ip', 'email')),
  created_at timestamptz not null default now(),
  constraint uq_public_request_limits unique (identifier_hash, window_start, kind)
);

-- 3. Row Level Security
alter table public.public_interests enable row level security;
alter table public.public_request_limits enable row level security;

revoke all on public.public_interests from anon, authenticated;
revoke all on public.public_request_limits from anon, authenticated;
grant all on public.public_interests to service_role;
grant all on public.public_request_limits to service_role;

-- 4. RPC: Reserve Interest Request (Idempotency + Rate Limiting)
create or replace function public.interest_reserve_request(
  p_ip_hash text,
  p_email_hash text,
  p_key uuid,
  p_payload_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing_hash text;
  v_ip_window timestamptz;
  v_email_window timestamptz;
  v_ip_count int;
  v_email_count int;
begin
  -- Check existing idempotency key
  select payload_hash into v_existing_hash
  from public.public_interests
  where idempotency_key = p_key;

  if found then
    if v_existing_hash = p_payload_hash then
      return jsonb_build_object('status', 'replay');
    else
      raise exception 'Conflito de chave de idempotência com payload diferente';
    end if;
  end if;

  -- 15-minute window for IP (max 5)
  v_ip_window := date_trunc('minute', now()) - (extract(minute from now())::int % 15) * interval '1 minute';

  -- 1-hour window for Email (max 3)
  v_email_window := date_trunc('hour', now());

  select coalesce(sum(request_count), 0) into v_ip_count
  from public.public_request_limits
  where identifier_hash = p_ip_hash
    and window_start = v_ip_window
    and kind = 'ip';

  if v_ip_count >= 5 then
    raise exception 'Limite de requisições excedido. Tente novamente mais tarde.';
  end if;

  select coalesce(sum(request_count), 0) into v_email_count
  from public.public_request_limits
  where identifier_hash = p_email_hash
    and window_start = v_email_window
    and kind = 'email';

  if v_email_count >= 3 then
    raise exception 'Limite de requisições por e-mail excedido. Tente novamente mais tarde.';
  end if;

  -- Increment counters atomically
  insert into public.public_request_limits (identifier_hash, window_start, request_count, kind)
  values (p_ip_hash, v_ip_window, 1, 'ip')
  on conflict (identifier_hash, window_start, kind)
  do update set request_count = public.public_request_limits.request_count + 1;

  insert into public.public_request_limits (identifier_hash, window_start, request_count, kind)
  values (p_email_hash, v_email_window, 1, 'email')
  on conflict (identifier_hash, window_start, kind)
  do update set request_count = public.public_request_limits.request_count + 1;

  return jsonb_build_object('status', 'new');
end;
$$;

-- 5. RPC: Save Confirmed Interest
create or replace function public.interest_save(
  p_key uuid,
  p_payload_hash text,
  p_record jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.public_interests (
    name,
    email,
    whatsapp,
    journey,
    interest,
    message,
    marketing_consent,
    notice_version,
    source,
    idempotency_key,
    payload_hash
  ) values (
    p_record->>'name',
    p_record->>'email',
    p_record->>'whatsapp',
    p_record->>'journey',
    p_record->>'interest',
    coalesce(p_record->>'message', ''),
    coalesce((p_record->>'marketingConsent')::boolean, false),
    p_record->>'noticeVersion',
    p_record->>'source',
    p_key,
    p_payload_hash
  );
end;
$$;

-- 6. RPC: List Interests for Staff (Owner & Sales only)
create or replace function public.interest_list()
returns setof public.public_interests
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid;
  v_allowed boolean;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Usuário não autenticado';
  end if;

  select exists (
    select 1
    from public.team_members
    where user_id = v_user_id
      and role in ('owner', 'sales')
      and active = true
  ) into v_allowed;

  if not v_allowed then
    raise exception 'Acesso não autorizado para consulta de interesses';
  end if;

  return query
  select *
  from public.public_interests
  order by created_at desc;
end;
$$;

-- Revoke direct execute from untrusted roles; allow service_role and authenticated staff
revoke execute on function public.interest_reserve_request(text, text, uuid, text) from anon, authenticated;
grant execute on function public.interest_reserve_request(text, text, uuid, text) to service_role;

revoke execute on function public.interest_save(uuid, text, jsonb) from anon, authenticated;
grant execute on function public.interest_save(uuid, text, jsonb) to service_role;

revoke execute on function public.interest_list() from anon;
grant execute on function public.interest_list() to authenticated, service_role;
