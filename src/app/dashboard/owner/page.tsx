'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

const stats = [
  { label: 'Total Properties',  value: '4',       sub: '3 occupied · 1 vacant',      icon: '🏠', color: '#1A5C3A', bg: '#EEF7F2' },
  { label: 'Rent Collected',    value: 'GHS 12,400', sub: 'This month',              icon: '💰', color: '#D97706', bg: '#FEF3C7' },
  { label: 'Open Maintenance',  value: '2',        sub: '1 emergency · 1 standard',  icon: '🔧', color: '#D94F3D', bg: '#FDECEA' },
  { label: 'Solar Savings',     value: 'GHS 3,120', sub: 'vs. grid this month',      icon: '☀️', color: '#2E8B6A', bg: '#D4EFE6' },
];

const properties = [
  { id: 'P001', name: 'East Legon Villa',     unit: '4 Beds', status: 'occupied', tenant: 'Kwame Asante',    rent: 4500, gps: 'GA-183-9021', sla: 'OK' },
  { id: 'P002', name: 'Airport Res. Apt 3B',  unit: '2 Beds', status: 'occupied', tenant: 'Ama Owusu',       rent: 3200, gps: 'GA-445-1130', sla: 'OK' },
  { id: 'P003', name: 'Tema Harbour Studio',  unit: '1 Bed',  status: 'occupied', tenant: 'Kojo Mensah',     rent: 2100, gps: 'GT-001-4567', sla: 'OK' },
  { id: 'P004', name: 'Cantonments Plot',     unit: '5 Beds', status: 'vacant',   tenant: '—',               rent: 6000, gps: 'GA-221-7734', sla: '—'  },
];

const maintenance = [
  { id: 'MR-2025-0042', property: 'East Legon Villa',    type: 'Electrical',  priority: 'emergency', status: 'assigned',   sla: '1h 20m' },
  { id: 'MR-2025-0039', property: 'Airport Res. Apt 3B', type: 'Plumbing',    priority: 'standard',  status: 'new',        sla: '68h 00m' },
];

const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    occupied: 'bg-[#EEF7F2] text-[#1A5C3A]',
    vacant:   'bg-[#FEF3C7] text-[#D97706]',
    emergency:'bg-[#FDECEA] text-[#D94F3D]',
    standard: 'bg-[#EFF6FF] text-[#2563EB]',
    assigned: 'bg-[#D4EFE6] text-[#2E8B6A]',
    new:      'bg-[#F5F9F6] text-[#6B7E72]',
  };
  return map[s] || 'bg-[#F5F9F6] text-[#6B7E72]';
};

export default function OwnerDashboard() {
  return (
    <DashboardLayout role="owner" userName="Property Owner">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Owner Dashboard</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Good morning! Here&apos;s your portfolio snapshot.</p>
        </div>
        <Link href="/dashboard/owner/properties"
          className="px-5 py-2.5 rounded-full bg-[#0F3D26] hover:bg-[#1A5C3A] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2">
          + Add Property
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#D8E4DC] p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: s.bg }}>
                {s.icon}
              </div>
            </div>
            <div className="text-xl font-bold font-serif text-[#111A14]">{s.value}</div>
            <div className="text-[10px] font-semibold text-[#6B7E72] uppercase tracking-wider mt-0.5">{s.label}</div>
            <div className="text-[10px] text-[#A8B8AE] mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Properties Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#D8E4DC] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D8E4DC] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#111A14]">My Properties</h2>
            <Link href="/dashboard/owner/properties" className="text-[10px] text-[#1A5C3A] font-semibold hover:underline">View All →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#F5F9F6] border-b border-[#D8E4DC]">
                  <th className="px-4 py-3 text-left text-[#6B7E72] font-semibold uppercase tracking-wider">Property</th>
                  <th className="px-4 py-3 text-left text-[#6B7E72] font-semibold uppercase tracking-wider">Tenant</th>
                  <th className="px-4 py-3 text-left text-[#6B7E72] font-semibold uppercase tracking-wider">Rent/mo</th>
                  <th className="px-4 py-3 text-left text-[#6B7E72] font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8E4DC]">
                {properties.map(p => (
                  <tr key={p.id} className="hover:bg-[#F5F9F6] transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#111A14]">{p.name}</div>
                      <div className="text-[10px] text-[#6B7E72]">{p.unit} · {p.gps}</div>
                    </td>
                    <td className="px-4 py-3 text-[#3D5044]">{p.tenant}</td>
                    <td className="px-4 py-3 font-semibold text-[#1A5C3A]">GHS {p.rent.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize ${statusBadge(p.status)}`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Maintenance & Quick Actions */}
        <div className="flex flex-col gap-6">
          {/* Active Maintenance */}
          <div className="bg-white rounded-2xl border border-[#D8E4DC] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#D8E4DC] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#111A14]">🔧 Active Requests</h2>
              <Link href="/dashboard/owner/maintenance" className="text-[10px] text-[#1A5C3A] font-semibold hover:underline">View All →</Link>
            </div>
            <div className="divide-y divide-[#D8E4DC]">
              {maintenance.map(m => (
                <div key={m.id} className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[#111A14]">{m.type}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${statusBadge(m.priority)}`}>{m.priority}</span>
                  </div>
                  <div className="text-[10px] text-[#6B7E72]">{m.property}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${statusBadge(m.status)}`}>{m.status}</span>
                    <span className="text-[10px] text-[#D94F3D] font-bold">⏱ {m.sla}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#0F3D26] rounded-2xl p-5 text-white">
            <h2 className="text-sm font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: 'Invite Tenant',      icon: '👤', href: '/dashboard/owner/tenants' },
                { label: 'Generate Statement', icon: '📄', href: '/dashboard/owner/finances' },
                { label: 'New Maintenance',    icon: '🔧', href: '/dashboard/owner/maintenance' },
                { label: 'View Energy Report', icon: '☀️', href: '/dashboard/owner/energy' },
              ].map((a, i) => (
                <Link key={i} href={a.href}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium transition-all">
                  <span>{a.icon}</span>{a.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
