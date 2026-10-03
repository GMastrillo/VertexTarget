-- ════════════════════════════════════════════════════════════════════
-- MIGRATION 009: Vertex OS Schema & Core Tables
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.os_workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete restrict,
  name text not null,
  journey text not null check (journey in ('business', 'professional')),
  status text not null default 'active' check (status in ('active', 'suspended', 'deleted')),
  plan text not null default 'free' check (plan in ('free')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.os_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  workspace_id uuid references public.os_workspaces(id) on delete set null,
  notice_version text not null,
  purpose text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.os_projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.os_workspaces(id) on delete cascade,
  briefing jsonb not null,
  document jsonb not null,
  version integer not null default 1 check (version >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint os_projects_workspace_unique unique (workspace_id)
);

create table if not exists public.os_publications (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.os_workspaces(id) on delete cascade,
  project_id uuid not null references public.os_projects(id) on delete cascade,
  slug text not null unique,
  snapshot jsonb not null,
  status text not null default 'active' check (status in ('active', 'suspended')),
  published_at timestamptz not null default now(),
  constraint os_publications_workspace_unique unique (workspace_id)
);

create table if not exists public.os_prospects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.os_workspaces(id) on delete cascade,
  name text not null,
  sector text not null default '',
  city text not null default '',
  website text not null default '',
  email text not null default '',
  phone text not null default '',
  notes text not null default '',
  status text not null default 'new' check (status in ('new', 'contacted', 'proposal', 'closed', 'discarded')),
  sources jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.os_usage_operations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  workspace_id uuid references public.os_workspaces(id) on delete set null,
  kind text not null check (kind in ('copy', 'search')),
  period text not null,
  idempotency_key uuid not null,
  payload_hash text not null,
  state text not null default 'reserved' check (state in ('reserved', 'sent', 'completed', 'failed')),
  tokens integer not null default 0,
  latency_ms integer not null default 0,
  error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint os_usage_operations_key_unique unique (user_id, idempotency_key)
);

create table if not exists public.os_usage_counters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  kind text not null check (kind in ('copy', 'search')),
  period text not null,
  count integer not null default 0 check (count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint os_usage_counters_user_period_unique unique (user_id, kind, period)
);

-- Indices for performance and multi-tenant queries
create index if not exists idx_os_prospects_workspace on public.os_prospects(workspace_id);
create index if not exists idx_os_publications_slug on public.os_publications(slug) where status = 'active';
create index if not exists idx_os_usage_counters_lookup on public.os_usage_counters(user_id, kind, period);
create index if not exists idx_os_usage_operations_lookup on public.os_usage_operations(user_id, idempotency_key);
