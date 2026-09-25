-- Migration: 0010_energy_telemetry.sql
-- Real-time solar inverter & IoT energy telemetry readings

create table if not exists public.energy_telemetry (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  timestamp timestamptz not null default now(),
  generation_kw numeric(8, 2) not null default 0,
  consumption_kw numeric(8, 2) not null default 0,
  grid_import_kw numeric(8, 2) not null default 0,
  battery_soc_pct numeric(5, 2),
  grid_status text not null default 'online' check (grid_status in ('online', 'offline', 'generator')),
  inverter_brand text default 'Generic Inverter',
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

-- Index for fast time-series queries by property
create index if not exists energy_telemetry_property_time_idx
  on public.energy_telemetry(property_id, timestamp desc);

alter table public.energy_telemetry enable row level security;

-- Policy: Owners can view telemetry for their properties
create policy "Owners can view energy telemetry for their properties"
  on public.energy_telemetry for select
  using (
    exists (
      select 1 from public.properties p
      where p.id = energy_telemetry.property_id
        and (p.owner_id = auth.uid() or p.organization_id in (
          select organization_id from public.profiles where id = auth.uid()
        ))
    )
  );

-- Policy: Service role or authorized webhook inserts telemetry
create policy "Service role can insert energy telemetry"
  on public.energy_telemetry for insert
  with check (true);
