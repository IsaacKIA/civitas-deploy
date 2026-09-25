import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';
import { MAINTENANCE_CATEGORIES, MAINTENANCE_PRIORITIES, MAINTENANCE_STATUS_STYLE } from '@/lib/maintenance';

export default async function SmeMaintenancePage() {
  const auth = await getAuthedProfile();

  if (!auth) {
    return (
      <DashboardLayout role="sme">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm text-center text-xs text-[#6B7E72]">
          Your session has expired. Please sign in again.
        </div>
      </DashboardLayout>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: requests, error } = await supabase
    .from('maintenance_requests')
    .select('id, category, priority, title, status, created_at, reference_code, properties(name)')
    .eq('owner_id', auth.user.id)
    .order('created_at', { ascending: false });

  return (
    <DashboardLayout role="sme" userName={auth.profile.full_name}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#111A14]">Commercial Maintenance & Work Orders</h1>
          <p className="text-xs text-[#6B7E72] mt-1">
            Track repairs, emergency dispatches, and work order progress across your business premises
          </p>
        </div>
        <Link
          href="/dashboard/owner/maintenance/new"
          className="px-5 py-2.5 rounded-full bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
        >
          + Log Urgent Facility Issue
        </Link>
      </div>

      {error && (
        <div className="p-6 rounded-2xl bg-[#FDECEA] border border-[#FAD4D0] text-xs text-[#D94F3D] text-center mb-6">
          Couldn&apos;t load your maintenance requests right now. Please refresh.
        </div>
      )}

      {!error && (!requests || requests.length === 0) && (
        <div className="p-14 rounded-3xl bg-white border border-[#D8E4DC] text-center">
          <div className="w-16 h-16 rounded-full bg-[#EFF6FF] text-[#1E40AF] text-3xl flex items-center justify-center mx-auto mb-4">🔧</div>
          <h2 className="text-lg font-serif font-bold text-[#111A14] mb-2">No active facility issues</h2>
          <p className="text-xs text-[#6B7E72] max-w-sm mx-auto mb-6">
            All your commercial premises are operating normally. When an equipment or plumbing fault arises, log it here for rapid SLA dispatch.
          </p>
          <Link
            href="/dashboard/owner/maintenance/new"
            className="inline-flex px-5 py-2.5 rounded-full bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-all"
          >
            Report an Issue →
          </Link>
        </div>
      )}

      {!error && requests && requests.length > 0 && (
        <div className="bg-white rounded-3xl border border-[#D8E4DC] shadow-sm overflow-hidden">
          <div className="divide-y divide-[#D8E4DC]">
            {requests.map((r) => {
              const statusClass = MAINTENANCE_STATUS_STYLE[r.status] || 'bg-[#F5F9F6] text-[#6B7E72]';
              const category = MAINTENANCE_CATEGORIES.find((c) => c.id === r.category);
              const priority = MAINTENANCE_PRIORITIES.find((p) => p.id === r.priority);
              const propName = (r.properties as unknown as { name?: string })?.name;

              return (
                <div key={r.id} className="p-6 hover:bg-[#F9FBFA] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-[#6B7E72]">
                        {r.reference_code || `#${r.id.slice(0, 8)}`}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${statusClass}`}>
                        {r.status.replace('_', ' ')}
                      </span>
                      {priority && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] font-semibold">
                          {priority.label}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-[#111A14]">{r.title}</div>
                    <div className="text-xs text-[#6B7E72]">
                      {propName ? `${propName} · ` : ''}
                      {category?.label || r.category}
                    </div>
                  </div>
                  <div className="text-xs text-[#6B7E72] whitespace-nowrap">
                    {new Date(r.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
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
