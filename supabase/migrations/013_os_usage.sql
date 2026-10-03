-- ════════════════════════════════════════════════════════════════════
-- MIGRATION 013: Atomic Usage Quotas, Idempotency & Cost Control
-- ════════════════════════════════════════════════════════════════════

-- 1. RPC: Reserve Usage
create or replace function public.os_reserve_usage(
  p_user_id uuid,
  p_kind text,
  p_key uuid,
  p_payload_hash text,
  p_global_limit integer
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_period text;
  v_op public.os_usage_operations%rowtype;
  v_user_limit integer;
  v_global_used integer;
  v_current_user_used integer;
  v_op_id uuid;
begin
  if p_kind not in ('copy', 'search') then
    raise exception 'Tipo de uso inválido: %', p_kind;
  end if;

  v_user_limit := case when p_kind = 'copy' then 3 else 1 end;
  v_period := to_char(now() at time zone 'utc', 'YYYY-MM');

  -- 1. Check idempotency for existing operation by key
  select * into v_op
  from public.os_usage_operations
  where user_id = p_user_id and idempotency_key = p_key;

  if found then
    if v_op.payload_hash = p_payload_hash then
      return jsonb_build_object(
        'operationId', v_op.id,
        'state', v_op.state,
        'executor', false
      );
    else
      raise exception 'Conflito de idempotência: payload diferente para a mesma chave';
    end if;
  end if;

  -- 2. Verify global system brake
  select coalesce(sum(count), 0) into v_global_used
  from public.os_usage_counters
  where kind = p_kind and period = v_period;

  if v_global_used >= p_global_limit then
    raise exception 'Limite global do sistema para este recurso foi atingido neste mês';
  end if;

  -- 3. Atomically check and increment user counter
  select count into v_current_user_used
  from public.os_usage_counters
  where user_id = p_user_id and kind = p_kind and period = v_period
  for update;

  if v_current_user_used is not null and v_current_user_used >= v_user_limit then
    raise exception 'Limite gratuito mensal atingido para este recurso';
  end if;

  if v_current_user_used is null then
    insert into public.os_usage_counters (user_id, kind, period, count)
    values (p_user_id, p_kind, v_period, 1);
  else
    update public.os_usage_counters
    set count = count + 1, updated_at = now()
    where user_id = p_user_id and kind = p_kind and period = v_period;
  end if;

  -- 4. Create new reserved operation
  insert into public.os_usage_operations (
    user_id, kind, period, idempotency_key, payload_hash, state
  ) values (
    p_user_id, p_kind, v_period, p_key, p_payload_hash, 'reserved'
  )
  returning id into v_op_id;

  return jsonb_build_object(
    'operationId', v_op_id,
    'state', 'reserved',
    'executor', true
  );
end;
$$;

-- 2. RPC: Mark Usage Sent (CAS transition from reserved to sent)
create or replace function public.os_mark_usage_sent(
  p_user_id uuid,
  p_operation_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_updated boolean := false;
begin
  update public.os_usage_operations
  set state = 'sent', updated_at = now()
  where id = p_operation_id
    and user_id = p_user_id
    and state = 'reserved';

  return found;
end;
$$;

-- 3. RPC: Complete Usage
create or replace function public.os_complete_usage(
  p_user_id uuid,
  p_operation_id uuid,
  p_result jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.os_usage_operations
  set
    state = coalesce(p_result->>'status', 'completed'),
    tokens = coalesce((p_result->>'tokens')::integer, 0),
    latency_ms = coalesce((p_result->>'latencyMs')::integer, 0),
    error_code = p_result->>'errorCode',
    updated_at = now()
  where id = p_operation_id and user_id = p_user_id;
end;
$$;

-- 4. RPC: Release Unsent Usage
create or replace function public.os_release_unsent_usage(
  p_user_id uuid,
  p_operation_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_kind text;
  v_period text;
begin
  -- Only release if state is still 'reserved' (never after 'sent')
  select kind, period into v_kind, v_period
  from public.os_usage_operations
  where id = p_operation_id and user_id = p_user_id and state = 'reserved';

  if found then
    update public.os_usage_operations
    set state = 'failed', error_code = 'unsent_released', updated_at = now()
    where id = p_operation_id;

    update public.os_usage_counters
    set count = greatest(0, count - 1), updated_at = now()
    where user_id = p_user_id and kind = v_kind and period = v_period;
  end if;
end;
$$;

-- 5. RPC: Get Usage Summary
create or replace function public.os_get_usage(
  p_user_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_period text;
  v_renews_at text;
  v_copy_used integer := 0;
  v_search_used integer := 0;
begin
  v_period := to_char(now() at time zone 'utc', 'YYYY-MM');
  v_renews_at := to_char(date_trunc('month', (now() at time zone 'utc') + interval '1 month'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"');

  select coalesce(count, 0) into v_copy_used
  from public.os_usage_counters
  where user_id = p_user_id and kind = 'copy' and period = v_period;

  select coalesce(count, 0) into v_search_used
  from public.os_usage_counters
  where user_id = p_user_id and kind = 'search' and period = v_period;

  return jsonb_build_object(
    'period', v_period,
    'renewsAt', v_renews_at,
    'copy', jsonb_build_object('used', coalesce(v_copy_used, 0), 'limit', 3),
    'search', jsonb_build_object('used', coalesce(v_search_used, 0), 'limit', 1)
  );
end;
$$;

-- Security Grants
revoke execute on function public.os_reserve_usage(uuid, text, uuid, text, integer) from anon, authenticated;
grant execute on function public.os_reserve_usage(uuid, text, uuid, text, integer) to service_role;

revoke execute on function public.os_mark_usage_sent(uuid, uuid) from anon, authenticated;
grant execute on function public.os_mark_usage_sent(uuid, uuid) to service_role;

revoke execute on function public.os_complete_usage(uuid, uuid, jsonb) from anon, authenticated;
grant execute on function public.os_complete_usage(uuid, uuid, jsonb) to service_role;

revoke execute on function public.os_release_unsent_usage(uuid, uuid) from anon, authenticated;
grant execute on function public.os_release_unsent_usage(uuid, uuid) to service_role;

revoke execute on function public.os_get_usage(uuid) from anon;
grant execute on function public.os_get_usage(uuid) to authenticated, service_role;
