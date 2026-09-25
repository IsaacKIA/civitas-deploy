import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { getAuthedProfile, createSupabaseServerClient } from '@/lib/supabase/server';
import MaintenanceScheduler, { type ScheduledService } from '@/components/MaintenanceScheduler';

export default async function OwnerMaintenanceSchedulePage() {
  const auth = await getAuthedProfile();
  const supabase = await createSupabaseServerClient();

  const { data: properties } = await supabase
    .from('properties')
    .select('id, name, address')
    .eq('owner_id', auth?.user.id || '')
    .order('name');

  const defaultSchedules: ScheduledService[] = [
    {
      id: 'sched-gen-1',
      propertyId: properties?.[0]?.id || 'prop-1',
      propertyName: properties?.[0]?.name || 'Primary Residence',
      assetType: 'generator',
      assetName: 'Perkins Backup Generator',
      frequency: 'monthly',
      nextDueDate: 'Next Saturday (Oct 04)',
      preferredTime: 'Saturday Morning (09:00 - 12:00)',
      status: 'active',
      technicianTrade: 'Diesel Engineering',
      notes: 'Check oil viscosity and perform 15-minute load transfer.',
    },
    {
      id: 'sched-ac-1',
      propertyId: properties?.[0]?.id || 'prop-1',
      propertyName: properties?.[0]?.name || 'Primary Residence',
      assetType: 'hvac',
      assetName: 'Split ACs (Living Room & Master)',
      frequency: 'bimonthly',
      nextDueDate: 'Oct 24, 2026',
      preferredTime: 'Saturday Morning (09:00 - 12:00)',
      status: 'active',
      technicianTrade: 'HVAC Specialists',
      notes: 'Clean filters and chemical coil wash.',
    },
  ];

  return (
    <DashboardLayout role="owner" userName={auth?.profile.full_name}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#6B7E72] mb-1">
              <Link href="/dashboard/owner/maintenance" className="hover:underline">
                Maintenance
              </Link>
              <span>/</span>
              <span>Preventive Schedule</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Preventive Maintenance Scheduler</h1>
            <p className="text-xs text-[#6B7E72] mt-1">
              Automate routine servicing for generators, air conditioners, water pumps, and solar installations
            </p>
          </div>
          <Link
            href="/dashboard/owner/maintenance"
            className="px-4 py-2 rounded-full border border-[#D8E4DC] text-xs font-semibold text-[#111A14] hover:bg-[#F5F9F6] transition-all"
          >
            ← Back to Work Orders
          </Link>
        </div>

        {/* Info card */}
        <div className="bg-[#EEF7F2] border border-[#C5E5D5] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛡️</span>
            <div>
              <h3 className="text-sm font-bold text-[#0F3D26]">Why Preventive Maintenance?</h3>
              <p className="text-xs text-[#1A5C3A] mt-0.5">
                Preventive checks reduce tenant repair complaints by 78% and eliminate unexpected emergency replacement costs for diesel generators and AC compressors.
              </p>
            </div>
          </div>
        </div>

        {/* Scheduler Component */}
        <MaintenanceScheduler
          properties={properties || []}
          initialSchedules={defaultSchedules}
          accentColor="#0F3D26"
        />
      </div>
    </DashboardLayout>
  );
}
