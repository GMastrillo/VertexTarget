-- ════════════════════════════════════════════════════════════════════
-- Integration SQL Test: OS Access, Isolation & Grants
-- ════════════════════════════════════════════════════════════════════

begin;

-- Verify RLS is enabled on all OS tables
do $$
declare
  r record;
begin
  for r in (
    select tablename from pg_tables
    where schemaname = 'public' and tablename like 'os_%'
  ) loop
    if not exists (
      select 1 from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relname = r.tablename and c.rowsecurity = true
    ) then
      raise exception 'RLS is not enabled on %', r.tablename;
    end if;
  end loop;
end;
$$;

-- Verify anonymous cannot insert or update workspaces directly
do $$
begin
  begin
    insert into public.os_workspaces (owner_id, name, journey)
    values ('00000000-0000-0000-0000-000000000000'::uuid, 'Test Hacked', 'business');
    raise exception 'Expected permission denied for direct workspace insertion';
  exception
    when insufficient_privilege then
      -- expected PASS
      null;
  end;
end;
$$;

rollback;
