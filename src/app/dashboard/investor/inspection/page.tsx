import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { getAuthedProfile } from '@/lib/supabase/server';

export default async function DiasporaInspectionPage() {
  const auth = await getAuthedProfile();

  const inspections = [
    {
      id: 'insp-101',
      date: 'Sept 18, 2026',
      property: 'East Legon Townhouse (Unit 3)',
      inspector: 'Kweku Mensah (Civitas Field Officer)',
      summary: 'Quarterly roof drainage, solar inverter performance, and structural integrity audit',
      grade: 'Excellent (94/100)',
      gradeColor: 'bg-[#D6EDE1] text-[#0F3D26]',
      photosCount: 16,
      videoLength: '4 min walkthrough',
    },
    {
      id: 'insp-102',
      date: 'June 12, 2026',
      property: 'East Legon Townhouse (Unit 3)',
      inspector: 'Civitas Engineering Inspection Team',
      summary: 'Pre-rainy season dampness check and borehole pump calibration',
      grade: 'Good (88/100)',
      gradeColor: 'bg-[#EFF6FF] text-[#1E40AF]',
      photosCount: 22,
      videoLength: '6 min walkthrough',
    },
  ];

  return (
    <DashboardLayout role="investor" userName={auth?.profile.full_name}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Remote Property Inspections</h1>
            <p className="text-xs text-[#6B7E72] mt-1">
              High-resolution photo and video walkthroughs conducted by Civitas field officers
            </p>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 rounded-full bg-[#E87722] hover:bg-[#D46B1E] text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            📸 Book On-Site Inspection
          </button>
        </div>

        {/* Audit reports list */}
        <div className="space-y-4">
          {inspections.map((insp) => (
            <div key={insp.id} className="bg-white rounded-2xl border border-[#D8E4DC] p-6 shadow-sm hover:border-[#1A5C3A]/50 transition-all">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-[#D8E4DC]">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">📋</span>
                    <h3 className="text-sm font-bold text-[#111A14]">{insp.property}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${insp.gradeColor}`}>
                      {insp.grade}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7E72] mt-1">
                    Inspected on {insp.date} by {insp.inspector}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#6B7E72] bg-[#F5F9F6] px-3 py-1 rounded-lg border border-[#D8E4DC]">
                    📸 {insp.photosCount} High-Res Photos
                  </span>
                  <span className="text-[11px] text-[#6B7E72] bg-[#F5F9F6] px-3 py-1 rounded-lg border border-[#D8E4DC]">
                    🎥 {insp.videoLength}
                  </span>
                </div>
              </div>

              <div className="py-4">
                <span className="text-[10px] uppercase font-semibold text-[#6B7E72] block mb-1">Audit Findings & Notes</span>
                <p className="text-xs text-[#111A14] leading-relaxed">{insp.summary}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#D8E4DC] text-xs">
                <span className="text-[#1A5C3A] font-semibold">Verified with GPS timestamp & geofence</span>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-[#0F3D26] hover:bg-[#1A5C3A] text-white font-semibold transition-all"
                >
                  Download Full Inspection PDF →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
