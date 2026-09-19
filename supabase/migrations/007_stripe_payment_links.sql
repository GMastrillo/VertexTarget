-- Stripe Payment Links. Apply after 006_whatsapp_integrations.sql.

create table if not exists public.stripe_payment_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid,
  deal_id uuid,
  stripe_payment_link_id text not null unique,
  stripe_price_id text not null default '',
  stripe_product_id text not null default '',
  url text not null,
  kind text not null check (kind in ('one_time', 'recurring')),
  status text not null default 'active' check (status in ('created', 'active', 'completed', 'expired', 'canceled')),
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'brl' check (currency in ('brl', 'usd', 'eur')),
  recurring_interval text check (recurring_interval in ('month', 'year')),
  installments integer not null default 1 check (installments between 1 and 12),
  description text not null default '' check (char_length(description) <= 240),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, client_id) references public.clients(organization_id, id) on delete set null,
  foreign key (organization_id, deal_id) references public.deals(organization_id, id) on delete set null,
  check ((kind = 'recurring' and recurring_interval is not null and installments = 1) or (kind = 'one_time' and recurring_interval is null))
);

create table if not exists public.stripe_webhook_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text not null unique,
  organization_id uuid references public.organizations(id) on delete set null,
  event_type text not null,
  payment_link_id text,
  processed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists stripe_payment_links_org_status_idx on public.stripe_payment_links(organization_id, status, created_at desc);
create index if not exists stripe_payment_links_org_client_idx on public.stripe_payment_links(organization_id, client_id, created_at desc);
create index if not exists stripe_webhook_events_link_idx on public.stripe_webhook_events(payment_link_id, created_at desc);

alter table public.stripe_payment_links enable row level security;
alter table public.stripe_webhook_events enable row level security;

create policy "organization members can read stripe payment links" on public.stripe_payment_links
  for select to authenticated using (public.is_org_member(organization_id));
create policy "finance and owners can write stripe payment links" on public.stripe_payment_links
  for all to authenticated using (public.is_org_role(organization_id, array['owner','finance']::public.team_role[]))
  with check (public.is_org_role(organization_id, array['owner','finance']::public.team_role[]));
create policy "organization members can read stripe webhook events" on public.stripe_webhook_events
  for select to authenticated using (organization_id is not null and public.is_org_member(organization_id));
