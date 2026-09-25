-- Migration: 0008_document_categories.sql
-- Expand property_documents category check constraint to support Developer, SME, and Diaspora document types

do $$
declare
  constraint_name text;
begin
  select con.conname into constraint_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_namespace nsp on nsp.oid = rel.relnamespace
  where nsp.nspname = 'public'
    and rel.relname = 'property_documents'
    and con.contype = 'c'
    and pg_get_constraintdef(con.oid) like '%category%';

  if constraint_name is not null then
    execute format('alter table public.property_documents drop constraint %I', constraint_name);
  end if;
end $$;

alter table public.property_documents
  add constraint property_documents_category_check
  check (category in (
    'title_deed',
    'contract',
    'verification',
    'certificate',
    'lease',
    'handover_cert',
    'inspection_report',
    'fire_safety_cert',
    'insurance',
    'warranty',
    'tax_receipt',
    'ghanapost_address',
    'other'
  ));
