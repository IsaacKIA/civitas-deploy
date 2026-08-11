-- Real maintenance request tracking, replacing the fully mock owner/tenant
-- maintenance pages (the owner page was a request wizard with no list view
-- at all, and its fake submit always "succeeded" after a setTimeout; the
-- tenant page showed two hardcoded tickets to every tenant and its "Log
-- New Issue" button linked into the owner's section, which the new
-- middleware role-gating would now correctly block).

create table if not exists public.maintenance_requests (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  organization_id uuid not null,
  property_id uuid not null references public.properties(id) on delete restrict,
  reported_by uuid not null references public.profiles(id) on delete restrict,
  tenant_id uuid references public.profiles(id) on delete set null,
  owner_id uuid not null references public.profiles(id) on delete restrict,
  category text not null check (category in
    ('electrical', 'plumbing', 'hvac', 'structural', 'solar', 'cleaning', 'smart_home', 'general')),
  priority text not null check (priority in ('emergency', 'urgent', 'standard', 'low')),
  sla_hours int not null,
  title text not null,
  description text not null,
  preferred_date date,
  status text not null default 'new'
    check (status in ('new', 'assigned', 'in_progress', 'completed', 'cancelled')),
  technician_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists maintenance_requests_org_idx on public.maintenance_requests(organization_id);
create index if not exists maintenance_requests_property_idx on public.maintenance_requests(property_id);
create index if not exists maintenance_requests_tenant_idx on public.maintenance_requests(tenant_id);
create index if not exists maintenance_requests_owner_idx on public.maintenance_requests(owner_id);
create index if not exists maintenance_requests_status_idx on public.maintenance_requests(status);

drop trigger if exists maintenance_requests_set_updated_at on public.maintenance_requests;
create trigger maintenance_requests_set_updated_at
  before update on public.maintenance_requests
  for each row execute function public.set_updated_at();

alter table public.maintenance_requests enable row level security;

-- Read: the tenant who reported it, the property owner, or an admin in the
-- same organization. A technician's own visibility (once technician
-- dashboards are built for real) will need its own policy added then —
-- deliberately not added now since there's no real technician assignment
-- flow yet, and an empty/unused policy is worse than no policy.
drop policy if exists maintenance_requests_select on public.maintenance_requests;
create policy maintenance_requests_select on public.maintenance_requests
  for select
  using (
    reported_by = auth.uid()
    or tenant_id = auth.uid()
    or owner_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('super_admin', 'org_admin')
        and p.organization_id = maintenance_requests.organization_id
    )
  );

-- Insert: a tenant may only file a request against a property they
-- actually have an active/pending lease on. An owner/org_admin/client may
-- only file against a property they actually own. This is checked in
-- Postgres, not just in the API route, so a forged request body can't
-- attach someone else's property.
drop policy if exists maintenance_requests_insert on public.maintenance_requests;
create policy maintenance_requests_insert on public.maintenance_requests
  for insert
  with check (
    reported_by = auth.uid()
    and (
      (
        tenant_id = auth.uid()
        and exists (
          select 1 from public.leases l
          where l.property_id = maintenance_requests.property_id
            and l.tenant_id = auth.uid()
            and l.status in ('active', 'pending_first_payment')
        )
      )
      or (
        tenant_id is null
        and exists (
          select 1 from public.properties pr
          where pr.id = maintenance_requests.property_id
            and pr.owner_id = auth.uid()
        )
      )
    )
  );

-- No client-side UPDATE policy: status transitions (assigning a
-- technician, marking in_progress/completed) happen through a future
-- ops-side flow using the service-role client, once that workflow exists.
