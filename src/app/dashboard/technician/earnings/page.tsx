'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function TechnicianEarningsPage() {
  return (
    <DashboardLayout role="technician" userName="Kofi Acheampong">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Mobile Money Earnings</h1>
          <p className="text-xs text-[#6B7E72] mt-1">MTN MoMo instant dispatch payouts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-[#D8E4DC] shadow-sm">
          <div className="text-[10px] uppercase font-bold text-[#1A5C3A] mb-1">Total Earned This Month</div>
          <div className="text-2xl font-serif font-bold text-[#111A14]">GHS 4,820</div>
          <div className="text-xs text-[#1A5C3A] mt-1">Paid directly via MTN MoMo</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#D8E4DC] shadow-sm">
          <div className="text-[10px] uppercase font-bold text-[#D97706] mb-1">Average Payout / Job</div>
          <div className="text-2xl font-serif font-bold text-[#111A14]">GHS 320</div>
          <div className="text-xs text-[#6B7E72] mt-1">15 jobs completed</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#D8E4DC] shadow-sm">
          <div className="text-[10px] uppercase font-bold text-[#2E8B6A] mb-1">SLA Bonus Earned</div>
          <div className="text-2xl font-serif font-bold text-[#111A14]">GHS 450</div>
          <div className="text-xs text-[#2E8B6A] mt-1">Zero SLA breaches bonus</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
