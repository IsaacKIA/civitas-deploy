import DashboardLayout from '@/components/DashboardLayout';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';
import InviteTenantWidget from './InviteTenantWidget';

export default async function OwnerTenantsPage() {
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
  const { data: leases, error } = await supabase
    .from('leases')
    .select('id, status, monthly_rent_ghs, start_date, end_date, properties(name), tenant:profiles!tenant_id(full_name, email)')
    .eq('owner_id', auth.user.id)
    .in('status', ['pending_first_payment', 'active'])
    .order('created_at', { ascending: false });


  return (
    <DashboardLayout role="owner" userName={auth.profile.full_name}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Tenant Management</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Tenant directory and lease agreements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm">
          <h2 className="text-base font-serif font-bold text-[#0F3D26] mb-4">Active Tenants</h2>

          {error && (
            <div className="p-6 text-center text-xs text-[#D94F3D]">Couldn&apos;t load your tenants right now. Please refresh.</div>
          )}

          {!error && (!leases || leases.length === 0) && (
            <div className="p-8 text-center text-xs text-[#6B7E72]">
              No tenants yet. Once you create a lease, the tenant appears here.
            </div>
          )}

          {!error && leases && leases.length > 0 && (
            <div className="divide-y divide-[#D8E4DC]">
              {leases.map((lease) => {
                const property = Array.isArray(lease.properties) ? lease.properties[0] : lease.properties;
                const tenant = Array.isArray(lease.profiles) ? lease.profiles[0] : lease.profiles;
                return (
                  <div key={lease.id} className="py-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#111A14] text-sm">{tenant?.full_name ?? 'Tenant'}</div>
                      <div className="text-[#6B7E72] mt-0.5">{property?.name}</div>
                      <div className="text-[10px] text-[#A8B8AE] mt-0.5">
                        Lease: {new Date(lease.start_date).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {lease.end_date && ` → ${new Date(lease.end_date).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#1A5C3A] text-sm">GHS {Number(lease.monthly_rent_ghs).toLocaleString()}</div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-[10px] font-bold mt-1 inline-block capitalize">
                        {lease.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <InviteTenantWidget />
      </div>
    </DashboardLayout>
  );
}
