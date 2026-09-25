import DashboardLayout from '@/components/DashboardLayout';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';
import EnergyClient from './EnergyClient';

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
  const { data: properties } = await supabase
    .from('properties')
    .select('id, name, has_solar, solar_capacity_kwp, has_battery_backup')
    .eq('owner_id', auth.user.id)
    .order('created_at', { ascending: false });

  // Default fallback if no properties marked solar yet
  const solarProperties = (properties ?? []).filter((p) => p.has_solar);
  const displayProperties = solarProperties.length > 0 ? solarProperties : (properties ?? []);

  return (
    <DashboardLayout role="owner" userName={auth.profile.full_name}>
      <div className="max-w-6xl mx-auto">
        <EnergyClient
          properties={displayProperties.map((p) => ({
            id: p.id,
            name: p.name,
            has_solar: Boolean(p.has_solar),
            solar_capacity_kwp: p.solar_capacity_kwp ? Number(p.solar_capacity_kwp) : null,
            has_battery_backup: Boolean(p.has_battery_backup),
          }))}
        />
      </div>
    </DashboardLayout>
  );
}
