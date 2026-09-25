import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { getAuthedProfile } from '@/lib/supabase/server';

export default async function DeveloperWarrantiesPage() {
  const auth = await getAuthedProfile();

  const warranties = [
    {
      unit: 'Units 1A - 4B (8 Units)',
      development: 'Osu Palm Residences',
      handoverDate: 'May 2026',
      warrantyExpires: 'May 2027',
      daysRemaining: 240,
      dlpStatus: 'Active Coverage',
      statusColor: 'bg-[#D6EDE1] text-[#0F3D26]',
      ticketsResolved: 12,
      openTickets: 1,
    },
    {
      unit: 'Units 5A - 7B (6 Units)',
      development: 'Osu Palm Residences',
      handoverDate: 'July 2026',
      warrantyExpires: 'July 2027',
      daysRemaining: 301,
      dlpStatus: 'Active Coverage',
      statusColor: 'bg-[#D6EDE1] text-[#0F3D26]',
      ticketsResolved: 5,
      openTickets: 0,
    },
    {
      unit: 'Lots 1 - 8 (8 Villas)',
      development: 'Mankessim Green Estate',
      handoverDate: 'August 2026',
      warrantyExpires: 'August 2027',
      daysRemaining: 332,
      dlpStatus: 'Active Coverage',
      statusColor: 'bg-[#D6EDE1] text-[#0F3D26]',
      ticketsResolved: 3,
      openTickets: 2,
    },
  ];

  return (
    <DashboardLayout role="developer" userName={auth?.profile.full_name || 'Property Developer'}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#111A14]">Defect Liability Period (DLP) & Warranties</h1>
            <p className="text-xs text-[#6B7E72] mt-1">
              Fulfill post-construction warranty commitments without building an in-house repair department
            </p>
          </div>
          <Link
            href="/dashboard/developer/handover"
            className="px-5 py-2.5 rounded-full bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            View Pre-Handover Punchlists →
          </Link>
        </div>

        {/* Info card */}
        <div className="bg-[#EEF7F2] border border-[#C5E5D5] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛡️</span>
            <div>
              <h3 className="text-sm font-bold text-[#0F3D26]">Civitas DLP Maintenance Buffer</h3>
              <p className="text-xs text-[#1A5C3A] mt-0.5">
                Civitas technicians handle all buyer defect tickets directly on your behalf, logging root cause analysis and keeping repair costs within warranty allowance.
              </p>
            </div>
          </div>
        </div>

        {/* Warranties table */}
        <div className="bg-white rounded-2xl border border-[#D8E4DC] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D8E4DC] flex items-center justify-between bg-[#F5F9F6]">
            <span className="text-xs font-bold text-[#111A14]">Active Unit Warranty Batches (22 Units Covered)</span>
            <span className="text-[11px] text-[#1A5C3A] font-semibold">Civitas Certified Response</span>
          </div>

          <div className="divide-y divide-[#D8E4DC]">
            {warranties.map((w, idx) => (
              <div key={idx} className="p-6 hover:bg-[#F9FBFA] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#111A14]">{w.unit}</span>
                    <span className="text-[11px] text-[#6B7E72] font-semibold">({w.development})</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${w.statusColor}`}>
                      {w.dlpStatus}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-[#3D5044] pt-1">
                    <span>Keys Given: <strong>{w.handoverDate}</strong></span>
                    <span>Expires: <strong>{w.warrantyExpires}</strong></span>
                    <span>Days Remaining: <strong className="text-[#0F3D26]">{w.daysRemaining} days</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right text-xs">
                    <span className="block text-[#1A5C3A] font-bold">{w.ticketsResolved} issues resolved</span>
                    <span className="text-[10px] text-[#D97706]">{w.openTickets} open defect ticket</span>
                  </div>
                  <button
                    type="button"
                    className="px-3.5 py-2 rounded-xl border border-[#D8E4DC] text-xs font-semibold text-[#111A14] hover:bg-[#F5F9F6] transition-all"
                  >
                    Ticket History
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
