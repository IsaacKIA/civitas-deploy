-- Initial schema for Civitas: profiles, properties, and auto-creation trigger from auth.users

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null default gen_random_uuid(),
  role text not null default 'client'
    check (role in ('super_admin', 'org_admin', 'ops_manager', 'technician', 'client', 'tenant', 'investor')),
  full_name text not null default '',
  email text not null default '',
  phone text,
  avatar_url text,
  city text default 'Accra',
  country text default 'Ghana',
  currency text default 'GHS',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_org_idx on public.profiles(organization_id);
create index if not exists profiles_role_idx on public.profiles(role);

-- RLS for profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ---------------------------------------------------------------------
-- properties
-- ---------------------------------------------------------------------
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  address text not null,
  city text not null default 'Accra',
  region text not null default 'Greater Accra',
  ghana_post_gps text,
  property_type text not null default 'residential'
    check (property_type in ('residential', 'commercial', 'mixed_use', 'industrial')),
  status text not null default 'active'
    check (status in ('active', 'vacant', 'under_build', 'maintenance', 'archived')),
  bedrooms int,
  bathrooms int,
  monthly_rent numeric(12, 2),
  has_solar boolean not null default false,
  solar_capacity_kwp numeric(8, 2),
  has_smart_home boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_org_idx on public.properties(organization_id);
create index if not exists properties_owner_idx on public.properties(owner_id);

alter table public.properties enable row level security;

create policy "Users can view properties in their org"
  on public.properties for select
  using (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------
-- Automatic Profile Creation Trigger on auth.users Signup
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
security definer set search_path = public
language plpgsql
as $$
begin
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
    gen_random_uuid()
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = case when excluded.full_name <> '' then excluded.full_name else profiles.full_name end,
    phone = coalesce(excluded.phone, profiles.phone),
    role = coalesce(excluded.role, profiles.role);
  return new;
end;
$$;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
