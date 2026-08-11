import DashboardLayout from '@/components/DashboardLayout';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';

export default async function EnergyPage() {
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
    .select('id, name, has_solar, solar_capacity_kwp, has_battery_backup')
    .eq('owner_id', auth.user.id)
    .order('created_at', { ascending: false });

  const solarProperties = (properties ?? []).filter((p) => p.has_solar);

  return (
    <DashboardLayout role="owner" userName={auth.profile.full_name}>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Solar & Energy</h1>
        <p className="text-xs text-[#6B7E72] mt-1">Solar equipment on record across your properties</p>
      </div>

      <div className="p-4 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] text-xs text-[#92610A] mb-6">
        No live solar telemetry, battery monitoring, or carbon-offset certification is connected yet — that
        requires an actual IoT/inverter integration and a real certification relationship (e.g. with Verra),
        neither of which exist yet. What&apos;s shown below is real: it&apos;s what was recorded when each
        property was registered.
      </div>

      {error && (
        <div className="p-6 rounded-2xl bg-[#FDECEA] border border-[#FAD4D0] text-xs text-[#D94F3D] text-center">
          Couldn&apos;t load your properties right now. Please refresh.
        </div>
      )}

      {!error && solarProperties.length === 0 && (
        <div className="bg-white rounded-3xl border border-[#D8E4DC] p-14 text-center text-xs text-[#6B7E72]">
          None of your registered properties are marked as solar-equipped.
        </div>
      )}

      {!error && solarProperties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {solarProperties.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-[#D8E4DC] p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#111A14] mb-2">☀️ {p.name}</h3>
              <div className="flex gap-4 text-xs">
                <div>
                  <div className="text-[10px] text-[#6B7E72] uppercase font-semibold">Rated Capacity</div>
                  <div className="font-bold text-[#1A5C3A]">{p.solar_capacity_kwp ? `${p.solar_capacity_kwp} kWp` : 'Not recorded'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#6B7E72] uppercase font-semibold">Battery Backup</div>
                  <div className="font-bold text-[#111A14]">{p.has_battery_backup ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
