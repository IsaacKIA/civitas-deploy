import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { getAuthedProfile } from '@/lib/supabase/server';

export default async function DeveloperDashboardPage() {
  const auth = await getAuthedProfile();

  const stats = [
    {
      label: 'Active Developments',
      value: '2',
      sub: 'Multi-unit residential sites',
      icon: '🏙️',
      bg: '#F5F3FF',
    },
    {
      label: 'Total Units Built',
      value: '28',
      sub: '22 handed over · 6 in snagging',
      icon: '🏘️',
      bg: '#EFF6FF',
    },
    {
      label: 'Open Snagging Items',
      value: '4',
      sub: 'Pre-handover punchlist',
      icon: '📋',
      bg: '#FEF3C7',
    },
    {
      label: 'Units Under Warranty (DLP)',
      value: '18',
      sub: '12-month defect liability',
      icon: '🛡️',
      bg: '#D6EDE1',
    },
  ];

  const projects = [
    {
      id: 'proj-1',
      name: 'Osu Palm Residences',
      location: 'Osu, Greater Accra',
      units: 16,
      handedOver: 14,
      snagging: 2,
      status: 'Handover Phase',
      tagColor: 'bg-[#EFF6FF] text-[#1E40AF]',
    },
    {
      id: 'proj-2',
      name: 'Mankessim Green Estate (Phase 1)',
      location: 'Mankessim, Central Region',
      units: 12,
      handedOver: 8,
      snagging: 4,
      status: 'Active Snagging',
      tagColor: 'bg-[#FEF3C7] text-[#D97706]',
    },
  ];

  return (
    <DashboardLayout role="developer" userName={auth?.profile.full_name || 'Property Developer'}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-br from-[#5B21B6] to-[#0F3D26] rounded-3xl p-8 text-white relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(232,119,34,0.2)_0%,transparent_60%)] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-[11px] font-semibold uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E87722] animate-pulse" />
                Developer & Estate Portal
              </div>
              <h1 className="text-2xl font-serif font-bold mb-2">Development & Handover Management</h1>
              <p className="text-sm text-white/70 leading-relaxed max-w-xl">
                Deliver snag-free homes to your buyers with digital punchlists, warranty tracking,
                and seamless transition into Civitas ongoing estate facility management.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard/developer/handover"
                className="px-5 py-2.5 rounded-full bg-[#E87722] hover:bg-[#D46B1E] text-white text-xs font-semibold text-center transition-all shadow-sm"
              >
                + New Snagging Inspection
              </Link>
              <Link
                href="/dashboard/developer/projects"
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold text-center border border-white/20 transition-all"
              >
                View Sites
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

        {/* Projects / Developments Overview */}
        <div className="bg-white rounded-2xl border border-[#D8E4DC] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D8E4DC] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#111A14]">Active Developments</h2>
              <p className="text-[11px] text-[#6B7E72] mt-0.5">Tracking unit completion and buyer handovers</p>
            </div>
            <Link href="/dashboard/developer/projects" className="text-[10px] text-[#5B21B6] font-semibold hover:underline">
              All Developments →
            </Link>
          </div>

          <div className="divide-y divide-[#D8E4DC]">
            {projects.map((p) => {
              const progressPct = Math.round((p.handedOver / p.units) * 100);
              return (
                <div key={p.id} className="p-6 hover:bg-[#F9FBFA] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-bold text-[#111A14]">{p.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${p.tagColor}`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7E72]">📍 {p.location}</p>

                    <div className="max-w-md pt-2">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#6B7E72]">Handover Progress ({p.handedOver}/{p.units} units)</span>
                        <span className="font-bold text-[#111A14]">{progressPct}%</span>
                      </div>
                      <div className="h-2 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#5B21B6] rounded-full transition-all"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href={`/dashboard/developer/handover?project=${p.id}`}
                      className="px-4 py-2 rounded-xl border border-[#D8E4DC] text-xs font-semibold text-[#111A14] hover:bg-[#F5F9F6] transition-all"
                    >
                      Inspect Punchlist ({p.snagging})
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Civitas Estate Operations Handshake */}
        <div className="bg-[#FAF5FF] border border-[#DDD6FE] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#5B21B6] text-white flex items-center justify-center text-xl shrink-0">
            🤝
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-[#4C1D95] mb-0.5">Post-Handover Facility Management</div>
            <p className="text-xs text-[#6D28D9]">
              After keys are handed to homeowners, Civitas manages common area generators, solar, borehole pumps,
              estate security, and refuse collection — preserving developer brand prestige.
            </p>
          </div>
          <Link
            href="/dashboard/developer/warranties"
            className="flex-shrink-0 px-5 py-2.5 rounded-full bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-semibold transition-all shadow-sm"
          >
            Review DLP Warranties →
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
