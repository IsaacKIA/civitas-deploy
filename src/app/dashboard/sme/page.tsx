import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { getAuthedProfile } from '@/lib/supabase/server';

export default async function SmeDashboardPage() {
  const auth = await getAuthedProfile();

  const stats = [
    {
      label: 'Premises / Branches',
      value: '1',
      sub: 'Active commercial space',
      icon: '🏢',
      bg: '#EFF6FF',
    },
    {
      label: 'Open Work Orders',
      value: '0',
      sub: 'All systems operational',
      icon: '🔧',
      bg: '#FEF3C7',
    },
    {
      label: 'Service Plan',
      value: 'Standard SME',
      sub: '4-hr emergency response',
      icon: '⚡',
      bg: '#D6EDE1',
    },
    {
      label: 'Upcoming Service',
      value: 'Generator Check',
      sub: 'Scheduled in 6 days',
      icon: '📅',
      bg: '#F5F3FF',
    },
  ];

  const serviceModules = [
    {
      title: 'Power & Generator Servicing',
      desc: 'Routine diesel generator oil change, load testing, and inverter battery health checks to prevent blackout downtime.',
      interval: 'Monthly / Quarterly',
      status: 'Protected',
      icon: '⚡',
    },
    {
      title: 'HVAC & Air Conditioning',
      desc: 'Filter cleaning, refrigerant pressure testing, and compressor health checks for offices, clinics, and retail floors.',
      interval: 'Bi-monthly',
      status: 'Scheduled',
      icon: '❄️',
    },
    {
      title: 'Water Pumps & Plumbing',
      desc: 'Overhead tank cleaning, booster pump servicing, and rapid response to leakages and drainage issues.',
      interval: 'Quarterly',
      status: 'Protected',
      icon: '💧',
    },
    {
      title: 'Commercial Solar & Backup',
      desc: 'Solar panel cleaning, inverter diagnostics, and battery balancing to lower grid electricity overhead.',
      interval: 'Quarterly',
      status: 'Active',
      icon: '☀️',
    },
  ];

  return (
    <DashboardLayout role="sme" userName={auth?.profile.full_name || 'Business Owner'}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-br from-[#1E40AF] to-[#0F3D26] rounded-3xl p-8 text-white relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(232,119,34,0.15)_0%,transparent_60%)] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-[11px] font-semibold uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E87722] animate-pulse" />
                SME Facility Operations
              </div>
              <h1 className="text-2xl font-serif font-bold mb-2">Zero-Downtime Workplace Management</h1>
              <p className="text-sm text-white/70 leading-relaxed max-w-xl">
                Keep your offices, clinics, and retail branches running smoothly. Scheduled servicing,
                fast SLA maintenance, and vetted technicians so you focus on business growth.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard/sme/maintenance"
                className="px-5 py-2.5 rounded-full bg-[#E87722] hover:bg-[#D46B1E] text-white text-xs font-semibold text-center transition-all shadow-sm"
              >
                + Log Urgent Repair
              </Link>
              <Link
                href="/dashboard/sme/premises"
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold text-center border border-white/20 transition-all"
              >
                Manage Premises
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#D8E4DC] p-5 shadow-sm hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3" style={{ background: s.bg }}>
                {s.icon}
              </div>
              <div className="text-xl font-bold font-serif text-[#111A14]">{s.value}</div>
              <div className="text-[10px] font-semibold text-[#6B7E72] uppercase tracking-wider mt-0.5">{s.label}</div>
              <div className="text-[10px] text-[#A8B8AE] mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Facility Maintenance SLAs & Coverage */}
        <div className="bg-white rounded-2xl border border-[#D8E4DC] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D8E4DC] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#111A14]">Preventive Facility Coverage</h2>
              <p className="text-[11px] text-[#6B7E72] mt-0.5">Recurring checks prevent catastrophic breakdowns</p>
            </div>
            <Link href="/dashboard/sme/services" className="text-[10px] text-[#1A5C3A] font-semibold hover:underline">
              View SLA Details →
            </Link>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceModules.map((m, idx) => (
              <div key={idx} className="border border-[#D8E4DC] rounded-xl p-4 hover:border-[#1A5C3A]/50 transition-all bg-[#F9FBFA]">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{m.icon}</span>
                    <span className="text-xs font-bold text-[#111A14]">{m.title}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#D6EDE1] text-[#0F3D26]">
                    {m.status}
                  </span>
                </div>
                <p className="text-[11px] text-[#6B7E72] leading-relaxed mb-3">{m.desc}</p>
                <div className="flex items-center justify-between text-[10px] text-[#3D5044] pt-2 border-t border-[#D8E4DC]/60">
                  <span>Cycle: <strong>{m.interval}</strong></span>
                  <span className="text-[#1A5C3A] font-semibold">Civitas Managed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Facility Hotline */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#1E40AF] text-white flex items-center justify-center text-xl shrink-0">
            🚨
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-[#1E3A8A] mb-0.5">Commercial Facility Emergency?</div>
            <p className="text-xs text-[#3B82F6]">
              Power cut, burst pipes, AC breakdown, or security gate malfunction affecting operations.
              Dedicated rapid response dispatch for Civitas SME partners.
            </p>
          </div>
          <a
            href="tel:+233555062589"
            className="flex-shrink-0 px-5 py-2.5 rounded-full bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-xs font-semibold transition-all shadow-sm"
          >
            Call Ops Center: +233 55 506 2589
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
