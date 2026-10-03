-- ════════════════════════════════════════════════════════════════════
-- MIGRATION 010: Vertex OS RLS Policies & Grants
-- ════════════════════════════════════════════════════════════════════

-- Enable Row Level Security on all OS tables
alter table public.os_workspaces enable row level security;
alter table public.os_consents enable row level security;
alter table public.os_projects enable row level security;
alter table public.os_publications enable row level security;
alter table public.os_prospects enable row level security;
alter table public.os_usage_operations enable row level security;
alter table public.os_usage_counters enable row level security;

-- 1. os_workspaces: authenticated owner reads their own active workspace
create policy "os_workspaces_select_owner"
  on public.os_workspaces
  for select
  to authenticated
  using (owner_id = auth.uid() and status != 'deleted');

-- 2. os_consents: authenticated user reads their consents
create policy "os_consents_select_user"
  on public.os_consents
  for select
  to authenticated
  using (user_id = auth.uid());

-- 3. os_projects: authenticated owner reads project of their active workspace
create policy "os_projects_select_owner"
  on public.os_projects
  for select
  to authenticated
  using (
    workspace_id in (
      select id from public.os_workspaces
      where owner_id = auth.uid() and status = 'active'
    )
  );

-- 4. os_publications: authenticated owner reads their publication
create policy "os_publications_select_owner"
  on public.os_publications
  for select
  to authenticated
  using (
    workspace_id in (
      select id from public.os_workspaces
      where owner_id = auth.uid() and status = 'active'
    )
  );

-- 5. os_prospects: authenticated owner reads prospects of their active workspace
create policy "os_prospects_select_owner"
  on public.os_prospects
  for select
  to authenticated
  using (
    workspace_id in (
      select id from public.os_workspaces
      where owner_id = auth.uid() and status = 'active'
    )
  );

-- 6. os_usage_operations: authenticated user reads their usage records
create policy "os_usage_operations_select_user"
  on public.os_usage_operations
  for select
  to authenticated
  using (user_id = auth.uid());

-- 7. os_usage_counters: authenticated user reads their usage counters
create policy "os_usage_counters_select_user"
  on public.os_usage_counters
  for select
  to authenticated
  using (user_id = auth.uid());

-- Revoke direct table mutation rights from anon and authenticated.
-- All mutations must go through SECURITY DEFINER RPCs invoked by the backend service.
revoke insert, update, delete on public.os_workspaces from anon, authenticated;
revoke insert, update, delete on public.os_consents from anon, authenticated;
revoke insert, update, delete on public.os_projects from anon, authenticated;
revoke insert, update, delete on public.os_publications from anon, authenticated;
revoke insert, update, delete on public.os_prospects from anon, authenticated;
revoke insert, update, delete on public.os_usage_operations from anon, authenticated;
revoke insert, update, delete on public.os_usage_counters from anon, authenticated;
