-- Multi-organization foundation.
-- Existing records are assigned to the initial VertexTarget organization.
-- Apply after 001_internal_operations.sql and 002_real_operations.sql.

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.team_role not null default 'operations',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

insert into public.organizations (id, name, slug)
values ('00000000-0000-0000-0000-000000000001', 'VertexTarget', 'vertex-target')
on conflict (slug) do nothing;

insert into public.organization_members (organization_id, user_id, role, active)
select '00000000-0000-0000-0000-000000000001', user_id, role, active
from public.team_members
on conflict (organization_id, user_id) do update
set role = excluded.role, active = excluded.active;

alter table public.clients add column if not exists organization_id uuid;
alter table public.contracts add column if not exists organization_id uuid;
alter table public.projects add column if not exists organization_id uuid;
alter table public.invoices add column if not exists organization_id uuid;
alter table public.ai_runs add column if not exists organization_id uuid;
alter table public.audit_events add column if not exists organization_id uuid;
alter table public.manual_sales add column if not exists organization_id uuid;
alter table public.prospects add column if not exists organization_id uuid;

update public.clients set organization_id = '00000000-0000-0000-0000-000000000001' where organization_id is null;
update public.contracts set organization_id = '00000000-0000-0000-0000-000000000001' where organization_id is null;
update public.projects set organization_id = '00000000-0000-0000-0000-000000000001' where organization_id is null;
update public.invoices set organization_id = '00000000-0000-0000-0000-000000000001' where organization_id is null;
update public.ai_runs set organization_id = '00000000-0000-0000-0000-000000000001' where organization_id is null;
update public.audit_events set organization_id = '00000000-0000-0000-0000-000000000001' where organization_id is null;
update public.manual_sales set organization_id = '00000000-0000-0000-0000-000000000001' where organization_id is null;
update public.prospects set organization_id = '00000000-0000-0000-0000-000000000001' where organization_id is null;

alter table public.clients alter column organization_id set not null;
alter table public.contracts alter column organization_id set not null;
alter table public.projects alter column organization_id set not null;
alter table public.invoices alter column organization_id set not null;
alter table public.ai_runs alter column organization_id set not null;
alter table public.audit_events alter column organization_id set not null;
alter table public.manual_sales alter column organization_id set not null;
alter table public.prospects alter column organization_id set not null;

alter table public.clients add constraint clients_organization_fk foreign key (organization_id) references public.organizations(id);
alter table public.contracts add constraint contracts_organization_fk foreign key (organization_id) references public.organizations(id);
alter table public.projects add constraint projects_organization_fk foreign key (organization_id) references public.organizations(id);
alter table public.invoices add constraint invoices_organization_fk foreign key (organization_id) references public.organizations(id);
alter table public.ai_runs add constraint ai_runs_organization_fk foreign key (organization_id) references public.organizations(id);
alter table public.audit_events add constraint audit_events_organization_fk foreign key (organization_id) references public.organizations(id);
alter table public.manual_sales add constraint manual_sales_organization_fk foreign key (organization_id) references public.organizations(id);
alter table public.prospects add constraint prospects_organization_fk foreign key (organization_id) references public.organizations(id);

create index if not exists organization_members_user_idx on public.organization_members(user_id, active);
create index if not exists clients_organization_updated_idx on public.clients(organization_id, updated_at desc);
create index if not exists projects_organization_stage_idx on public.projects(organization_id, stage, updated_at desc);
create index if not exists invoices_organization_status_idx on public.invoices(organization_id, status, created_at desc);
create index if not exists ai_runs_organization_created_idx on public.ai_runs(organization_id, created_at desc);
create index if not exists manual_sales_organization_sold_idx on public.manual_sales(organization_id, sold_at desc);
create index if not exists prospects_organization_status_idx on public.prospects(organization_id, status, score desc);

-- Prevent a row in one organization from referencing a client owned by another.
alter table public.clients add constraint clients_organization_id_id_unique unique (organization_id, id);
alter table public.contracts add constraint contracts_same_organization_client_fk foreign key (organization_id, client_id) references public.clients(organization_id, id);
alter table public.projects add constraint projects_same_organization_client_fk foreign key (organization_id, client_id) references public.clients(organization_id, id);
alter table public.invoices add constraint invoices_same_organization_client_fk foreign key (organization_id, client_id) references public.clients(organization_id, id);
alter table public.ai_runs add constraint ai_runs_same_organization_client_fk foreign key (organization_id, client_id) references public.clients(organization_id, id);
alter table public.manual_sales add constraint manual_sales_same_organization_client_fk foreign key (organization_id, client_id) references public.clients(organization_id, id);
alter table public.prospects add constraint prospects_same_organization_client_fk foreign key (organization_id, converted_client_id) references public.clients(organization_id, id);

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;

create or replace function public.is_org_member(target_org uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.organization_members
    where organization_id = target_org and user_id = auth.uid() and active = true
  );
$$;

create or replace function public.is_org_role(target_org uuid, allowed_roles public.team_role[])
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.organization_members
    where organization_id = target_org
      and user_id = auth.uid()
      and active = true
      and role = any(allowed_roles)
  );
$$;

-- Replace the old global-team policies. These drops are idempotent.
drop policy if exists "active team can read clients" on public.clients;
drop policy if exists "sales and owners can create clients" on public.clients;
drop policy if exists "sales and owners can update clients" on public.clients;
drop policy if exists "active team can read contracts" on public.contracts;
drop policy if exists "active team can read projects" on public.projects;
drop policy if exists "active team can read invoices" on public.invoices;
drop policy if exists "active team can read ai runs" on public.ai_runs;
drop policy if exists "active team can read audit events" on public.audit_events;
drop policy if exists "active team can read manual sales" on public.manual_sales;
drop policy if exists "finance and owners can insert manual sales" on public.manual_sales;
drop policy if exists "finance and owners can delete manual sales" on public.manual_sales;
drop policy if exists "active team can read prospects" on public.prospects;
drop policy if exists "active team can insert prospects" on public.prospects;
drop policy if exists "active team can update prospects" on public.prospects;
drop policy if exists "active team can delete prospects" on public.prospects;
drop policy if exists "operations and owners can insert projects" on public.projects;
drop policy if exists "operations and owners can update projects" on public.projects;
drop policy if exists "operations and owners can delete projects" on public.projects;

create policy "members can read organizations" on public.organizations
  for select to authenticated using (public.is_org_member(id));
create policy "members can read organization memberships" on public.organization_members
  for select to authenticated using (user_id = auth.uid() or public.is_org_member(organization_id));

create policy "organization members can read clients" on public.clients
  for select to authenticated using (public.is_org_member(organization_id));
create policy "sales and owners can create organization clients" on public.clients
  for insert to authenticated with check (public.is_org_role(organization_id, array['owner','sales']::public.team_role[]));
create policy "sales and owners can update organization clients" on public.clients
  for update to authenticated using (public.is_org_role(organization_id, array['owner','sales']::public.team_role[]))
  with check (public.is_org_role(organization_id, array['owner','sales']::public.team_role[]));

create policy "organization members can read contracts" on public.contracts
  for select to authenticated using (public.is_org_member(organization_id));
create policy "organization members can read projects" on public.projects
  for select to authenticated using (public.is_org_member(organization_id));
create policy "organization members can write projects" on public.projects
  for insert to authenticated with check (public.is_org_member(organization_id));
create policy "organization members can update projects" on public.projects
  for update to authenticated using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));
create policy "organization members can delete projects" on public.projects
  for delete to authenticated using (public.is_org_member(organization_id));

create policy "organization members can read invoices" on public.invoices
  for select to authenticated using (public.is_org_member(organization_id));
create policy "organization members can read ai runs" on public.ai_runs
  for select to authenticated using (public.is_org_member(organization_id));
create policy "organization members can read audit events" on public.audit_events
  for select to authenticated using (public.is_org_member(organization_id));

create policy "organization members can read manual sales" on public.manual_sales
  for select to authenticated using (public.is_org_member(organization_id));
create policy "finance and owners can insert organization manual sales" on public.manual_sales
  for insert to authenticated with check (public.is_org_role(organization_id, array['owner','finance']::public.team_role[]));
create policy "finance and owners can delete organization manual sales" on public.manual_sales
  for delete to authenticated using (public.is_org_role(organization_id, array['owner','finance']::public.team_role[]));

create policy "organization members can read prospects" on public.prospects
  for select to authenticated using (public.is_org_member(organization_id));
create policy "organization members can insert prospects" on public.prospects
  for insert to authenticated with check (public.is_org_member(organization_id));
create policy "organization members can update prospects" on public.prospects
  for update to authenticated using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));
create policy "organization members can delete prospects" on public.prospects
  for delete to authenticated using (public.is_org_member(organization_id));
