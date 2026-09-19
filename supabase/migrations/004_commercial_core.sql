-- Commercial core. Apply after 003_multi_tenant_foundation.sql.

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 160),
  website text not null default '',
  industry text not null default '',
  email text not null default '',
  phone text not null default '',
  owner_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id)
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid not null,
  name text not null check (char_length(name) between 2 and 160),
  email text not null default '',
  phone text not null default '',
  job_title text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, company_id) references public.companies(organization_id, id) on delete cascade
);

create table if not exists public.pipelines (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 100),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  unique (organization_id, id),
  unique (organization_id, name)
);

create table if not exists public.pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  pipeline_id uuid not null,
  name text not null check (char_length(name) between 2 and 80),
  position integer not null check (position >= 0),
  probability integer not null default 0 check (probability between 0 and 100),
  created_at timestamptz not null default now(),
  unique (organization_id, id),
  unique (organization_id, pipeline_id, position),
  unique (organization_id, pipeline_id, id),
  foreign key (organization_id, pipeline_id) references public.pipelines(organization_id, id) on delete cascade
);

create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid not null,
  contact_id uuid,
  owner_id uuid references auth.users(id) on delete set null,
  pipeline_id uuid not null,
  stage_id uuid not null,
  title text not null check (char_length(title) between 2 and 180),
  amount_cents integer not null default 0 check (amount_cents >= 0),
  status text not null default 'open' check (status in ('open', 'won', 'lost')),
  expected_close_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, company_id) references public.companies(organization_id, id),
  foreign key (organization_id, contact_id) references public.contacts(organization_id, id),
  foreign key (organization_id, pipeline_id) references public.pipelines(organization_id, id),
  foreign key (organization_id, stage_id) references public.pipeline_stages(organization_id, id),
  foreign key (organization_id, pipeline_id, stage_id) references public.pipeline_stages(organization_id, pipeline_id, id)
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid,
  contact_id uuid,
  deal_id uuid,
  assignee_id uuid references auth.users(id) on delete set null,
  title text not null check (char_length(title) between 2 and 180),
  due_date date,
  status text not null default 'open' check (status in ('open', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, company_id) references public.companies(organization_id, id),
  foreign key (organization_id, contact_id) references public.contacts(organization_id, id),
  foreign key (organization_id, deal_id) references public.deals(organization_id, id)
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid,
  contact_id uuid,
  deal_id uuid,
  actor_id uuid references auth.users(id) on delete set null,
  activity_type text not null check (activity_type in ('note', 'stage_changed', 'task_created', 'task_completed', 'deal_created')),
  body text not null default '',
  created_at timestamptz not null default now(),
  foreign key (organization_id, company_id) references public.companies(organization_id, id),
  foreign key (organization_id, contact_id) references public.contacts(organization_id, id),
  foreign key (organization_id, deal_id) references public.deals(organization_id, id)
);

create index if not exists companies_org_updated_idx on public.companies(organization_id, updated_at desc);
create index if not exists contacts_org_company_idx on public.contacts(organization_id, company_id, updated_at desc);
create index if not exists stages_org_pipeline_idx on public.pipeline_stages(organization_id, pipeline_id, position);
create index if not exists deals_org_stage_idx on public.deals(organization_id, pipeline_id, stage_id, updated_at desc);
create index if not exists tasks_org_status_idx on public.tasks(organization_id, status, due_date);
create index if not exists activities_org_created_idx on public.activities(organization_id, created_at desc);

-- Seed an empty default pipeline for every existing organization; no business records are fabricated.
insert into public.pipelines (organization_id, name, is_default)
select id, 'Vendas', true from public.organizations
on conflict (organization_id, name) do nothing;

insert into public.pipeline_stages (organization_id, pipeline_id, name, position, probability)
select p.organization_id, p.id, stages.name, stages.position, stages.probability
from public.pipelines p
cross join (values
  ('Novo', 0, 10),
  ('Qualificado', 1, 30),
  ('Proposta', 2, 60),
  ('Negociação', 3, 80),
  ('Fechado', 4, 100)
) as stages(name, position, probability)
where p.is_default
on conflict (organization_id, pipeline_id, position) do nothing;

alter table public.companies enable row level security;
alter table public.contacts enable row level security;
alter table public.pipelines enable row level security;
alter table public.pipeline_stages enable row level security;
alter table public.deals enable row level security;
alter table public.tasks enable row level security;
alter table public.activities enable row level security;

create policy "organization members can read companies" on public.companies
  for select to authenticated using (public.is_org_member(organization_id));
create policy "organization members can write companies" on public.companies
  for all to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "organization members can read contacts" on public.contacts
  for select to authenticated using (public.is_org_member(organization_id));
create policy "organization members can write contacts" on public.contacts
  for all to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "organization members can read pipelines" on public.pipelines
  for select to authenticated using (public.is_org_member(organization_id));
create policy "organization members can write pipelines" on public.pipelines
  for all to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "organization members can read pipeline stages" on public.pipeline_stages
  for select to authenticated using (public.is_org_member(organization_id));
create policy "organization members can write pipeline stages" on public.pipeline_stages
  for all to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "organization members can read deals" on public.deals
  for select to authenticated using (public.is_org_member(organization_id));
create policy "organization members can write deals" on public.deals
  for all to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "organization members can read tasks" on public.tasks
  for select to authenticated using (public.is_org_member(organization_id));
create policy "organization members can write tasks" on public.tasks
  for all to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "organization members can read activities" on public.activities
  for select to authenticated using (public.is_org_member(organization_id));
create policy "organization members can write activities" on public.activities
  for insert to authenticated with check (public.is_org_member(organization_id));
