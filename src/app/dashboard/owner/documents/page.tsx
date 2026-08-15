import DashboardLayout from '@/components/DashboardLayout';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';
import DocumentsClient from './DocumentsClient';

export default async function OwnerDocumentsPage() {
  const auth = await getAuthedProfile();

  if (!auth) {
    return (
      <DashboardLayout role="owner">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm text-center text-xs text-[#6B7E72]">
          Your session has expired. Please sign in again.
        </div>
      </DashboardLayout>
    );
  }

  const supabase = await createSupabaseServerClient();

  const [{ data: documents, error: docsError }, { data: leases, error: leasesError }, { data: properties }] = await Promise.all([
    supabase
      .from('property_documents')
      .select('id, title, category, storage_path, file_size_bytes, mime_type, created_at, properties(name)')
      .eq('owner_id', auth.user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('leases')
      .select('id, status, created_at, properties(name), tenant:profiles!tenant_id(full_name)')
      .eq('owner_id', auth.user.id)
      .order('created_at', { ascending: false }),

    supabase.from('properties').select('id, name').eq('owner_id', auth.user.id).order('created_at', { ascending: false }),
  ]);

  return (
    <DashboardLayout role="owner" userName={auth.profile.full_name}>
      <DocumentsClient
        userId={auth.user.id}
        organizationId={auth.profile.organization_id}
        properties={(properties ?? []).map((p) => ({ id: p.id, name: p.name }))}
        initialDocuments={(documents ?? []).map((d) => ({
          id: d.id,
          title: d.title,
          category: d.category,
          storagePath: d.storage_path,
          fileSizeBytes: d.file_size_bytes,
          mimeType: d.mime_type,
          createdAt: d.created_at,
          propertyName: (Array.isArray(d.properties) ? d.properties[0] : d.properties)?.name ?? null,
        }))}
        leases={(leases ?? []).map((l) => ({
          id: l.id,
          status: l.status,
          createdAt: l.created_at,
          propertyName: (Array.isArray(l.properties) ? l.properties[0] : l.properties)?.name ?? 'Property',
          tenantName: (Array.isArray(l.profiles) ? l.profiles[0] : l.profiles)?.full_name ?? null,
        }))}
        hasError={!!docsError || !!leasesError}
      />
    </DashboardLayout>
  );
}
