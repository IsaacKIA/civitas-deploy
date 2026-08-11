-- Real document storage, replacing the Document Vault mock (4 hardcoded
-- documents like "Verra VCS Carbon Offsets Certificate 2024" that don't
-- exist, and an Upload button that only called alert()).

insert into storage.buckets (id, name, public)
values ('property-documents', 'property-documents', false)
on conflict (id) do nothing;

create table if not exists public.property_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  owner_id uuid not null references public.profiles(id) on delete restrict,
  property_id uuid references public.properties(id) on delete set null,
  title text not null,
  category text not null check (category in
    ('title_deed', 'contract', 'verification', 'certificate', 'other')),
  storage_path text not null unique,
  file_size_bytes bigint not null,
  mime_type text not null,
  uploaded_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now()
);

create index if not exists property_documents_org_idx on public.property_documents(organization_id);
create index if not exists property_documents_owner_idx on public.property_documents(owner_id);
create index if not exists property_documents_property_idx on public.property_documents(property_id);

alter table public.property_documents enable row level security;

drop policy if exists property_documents_select on public.property_documents;
create policy property_documents_select on public.property_documents
  for select
  using (
    owner_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('super_admin', 'org_admin')
        and p.organization_id = property_documents.organization_id
    )
  );

drop policy if exists property_documents_insert on public.property_documents;
create policy property_documents_insert on public.property_documents
  for insert
  with check (
    owner_id = auth.uid()
    and uploaded_by = auth.uid()
    and storage_path like (auth.uid()::text || '/%')
  );

drop policy if exists property_documents_delete on public.property_documents;
create policy property_documents_delete on public.property_documents
  for delete
  using (owner_id = auth.uid());

-- Storage RLS: objects are namespaced by uploader's user id
-- ("{auth.uid()}/filename.pdf"), so an owner can only read, write, and
-- delete within their own folder in the bucket. Uses storage.foldername()
-- to read the first path segment as the owning user id.
drop policy if exists property_documents_storage_select on storage.objects;
create policy property_documents_storage_select on storage.objects
  for select
  using (bucket_id = 'property-documents' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists property_documents_storage_insert on storage.objects;
create policy property_documents_storage_insert on storage.objects
  for insert
  with check (bucket_id = 'property-documents' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists property_documents_storage_delete on storage.objects;
create policy property_documents_storage_delete on storage.objects
  for delete
  using (bucket_id = 'property-documents' and (storage.foldername(name))[1] = auth.uid()::text);

-- Note: this intentionally scopes documents to the uploading owner, not
-- shared org-wide access, to keep the RLS simple and safe for a first cut.
-- If multiple org_admins on the same organization need to share a
-- document vault, the path scheme and policies above need to change to use
-- organization_id instead of auth.uid() as the folder key.
