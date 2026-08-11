import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';
import { MAINTENANCE_CATEGORIES, MAINTENANCE_PRIORITIES, MAINTENANCE_STATUS_STYLE } from '@/lib/maintenance';

export default async function TenantMaintenancePage() {
  const auth = await getAuthedProfile();

  if (!auth) {
    return (
      <DashboardLayout role="tenant">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm text-center text-xs text-[#6B7E72]">
          Your session has expired. Please sign in again.
        </div>
      </DashboardLayout>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: requests, error } = await supabase
    .from('maintenance_requests')
    .select('id, reference_code, category, priority, title, status, created_at, properties(name)')
    .eq('tenant_id', auth.user.id)
    .order('created_at', { ascending: false });

  return (
    <DashboardLayout role="tenant" userName={auth.profile.full_name}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">My Maintenance Requests</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Track issues you&apos;ve reported</p>
        </div>
        <Link
          href="/dashboard/tenant/maintenance/new"
          className="px-5 py-2.5 rounded-full bg-[#E87722] hover:bg-[#B85A10] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          + Log New Issue
        </Link>
      </div>

      {error && (
        <div className="p-6 rounded-2xl bg-[#FDECEA] border border-[#FAD4D0] text-xs text-[#D94F3D] text-center">
          Couldn&apos;t load your requests right now. Please refresh.
        </div>
      )}

      {!error && (!requests || requests.length === 0) && (
        <div className="bg-white rounded-3xl border border-[#D8E4DC] shadow-sm text-center py-14">
          <div className="w-16 h-16 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-3xl flex items-center justify-center mx-auto mb-4">🔧</div>
          <h2 className="text-lg font-serif font-bold text-[#0F3D26] mb-2">No requests yet</h2>
          <p className="text-xs text-[#6B7E72]">Anything you report will show up here with its status.</p>
        </div>
      )}

      {!error && requests && requests.length > 0 && (
        <div className="bg-white rounded-3xl border border-[#D8E4DC] shadow-sm overflow-hidden">
          <div className="divide-y divide-[#D8E4DC]">
            {requests.map((t) => {
              const property = Array.isArray(t.properties) ? t.properties[0] : t.properties;
              const category = MAINTENANCE_CATEGORIES.find((c) => c.id === t.category);
              const priority = MAINTENANCE_PRIORITIES.find((p) => p.id === t.priority);
              return (
                <div key={t.id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-[#F5F9F6] transition-colors">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-xs font-bold text-[#1A5C3A]">{t.reference_code}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: priority?.bg, color: priority?.color }}>
                        {priority?.label ?? t.priority}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#111A14]">{category?.icon} {t.title}</h3>
                    <p className="text-xs text-[#6B7E72] mt-0.5">
                      {property?.name} · Logged {new Date(t.created_at).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize w-fit ${MAINTENANCE_STATUS_STYLE[t.status] ?? ''}`}>
                    {t.status.replace('_', ' ')}
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
