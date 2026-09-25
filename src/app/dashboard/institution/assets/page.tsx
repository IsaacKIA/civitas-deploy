import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { getAuthedProfile } from '@/lib/supabase/server';

export default async function InstitutionAssetsPage() {
  const auth = await getAuthedProfile();

  const assets = [
    {
      id: 'ast-1',
      tag: 'GEN-01',
      name: '250 kVA Cummins Heavy Duty Diesel Generator',
      location: 'Central Powerhouse (North Campus)',
      category: 'Power Generation',
      installed: '2023',
      capacity: '250 kVA / 200 kW',
      condition: 'Excellent',
      conditionColor: 'bg-[#D6EDE1] text-[#0F3D26]',
      serialNo: 'CUM-GH-88219',
      lastServiceDate: 'Sept 13, 2026',
      serviceInterval: '250 hours (Monthly)',
    },
    {
      id: 'ast-2',
      tag: 'GEN-02',
      name: '150 kVA Perkins Standby Generator',
      location: 'Medical & Science Complex',
      category: 'Power Generation',
      installed: '2024',
      capacity: '150 kVA',
      condition: 'Good',
      conditionColor: 'bg-[#EFF6FF] text-[#1E40AF]',
      serialNo: 'PRK-41002-X',
      lastServiceDate: 'Aug 28, 2026',
      serviceInterval: '250 hours (Monthly)',
    },
    {
      id: 'ast-3',
      tag: 'LIFT-01',
      name: 'Kone MonoSpace 8-Passenger Elevator',
      location: 'Administration Tower (Floors G–6)',
      category: 'Vertical Transport',
      installed: '2022',
      capacity: '630 kg (8 Persons)',
      condition: 'Certified',
      conditionColor: 'bg-[#D6EDE1] text-[#0F3D26]',
      serialNo: 'KN-99214-GH',
      lastServiceDate: 'Sept 01, 2026',
      serviceInterval: 'Monthly Safety Audit',
    },
    {
      id: 'ast-4',
      tag: 'HVAC-VRV-1',
      name: 'Daikin VRV IV-X Central Heat Recovery Chiller',
      location: 'Main Auditorium & Library Complex',
      category: 'HVAC / Climate Control',
      installed: '2023',
      capacity: '54 HP / 150 kW cooling',
      condition: 'Service Due',
      conditionColor: 'bg-[#FEF3C7] text-[#D97706]',
      serialNo: 'DKN-VRV-0019',
      lastServiceDate: 'July 18, 2026',
      serviceInterval: 'Quarterly Deep Chemical Wash',
    },
    {
      id: 'ast-5',
      tag: 'WTR-RO-01',
      name: 'Industrial Reverse Osmosis Water Purification Plant',
      location: 'Water Processing Station',
      category: 'Water & Plumbing',
      installed: '2024',
      capacity: '10,000 Litres / Day',
      condition: 'Excellent',
      conditionColor: 'bg-[#D6EDE1] text-[#0F3D26]',
      serialNo: 'RO-FLTR-8812',
      lastServiceDate: 'Sept 04, 2026',
      serviceInterval: 'Quarterly Filter Membrane Flush',
    },
    {
      id: 'ast-6',
      tag: 'FIRE-PUMP-01',
      name: 'Diesel Fire Suppression Booster Pump & Sprinklers',
      location: 'Underground Pump House',
      category: 'Life Safety & Fire Protection',
      installed: '2022',
      capacity: '500 GPM @ 100 PSI',
      condition: 'Tested & Certified',
      conditionColor: 'bg-[#D6EDE1] text-[#0F3D26]',
      serialNo: 'FP-GHNF-221',
      lastServiceDate: 'Aug 10, 2026',
      serviceInterval: 'Biannual NFPA Safety Test',
    },
  ];

  return (
    <DashboardLayout role="institution" userName={auth?.profile.full_name || 'Facilities Director'}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#111A14]">Enterprise Asset Register</h1>
            <p className="text-xs text-[#6B7E72] mt-1">
              Industrial machinery, power plants, elevators, HVAC chillers, and fire suppression systems
            </p>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 rounded-full bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            + Register Campus Asset
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {assets.map((asset) => (
            <div key={asset.id} className="bg-white rounded-2xl border border-[#D8E4DC] p-6 shadow-sm hover:border-[#047857]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-[#047857] bg-[#ECFDF5] px-2.5 py-0.5 rounded-lg border border-[#A7F3D0]">
                    {asset.tag}
                  </span>
                  <h3 className="text-sm font-bold text-[#111A14]">{asset.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${asset.conditionColor}`}>
                    {asset.condition}
                  </span>
                </div>
                <p className="text-xs text-[#6B7E72]">
                  📍 {asset.location} · Category: <strong>{asset.category}</strong>
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-[#3D5044] pt-2">
                  <span>Capacity: <strong>{asset.capacity}</strong></span>
                  <span>Serial: <code className="font-mono text-[11px] bg-[#F5F9F6] px-1 py-0.5 rounded">{asset.serialNo}</code></span>
                  <span>Routine: <strong>{asset.serviceInterval}</strong></span>
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0">
                <div className="text-right text-xs">
                  <span className="text-[#6B7E72] block">Last Serviced</span>
                  <span className="font-semibold text-[#111A14]">{asset.lastServiceDate}</span>
                </div>
                <Link
                  href={`/dashboard/institution/schedule?asset=${encodeURIComponent(asset.tag)}`}
                  className="px-4 py-2 rounded-xl bg-[#F5F9F6] hover:bg-[#EEF7F2] text-[#047857] text-xs font-semibold transition-all"
                >
                  Manage Routine →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
