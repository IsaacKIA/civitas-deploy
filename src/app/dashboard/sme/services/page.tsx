import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { getAuthedProfile } from '@/lib/supabase/server';

export default async function SmeServicesPage() {
  const auth = await getAuthedProfile();

  const services = [
    {
      name: 'Diesel Generator Maintenance SLA',
      frequency: 'Monthly Inspection + Oil Change every 250 hrs',
      slaResponse: '2 hours on complete power failure',
      details: 'Automatic ATS test, filter replacement, alternator inspection, fuel line cleaning, load bank testing.',
      status: 'Included in SME Plan',
      icon: '⚡',
    },
    {
      name: 'Commercial Air Conditioning & Cooling',
      frequency: 'Every 60 days',
      slaResponse: '4 hours on server room / primary office failure',
      details: 'Deep chemical coil cleaning, refrigerant top-up, fan motor lubrication, condensate drain unblocking.',
      status: 'Included in SME Plan',
      icon: '❄️',
    },
    {
      name: 'Plumbing, Water Pumps & Storage Tanks',
      frequency: 'Quarterly',
      slaResponse: '3 hours on active burst / water outage',
      details: 'Booster pump pressure calibration, float switch testing, overhead Polytank sanitization, pipe leak audit.',
      status: 'Included in SME Plan',
      icon: '💧',
    },
    {
      name: 'Electrical Distribution & Safety Audit',
      frequency: 'Biannual',
      slaResponse: '2 hours on breaker trips / electrical hazards',
      details: 'Distribution board thermal scanning (identifying hot spots before fires), earth leakage circuit breaker tests, surge protector verification.',
      status: 'Certified Compliance',
      icon: '🔌',
    },
    {
      name: 'Solar PV & Battery Inverter Servicing',
      frequency: 'Quarterly',
      slaResponse: '4 hours on inverter tripping',
      details: 'Panel array washing, terminal torque checks, battery cycle health verification, string voltage testing.',
      status: 'Active Upgrade',
      icon: '☀️',
    },
  ];

  return (
    <DashboardLayout role="sme" userName={auth?.profile.full_name || 'Business Owner'}>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#111A14]">Facility Services & Service Level Agreements</h1>
            <p className="text-xs text-[#6B7E72] mt-1">
              Guaranteed response times and certified technicians to protect your daily commercial operations
            </p>
          </div>
          <Link
            href="/dashboard/sme/schedule"
            className="px-5 py-2.5 rounded-full bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-all shadow-sm text-center"
          >
            View Service Calendar →
          </Link>
        </div>

        <div className="space-y-4">
          {services.map((s, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-[#D8E4DC] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#1E40AF]/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#1E40AF] text-2xl flex items-center justify-center shrink-0">
                  {s.icon}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-[#111A14]">{s.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#D6EDE1] text-[#0F3D26]">
                      {s.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7E72] mt-1">{s.details}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-[11px] text-[#3D5044]">
                    <span>📅 <strong>Cycle:</strong> {s.frequency}</span>
                    <span>⏱️ <strong>Emergency SLA:</strong> {s.slaResponse}</span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <Link
                  href="/dashboard/sme/maintenance"
                  className="px-4 py-2 rounded-xl border border-[#D8E4DC] text-xs font-semibold text-[#111A14] hover:bg-[#F5F9F6] transition-all"
                >
                  Request Service
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-[#6B21A8]">Need a Custom Corporate SLA?</h4>
            <p className="text-xs text-[#7E22CE] mt-0.5">
              For multi-site retail chains, financial branches, or hospitals requiring 24/7 on-call engineering.
            </p>
          </div>
          <a
            href="tel:+233555062589"
            className="px-5 py-2.5 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold transition-all whitespace-nowrap shadow-sm"
          >
            Contact Key Accounts Manager
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
