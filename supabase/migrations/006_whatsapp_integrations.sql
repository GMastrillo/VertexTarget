-- WhatsApp integrations. Apply after 005_inbox_support.sql.

create table if not exists public.whatsapp_instances (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  provider text not null check (provider in ('official', 'unofficial')),
  name text not null check (char_length(name) between 2 and 100),
  phone_number text not null default '',
  external_id text not null default '',
  status text not null default 'disconnected' check (status in ('disconnected', 'connecting', 'connected', 'error')),
  last_error text not null default '',
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  unique (organization_id, provider, external_id)
);

create table if not exists public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  instance_id uuid not null,
  conversation_id uuid,
  provider_message_id text not null default '',
  direction text not null check (direction in ('inbound', 'outbound')),
  status text not null default 'queued' check (status in ('queued', 'sent', 'delivered', 'read', 'failed')),
  recipient text not null default '',
  body text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, instance_id) references public.whatsapp_instances(organization_id, id) on delete cascade,
  foreign key (organization_id, conversation_id) references public.conversations(organization_id, id) on delete set null
);

create table if not exists public.whatsapp_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  instance_id uuid,
  provider text not null check (provider in ('official', 'unofficial')),
  event_type text not null,
  provider_event_id text not null default '',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, instance_id) references public.whatsapp_instances(organization_id, id) on delete set null
);

create index if not exists whatsapp_instances_org_status_idx on public.whatsapp_instances(organization_id, status, updated_at desc);
create index if not exists whatsapp_messages_org_instance_idx on public.whatsapp_messages(organization_id, instance_id, created_at desc);
create index if not exists whatsapp_events_org_created_idx on public.whatsapp_events(organization_id, created_at desc);

alter table public.whatsapp_instances enable row level security;
alter table public.whatsapp_messages enable row level security;
alter table public.whatsapp_events enable row level security;

create policy "organization members can read whatsapp instances" on public.whatsapp_instances
  for select to authenticated using (public.is_org_member(organization_id));
create policy "organization members can write whatsapp instances" on public.whatsapp_instances
  for all to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy "organization members can read whatsapp messages" on public.whatsapp_messages
  for select to authenticated using (public.is_org_member(organization_id));
create policy "organization members can insert whatsapp messages" on public.whatsapp_messages
  for insert to authenticated with check (public.is_org_member(organization_id));
create policy "organization members can read whatsapp events" on public.whatsapp_events
  for select to authenticated using (public.is_org_member(organization_id));
create policy "organization members can insert whatsapp events" on public.whatsapp_events
  for insert to authenticated with check (public.is_org_member(organization_id));
