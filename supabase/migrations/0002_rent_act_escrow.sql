-- Rent Act 220 escrow flow: leases, escrow installment schedule, MoMo
-- transactions, and RLS.
--
-- Assumes tables from the existing schema referenced in src/lib/supabase.ts:
--   profiles(id uuid pk -> auth.users, organization_id uuid, role text, ...)
--   properties(id uuid pk, organization_id uuid, owner_id uuid, ...)
-- If those don't exist yet in your project, create them first — this
-- migration will fail on the foreign keys otherwise, loudly, which is the
-- point: no silent partial schema.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- leases
-- ---------------------------------------------------------------------
create table if not exists public.leases (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  property_id uuid not null references public.properties(id) on delete restrict,
  tenant_id uuid not null references public.profiles(id) on delete restrict,
  owner_id uuid not null references public.profiles(id) on delete restrict,
  monthly_rent_ghs numeric(12, 2) not null check (monthly_rent_ghs > 0),
  advance_months_requested int not null check (advance_months_requested >= 1),
  legal_advance_months int not null check (legal_advance_months between 1 and 6),
  start_date date not null,
  end_date date,
  status text not null default 'pending_first_payment'
    check (status in ('pending_first_payment', 'active', 'terminated', 'expired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leases_org_idx on public.leases(organization_id);
create index if not exists leases_tenant_idx on public.leases(tenant_id);
create index if not exists leases_owner_idx on public.leases(owner_id);
create index if not exists leases_property_idx on public.leases(property_id);

-- ---------------------------------------------------------------------
-- lease_installments — the full Rent Act compliant payment schedule
-- ---------------------------------------------------------------------
create table if not exists public.lease_installments (
  id uuid primary key default gen_random_uuid(),
  lease_id uuid not null references public.leases(id) on delete cascade,
  installment_number int not null,
  month_offset int not null,
  due_date date not null,
  amount_ghs numeric(12, 2) not null check (amount_ghs > 0),
  kind text not null check (kind in ('legal_advance', 'monthly_rent')),
  status text not null default 'due'
    check (status in ('due', 'pending_confirmation', 'paid', 'overdue', 'waived')),
  paid_at timestamptz,
  momo_transaction_id uuid,
  created_at timestamptz not null default now(),
  unique (lease_id, installment_number)
);

create index if not exists lease_installments_lease_idx on public.lease_installments(lease_id);
create index if not exists lease_installments_status_idx on public.lease_installments(status);

-- ---------------------------------------------------------------------
-- momo_transactions — one row per Mobile Money payment attempt
-- ---------------------------------------------------------------------
create table if not exists public.momo_transactions (
  id uuid primary key default gen_random_uuid(),
  lease_id uuid not null references public.leases(id) on delete restrict,
  installment_id uuid not null references public.lease_installments(id) on delete restrict,
  initiated_by uuid not null references public.profiles(id) on delete restrict,
  rail text not null check (rail in ('mtn_momo', 'telecel_cash', 'at_money')),
  phone_number text not null,
  amount_ghs numeric(12, 2) not null check (amount_ghs > 0),
  status text not null default 'initiated'
    check (status in ('initiated', 'awaiting_pin', 'success', 'failed', 'cancelled')),
  provider_reference text,
  failure_reason text,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

create index if not exists momo_tx_lease_idx on public.momo_transactions(lease_id);
create index if not exists momo_tx_installment_idx on public.momo_transactions(installment_id);

alter table public.lease_installments
  add constraint lease_installments_momo_tx_fk
  foreign key (momo_transaction_id) references public.momo_transactions(id) on delete set null;

-- ---------------------------------------------------------------------
-- updated_at trigger for leases
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leases_set_updated_at on public.leases;
create trigger leases_set_updated_at
  before update on public.leases
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------
alter table public.leases enable row level security;
alter table public.lease_installments enable row level security;
alter table public.momo_transactions enable row level security;

-- leases: tenant and owner on the lease can read it; nobody can write
-- directly from the client — writes go through the service-role API route
-- so the Rent Act math is always computed server-side, never trusted from
-- the browser.
drop policy if exists leases_select on public.leases;
create policy leases_select on public.leases
  for select
  using (
    tenant_id = auth.uid()
    or owner_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('super_admin', 'org_admin')
        and p.organization_id = leases.organization_id
    )
  );

drop policy if exists lease_installments_select on public.lease_installments;
create policy lease_installments_select on public.lease_installments
  for select
  using (
    exists (
      select 1 from public.leases l
      where l.id = lease_installments.lease_id
        and (
          l.tenant_id = auth.uid()
          or l.owner_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid()
              and p.role in ('super_admin', 'org_admin')
              and p.organization_id = l.organization_id
          )
        )
    )
  );

drop policy if exists momo_transactions_select on public.momo_transactions;
create policy momo_transactions_select on public.momo_transactions
  for select
  using (
    exists (
      select 1 from public.leases l
      where l.id = momo_transactions.lease_id
        and (
          l.tenant_id = auth.uid()
          or l.owner_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid()
              and p.role in ('super_admin', 'org_admin')
              and p.organization_id = l.organization_id
          )
        )
    )
  );

-- A tenant may insert their OWN momo_transactions row directly (payment
-- initiation UX needs low latency), but only for an installment on their
-- own lease, only for the exact amount the installment specifies, and only
-- while it's still payable. Confirmation (marking it 'success' and marking
-- the installment 'paid') happens exclusively through the service-role
-- confirm route — never directly from the client — so a tenant can't simply
-- update their own transaction row to 'success'.
drop policy if exists momo_transactions_insert_by_tenant on public.momo_transactions;
create policy momo_transactions_insert_by_tenant on public.momo_transactions
  for insert
  with check (
    initiated_by = auth.uid()
    and status = 'initiated'
    and exists (
      select 1 from public.leases l
      join public.lease_installments li on li.lease_id = l.id
      where l.id = momo_transactions.lease_id
        and li.id = momo_transactions.installment_id
        and l.tenant_id = auth.uid()
        and li.status = 'due'
        and li.amount_ghs = momo_transactions.amount_ghs
    )
  );

-- A tenant may flip their OWN installment from 'due' to
-- 'pending_confirmation' the moment they initiate a payment against it —
-- this is a narrow, non-monetary status transition purely to prevent two
-- concurrent payment attempts on the same installment. It cannot be used to
-- mark anything 'paid'.
drop policy if exists lease_installments_update_pending_by_tenant on public.lease_installments;
create policy lease_installments_update_pending_by_tenant on public.lease_installments
  for update
  using (
    status = 'due'
    and exists (
      select 1 from public.leases l
      where l.id = lease_installments.lease_id and l.tenant_id = auth.uid()
    )
  )
  with check (
    status = 'pending_confirmation'
    and exists (
      select 1 from public.leases l
      where l.id = lease_installments.lease_id and l.tenant_id = auth.uid()
    )
  );

-- No other client-side UPDATE/DELETE policies exist on these three tables.
-- Every other status transition (initiated -> success, pending_confirmation
-- -> paid, etc.) is performed only by API routes using the service-role
-- client, after re-verifying the caller's identity and role server-side.
-- This is deliberate: real money state should never be writable by a
-- browser-held anon/session key beyond the one narrow case above.
