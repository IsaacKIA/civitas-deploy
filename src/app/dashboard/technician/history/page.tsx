'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function TechnicianHistoryPage() {
  const jobs = [
    { id: 'MR-2025-0035', title: 'HVAC Unit Service', property: 'Kumasi Eco-Hub', date: '21 Jul 2025', payout: 280, rating: '5.0 ⭐' },
    { id: 'MR-2025-0028', title: 'Solar Inverter Calibration', property: 'East Legon Villa', date: '18 Jul 2025', payout: 450, rating: '4.9 ⭐' },
    { id: 'MR-2025-0021', title: 'Water Pump Repair', property: 'Airport Res. Apt 3B', date: '12 Jul 2025', payout: 350, rating: '4.8 ⭐' },
  ];

  return (
    <DashboardLayout role="technician" userName="Kofi Acheampong">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Job History & Performance</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Completed work order history and customer ratings</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm">
        <div className="divide-y divide-[#D8E4DC]">
          {jobs.map(j => (
            <div key={j.id} className="py-4 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-[#111A14]">{j.title} ({j.id})</div>
                <div className="text-[#6B7E72] mt-0.5">{j.property} · Completed {j.date}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#1A5C3A]">GHS {j.payout}</div>
                <div className="text-[10px] text-[#D97706] mt-0.5">{j.rating}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
