-- ════════════════════════════════════════════════════════════════════
-- INTEGRATION TEST: Vertex OS Publications (os-publications.sql)
-- ════════════════════════════════════════════════════════════════════

begin;

-- Fixture setup
select plan(7);

-- Create test user & workspace
insert into auth.users (id, email)
values ('11111111-1111-4111-8111-111111111111', 'pub-tester@vertex.test')
on conflict (id) do nothing;

select os_ensure_workspace(
  '11111111-1111-4111-8111-111111111111',
  'Pub Studio',
  'business',
  'v1.0'
);

-- Create initial project (version 1)
select os_create_project(
  '11111111-1111-4111-8111-111111111111',
  '{
    "businessName": "Pub Studio",
    "sector": "Tech",
    "city": "SP",
    "objective": "Growth",
    "description": "Desc",
    "services": [],
    "email": "pub@teste.com",
    "whatsapp": "11999998888",
    "templateId": "consulting"
  }'::jsonb,
  '{
    "schemaVersion": 1,
    "templateId": "consulting",
    "themeId": "cyan-dark",
    "businessName": "Pub Studio",
    "title": "Titulo V1",
    "subtitle": "Sub V1",
    "description": "Desc V1",
    "services": [],
    "ctaLabel": "Contato",
    "email": "pub@teste.com",
    "whatsapp": "11999998888",
    "city": "SP"
  }'::jsonb
);

-- Retrieve created project id
do $$
declare
  v_proj_id uuid;
  v_pub jsonb;
  v_read jsonb;
begin
  select id into v_proj_id from public.os_projects limit 1;

  -- 1. Publish project with expected version 1
  v_pub := os_publish_project(
    '11111111-1111-4111-8111-111111111111',
    v_proj_id,
    1,
    'pub-studio-slug1'
  );
  perform is((v_pub->>'slug')::text, 'pub-studio-slug1', 'Project published with given slug');

  -- 2. Read snapshot via public reader
  v_read := os_read_publication('pub-studio-slug1');
  perform is((v_read->'document'->>'title')::text, 'Titulo V1', 'Snapshot reflects version 1 content');

  -- 3. Modify draft to version 2
  perform os_save_project(
    '11111111-1111-4111-8111-111111111111',
    v_proj_id,
    1,
    '{
      "schemaVersion": 1,
      "templateId": "consulting",
      "themeId": "cyan-dark",
      "businessName": "Pub Studio",
      "title": "Titulo V2 Modificado",
      "subtitle": "Sub V2",
      "description": "Desc V2",
      "services": [],
      "ctaLabel": "Contato",
      "email": "pub@teste.com",
      "whatsapp": "11999998888",
      "city": "SP"
    }'::jsonb
  );

  -- 4. Verify snapshot remains V1 (draft v2 does not mutate public snapshot)
  v_read := os_read_publication('pub-studio-slug1');
  perform is((v_read->'document'->>'title')::text, 'Titulo V1', 'Draft v2 does not mutate published v1 snapshot');
end;
$$;

-- 5. Attempting to publish expecting version 1 against draft v2 must raise VERSION_CONFLICT
do $$
declare
  v_proj_id uuid;
  v_err boolean := false;
begin
  select id into v_proj_id from public.os_projects limit 1;
  begin
    perform os_publish_project(
      '11111111-1111-4111-8111-111111111111',
      v_proj_id,
      1,
      'pub-studio-slug1'
    );
  exception when others then
    if sqlerrm like '%VERSION_CONFLICT%' then
      v_err := true;
    end if;
  end;
  perform ok(v_err, 'Publishing expecting v1 against draft v2 fails with VERSION_CONFLICT');
end;
$$;

-- 6. Suspended workspace publication cannot be resolved via public reader
do $$
declare
  v_read jsonb;
begin
  update public.os_workspaces set status = 'suspended' where owner_id = '11111111-1111-4111-8111-111111111111';
  v_read := os_read_publication('pub-studio-slug1');
  perform is(v_read, null, 'Suspended workspace publication resolves to null');
  update public.os_workspaces set status = 'active' where owner_id = '11111111-1111-4111-8111-111111111111';
end;
$$;

-- 7. Unpublish removes the publication
do $$
declare
  v_proj_id uuid;
  v_read jsonb;
begin
  select id into v_proj_id from public.os_projects limit 1;
  perform os_unpublish_project('11111111-1111-4111-8111-111111111111', v_proj_id);
  v_read := os_read_publication('pub-studio-slug1');
  perform is(v_read, null, 'Unpublished project is no longer returned by public reader');
end;
$$;

-- Finalize
select * from finish();
rollback;
