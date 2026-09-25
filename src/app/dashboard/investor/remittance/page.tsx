import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { getAuthedProfile } from '@/lib/supabase/server';
import { CurrencyAmount } from '@/components/CurrencyToggle';

export default async function DiasporaRemittancePage() {
  const auth = await getAuthedProfile();

  const remittances = [
    {
      id: 'rem-901',
      date: 'Sept 01, 2026',
      property: 'East Legon Townhouse',
      grossRentGhs: 12000,
      taxWithheldGhs: 960, // 8% GRA rent tax
      maintenanceReserveGhs: 540,
      netPayoutGhs: 10500,
      destination: 'Barclays UK (GBP Account ending ••••4192)',
      status: 'Paid & Settled',
      statusColor: 'bg-[#D6EDE1] text-[#0F3D26]',
      transferRef: 'SWIFT-GH99210-UK',
    },
    {
      id: 'rem-844',
      date: 'Aug 01, 2026',
      property: 'East Legon Townhouse',
      grossRentGhs: 12000,
      taxWithheldGhs: 960,
      maintenanceReserveGhs: 0,
      netPayoutGhs: 11040,
      destination: 'Barclays UK (GBP Account ending ••••4192)',
      status: 'Paid & Settled',
      statusColor: 'bg-[#D6EDE1] text-[#0F3D26]',
      transferRef: 'SWIFT-GH87321-UK',
    },
  ];

  return (
    <DashboardLayout role="investor" userName={auth?.profile.full_name}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Rental Remittance & Overseas Transfers</h1>
            <p className="text-xs text-[#6B7E72] mt-1">
              Transparent rental income tracking, tax compliance withholding, and international bank remittances
            </p>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 rounded-full bg-[#0F3D26] hover:bg-[#1A5C3A] text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            Update Offshore Bank Account
          </button>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-[#D8E4DC] p-5 shadow-sm">
            <span className="text-[10px] font-semibold text-[#6B7E72] uppercase tracking-wider block">YTD Rent Collected</span>
            <div className="text-2xl font-serif font-bold text-[#0F3D26] mt-1">
              <CurrencyAmount amountGhs={108000} />
            </div>
            <span className="text-[11px] text-[#A8B8AE]">9 monthly cycles</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#D8E4DC] p-5 shadow-sm">
            <span className="text-[10px] font-semibold text-[#6B7E72] uppercase tracking-wider block">GRA Rent Tax Paid (8%)</span>
            <div className="text-2xl font-serif font-bold text-[#2563EB] mt-1">
              <CurrencyAmount amountGhs={8640} />
            </div>
            <span className="text-[11px] text-[#2563EB]">100% Tax Compliant</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#D8E4DC] p-5 shadow-sm">
            <span className="text-[10px] font-semibold text-[#6B7E72] uppercase tracking-wider block">Total Remitted Overseas</span>
            <div className="text-2xl font-serif font-bold text-[#E87722] mt-1">
              <CurrencyAmount amountGhs={98820} />
            </div>
            <span className="text-[11px] text-[#A8B8AE]">Zero transfer disputes</span>
          </div>
        </div>

        {/* Transfer statements */}
        <div className="bg-white rounded-2xl border border-[#D8E4DC] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D8E4DC] flex items-center justify-between bg-[#F5F9F6]">
            <span className="text-xs font-bold text-[#111A14]">Remittance History</span>
            <span className="text-[11px] text-[#1A5C3A] font-semibold">Automatic Direct Deposit</span>
          </div>

          <div className="divide-y divide-[#D8E4DC]">
            {remittances.map((rem) => (
              <div key={rem.id} className="p-6 hover:bg-[#F9FBFA] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#111A14]">{rem.property}</span>
                    <span className="text-[10px] font-mono text-[#6B7E72] bg-[#EEF4F0] px-2 py-0.5 rounded-full">
                      Ref: {rem.transferRef}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${rem.statusColor}`}>
                      {rem.status}
                    </span>
                  </div>
                  <div className="text-xs text-[#6B7E72]">
                    Destination: <strong className="text-[#111A14]">{rem.destination}</strong> · Date: {rem.date}
                  </div>
                  <div className="flex flex-wrap gap-4 text-[11px] text-[#3D5044] pt-1">
                    <span>Gross Rent: <strong><CurrencyAmount amountGhs={rem.grossRentGhs} /></strong></span>
                    <span>GRA Tax: <strong>-<CurrencyAmount amountGhs={rem.taxWithheldGhs} /></strong></span>
                    {rem.maintenanceReserveGhs > 0 && (
                      <span>Reserve: <strong>-<CurrencyAmount amountGhs={rem.maintenanceReserveGhs} /></strong></span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-[#6B7E72] uppercase font-semibold block">Net Remitted</span>
                  <div className="text-lg font-serif font-bold text-[#0F3D26]">
                    <CurrencyAmount amountGhs={rem.netPayoutGhs} />
                  </div>
                  <button
                    type="button"
                    className="text-[11px] text-[#1A5C3A] font-semibold hover:underline mt-1"
                  >
                    Download Statement (PDF)
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
