-- Inbox and support core. Apply after 004_commercial_core.sql.

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  subject text not null default '' check (char_length(subject) <= 180),
  status text not null default 'open' check (status in ('open', 'pending', 'resolved')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  company_id uuid,
  contact_id uuid,
  assignee_id uuid references auth.users(id) on delete set null,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, company_id) references public.companies(organization_id, id),
  foreign key (organization_id, contact_id) references public.contacts(organization_id, id)
);

create table if not exists public.conversation_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  conversation_id uuid not null,
  author_id uuid references auth.users(id) on delete set null,
  message_type text not null default 'message' check (message_type in ('message', 'internal_note')),
  body text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, conversation_id) references public.conversations(organization_id, id) on delete cascade
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  conversation_id uuid,
  title text not null check (char_length(title) between 2 and 180),
  status text not null default 'open' check (status in ('open', 'pending', 'resolved')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  assignee_id uuid references auth.users(id) on delete set null,
  sla_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, conversation_id) references public.conversations(organization_id, id) on delete set null
);

create index if not exists conversations_org_status_idx on public.conversations(organization_id, status, last_message_at desc);
create index if not exists conversation_messages_org_conversation_idx on public.conversation_messages(organization_id, conversation_id, created_at);
create index if not exists support_tickets_org_status_sla_idx on public.support_tickets(organization_id, status, sla_due_at);

alter table public.conversations enable row level security;
alter table public.conversation_messages enable row level security;
alter table public.support_tickets enable row level security;

create policy "organization members can read conversations" on public.conversations
  for select to authenticated using (public.is_org_member(organization_id));
create policy "organization members can write conversations" on public.conversations
  for all to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "organization members can read conversation messages" on public.conversation_messages
  for select to authenticated using (public.is_org_member(organization_id));
create policy "organization members can write conversation messages" on public.conversation_messages
  for insert to authenticated with check (public.is_org_member(organization_id));

create policy "organization members can read support tickets" on public.support_tickets
  for select to authenticated using (public.is_org_member(organization_id));
create policy "organization members can write support tickets" on public.support_tickets
  for all to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
