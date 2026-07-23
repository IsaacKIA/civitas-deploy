'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function TenantLeasePage() {
  return (
    <DashboardLayout role="tenant" userName="Ama Owusu">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Digital Lease Agreement</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Official lease document compliant with Ghana Rent Act (Act 220)</p>
        </div>
        <button
          onClick={() => alert('Downloading official Ghana Rent Act Lease Agreement PDF...')}
          className="px-5 py-2.5 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          📥 Download PDF Document
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document Viewer Container */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm">
          <div className="border-b border-[#D8E4DC] pb-6 mb-6 flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E87722]">Verified Legal Document</span>
              <h2 className="text-2xl font-serif font-bold text-[#0F3D26] mt-1">Residential Tenancy Agreement</h2>
              <p className="text-xs text-[#6B7E72]">Contract Ref: <span className="font-mono font-bold text-[#111A14]">LEASE-GH-2025-4402</span></p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-xs font-bold">Active & Signed</span>
          </div>

          <div className="space-y-6 text-xs text-[#3D5044] leading-relaxed font-sans">
            <div>
              <h3 className="font-bold text-[#111A14] text-sm mb-1">1. Parties & Property Description</h3>
              <p>
                This agreement is entered into between <strong>Civitas Estate Management Ltd</strong> (Landlord Representative) and <strong>Ama Owusu</strong> (Tenant) for the property located at <strong>Airport Residential Apartment 3B, Accra, Ghana (Ghana Post GPS: GA-445-1130)</strong>.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#111A14] text-sm mb-1">2. Term & Ghana Rent Act Compliance</h3>
              <p>
                The lease term shall commence on <strong>1st February 2025</strong> and expire on <strong>31st January 2026</strong>. In accordance with the <strong>Ghana Rent Act (Act 220)</strong>, advance rental payments do not exceed 6 calendar months. Rental deposits are safely held in Bank of Ghana regulated escrow accounts.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#111A14] text-sm mb-1">3. Monthly Rent & Maintenance Guarantees</h3>
              <p>
                The monthly rent of <strong>GHS 3,200</strong> is payable on or before the 28th day of each month via Civitas Mobile Money rails. The Landlord guarantees 24/7 emergency maintenance response within 2 hours.
              </p>
            </div>

            <div className="pt-6 border-t border-[#D8E4DC] grid grid-cols-2 gap-4 text-[11px]">
              <div className="p-4 rounded-2xl bg-[#F5F9F6] border border-[#D8E4DC]">
                <div className="text-[10px] uppercase font-bold text-[#6B7E72]">Tenant Signature</div>
                <div className="font-bold text-[#1A5C3A] mt-1">Ama Owusu (Verified Digital ID)</div>
                <div className="text-[9px] text-[#A8B8AE] mt-0.5">Signed: 15 Jan 2025 · IP 102.176.4.12</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F9F6] border border-[#D8E4DC]">
                <div className="text-[10px] uppercase font-bold text-[#6B7E72]">Landlord / Agent Signature</div>
                <div className="font-bold text-[#1A5C3A] mt-1">Civitas Legal Operations</div>
                <div className="text-[9px] text-[#A8B8AE] mt-0.5">Signed: 15 Jan 2025 · Verified Stamp</div>
              </div>
            </div>
          </div>
        </div>

        {/* Lease Summary Panel */}
        <div className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-serif font-bold text-[#0F3D26] mb-4">Lease Quick Facts</h2>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-[#F5F9F6]">
                <span className="text-[#6B7E72]">Monthly Rent</span>
                <span className="font-bold text-[#1A5C3A]">GHS 3,200</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-[#F5F9F6]">
                <span className="text-[#6B7E72]">Rent Advance</span>
                <span className="font-bold text-[#111A14]">6 Months (Act 220)</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-[#F5F9F6]">
                <span className="text-[#6B7E72]">Ghana Post GPS</span>
                <span className="font-mono font-bold text-[#111A14]">GA-445-1130</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-[#F5F9F6]">
                <span className="text-[#6B7E72]">Escrow Holding</span>
                <span className="font-bold text-[#2E8B6A]">Protected</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-[#EEF7F2] text-center border border-[#D6EDE1]">
            <div className="text-xl mb-1">⚖️</div>
            <div className="text-xs font-bold text-[#0F3D26]">Rent Control Board Aligned</div>
            <div className="text-[10px] text-[#6B7E72] mt-1">This agreement is fully enforceable under Republic of Ghana tenancy laws.</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
