'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function TenantUtilitiesPage() {
  return (
    <DashboardLayout role="tenant" userName="Ama Owusu">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Utility Bills & Solar Savings</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Airport Residential Apt 3B · Smart Metering</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-[#D8E4DC] shadow-sm">
          <div className="text-[10px] uppercase font-bold text-[#1A5C3A] mb-1">Solar Contribution</div>
          <div className="text-2xl font-serif font-bold text-[#111A14]">85% Solar</div>
          <div className="text-xs text-[#6B7E72] mt-1">Zero power loss during grid dumsor</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#D8E4DC] shadow-sm">
          <div className="text-[10px] uppercase font-bold text-[#E87722] mb-1">Current Bill Saved</div>
          <div className="text-2xl font-serif font-bold text-[#111A14]">GHS 640</div>
          <div className="text-xs text-[#6B7E72] mt-1">vs. standard ECG tariff</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#D8E4DC] shadow-sm">
          <div className="text-[10px] uppercase font-bold text-[#2E8B6A] mb-1">Water Recycling</div>
          <div className="text-2xl font-serif font-bold text-[#111A14]">1.2K Liters</div>
          <div className="text-xs text-[#6B7E72] mt-1">Rainwater harvesting active</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
