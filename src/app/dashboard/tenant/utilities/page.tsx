import DashboardLayout from '@/components/DashboardLayout';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';

export default async function TenantUtilitiesPage() {
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
  const { data: lease } = await supabase
    .from('leases')
    .select('properties(name, has_solar, solar_capacity_kwp, has_battery_backup)')
    .eq('tenant_id', auth.user.id)
    .in('status', ['active', 'pending_first_payment'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const property = lease ? (Array.isArray(lease.properties) ? lease.properties[0] : lease.properties) : null;

  return (
    <DashboardLayout role="tenant" userName={auth.profile.full_name}>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Utilities</h1>
        <p className="text-xs text-[#6B7E72] mt-1">{property?.name ?? 'Your property'}</p>
      </div>

      {!property ? (
        <div className="bg-white rounded-3xl border border-[#D8E4DC] p-14 text-center text-xs text-[#6B7E72]">
          You don&apos;t have an active lease yet.
        </div>
      ) : (
        <>
          <div className="p-4 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] text-xs text-[#92610A] mb-6">
            No live utility meter, bill, or water-usage data is connected yet — that requires a real ECG/GWCL or
            smart-meter integration, which doesn&apos;t exist. What&apos;s shown below is real: whether your
            property is equipped with solar, as recorded when it was registered.
          </div>

          <div className="bg-white rounded-2xl border border-[#D8E4DC] p-6 shadow-sm max-w-md">
            <h3 className="text-sm font-bold text-[#111A14] mb-3">{property.has_solar ? '☀️ Solar-Equipped' : 'No Solar Recorded'}</h3>
            {property.has_solar && (
              <div className="flex gap-6 text-xs">
                <div>
                  <div className="text-[10px] text-[#6B7E72] uppercase font-semibold">Rated Capacity</div>
                  <div className="font-bold text-[#1A5C3A]">{property.solar_capacity_kwp ? `${property.solar_capacity_kwp} kWp` : 'Not recorded'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#6B7E72] uppercase font-semibold">Battery Backup</div>
                  <div className="font-bold text-[#111A14]">{property.has_battery_backup ? 'Yes' : 'No'}</div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
