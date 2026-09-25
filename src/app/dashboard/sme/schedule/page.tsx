import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { getAuthedProfile } from '@/lib/supabase/server';

export default async function SmeSchedulePage() {
  const auth = await getAuthedProfile();

  const schedules = [
    {
      date: 'Next Tuesday (Oct 07)',
      equipment: '50 kVA Perkins Generator',
      facility: 'Head Office & Showroom',
      technician: 'Kweku Mensah (Certified Diesel Eng.)',
      scope: 'Engine oil flush, fuel filter replacement, battery load test, ATS auto-transfer dry run',
      status: 'Confirmed',
      statusColor: 'bg-[#D6EDE1] text-[#0F3D26]',
    },
    {
      date: 'Oct 21, 2026',
      equipment: 'Split & Cassette AC Units (8 units)',
      facility: 'Main Office Floor',
      technician: 'Emmanuel Appiah (HVAC Lead)',
      scope: 'Coil chemical wash, drain pan sterilization, compressor amp draw verification',
      status: 'Scheduled',
      statusColor: 'bg-[#EFF6FF] text-[#1E40AF]',
    },
    {
      date: 'Nov 04, 2026',
      equipment: 'Borehole Submersible & Booster System',
      facility: 'Warehouse & Logistics Hub',
      technician: 'Civitas Plumbing Crew',
      scope: 'Impeller wear inspection, pressure tank bladder check, water treatment chlorination check',
      status: 'Upcoming',
      statusColor: 'bg-[#FEF3C7] text-[#D97706]',
    },
    {
      date: 'Dec 15, 2026',
      equipment: 'Electrical Distribution Boards & ATS',
      facility: 'All Locations',
      technician: 'Energy Audit Team',
      scope: 'Thermal imaging scan for loose lugs, earth rod impedance test, lightning arrestor review',
      status: 'Upcoming',
      statusColor: 'bg-[#F5F3FF] text-[#7C3AED]',
    },
  ];

  return (
    <DashboardLayout role="sme" userName={auth?.profile.full_name || 'Business Owner'}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#111A14]">Preventive Service Schedule</h1>
            <p className="text-xs text-[#6B7E72] mt-1">
              Automated servicing calendar ensuring zero surprise equipment breakdowns
            </p>
          </div>
          <Link
            href="/dashboard/sme/maintenance"
            className="px-5 py-2.5 rounded-full bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-all shadow-sm text-center"
          >
            + Request Additional Visit
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-[#D8E4DC] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D8E4DC] flex items-center justify-between bg-[#F5F9F6]">
            <span className="text-xs font-bold text-[#111A14]">Upcoming Servicing Windows (Q4)</span>
            <span className="text-[11px] text-[#1A5C3A] font-semibold">100% On-Time Completion Rate</span>
          </div>

          <div className="divide-y divide-[#D8E4DC]">
            {schedules.map((item, idx) => (
              <div key={idx} className="p-6 hover:bg-[#F9FBFA] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#111A14]">{item.equipment}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7E72]">{item.scope}</p>
                  <div className="flex flex-wrap gap-4 text-[11px] text-[#3D5044]">
                    <span>📍 <strong>Location:</strong> {item.facility}</span>
                    <span>👤 <strong>Technician:</strong> {item.technician}</span>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0">
                  <span className="text-xs font-bold text-[#0F3D26]">{item.date}</span>
                  <span className="text-[10px] text-[#6B7E72] bg-[#EEF7F2] px-2 py-1 rounded-lg">
                    Civitas Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
