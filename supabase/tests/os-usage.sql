-- ════════════════════════════════════════════════════════════════════
-- SQL TESTS: Atomic Usage Quotas, Monthly Reset & Braking
-- ════════════════════════════════════════════════════════════════════

begin;

-- 1. Create a simulated confirmed user in auth.users
do $$
declare
  v_user_id uuid := gen_random_uuid();
  v_res jsonb;
  v_op_id uuid;
  v_marked boolean;
  v_usage jsonb;
  v_err text;
begin
  -- Simulate user in auth.users
  insert into auth.users (id, email, email_confirmed_at)
  values (v_user_id, 'usage.test@exemplo.com.br', now());

  -- 1st copy reservation (ok)
  v_res := public.os_reserve_usage(v_user_id, 'copy', gen_random_uuid(), 'hash1', 1000);
  if (v_res->>'executor')::boolean != true then
    raise exception '1ª cópia deveria ser executor: true';
  end if;

  -- 2nd copy reservation (ok)
  v_res := public.os_reserve_usage(v_user_id, 'copy', gen_random_uuid(), 'hash2', 1000);
  if (v_res->>'executor')::boolean != true then
    raise exception '2ª cópia deveria ser executor: true';
  end if;

  -- 3rd copy reservation (ok)
  v_res := public.os_reserve_usage(v_user_id, 'copy', gen_random_uuid(), 'hash3', 1000);
  v_op_id := (v_res->>'operationId')::uuid;
  if (v_res->>'executor')::boolean != true then
    raise exception '3ª cópia deveria ser executor: true';
  end if;

  -- 4th copy reservation (must fail with limit exceeded)
  begin
    perform public.os_reserve_usage(v_user_id, 'copy', gen_random_uuid(), 'hash4', 1000);
    raise exception '4ª cópia deveria ter sido rejeitada por limite atingido';
  exception when others then
    get stacked diagnostics v_err = message_text;
    if v_err not like '%Limite gratuito mensal%' then
      raise exception 'Erro inesperado ao rejeitar 4ª cópia: %', v_err;
    end if;
  end;

  -- Test CAS mark sent
  v_marked := public.os_mark_usage_sent(v_user_id, v_op_id);
  if not v_marked then
    raise exception 'os_mark_usage_sent deveria retornar true para operação reservada';
  end if;

  -- Attempting release on a SENT operation must not release quota
  perform public.os_release_unsent_usage(v_user_id, v_op_id);

  -- Complete operation
  perform public.os_complete_usage(v_user_id, v_op_id, jsonb_build_object('status', 'completed', 'tokens', 150));

  -- Verify summary shows 3 copies used
  v_usage := public.os_get_usage(v_user_id);
  if (v_usage->'copy'->>'used')::int != 3 then
    raise exception 'Usage summary deveria reportar 3 cópias usadas, obteve %', v_usage->'copy'->>'used';
  end if;
end $$;

rollback;
