'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

interface Ticket {
  id: string;
  type: string;
  property: string;
  status: 'In Progress' | 'Completed' | 'Assigned';
  priority: 'Emergency' | 'Urgent' | 'Standard';
  sla: string;
  date: string;
  tech: string;
}

export default function TenantMaintenancePage() {
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 'MR-0039', type: 'Leaking Tap in Kitchen', property: 'Airport Res. Apt 3B', status: 'In Progress', priority: 'Standard', sla: '68h remaining', date: '22 Jul 2025', tech: 'Kofi Acheampong' },
    { id: 'MR-0031', type: 'Main Entrance Lock Replacement', property: 'Airport Res. Apt 3B', status: 'Completed', priority: 'Standard', sla: 'Done', date: '14 Jul 2025', tech: 'Abena Mensah' },
  ]);

  return (
    <DashboardLayout role="tenant" userName="Ama Owusu">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">My Maintenance Requests</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Track issues and log repair tickets for Airport Res. Apt 3B</p>
        </div>
        <Link
          href="/dashboard/owner/maintenance"
          className="px-5 py-2.5 rounded-full bg-[#E87722] hover:bg-[#B85A10] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          + Log New Issue
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-[#D8E4DC] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#D8E4DC]">
          <h2 className="text-sm font-bold text-[#111A14]">Active & Past Repair Tickets</h2>
        </div>

        <div className="divide-y divide-[#D8E4DC]">
          {tickets.map(t => (
            <div key={t.id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-[#F5F9F6] transition-colors">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-xs font-bold text-[#1A5C3A]">{t.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${t.priority === 'Emergency' ? 'bg-[#FDECEA] text-[#D94F3D]' : 'bg-[#EFF6FF] text-[#2563EB]'}`}>
                    {t.priority}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#111A14]">{t.type}</h3>
                <p className="text-xs text-[#6B7E72] mt-0.5">Assigned Technician: {t.tech} · Logged {t.date}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${t.status === 'Completed' ? 'bg-[#EEF7F2] text-[#1A5C3A]' : 'bg-[#FEF3C7] text-[#D97706]'}`}>
                    {t.status}
                  </span>
                  <div className="text-[10px] text-[#6B7E72] mt-1">{t.sla}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
