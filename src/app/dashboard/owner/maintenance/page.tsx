import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';
import { MAINTENANCE_CATEGORIES, MAINTENANCE_PRIORITIES, MAINTENANCE_STATUS_STYLE } from '@/lib/maintenance';
import AssignTechnicianControl from './AssignTechnicianControl';

export default async function OwnerMaintenancePage() {
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
  const { data: requests, error } = await supabase
    .from('maintenance_requests')
    .select('id, category, priority, title, status, created_at, properties(name), tenant:profiles!tenant_id(full_name)')
    .eq('owner_id', auth.user.id)
    .order('created_at', { ascending: false });


  return (
    <DashboardLayout role="owner" userName={auth.profile.full_name}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Maintenance Requests</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Every issue reported across your portfolio, by you or your tenants</p>
        </div>
        <Link
          href="/dashboard/owner/maintenance/new"
          className="px-5 py-2.5 rounded-full bg-[#E87722] hover:bg-[#B85A10] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          + Log New Issue
        </Link>
      </div>

      {error && (
        <div className="p-6 rounded-2xl bg-[#FDECEA] border border-[#FAD4D0] text-xs text-[#D94F3D] text-center">
          Couldn&apos;t load your maintenance requests right now. Please refresh.
        </div>
      )}

      {!error && (!requests || requests.length === 0) && (
        <div className="p-14 rounded-3xl bg-white border border-[#D8E4DC] text-center">
          <div className="w-16 h-16 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-3xl flex items-center justify-center mx-auto mb-4">🔧</div>
          <h2 className="text-lg font-serif font-bold text-[#0F3D26] mb-2">No maintenance requests</h2>
          <p className="text-xs text-[#6B7E72]">Requests logged by you or your tenants will appear here.</p>
        </div>
      )}

      {!error && requests && requests.length > 0 && (
        <div className="bg-white rounded-3xl border border-[#D8E4DC] shadow-sm overflow-hidden">
          <div className="divide-y divide-[#D8E4DC]">
            {requests.map((r) => {
              const property = Array.isArray(r.properties) ? r.properties[0] : r.properties;
              const tenant = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
              const technician = Array.isArray(r.technician) ? r.technician[0] : r.technician;
              const category = MAINTENANCE_CATEGORIES.find((c) => c.id === r.category);
              const priority = MAINTENANCE_PRIORITIES.find((p) => p.id === r.priority);
              return (
                <div key={r.id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-[#F5F9F6] transition-colors">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-xs font-bold text-[#1A5C3A]">{r.reference_code}</span>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: priority?.bg, color: priority?.color }}
                      >
                        {priority?.label ?? r.priority}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#111A14]">{category?.icon} {r.title}</h3>
                    <p className="text-xs text-[#6B7E72] mt-0.5">
                      {property?.name} · Reported by {tenant?.full_name ?? 'you'} ·{' '}
                      {new Date(r.created_at).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <div className="mt-2">
                      <AssignTechnicianControl requestId={r.id} status={r.status} assignedTechnicianName={technician?.full_name ?? null} />
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize w-fit ${MAINTENANCE_STATUS_STYLE[r.status] ?? ''}`}>
                    {r.status.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
