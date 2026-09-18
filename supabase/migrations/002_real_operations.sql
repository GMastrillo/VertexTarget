-- Apply with Supabase SQL Editor (supabase/migrations/002_real_operations.sql).
-- Manual sales (PIX/outside Stripe), AI prospecting, project writes, AI run logging.

-- ── Manual sales: revenue recorded outside Stripe (PIX, cash, transfer) ──
create table if not exists public.manual_sales (
  id uuid primary key default gen_random_uuid(),
  client_name text not null check (char_length(client_name) between 1 and 120),
  client_id uuid references public.clients(id) on delete set null,
  description text not null default '' check (char_length(description) <= 240),
  amount_cents integer not null check (amount_cents > 0),
  method text not null default 'pix' check (method in ('pix', 'cash', 'transfer', 'other')),
  sold_at date not null default current_date,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists manual_sales_sold_at_idx on public.manual_sales(sold_at desc);

-- ── Prospecting: leads found by Gemini + Google Search grounding ──
create table if not exists public.prospects (
  id uuid primary key default gen_random_uuid(),
  company_name text not null check (char_length(company_name) between 1 and 160),
  category text not null default '',
  city text not null default '',
  region text not null default '',
  country text not null default '',
  website text not null default '',
  phone text not null default '',
  opportunity text not null default '',
  score integer not null default 0 check (score between 0 and 100),
  status text not null default 'new' check (status in ('new', 'contacted', 'client', 'discarded')),
  source_query text not null default '',
  converted_client_id uuid references public.clients(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists prospects_status_idx on public.prospects(status, score desc);

-- ── RLS: same team pattern as the other tables ──
alter table public.manual_sales enable row level security;
alter table public.prospects enable row level security;

create policy "active team can read manual sales" on public.manual_sales
  for select to authenticated using (public.is_active_team_member());
create policy "finance and owners can insert manual sales" on public.manual_sales
  for insert to authenticated with check (
    exists (select 1 from public.team_members where user_id = auth.uid() and active and role in ('owner', 'finance'))
  );
create policy "finance and owners can delete manual sales" on public.manual_sales
  for delete to authenticated using (
    exists (select 1 from public.team_members where user_id = auth.uid() and active and role in ('owner', 'finance'))
  );

create policy "active team can read prospects" on public.prospects
  for select to authenticated using (public.is_active_team_member());
create policy "active team can insert prospects" on public.prospects
  for insert to authenticated with check (public.is_active_team_member());
create policy "active team can update prospects" on public.prospects
  for update to authenticated using (public.is_active_team_member())
  with check (public.is_active_team_member());
create policy "active team can delete prospects" on public.prospects
  for delete to authenticated using (public.is_active_team_member());

-- ── Writing access to projects (kanban moves / creation were read-only) ──
create policy "operations and owners can insert projects" on public.projects
  for insert to authenticated with check (public.is_active_team_member());
create policy "operations and owners can update projects" on public.projects
  for update to authenticated using (public.is_active_team_member())
  with check (public.is_active_team_member());
create policy "operations and owners can delete projects" on public.projects
  for delete to authenticated using (public.is_active_team_member());
