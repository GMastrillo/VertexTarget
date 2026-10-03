-- ════════════════════════════════════════════════════════════════════
-- Integration SQL Test: OS Workspaces Lifecycle (Idempotency & Isolation)
-- ════════════════════════════════════════════════════════════════════

begin;

-- Verify functions exist with correct security settings
do $$
begin
  if not exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'os_ensure_workspace' and p.prosecdef = true
  ) then
    raise exception 'os_ensure_workspace is missing or not security definer';
  end if;

  if not exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'os_delete_workspace' and p.prosecdef = true
  ) then
    raise exception 'os_delete_workspace is missing or not security definer';
  end if;
end;
$$;

rollback;
