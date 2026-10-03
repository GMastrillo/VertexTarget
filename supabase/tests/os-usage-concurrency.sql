-- ════════════════════════════════════════════════════════════════════
-- SQL TESTS: Usage Idempotency & Concurrency Safety
-- ════════════════════════════════════════════════════════════════════

begin;

do $$
declare
  v_user_id uuid := gen_random_uuid();
  v_key uuid := gen_random_uuid();
  v_res1 jsonb;
  v_res2 jsonb;
  v_err text;
begin
  insert into auth.users (id, email, email_confirmed_at)
  values (v_user_id, 'concurrent.test@exemplo.com.br', now());

  -- 1st call on key with payload 'hashA' -> executor: true
  v_res1 := public.os_reserve_usage(v_user_id, 'copy', v_key, 'hashA', 1000);
  if (v_res1->>'executor')::boolean != true then
    raise exception 'Primeira chamada na chave deveria ser executor: true';
  end if;

  -- 2nd call on identical key and identical payload -> executor: false, same operationId
  v_res2 := public.os_reserve_usage(v_user_id, 'copy', v_key, 'hashA', 1000);
  if (v_res2->>'executor')::boolean != false then
    raise exception 'Segunda chamada na mesma chave deveria ser executor: false';
  end if;

  if v_res1->>'operationId' != v_res2->>'operationId' then
    raise exception 'Segunda chamada deveria devolver o mesmo operationId da primeira';
  end if;

  -- 3rd call on identical key with DIFFERENT payload -> must raise 409 conflict
  begin
    perform public.os_reserve_usage(v_user_id, 'copy', v_key, 'hashB_divergent', 1000);
    raise exception 'Deveria ter lançado exceção de conflito de payload para mesma chave';
  exception when others then
    get stacked diagnostics v_err = message_text;
    if v_err not like '%Conflito de idempotência%' then
      raise exception 'Erro inesperado: %', v_err;
    end if;
  end;
end $$;

rollback;
