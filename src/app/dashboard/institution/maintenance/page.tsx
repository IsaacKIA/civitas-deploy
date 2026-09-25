import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { getAuthedProfile } from '@/lib/supabase/server';

export default async function InstitutionMaintenancePage() {
  const auth = await getAuthedProfile();

  const tickets = [
    {
      id: 'WO-2026-904',
      title: 'Auditorium Chiller Air Handling Unit 2 Vibration',
      asset: 'HVAC-VRV-1 (Auditorium & Labs)',
      priority: 'Standard',
      priorityColor: 'bg-[#EFF6FF] text-[#1E40AF]',
      status: 'Technician Dispatched',
      statusColor: 'bg-[#FEF3C7] text-[#D97706]',
      reportedBy: 'Kofi Owusu (Lead Lab Tech)',
      assignedTo: 'Emmanuel Appiah (Civitas Senior HVAC Lead)',
      timeElapsed: '34 mins since dispatch',
      slaTarget: '4 hours SLA',
    },
    {
      id: 'WO-2026-881',
      title: 'Science Complex Generator Automatic Transfer Switch (ATS) Test Failure',
      asset: 'GEN-02 (Medical & Science)',
      priority: 'Emergency',
      priorityColor: 'bg-[#FDECEA] text-[#D94F3D]',
      status: 'Resolved & Certified',
      statusColor: 'bg-[#D6EDE1] text-[#0F3D26]',
      reportedBy: 'Facilities Ops Center',
      assignedTo: 'Kweku Mensah (Diesel & ATS Lead)',
      timeElapsed: 'Resolved in 1 hr 12 mins',
      slaTarget: '2 hours SLA (Met)',
    },
    {
      id: 'WO-2026-840',
      title: 'Admin Tower Elevator Hoist Cable Tension Adjustment',
      asset: 'LIFT-01 (Admin Tower)',
      priority: 'Urgent',
      priorityColor: 'bg-[#FEF3C7] text-[#D97706]',
      status: 'Completed',
      statusColor: 'bg-[#D6EDE1] text-[#0F3D26]',
      reportedBy: 'Dr. Mensah (Registrar)',
      assignedTo: 'Vertical Transport Crew',
      timeElapsed: 'Resolved in 2 hrs 40 mins',
      slaTarget: '4 hours SLA (Met)',
    },
  ];

  return (
    <DashboardLayout role="institution" userName={auth?.profile.full_name || 'Facilities Director'}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#111A14]">Campus Work Orders & Dispatches</h1>
            <p className="text-xs text-[#6B7E72] mt-1">
              Active engineering tickets, breakdown calls, and priority technician tracking
            </p>
          </div>
          <Link
            href="/dashboard/owner/maintenance/new"
            className="px-5 py-2.5 rounded-full bg-[#E87722] hover:bg-[#D46B1E] text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            🚨 Log Emergency Dispatch Order
          </Link>
        </div>

        {/* Work order list */}
        <div className="bg-white rounded-2xl border border-[#D8E4DC] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D8E4DC] flex items-center justify-between bg-[#F5F9F6]">
            <span className="text-xs font-bold text-[#111A14]">Recent Work Orders & Campus Incident Tickets</span>
            <span className="text-[11px] text-[#047857] font-semibold">100% SLA Compliance Rate</span>
          </div>

          <div className="divide-y divide-[#D8E4DC]">
            {tickets.map((t) => (
              <div key={t.id} className="p-6 hover:bg-[#F9FBFA] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#6B7E72]">{t.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.priorityColor}`}>
                      {t.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.statusColor}`}>
                      {t.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#111A14]">{t.title}</h3>
                  <div className="text-xs text-[#6B7E72]">
                    Asset: <strong>{t.asset}</strong> · Reported by: {t.reportedBy}
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-[#3D5044] pt-1">
                    <span>👤 Assigned: <strong>{t.assignedTo}</strong></span>
                    <span>⏱️ Performance: <strong>{t.timeElapsed}</strong> ({t.slaTarget})</span>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0">
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-xl border border-[#D8E4DC] text-xs font-semibold text-[#111A14] hover:bg-[#F5F9F6] transition-all"
                  >
                    View Engineering Log
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
