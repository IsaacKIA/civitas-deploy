'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default function PropertiesDirectoryPage() {
  const properties = [
    { id: 'P001', name: 'East Legon Villa', type: 'Residential Villa', unit: '4 Beds', status: 'occupied', tenant: 'Kwame Asante', rent: 4500, gps: 'GA-183-9021', solar: '5.5 kWp' },
    { id: 'P002', name: 'Airport Res. Apt 3B', type: 'Apartment', unit: '2 Beds', status: 'occupied', tenant: 'Ama Owusu', rent: 3200, gps: 'GA-445-1130', solar: '3.2 kWp' },
    { id: 'P003', name: 'Tema Harbour Studio', type: 'Commercial / Studio', unit: '1 Bed', status: 'occupied', tenant: 'Kojo Mensah', rent: 2100, gps: 'GT-001-4567', solar: '2.0 kWp' },
    { id: 'P004', name: 'Cantonments Luxury Residence', type: 'Mixed-Use Complex', unit: '5 Beds', status: 'vacant', tenant: '—', rent: 6000, gps: 'GA-221-7734', solar: '8.0 kWp' },
  ];

  return (
    <DashboardLayout role="owner" userName="Property Owner">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Property Directory</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Manage all registered real estate assets across Ghana</p>
        </div>
        <Link
          href="/dashboard/owner/properties/new"
          className="px-5 py-2.5 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          + Add New Property
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map(p => (
          <div key={p.id} className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="px-2.5 py-1 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-[10px] font-bold uppercase">{p.type}</span>
                  <h3 className="text-lg font-serif font-bold text-[#111A14] mt-2">{p.name}</h3>
                  <p className="text-xs text-[#6B7E72]">Ghana Post GPS: <span className="font-mono font-bold text-[#111A14]">{p.gps}</span></p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${p.status === 'occupied' ? 'bg-[#EEF7F2] text-[#1A5C3A]' : 'bg-[#FEF3C7] text-[#D97706]'}`}>
                  {p.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-[#D8E4DC] text-xs mb-4">
                <div>
                  <span className="text-[10px] text-[#6B7E72] uppercase font-semibold block">Monthly Rent</span>
                  <span className="font-bold text-[#1A5C3A]">GHS {p.rent.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7E72] uppercase font-semibold block">Current Tenant</span>
                  <span className="font-semibold text-[#111A14]">{p.tenant}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7E72] uppercase font-semibold block">Solar Telemetry</span>
                  <span className="font-semibold text-[#2E8B6A]">☀️ {p.solar}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Link
                href="/dashboard/owner/energy"
                className="flex-1 py-2 text-center rounded-xl bg-[#F5F9F6] hover:bg-[#EEF7F2] text-[#1A5C3A] text-xs font-semibold transition-all"
              >
                Solar Telemetry →
              </Link>
              <Link
                href="/dashboard/owner/maintenance"
                className="flex-1 py-2 text-center rounded-xl bg-[#0F3D26] hover:bg-[#1A5C3A] text-white text-xs font-semibold transition-all"
              >
                Log Maintenance →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
