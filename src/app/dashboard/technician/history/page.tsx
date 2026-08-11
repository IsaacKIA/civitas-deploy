import DashboardLayout from '@/components/DashboardLayout';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';
import { MAINTENANCE_CATEGORIES } from '@/lib/maintenance';

export default async function TechnicianHistoryPage() {
  const auth = await getAuthedProfile();

  if (!auth) {
    return (
      <DashboardLayout role="technician">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm text-center text-xs text-[#6B7E72]">
          Your session has expired. Please sign in again.
        </div>
      </DashboardLayout>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: jobs, error } = await supabase
    .from('maintenance_requests')
    .select('id, reference_code, category, title, resolved_at, properties(name)')
    .eq('technician_id', auth.user.id)
    .eq('status', 'completed')
    .order('resolved_at', { ascending: false });

  return (
    <DashboardLayout role="technician" userName={auth.profile.full_name}>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Job History</h1>
        <p className="text-xs text-[#6B7E72] mt-1">Your completed work orders</p>
      </div>

      {error && (
        <div className="p-6 rounded-2xl bg-[#FDECEA] border border-[#FAD4D0] text-xs text-[#D94F3D] text-center">
          Couldn&apos;t load your job history right now. Please refresh.
        </div>
      )}

      {!error && (!jobs || jobs.length === 0) && (
        <div className="bg-white rounded-3xl border border-[#D8E4DC] p-14 text-center text-xs text-[#6B7E72]">
          No completed jobs yet. Jobs you finish will show up here.
        </div>
      )}

      {!error && jobs && jobs.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm">
          <div className="divide-y divide-[#D8E4DC]">
            {jobs.map((j) => {
              const property = Array.isArray(j.properties) ? j.properties[0] : j.properties;
              const category = MAINTENANCE_CATEGORIES.find((c) => c.id === j.category);
              return (
                <div key={j.id} className="py-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#111A14]">{category?.icon} {j.title} ({j.reference_code})</div>
                    <div className="text-[#6B7E72] mt-0.5">
                      {property?.name} · Completed{' '}
                      {j.resolved_at ? new Date(j.resolved_at).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
