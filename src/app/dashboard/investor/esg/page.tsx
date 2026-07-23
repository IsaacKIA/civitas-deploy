'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function InvestorESGPage() {
  return (
    <DashboardLayout role="investor" userName="Dr. Abena Mensah">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">ESG & Environmental Impact Audit</h1>
          <p className="text-xs text-[#6B7E72] mt-1">UN SDG 7 & 11 Alignment · Verra Carbon Offset Standards</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-[#D8E4DC] shadow-sm">
          <div className="text-[10px] uppercase font-bold text-[#1A5C3A] mb-1">Carbon Offsets Generated</div>
          <div className="text-2xl font-serif font-[#111A14] font-bold">14.8 Tons</div>
          <div className="text-xs text-[#1A5C3A] mt-1">Across Green Township portfolio</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#D8E4DC] shadow-sm">
          <div className="text-[10px] uppercase font-bold text-[#7C3AED] mb-1">Clean Energy Generated</div>
          <div className="text-2xl font-serif font-[#111A14] font-bold">142 MWh</div>
          <div className="text-xs text-[#7C3AED] mt-1">Zero diesel generator reliance</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#D8E4DC] shadow-sm">
          <div className="text-[10px] uppercase font-bold text-[#2E8B6A] mb-1">Jobs Created</div>
          <div className="text-2xl font-serif font-[#111A14] font-bold">48 Skilled Jobs</div>
          <div className="text-xs text-[#2E8B6A] mt-1">Certified Ghanaian technicians</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
