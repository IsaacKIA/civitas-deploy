'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import RentActEscrowCalculator from '@/components/RentActEscrowCalculator';

export default function OwnerFinancesPage() {
  const payouts = [
    { date: 'Jul 01, 2025', ref: 'PAY-GH-9901', amount: 10912, method: 'Wise (USD $948)', status: 'Disbursed' },
    { date: 'Jun 01, 2025', ref: 'PAY-GH-8821', amount: 10912, method: 'Wise (USD $948)', status: 'Disbursed' },
    { date: 'May 01, 2025', ref: 'PAY-GH-7734', amount: 9800,  method: 'MTN MoMo',      status: 'Disbursed' },
  ];

  return (
    <DashboardLayout role="owner" userName="Property Owner">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Financial Statements & Payouts</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Monthly property P&L breakdown, management fees, and net owner payouts</p>
        </div>
        <button
          onClick={() => alert('Exporting monthly property P&L statement (PDF/CSV)...')}
          className="px-5 py-2.5 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          📄 Export Financial Report
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-[#D8E4DC] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7E72] mb-1">Gross Rent Collected</div>
          <div className="text-2xl font-serif font-bold text-[#111A14]">GHS 12,400</div>
          <div className="text-[10px] text-[#1A5C3A] mt-1">100% collection rate this month</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D8E4DC] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#E87722] mb-1">Civitas Fee (8%)</div>
          <div className="text-2xl font-serif font-bold text-[#111A14]">GHS 992</div>
          <div className="text-[10px] text-[#6B7E72] mt-1">Full management & SLA dispatch</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D8E4DC] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] mb-1">Maintenance Escrow (4%)</div>
          <div className="text-2xl font-serif font-bold text-[#111A14]">GHS 496</div>
          <div className="text-[10px] text-[#D97706] mt-1">Held in reserve for repairs</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D8E4DC] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#1A5C3A] mb-1">Net Owner Payout</div>
          <div className="text-2xl font-serif font-bold text-[#1A5C3A]">GHS 10,912</div>
          <div className="text-[10px] text-[#2E8B6A] font-semibold mt-1">Disbursed on 1st of month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* P&L Statement breakdown */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm">
          <h2 className="text-base font-serif font-bold text-[#0F3D26] mb-6">July 2025 Income Statement Breakdown</h2>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between py-3 border-b border-[#D8E4DC]">
              <span className="font-semibold text-[#111A14]">(+) East Legon Villa Rent</span>
              <span className="font-bold text-[#1A5C3A]">GHS 4,500</span>
            </div>
            <div className="flex justify-between py-3 border-b border-[#D8E4DC]">
              <span className="font-semibold text-[#111A14]">(+) Airport Res. Apt 3B Rent</span>
              <span className="font-bold text-[#1A5C3A]">GHS 3,200</span>
            </div>
            <div className="flex justify-between py-3 border-b border-[#D8E4DC]">
              <span className="font-semibold text-[#111A14]">(+) Tema Harbour Studio Rent</span>
              <span className="font-bold text-[#1A5C3A]">GHS 2,100</span>
            </div>
            <div className="flex justify-between py-3 border-b border-[#D8E4DC]">
              <span className="font-semibold text-[#111A14]">(+) Solar Micro-Grid Power Sales</span>
              <span className="font-bold text-[#1A5C3A]">GHS 2,600</span>
            </div>

            <div className="flex justify-between py-3 border-b border-[#D8E4DC] text-[#D94F3D]">
              <span>(-) Civitas Management Fee (8%)</span>
              <span className="font-bold">- GHS 992</span>
            </div>
            <div className="flex justify-between py-3 border-b border-[#D8E4DC] text-[#D94F3D]">
              <span>(-) Reserve Maintenance Escrow (4%)</span>
              <span className="font-bold">- GHS 496</span>
            </div>

            <div className="flex justify-between py-4 bg-[#EEF7F2] px-4 rounded-2xl font-bold text-sm text-[#0F3D26]">
              <span>Net Distributable Income</span>
              <span>GHS 10,912</span>
            </div>
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-serif font-bold text-[#0F3D26] mb-4">Payout History</h2>

            <div className="space-y-3">
              {payouts.map((p, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#F5F9F6] border border-[#D8E4DC] flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-[#111A14]">GHS {p.amount.toLocaleString()}</div>
                    <div className="text-[10px] text-[#6B7E72] mt-0.5">{p.date} · {p.method}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-[10px] font-bold">{p.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-[#FEF6EF] border border-[#FAE8D5] text-xs text-[#6B7E72]">
            💡 Payout preferences can be configured between <strong>MTN Mobile Money (GHS)</strong> and <strong>Wise Wire (USD)</strong>.
          </div>
        </div>
      </div>

      {/* Ghana Rent Act 220 Interactive Escrow Calculator */}
      <RentActEscrowCalculator />
    </DashboardLayout>
  );
}
