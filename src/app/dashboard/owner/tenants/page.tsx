'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function OwnerTenantsPage() {
  const [invited, setInvited] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const tenants = [
    { name: 'Kwame Asante', property: 'East Legon Villa', leaseStart: '01 Feb 2024', leaseEnd: '31 Jan 2026', rent: 4500, status: 'Active', phone: '+233 24 412 8890' },
    { name: 'Ama Owusu', property: 'Airport Res. Apt 3B', leaseStart: '01 Feb 2025', leaseEnd: '31 Jan 2026', rent: 3200, status: 'Active', phone: '+233 55 901 2234' },
    { name: 'Kojo Mensah', property: 'Tema Harbour Studio', leaseStart: '15 Mar 2024', leaseEnd: '14 Mar 2026', rent: 2100, status: 'Active', phone: '+233 20 882 1109' },
  ];

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setInvited(true);
    setTimeout(() => setInvited(false), 4000);
  };

  return (
    <DashboardLayout role="owner" userName="Property Owner">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Tenant Management</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Tenant directory, lease agreements, and digital invitation system</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tenants Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm">
          <h2 className="text-base font-serif font-bold text-[#0F3D26] mb-4">Active Tenants</h2>
          <div className="divide-y divide-[#D8E4DC]">
            {tenants.map((t, idx) => (
              <div key={idx} className="py-4 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#111A14] text-sm">{t.name}</div>
                  <div className="text-[#6B7E72] mt-0.5">{t.property} · {t.phone}</div>
                  <div className="text-[10px] text-[#A8B8AE] mt-0.5">Lease: {t.leaseStart} → {t.leaseEnd}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#1A5C3A] text-sm">GHS {t.rent.toLocaleString()}</div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-[10px] font-bold mt-1 inline-block">{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invite New Tenant Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-serif font-bold text-[#0F3D26] mb-2">Send Digital Tenant Invite</h2>
            <p className="text-xs text-[#6B7E72] mb-6">Invite a tenant to access their Civitas portal, view lease terms, and pay rent via Mobile Money.</p>

            {invited ? (
              <div className="p-4 rounded-2xl bg-[#EEF7F2] text-[#1A5C3A] text-xs font-semibold text-center">
                ✅ Digital invitation link sent to {inviteEmail}!
              </div>
            ) : (
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1">Tenant Email Address</label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="tenant@example.com"
                    className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-xs font-semibold uppercase tracking-wider shadow-md"
                >
                  Send Portal Invite →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
