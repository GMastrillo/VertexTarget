-- Performance and results gamification. Apply after 007_stripe_payment_links.sql.

create table if not exists public.performance_goals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  owner_id uuid references auth.users(id) on delete set null,
  title text not null check (char_length(title) between 2 and 160),
  metric text not null check (metric in ('revenue_cents', 'deals_won', 'tasks_completed', 'messages_sent')),
  target_value bigint not null check (target_value > 0),
  period_start date not null,
  period_end date not null,
  status text not null default 'active' check (status in ('active', 'completed', 'archived')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  check (period_end >= period_start)
);

create table if not exists public.performance_challenges (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 160),
  metric text not null check (metric in ('revenue_cents', 'deals_won', 'tasks_completed', 'messages_sent')),
  target_value bigint not null check (target_value > 0),
  period_start date not null,
  period_end date not null,
  status text not null default 'active' check (status in ('active', 'completed', 'archived')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  check (period_end >= period_start)
);

create table if not exists public.performance_achievements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 120),
  description text not null default '' check (char_length(description) <= 300),
  metric text not null check (metric in ('revenue_cents', 'deals_won', 'tasks_completed', 'messages_sent')),
  target_value bigint not null check (target_value > 0),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (organization_id, id)
);

create table if not exists public.performance_awards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  achievement_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  metric_value bigint not null check (metric_value >= 0),
  awarded_at timestamptz not null default now(),
  unique (organization_id, achievement_id, user_id),
  foreign key (organization_id, achievement_id) references public.performance_achievements(organization_id, id) on delete cascade
);

create index if not exists performance_goals_org_period_idx on public.performance_goals(organization_id, status, period_end);
create index if not exists performance_challenges_org_period_idx on public.performance_challenges(organization_id, status, period_end);
create index if not exists performance_achievements_org_metric_idx on public.performance_achievements(organization_id, metric);
create index if not exists performance_awards_org_user_idx on public.performance_awards(organization_id, user_id, awarded_at desc);

alter table public.performance_goals enable row level security;
alter table public.performance_challenges enable row level security;
alter table public.performance_achievements enable row level security;
alter table public.performance_awards enable row level security;

create policy "organization members can read performance goals" on public.performance_goals
  for select to authenticated using (public.is_org_member(organization_id));
create policy "organization members can write performance goals" on public.performance_goals
  for all to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy "organization members can read performance challenges" on public.performance_challenges
  for select to authenticated using (public.is_org_member(organization_id));
create policy "organization members can write performance challenges" on public.performance_challenges
  for all to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy "organization members can read performance achievements" on public.performance_achievements
  for select to authenticated using (public.is_org_member(organization_id));
create policy "organization members can write performance achievements" on public.performance_achievements
  for all to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy "organization members can read performance awards" on public.performance_awards
  for select to authenticated using (public.is_org_member(organization_id));
-- Awards are written only by the server-side service-role path after real metric evaluation.
-- There is intentionally no client insert policy for this table.

