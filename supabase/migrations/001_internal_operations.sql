-- Apply with Supabase SQL Editor or the Supabase CLI.
-- team_members is the authorization source for the internal dashboard.
create extension if not exists pgcrypto;

create type public.team_role as enum ('owner', 'finance', 'sales', 'operations', 'ai_lab');
create type public.client_status as enum ('active', 'negotiating', 'paused');
create type public.project_stage as enum ('backlog', 'design', 'development', 'qa', 'delivered');

create table if not exists public.team_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  role public.team_role not null default 'operations',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  service text not null check (char_length(service) between 2 and 160),
  status public.client_status not null default 'negotiating',
  value_cents integer not null default 0 check (value_cents >= 0),
  billing_type text not null default 'project' check (billing_type in ('monthly', 'project')),
  email text not null check (char_length(email) <= 320),
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  provider text not null default 'manual',
  external_id text,
  amount_cents integer not null default 0 check (amount_cents >= 0),
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  title text not null check (char_length(title) between 2 and 160),
  project_type text not null default 'web',
  stage public.project_stage not null default 'backlog',
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  stripe_invoice_id text unique not null,
  client_id uuid references public.clients(id) on delete set null,
  amount_cents integer not null default 0,
  currency text not null default 'brl',
  status text not null,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_runs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  automation text not null,
  model text not null,
  status text not null,
  tokens integer not null default 0,
  latency_ms integer,
  error_code text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists clients_updated_at_idx on public.clients(updated_at desc);
create index if not exists projects_stage_idx on public.projects(stage, updated_at desc);
create index if not exists invoices_status_idx on public.invoices(status, created_at desc);
create index if not exists ai_runs_created_at_idx on public.ai_runs(created_at desc);

alter table public.team_members enable row level security;
alter table public.clients enable row level security;
alter table public.contracts enable row level security;
alter table public.projects enable row level security;
alter table public.invoices enable row level security;
alter table public.ai_runs enable row level security;
alter table public.audit_events enable row level security;

create or replace function public.is_active_team_member()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.team_members where user_id = auth.uid() and active = true);
$$;

create policy "members can read own membership" on public.team_members for select to authenticated using (user_id = auth.uid());
create policy "active team can read clients" on public.clients for select to authenticated using (public.is_active_team_member());
create policy "sales and owners can create clients" on public.clients for insert to authenticated with check (exists (select 1 from public.team_members where user_id = auth.uid() and active and role in ('owner', 'sales')));
create policy "sales and owners can update clients" on public.clients for update to authenticated using (exists (select 1 from public.team_members where user_id = auth.uid() and active and role in ('owner', 'sales'))) with check (exists (select 1 from public.team_members where user_id = auth.uid() and active and role in ('owner', 'sales')));
create policy "active team can read contracts" on public.contracts for select to authenticated using (public.is_active_team_member());
create policy "active team can read projects" on public.projects for select to authenticated using (public.is_active_team_member());
create policy "active team can read invoices" on public.invoices for select to authenticated using (public.is_active_team_member());
create policy "active team can read ai runs" on public.ai_runs for select to authenticated using (public.is_active_team_member());
create policy "active team can read audit events" on public.audit_events for select to authenticated using (public.is_active_team_member());
