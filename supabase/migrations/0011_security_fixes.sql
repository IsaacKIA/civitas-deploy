-- Migration: 0011_security_fixes.sql
-- Fixes insecure RLS policies and enables tenant visibility into leased properties

-- 1. Tighten energy_telemetry insert RLS policy
drop policy if exists "Service role can insert energy telemetry" on public.energy_telemetry;

create policy "Authorized sources can insert energy telemetry"
  on public.energy_telemetry for insert
  with check (
    auth.role() = 'service_role' or
    exists (
      select 1 from public.properties p
      where p.id = energy_telemetry.property_id
        and (
          p.owner_id = auth.uid() or
          p.organization_id in (
            select organization_id from public.profiles where id = auth.uid()
          )
        )
    )
  );

-- 2. Allow tenants to view properties they have a lease on
drop policy if exists "Tenants can view leased properties" on public.properties;

create policy "Tenants can view leased properties"
  on public.properties for select
  using (
    exists (
      select 1 from public.leases l
      where l.property_id = properties.id
        and l.tenant_id = auth.uid()
    )
  );

-- 3. Enhance handle_new_user() trigger to honor incoming organization_id metadata if provided
create or replace function public.handle_new_user()
returns trigger
security definer set search_path = public
language plpgsql
as $$
declare
  assigned_org uuid;
begin
  if new.raw_user_meta_data->>'organization_id' is not null and new.raw_user_meta_data->>'organization_id' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    assigned_org := (new.raw_user_meta_data->>'organization_id')::uuid;
  else
    assigned_org := gen_random_uuid();
  end if;

  insert into public.profiles (
    id,
    email,
    full_name,
    phone,
    role,
    organization_id
  )
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    assigned_org
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(nullif(excluded.full_name, ''), profiles.full_name),
    phone = coalesce(excluded.phone, profiles.phone);

  return new;
end;
$$;
