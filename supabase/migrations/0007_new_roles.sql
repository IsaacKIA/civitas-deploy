-- Migration: 0007_new_roles.sql
-- Add 'sme_owner', 'developer', and 'institution_admin' to profiles role check constraint

do $$
declare
  constraint_name text;
begin
  select con.conname into constraint_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_namespace nsp on nsp.oid = rel.relnamespace
  where nsp.nspname = 'public'
    and rel.relname = 'profiles'
    and con.contype = 'c'
    and pg_get_constraintdef(con.oid) like '%role%';

  if constraint_name is not null then
    execute format('alter table public.profiles drop constraint %I', constraint_name);
  end if;
end $$;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('super_admin', 'org_admin', 'ops_manager', 'technician', 'client', 'sme_owner', 'developer', 'institution_admin', 'tenant', 'investor'));

