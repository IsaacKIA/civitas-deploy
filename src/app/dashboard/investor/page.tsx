'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

const portfolio = [
  { id: 'INV001', project: 'Civitas Green Township', region: 'Mankessim, Central', committed: 50000, irr: 16.8, nextPayout: 'Sep 30', payoutAmt: 2100, progress: 64, status: 'Active', esg: 'A' },
  { id: 'INV002', project: 'Rural Energy Hubs',      region: 'Northern Region',    committed: 25000, irr: 15.2, nextPayout: 'Oct 15', payoutAmt: 945,  progress: 63, status: 'Active', esg: 'A+' },
  { id: 'INV003', project: 'Clean City Initiative',  region: 'Greater Accra',      committed: 15000, irr: 13.5, nextPayout: 'Nov 1',  payoutAmt: 506,  progress: 53, status: 'Active', esg: 'B+' },
];

const dividends = [
  { date: 'Apr 30, 2025', project: 'Green Township', amount: 2100, method: 'USD Wire', status: 'Paid' },
  { date: 'Jan 31, 2025', project: 'Green Township', amount: 2100, method: 'USD Wire', status: 'Paid' },
  { date: 'Apr 30, 2025', project: 'Rural Energy',   amount: 945,  method: 'GHS MoMo', status: 'Paid' },
];

const totalCommitted = portfolio.reduce((s, p) => s + p.committed, 0);
const totalNextPayout = portfolio.reduce((s, p) => s + p.payoutAmt, 0);
const avgIRR = (portfolio.reduce((s, p) => s + p.irr, 0) / portfolio.length).toFixed(1);

export default function InvestorDashboard() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'dividends'>('portfolio');

  return (
    <DashboardLayout role="investor" userName="Dr. Abena Mensah">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Investment Portfolio</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Impact Investor · London, UK · USD / GHS</p>
        </div>
        <Link href="/dashboard/investor/marketplace"
          className="px-5 py-2.5 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2">
          Browse Projects →
        </Link>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Committed',  value: `$${(totalCommitted / 11.5).toFixed(0)}K`,    sub: `GHS ${totalCommitted.toLocaleString()}`,  icon: '💰', color: '#7C3AED', bg: '#F5F3FF' },
          { label: 'Avg IRR',          value: `${avgIRR}%`,                                   sub: 'vs. 12% benchmark',                       icon: '📈', color: '#1A5C3A', bg: '#EEF7F2' },
          { label: 'Next Payout',      value: `GHS ${totalNextPayout.toLocaleString()}`,      sub: 'Sep 30, 2025',                            icon: '💸', color: '#D97706', bg: '#FEF3C7' },
          { label: 'ESG Portfolio',    value: 'A',                                             sub: 'Verra VCS Aligned',                       icon: '🌿', color: '#2E8B6A', bg: '#D4EFE6' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#D8E4DC] p-5 shadow-sm hover:shadow-md transition-all">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3" style={{ background: s.bg }}>{s.icon}</div>
            <div className="text-xl font-bold font-serif" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] font-semibold text-[#6B7E72] uppercase tracking-wider mt-0.5">{s.label}</div>
            <div className="text-[10px] text-[#A8B8AE] mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* IRR Comparison Banner */}
      <div className="bg-[#0F3D26] rounded-2xl p-6 text-white mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-white/50 uppercase tracking-wider mb-1">Portfolio IRR vs. Alternatives</div>
            <div className="flex items-center gap-6 text-sm">
              <div><span className="text-2xl font-serif font-bold text-[#E87722]">{avgIRR}%</span><span className="text-white/50 ml-1">Civitas</span></div>
              <div className="text-white/30">vs.</div>
              <div><span className="text-lg font-serif font-bold text-white/60">8.2%</span><span className="text-white/40 ml-1 text-xs">S&P 500 (avg)</span></div>
              <div className="text-white/30">vs.</div>
              <div><span className="text-lg font-serif font-bold text-white/60">5.1%</span><span className="text-white/40 ml-1 text-xs">Ghana T-Bills</span></div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/50 mb-1">Total Dividends Received</div>
            <div className="text-2xl font-serif font-bold text-[#D6EDE1]">GHS 15,492</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-[#D8E4DC] shadow-sm overflow-hidden">
        <div className="flex border-b border-[#D8E4DC]">
          {(['portfolio', 'dividends'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-xs font-semibold capitalize transition-all ${activeTab === tab ? 'border-b-2 border-[#7C3AED] text-[#7C3AED]' : 'text-[#6B7E72]'}`}>
              {tab === 'portfolio' ? '📊 My Holdings' : '💸 Dividend History'}
            </button>
          ))}
        </div>

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="divide-y divide-[#D8E4DC]">
            {portfolio.map(inv => (
              <div key={inv.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-sm font-bold text-[#111A14]">{inv.project}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-[9px] font-bold">{inv.status}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#D4EFE6] text-[#2E8B6A] text-[9px] font-bold">ESG {inv.esg}</span>
                    </div>
                    <p className="text-xs text-[#6B7E72] mb-3">📍 {inv.region}</p>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 bg-[#D8E4DC] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#7C3AED] h-full rounded-full transition-all" style={{ width: `${inv.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-[#6B7E72] font-semibold">{inv.progress}% funded</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center md:text-right">
                    <div>
                      <div className="text-[10px] text-[#6B7E72] uppercase tracking-wider">Committed</div>
                      <div className="text-sm font-bold text-[#111A14]">GHS {inv.committed.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#6B7E72] uppercase tracking-wider">IRR</div>
                      <div className="text-sm font-bold text-[#7C3AED]">{inv.irr}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#6B7E72] uppercase tracking-wider">Next Payout</div>
                      <div className="text-xs font-bold text-[#D97706]">GHS {inv.payoutAmt.toLocaleString()}</div>
                      <div className="text-[9px] text-[#A8B8AE]">{inv.nextPayout}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dividends Tab */}
        {activeTab === 'dividends' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#F5F9F6] border-b border-[#D8E4DC]">
                  <th className="px-6 py-3 text-left text-[#6B7E72] font-semibold uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-[#6B7E72] font-semibold uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-[#6B7E72] font-semibold uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-[#6B7E72] font-semibold uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-[#6B7E72] font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8E4DC]">
                {dividends.map((d, i) => (
                  <tr key={i} className="hover:bg-[#F5F9F6] transition-colors">
                    <td className="px-6 py-4 text-[#3D5044]">{d.date}</td>
                    <td className="px-6 py-4 font-semibold text-[#111A14]">{d.project}</td>
                    <td className="px-6 py-4 font-bold text-[#1A5C3A]">GHS {d.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-[#6B7E72]">{d.method}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-[10px] font-semibold">{d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
