'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function TechnicianProfilePage() {
  return (
    <DashboardLayout role="technician" userName="Kofi Acheampong">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#D8E4DC]">
          <div className="w-16 h-16 rounded-full bg-[#D97706] text-white flex items-center justify-center font-bold text-2xl">
            K
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Kofi Acheampong</h1>
            <p className="text-xs text-[#6B7E72]">Senior Certified Electrical & Solar Technician · Zone A (Accra & Tema)</p>
            <div className="mt-1 flex items-center gap-2 text-xs font-bold text-[#D97706]">
              <span>4.8 ⭐ Rating</span> · <span className="text-[#1A5C3A]">Verified Artisan</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-xs text-[#3D5044]">
          <div className="p-4 rounded-2xl bg-[#F5F9F6] border border-[#D8E4DC]">
            <div className="font-bold text-[#111A14] mb-1">Certified Skill Sets</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2.5 py-1 rounded-full bg-[#EEF7F2] text-[#1A5C3A] font-bold">Electrical Wiring</span>
              <span className="px-2.5 py-1 rounded-full bg-[#EEF7F2] text-[#1A5C3A] font-bold">Solar Inverters & Storage</span>
              <span className="px-2.5 py-1 rounded-full bg-[#EEF7F2] text-[#1A5C3A] font-bold">HVAC Maintenance</span>
              <span className="px-2.5 py-1 rounded-full bg-[#EEF7F2] text-[#1A5C3A] font-bold">Emergency Lock Smith</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F9F6] border border-[#D8E4DC]">
            <div className="font-bold text-[#111A14] mb-1">MTN Mobile Money Payout Phone</div>
            <div className="font-mono font-bold text-[#1A5C3A] mt-1">+233 24 411 9901</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
