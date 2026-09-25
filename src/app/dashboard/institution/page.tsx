import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { getAuthedProfile } from '@/lib/supabase/server';

export default async function InstitutionDashboardPage() {
  const auth = await getAuthedProfile();

  const stats = [
    {
      label: 'Campus Facility Uptime',
      value: '99.8%',
      sub: 'Power & water systems',
      icon: '🏛️',
      bg: '#D1FAE5',
    },
    {
      label: 'Critical Machinery Assets',
      value: '14',
      sub: 'Lifts, Gensets, Chillers, RO',
      icon: '⚙️',
      bg: '#EFF6FF',
    },
    {
      label: 'Open Work Orders',
      value: '1',
      sub: 'Priority: Standard (HVAC)',
      icon: '🔧',
      bg: '#FEF3C7',
    },
    {
      label: 'Civitas SLA Response',
      value: '42 mins',
      sub: 'Target: < 120 mins (100% met)',
      icon: '⏱️',
      bg: '#EEF7F2',
    },
  ];

  const criticalMachinery = [
    {
      name: '250 kVA Cummins Prime Generator',
      tag: 'GEN-01 (Main Campus Block)',
      status: 'Operational',
      statusColor: 'bg-[#D6EDE1] text-[#0F3D26]',
      hours: '1,842 hrs runtime',
      lastService: '12 days ago',
      nextService: 'In 18 days',
    },
    {
      name: 'Kone MonoSpace 8-Passenger Elevator',
      tag: 'LIFT-A (Admin Tower)',
      status: 'Operational',
      statusColor: 'bg-[#D6EDE1] text-[#0F3D26]',
      hours: 'Certified by Factories Inspectorate',
      lastService: 'Last Month',
      nextService: 'Oct 15, 2026',
    },
    {
      name: 'Central Daikin VRV Chiller System',
      tag: 'HVAC-01 (Auditorium & Labs)',
      status: 'Routine Service Due',
      statusColor: 'bg-[#FEF3C7] text-[#D97706]',
      hours: '32 indoor cassette units',
      lastService: '60 days ago',
      nextService: 'This Friday',
    },
    {
      name: 'Reverse Osmosis Borehole Filtration',
      tag: 'WTR-01 (Campus Water Station)',
      status: 'Operational',
      statusColor: 'bg-[#D6EDE1] text-[#0F3D26]',
      hours: '10,000L/day purification',
      lastService: 'Sept 04, 2026',
      nextService: 'Dec 04, 2026',
    },
  ];

  return (
    <DashboardLayout role="institution" userName={auth?.profile.full_name || 'Facilities Director'}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-br from-[#064E3B] to-[#0F3D26] rounded-3xl p-8 text-white relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(52,211,153,0.15)_0%,transparent_60%)] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-[11px] font-semibold uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                Institutional Campus Operations
              </div>
              <h1 className="text-2xl font-serif font-bold mb-2">Enterprise Facility & Asset Governance</h1>
              <p className="text-sm text-white/70 leading-relaxed max-w-xl">
                Multi-building campus oversight, industrial machinery uptime, certified technician dispatches,
                and regulatory compliance for hospitals, educational facilities, and corporate headquarters.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard/institution/maintenance"
                className="px-5 py-2.5 rounded-full bg-[#E87722] hover:bg-[#D46B1E] text-white text-xs font-semibold text-center transition-all shadow-sm"
              >
                🚨 Log Campus Emergency
              </Link>
              <Link
                href="/dashboard/institution/assets"
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold text-center border border-white/20 transition-all"
              >
                Asset Register →
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
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

        {/* Critical Plant Machinery Snapshot */}
        <div className="bg-white rounded-2xl border border-[#D8E4DC] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D8E4DC] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#111A14]">Critical Campus Machinery</h2>
              <p className="text-[11px] text-[#6B7E72] mt-0.5">Heavy mechanical & electrical assets under Civitas SLA</p>
            </div>
            <Link href="/dashboard/institution/assets" className="text-[10px] text-[#047857] font-semibold hover:underline">
              View All 14 Assets →
            </Link>
          </div>

          <div className="divide-y divide-[#D8E4DC]">
            {criticalMachinery.map((asset, idx) => (
              <div key={idx} className="p-6 hover:bg-[#F9FBFA] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-[#111A14]">{asset.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${asset.statusColor}`}>
                      {asset.status}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#6B7E72]">{asset.tag}</p>
                  <p className="text-xs text-[#3D5044]">{asset.hours}</p>
                </div>

                <div className="flex md:flex-col items-start md:items-end justify-between gap-2 shrink-0 text-xs">
                  <span className="text-[#6B7E72]">Next Service: <strong className="text-[#064E3B]">{asset.nextService}</strong></span>
                  <Link
                    href={`/dashboard/institution/maintenance?asset=${encodeURIComponent(asset.tag)}`}
                    className="text-[11px] text-[#047857] font-semibold hover:underline"
                  >
                    View Maintenance Log →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dedicated Account Executive & SLA Banner */}
        <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#047857] text-white flex items-center justify-center text-xl shrink-0">
            🤝
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-[#065F46] mb-0.5">Civitas Dedicated Institutional Facilities Lead</div>
            <p className="text-xs text-[#047857]">
              Eng. Kwesi Arthur (Senior Mechanical Engineer) is assigned to your campus. Guaranteed 2-hour on-site arrival
              for catastrophic power, water, or life-safety outages.
            </p>
          </div>
          <a
            href="tel:+233555062589"
            className="flex-shrink-0 px-5 py-2.5 rounded-full bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold transition-all shadow-sm"
          >
            Direct Line: +233 55 506 2589
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
