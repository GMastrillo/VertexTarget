-- Migration 018: Global Payment Links Operations and Idempotency
-- Creates scoped operation tracking table for idempotent payment link creation.

alter table if exists stripe_payment_links
  add column if not exists request_id uuid;

create table if not exists stripe_payment_link_operations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  request_id uuid not null,
  payload_hash text not null,
  status text not null check (status in ('pending', 'completed', 'failed')),
  resource_ids jsonb,
  payment_link_id uuid references stripe_payment_links(id) on delete set null,
  error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_payment_link_op_request unique (organization_id, request_id)
);

alter table stripe_payment_link_operations enable row level security;

create policy "payment_link_operations_org_select"
  on stripe_payment_link_operations
  for select
  to authenticated
  using (is_member(organization_id));

create policy "payment_link_operations_org_insert"
  on stripe_payment_link_operations
  for insert
  to authenticated
  with check (is_member(organization_id));

create policy "payment_link_operations_org_update"
  on stripe_payment_link_operations
  for update
  to authenticated
  using (is_member(organization_id))
  with check (is_member(organization_id));

-- Service role bypass for backend automation
create policy "payment_link_operations_service_role"
  on stripe_payment_link_operations
  for all
  to service_role
  using (true)
  with check (true);
