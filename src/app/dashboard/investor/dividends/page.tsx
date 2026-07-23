'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function InvestorDividendsPage() {
  const schedule = [
    { period: 'Q3 2025 (Upcoming)', date: 'Sep 30, 2025', estPayout: 'GHS 3,551', status: 'Scheduled' },
    { period: 'Q2 2025', date: 'Jun 30, 2025', estPayout: 'GHS 3,551', status: 'Paid via Wire' },
    { period: 'Q1 2025', date: 'Mar 31, 2025', estPayout: 'GHS 3,551', status: 'Paid via Wire' },
  ];

  return (
    <DashboardLayout role="investor" userName="Dr. Abena Mensah">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Quarterly Dividend Distribution</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Payout schedule and historical USD / GHS distributions</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm">
        <div className="divide-y divide-[#D8E4DC]">
          {schedule.map((item, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-[#111A14]">{item.period}</div>
                <div className="text-[#6B7E72] mt-0.5">Target Payout Date: {item.date}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#7C3AED]">{item.estPayout}</div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F5F9F6] text-[#1A5C3A] text-[10px] font-bold mt-1 inline-block">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
