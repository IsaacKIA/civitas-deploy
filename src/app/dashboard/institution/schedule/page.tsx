import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { getAuthedProfile, createSupabaseServerClient } from '@/lib/supabase/server';
import MaintenanceScheduler, { type ScheduledService } from '@/components/MaintenanceScheduler';

export default async function InstitutionSchedulePage() {
  const auth = await getAuthedProfile();
  const supabase = await createSupabaseServerClient();

  const { data: properties } = await supabase
    .from('properties')
    .select('id, name, address')
    .eq('owner_id', auth?.user.id || '')
    .order('name');

  const institutionalSchedules: ScheduledService[] = [
    {
      id: 'sched-inst-gen1',
      propertyId: properties?.[0]?.id || 'campus-1',
      propertyName: properties?.[0]?.name || 'Main University Campus',
      assetType: 'generator',
      assetName: '250 kVA Cummins Prime Generator (GEN-01)',
      frequency: 'monthly',
      nextDueDate: 'Oct 08, 2026',
      preferredTime: 'Saturday Morning (09:00 - 12:00)',
      status: 'active',
      technicianTrade: 'Senior Diesel Engineering Crew',
      notes: 'Full synthetic oil change, 250hr fuel filter replacement, and ATS automatic switchover test.',
    },
    {
      id: 'sched-inst-lift1',
      propertyId: properties?.[0]?.id || 'campus-1',
      propertyName: properties?.[0]?.name || 'Main University Campus',
      assetType: 'electrical',
      assetName: 'Kone Passenger Elevator (LIFT-01)',
      frequency: 'monthly',
      nextDueDate: 'Oct 15, 2026',
      preferredTime: 'Weekday Evening (18:00 - 21:00)',
      status: 'active',
      technicianTrade: 'Elevator & Vertical Transport Specialists',
      notes: 'Brake pad clearance, hoist cable tension check, and emergency car communication test.',
    },
    {
      id: 'sched-inst-vrv1',
      propertyId: properties?.[0]?.id || 'campus-1',
      propertyName: properties?.[0]?.name || 'Main University Campus',
      assetType: 'hvac',
      assetName: 'Daikin VRV Chiller System (HVAC-01)',
      frequency: 'quarterly',
      nextDueDate: 'This Friday (Oct 02)',
      preferredTime: 'Saturday Morning (08:00 - 14:00)',
      status: 'active',
      technicianTrade: 'Commercial Chiller Engineers',
      notes: 'Chemical condenser coil cleaning and refrigerant loop pressure leak check.',
    },
    {
      id: 'sched-inst-ro1',
      propertyId: properties?.[0]?.id || 'campus-1',
      propertyName: properties?.[0]?.name || 'Main University Campus',
      assetType: 'plumbing',
      assetName: 'Industrial Reverse Osmosis Plant (WTR-RO-01)',
      frequency: 'quarterly',
      nextDueDate: 'Dec 04, 2026',
      preferredTime: 'Weekday Morning (09:00 - 12:00)',
      status: 'active',
      technicianTrade: 'Water Treatment Engineers',
      notes: 'Membrane chemical flush, sediment pre-filter cartridge renewal, and TDS quality test.',
    },
  ];

  return (
    <DashboardLayout role="institution" userName={auth?.profile.full_name || 'Facilities Director'}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#111A14]">Campus Maintenance Scheduling</h1>
            <p className="text-xs text-[#6B7E72] mt-1">
              Automated recurring servicing for heavy mechanical plants, elevators, chillers, and backup power
            </p>
          </div>
          <Link
            href="/dashboard/institution/sla"
            className="px-4 py-2 rounded-full border border-[#D8E4DC] text-xs font-semibold text-[#047857] hover:bg-[#F5F9F6] transition-all"
          >
            View SLA Compliance →
          </Link>
        </div>

        <MaintenanceScheduler
          properties={properties && properties.length > 0 ? properties : [{ id: 'campus-1', name: 'Main Campus / Facility' }]}
          initialSchedules={institutionalSchedules}
          accentColor="#047857"
        />
      </div>
    </DashboardLayout>
  );
}
