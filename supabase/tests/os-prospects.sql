-- ════════════════════════════════════════════════════════════════════
-- INTEGRATION TEST: Vertex OS Prospects (os-prospects.sql)
-- ════════════════════════════════════════════════════════════════════

begin;

select plan(5);

-- Create test user A & workspace A
insert into auth.users (id, email)
values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'prospect-a@vertex.test')
on conflict (id) do nothing;

select os_ensure_workspace(
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'Workspace A',
  'business',
  'v1.0'
);

-- Create test user B & workspace B
insert into auth.users (id, email)
values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'prospect-b@vertex.test')
on conflict (id) do nothing;

select os_ensure_workspace(
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'Workspace B',
  'professional',
  'v1.0'
);

-- 1. Create prospect in Workspace A
do $$
declare
  v_res jsonb;
begin
  v_res := os_create_prospect(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '{
      "name": "Cliente A1",
      "sector": "Varejo",
      "city": "Sao Paulo",
      "website": "https://a1.test",
      "email": "a1@test.com",
      "phone": "11999990001",
      "notes": "Lead qualificado",
      "status": "new"
    }'::jsonb
  );
  perform is((v_res->>'name')::text, 'Cliente A1', 'Prospect created successfully');
end;
$$;

-- 2. Move prospect status
do $$
declare
  v_id uuid;
  v_status text;
begin
  select id into v_id from public.os_prospects where name = 'Cliente A1';
  perform os_move_prospect('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', v_id, 'contacted');
  select status into v_status from public.os_prospects where id = v_id;
  perform is(v_status, 'contacted', 'Prospect moved to contacted');
end;
$$;

-- 3. Isolation: User B cannot move or update prospect of User A
do $$
declare
  v_id uuid;
  v_err boolean := false;
begin
  select id into v_id from public.os_prospects where name = 'Cliente A1';
  begin
    perform os_move_prospect('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', v_id, 'closed');
  exception when others then
    if sqlerrm like '%PROSPECT_NOT_FOUND%' then
      v_err := true;
    end if;
  end;
  perform ok(v_err, 'User B moving User A prospect fails with PROSPECT_NOT_FOUND');
end;
$$;

-- 4. Limit enforcement: populating up to 50 prospects succeeds, 51st is rejected
do $$
declare
  i integer;
  v_err boolean := false;
begin
  -- Currently 1 prospect exists, insert 49 more (reaching 50)
  for i in 2..50 loop
    perform os_create_prospect(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      jsonb_build_object(
        'name', 'Cliente ' || i,
        'sector', 'Servicos',
        'city', 'SP',
        'email', 'c' || i || '@test.com'
      )
    );
  end loop;

  -- 51st must fail
  begin
    perform os_create_prospect(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      '{"name": "Cliente 51", "sector": "Overflow"}'::jsonb
    );
  exception when others then
    if sqlerrm like '%PROSPECT_LIMIT_EXCEEDED%' then
      v_err := true;
    end if;
  end;
  perform ok(v_err, '51st prospect is rejected with PROSPECT_LIMIT_EXCEEDED');
end;
$$;

-- 5. Delete prospect
do $$
declare
  v_id uuid;
  v_count integer;
begin
  select id into v_id from public.os_prospects where name = 'Cliente A1';
  perform os_delete_prospect('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', v_id);
  select count(*) into v_count from public.os_prospects where id = v_id;
  perform is(v_count, 0, 'Prospect deleted successfully');
end;
$$;

select * from finish();
rollback;
