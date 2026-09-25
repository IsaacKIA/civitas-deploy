import DashboardLayout from '@/components/DashboardLayout';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';
import DocumentsClient from '@/app/dashboard/owner/documents/DocumentsClient';

export default async function DeveloperDocumentsPage() {
  const auth = await getAuthedProfile();

  if (!auth) {
    return (
      <DashboardLayout role="developer">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm text-center text-xs text-[#6B7E72]">
          Your session has expired. Please sign in again.
        </div>
      </DashboardLayout>
    );
  }

  const supabase = await createSupabaseServerClient();

  const [{ data: documents, error: docsError }, { data: properties }] = await Promise.all([
    supabase
      .from('property_documents')
      .select('id, title, category, storage_path, file_size_bytes, mime_type, created_at, properties(name)')
      .eq('owner_id', auth.user.id)
      .order('created_at', { ascending: false }),
    supabase.from('properties').select('id, name').eq('owner_id', auth.user.id).order('created_at', { ascending: false }),
  ]);

  return (
    <DashboardLayout role="developer" userName={auth.profile.full_name}>
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
        leases={[]}
        hideLeases={true}
        hasError={!!docsError}
        titleText="Development Documentation & Compliance"
        subtitleText="Unit handover packs, EPA & building permits, snagging punchlists, and DLP warranty certs"
        accentColor="#5B21B6"
      />
    </DashboardLayout>
  );
}
