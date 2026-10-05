-- Migration 019: Stripe Presentment and Multi-currency Checkout Payments
-- Records settled checkout sessions with separated integration and presentment currencies.

create table if not exists stripe_checkout_payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  checkout_session_id text not null unique,
  stripe_payment_link_id text,
  amount_cents integer not null,
  currency text not null,
  presentment_amount_cents integer,
  presentment_currency text,
  payment_status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_presentment_pair check (
    (presentment_amount_cents is null and presentment_currency is null) or
    (presentment_amount_cents is not null and presentment_currency is not null)
  )
);

alter table stripe_checkout_payments enable row level security;

create policy "stripe_checkout_payments_org_select"
  on stripe_checkout_payments
  for select
  to authenticated
  using (is_member(organization_id));

create policy "stripe_checkout_payments_service_role"
  on stripe_checkout_payments
  for all
  to service_role
  using (true)
  with check (true);
