import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';
import { PROPERTY_STATUS_LABEL, PROPERTY_STATUS_STYLE, type PropertyStatus } from '@/lib/property-status';

export default async function PropertiesDirectoryPage() {
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
  const { data: properties, error } = await supabase
    .from('properties')
    .select(
      'id, name, property_type, status, monthly_rent, ghana_post_gps, solar_capacity_kwp, has_solar, leases(id, status, tenant_id, profiles:tenant_id(full_name))'
    )
    .eq('owner_id', auth.user.id)
    .order('created_at', { ascending: false });

  return (
    <DashboardLayout role="owner" userName={auth.profile.full_name}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Property Directory</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Manage all registered real estate assets across Ghana</p>
        </div>
        <Link
          href="/dashboard/owner/properties/new"
          className="px-5 py-2.5 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          + Add New Property
        </Link>
      </div>

      {error && (
        <div className="p-6 rounded-2xl bg-[#FDECEA] border border-[#FAD4D0] text-xs text-[#D94F3D] text-center">
          Couldn&apos;t load your properties right now. Please refresh.
        </div>
      )}

      {!error && (!properties || properties.length === 0) && (
        <div className="p-14 rounded-3xl bg-white border border-[#D8E4DC] text-center">
          <div className="w-16 h-16 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-3xl flex items-center justify-center mx-auto mb-4">🏠</div>
          <h2 className="text-lg font-serif font-bold text-[#0F3D26] mb-2">No properties yet</h2>
          <p className="text-xs text-[#6B7E72] mb-6">Register your first property to start managing tenants, leases, and payments on Civitas.</p>
          <Link
            href="/dashboard/owner/properties/new"
            className="inline-block px-6 py-3 rounded-full bg-[#1A5C3A] text-white text-xs font-semibold"
          >
            + Add Your First Property
          </Link>
        </div>
      )}

      {!error && properties && properties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((p) => {
            const activeLease = (p.leases ?? []).find((l) => l.status === 'active' || l.status === 'pending_first_payment');
            const tenantProfile = activeLease
              ? Array.isArray(activeLease.profiles) ? activeLease.profiles[0] : activeLease.profiles
              : null;

            return (
              <div key={p.id} className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="px-2.5 py-1 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-[10px] font-bold uppercase">{p.property_type}</span>
                      <h3 className="text-lg font-serif font-bold text-[#111A14] mt-2">{p.name}</h3>
                      {p.ghana_post_gps && (
                        <p className="text-xs text-[#6B7E72]">Ghana Post GPS: <span className="font-mono font-bold text-[#111A14]">{p.ghana_post_gps}</span></p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${PROPERTY_STATUS_STYLE[p.status as PropertyStatus] ?? 'bg-[#F5F9F6] text-[#6B7E72]'}`}>
                      {PROPERTY_STATUS_LABEL[p.status as PropertyStatus] ?? p.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-[#D8E4DC] text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-[#6B7E72] uppercase font-semibold block">Monthly Rent</span>
                      <span className="font-bold text-[#1A5C3A]">GHS {Number(p.monthly_rent).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#6B7E72] uppercase font-semibold block">Current Tenant</span>
                      <span className="font-semibold text-[#111A14]">{tenantProfile?.full_name ?? '—'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#6B7E72] uppercase font-semibold block">Solar Telemetry</span>
                      <span className="font-semibold text-[#2E8B6A]">{p.has_solar ? `☀️ ${p.solar_capacity_kwp} kWp` : '—'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {!activeLease && (
                    <Link
                      href={`/dashboard/owner/leases/new?propertyId=${p.id}`}
                      className="flex-1 py-2 text-center rounded-xl bg-[#E87722] hover:bg-[#B85A10] text-white text-xs font-semibold transition-all"
                    >
                      Create Lease →
                    </Link>
                  )}
                  <Link
                    href="/dashboard/owner/maintenance/new"
                    className="flex-1 py-2 text-center rounded-xl bg-[#0F3D26] hover:bg-[#1A5C3A] text-white text-xs font-semibold transition-all"
                  >
                    Log Maintenance →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
