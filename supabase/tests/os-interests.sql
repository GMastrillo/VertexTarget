-- ════════════════════════════════════════════════════════════════════
-- SQL TESTS: Public Interests, RLS & Rate Limiting Verification
-- ════════════════════════════════════════════════════════════════════

begin;

-- 1. Assert table public_interests and public_request_limits exist
do $$
begin
  if not exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'public_interests') then
    raise exception 'Tabela public_interests não encontrada';
  end if;

  if not exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'public_request_limits') then
    raise exception 'Tabela public_request_limits não encontrada';
  end if;
end $$;

-- 2. Verify direct access is revoked for anon and authenticated
do $$
declare
  v_has_access boolean;
begin
  select has_table_privilege('anon', 'public.public_interests', 'SELECT') into v_has_access;
  if v_has_access then
    raise exception 'anon não deve ter privilégio direto de SELECT em public_interests';
  end if;

  select has_table_privilege('authenticated', 'public.public_interests', 'INSERT') into v_has_access;
  if v_has_access then
    raise exception 'authenticated não deve ter privilégio direto de INSERT em public_interests';
  end if;
end $$;

-- 3. Verify RPC interest_reserve_request idempotency logic
do $$
declare
  v_key uuid := gen_random_uuid();
  v_payload_hash text := 'hash1234567890';
  v_res jsonb;
begin
  -- First reservation (new)
  v_res := public.interest_reserve_request('ip_hash_test', 'email_hash_test', v_key, v_payload_hash);
  if v_res->>'status' != 'new' then
    raise exception 'Primeira reserva deveria retornar status: new';
  end if;

  -- Save record
  perform public.interest_save(
    v_key,
    v_payload_hash,
    jsonb_build_object(
      'name', 'Teste Lead',
      'email', 'lead@teste.com',
      'whatsapp', '5511999998888',
      'journey', 'business',
      'interest', 'solutions',
      'message', 'Teste de mensagem',
      'marketingConsent', false,
      'noticeVersion', '2026-10-02',
      'source', 'home-contact'
    )
  );

  -- Replay reservation (replay)
  v_res := public.interest_reserve_request('ip_hash_test', 'email_hash_test', v_key, v_payload_hash);
  if v_res->>'status' != 'replay' then
    raise exception 'Replay com mesmo hash deveria retornar status: replay';
  end if;
end $$;

rollback;
