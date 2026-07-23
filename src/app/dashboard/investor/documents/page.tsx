'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function InvestorDocumentsPage() {
  const docs = [
    { title: 'Civitas Green Township Private Placement Memorandum', date: '10 Jan 2024', size: '5.4 MB' },
    { title: 'Audited Financial Statements Q2 2025', date: '15 Jul 2025', size: '3.1 MB' },
    { title: 'Verra VCS Carbon Credit Audit Report', date: '30 May 2025', size: '2.8 MB' },
  ];

  return (
    <DashboardLayout role="investor" userName="Dr. Abena Mensah">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Investor Offering Memoranda & Reports</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Prospectuses, audited financials, and compliance filings</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm">
        <div className="divide-y divide-[#D8E4DC]">
          {docs.map((doc, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📜</span>
                <div>
                  <div className="font-bold text-[#111A14]">{doc.title}</div>
                  <div className="text-[#6B7E72] mt-0.5">Added {doc.date}</div>
                </div>
              </div>
              <button
                onClick={() => alert(`Downloading ${doc.title}...`)}
                className="px-4 py-2 rounded-xl bg-[#F5F9F6] hover:bg-[#EEF7F2] text-[#7C3AED] font-semibold transition-all"
              >
                Download ({doc.size})
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
