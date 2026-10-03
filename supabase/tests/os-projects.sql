-- ════════════════════════════════════════════════════════════════════
-- SQL TESTS: OS Projects CRUD, Optimistic Locking & Free Limit
-- ════════════════════════════════════════════════════════════════════

begin;

do $$
declare
  v_user_id uuid := gen_random_uuid();
  v_workspace_id uuid;
  v_res jsonb;
  v_project_id uuid;
  v_saved jsonb;
  v_err text;
  v_briefing jsonb := jsonb_build_object(
    'businessName', 'Studio Teste',
    'sector', 'Arquitetura',
    'city', 'São Paulo',
    'objective', 'Apresentação comercial',
    'description', 'Projetos residenciais',
    'services', jsonb_build_array(jsonb_build_object('title', 'Interiores', 'description', 'Design completo')),
    'email', 'contato@studioteste.com',
    'whatsapp', '5511999998888',
    'templateId', 'consulting'
  );
  v_document jsonb := jsonb_build_object(
    'schemaVersion', 1,
    'templateId', 'consulting',
    'themeId', 'cyan-dark',
    'businessName', 'Studio Teste',
    'title', 'Arquitetura e Design',
    'subtitle', 'Projetos residenciais contemporâneos',
    'description', 'Projetos com sustentabilidade e elegância',
    'services', jsonb_build_array(jsonb_build_object('title', 'Interiores', 'description', 'Design completo')),
    'ctaLabel', 'Falar com Arquiteto',
    'email', 'contato@studioteste.com',
    'whatsapp', '5511999998888',
    'city', 'São Paulo'
  );
begin
  -- 1. Create simulated user in auth.users
  insert into auth.users (id, email, email_confirmed_at)
  values (v_user_id, 'projects.test@exemplo.com.br', now());

  -- 2. Ensure workspace for user
  v_res := public.os_ensure_workspace(v_user_id, 'Workspace Teste', 'business', '2026-10-02');
  v_workspace_id := (v_res->>'id')::uuid;

  -- 3. Create first project (must succeed, version = 1)
  v_res := public.os_create_project(v_user_id, v_briefing, v_document);
  v_project_id := (v_res->>'id')::uuid;
  if (v_res->>'version')::int != 1 then
    raise exception 'Versão inicial do projeto deveria ser 1';
  end if;

  -- 4. Create second project on same workspace (must fail with limit error)
  begin
    perform public.os_create_project(v_user_id, v_briefing, v_document);
    raise exception 'Deveria ter rejeitado criação do 2º projeto no plano gratuito';
  exception when others then
    get stacked diagnostics v_err = message_text;
    if v_err not like '%Limite do plano gratuito%' then
      raise exception 'Erro inesperado: %', v_err;
    end if;
  end;

  -- 5. Save project with expected_version = 1 -> version becomes 2
  v_saved := public.os_save_project(v_user_id, v_project_id, 1, v_document);
  if (v_saved->>'version')::int != 2 then
    raise exception 'Versão após primeiro save deveria ser 2, obteve %', v_saved->>'version';
  end if;

  -- 6. Save project expecting stale version 1 -> must throw version conflict
  begin
    perform public.os_save_project(v_user_id, v_project_id, 1, v_document);
    raise exception 'Deveria ter rejeitado save com versão desatualizada';
  exception when others then
    get stacked diagnostics v_err = message_text;
    if v_err not like '%Conflito de versão%' then
      raise exception 'Erro inesperado: %', v_err;
    end if;
  end;

  -- 7. Delete project
  perform public.os_delete_project(v_user_id, v_project_id);
  if exists (select 1 from public.os_projects where id = v_project_id) then
    raise exception 'Projeto não deveria mais existir após exclusão';
  end if;
end $$;

rollback;
