import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { getAuthedProfile } from '@/lib/supabase/server';

export default async function DiasporaLocalAgentPage() {
  const auth = await getAuthedProfile();

  const representatives = [
    {
      name: 'Civitas Dedicated Property Manager',
      role: 'Institutional Caretaker & Legal Delegate',
      phone: '+233 55 506 2589',
      email: 'operations@civitas.com',
      location: 'Mankessim / Accra Operations Center',
      permissions: ['Emergency Repairs up to GH₵ 2,500', 'Digital Snagging & Video Inspection', 'Key Custody'],
      isPrimary: true,
      status: 'Active & Verified',
    },
    {
      name: 'Kofi Mensah',
      role: 'Family Delegate / Contact',
      phone: '+233 24 123 4567',
      email: 'kofi.m@gmail.com',
      location: 'East Legon, Accra',
      permissions: ['Inspection Accompaniment', 'Tenant Communication Notice'],
      isPrimary: false,
      status: 'Active',
    },
  ];

  return (
    <DashboardLayout role="investor" userName={auth?.profile.full_name}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Local Agent & Delegation</h1>
            <p className="text-xs text-[#6B7E72] mt-1">
              Appoint trusted local representatives and professional Civitas managers to oversee your property on the ground
            </p>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 rounded-full bg-[#0F3D26] hover:bg-[#1A5C3A] text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            + Assign Local Representative
          </button>
        </div>

        {/* Info on delegation */}
        <div className="bg-[#FAF5FF] border border-[#DDD6FE] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🤝</span>
            <div>
              <h3 className="text-sm font-bold text-[#4C1D95]">How Local Delegation Works</h3>
              <p className="text-xs text-[#6D28D9] mt-0.5">
                Never worry about family conflict or unverified caretakers. Set exact spending limits, key handover permissions, and require photo sign-off for any work.
              </p>
            </div>
          </div>
        </div>

        {/* Representative list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {representatives.map((rep, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-[#D8E4DC] p-6 shadow-sm hover:border-[#1A5C3A]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#111A14] flex items-center gap-2">
                      {rep.name}
                      {rep.isPrimary && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#D6EDE1] text-[#0F3D26]">
                          Primary
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-[#6B7E72] mt-0.5">{rep.role}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EEF7F2] text-[#1A5C3A]">
                    {rep.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#3D5044] my-4 pt-3 border-t border-[#D8E4DC]">
                  <div>📞 <span className="font-mono">{rep.phone}</span></div>
                  <div>✉️ <span>{rep.email}</span></div>
                  <div>📍 <span>{rep.location}</span></div>
                </div>

                <div className="pt-3 border-t border-[#D8E4DC]">
                  <span className="text-[10px] uppercase font-semibold text-[#6B7E72] block mb-2">Granted Permissions</span>
                  <div className="flex flex-wrap gap-1.5">
                    {rep.permissions.map((p, i) => (
                      <span key={i} className="text-[10px] px-2.5 py-0.5 rounded-lg bg-[#F5F9F6] text-[#111A14] border border-[#D8E4DC]/60">
                        ✓ {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#D8E4DC] flex justify-between items-center text-xs">
                <button type="button" className="text-[#1A5C3A] font-semibold hover:underline">
                  Edit Spending Limits
                </button>
                <a href={`tel:${rep.phone}`} className="text-[#E87722] font-semibold hover:underline">
                  Call Representative →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
