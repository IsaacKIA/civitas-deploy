-- The property onboarding wizard (src/app/dashboard/owner/properties/new)
-- has always collected these fields and then discarded them, because the
-- schema had nowhere to put them. Adding them here rather than dropping the
-- data on the floor. Idempotent — safe to run against a project that
-- already has some of these columns from elsewhere.

alter table public.properties add column if not exists city text;
alter table public.properties add column if not exists total_units int not null default 1;
alter table public.properties add column if not exists has_battery_backup boolean not null default false;
alter table public.properties add column if not exists ghana_card_pin text;
alter table public.properties add column if not exists land_title_ref text;
alter table public.properties add column if not exists property_code text unique;

-- Deliberately no RLS INSERT/UPDATE policy for the client here either —
-- property creation goes through POST /api/properties using the
-- service-role client, after the caller's role and organization are
-- verified server-side, for the same reason lease writes do (see
-- 0002_rent_act_escrow.sql). Read access for the owning org is assumed to
-- already exist from the original properties table setup; if it doesn't,
-- add:
--
-- alter table public.properties enable row level security;
-- create policy properties_select on public.properties for select
--   using (
--     owner_id = auth.uid()
--     or exists (
--       select 1 from public.profiles p
--       where p.id = auth.uid() and p.organization_id = properties.organization_id
--     )
--   );
