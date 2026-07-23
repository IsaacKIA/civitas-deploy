'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function OwnerDocumentsPage() {
  const docs = [
    { title: 'East Legon Land Title Indenture', category: 'Title & Deeds', date: '12 Jan 2024', size: '4.2 MB' },
    { title: 'Civitas Master Property Management Agreement', category: 'Contracts', date: '01 Feb 2024', size: '1.8 MB' },
    { title: 'Ghana Post Digital Address Certificate', category: 'Verification', date: '15 Jan 2024', size: '512 KB' },
    { title: 'Verra VCS Carbon Offsets Certificate 2024', category: 'ESG Reports', date: '31 Dec 2024', size: '2.1 MB' },
  ];

  return (
    <DashboardLayout role="owner" userName="Property Owner">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Document Vault</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Verified land titles, lease contracts, and ESG certificates</p>
        </div>
        <button
          onClick={() => alert('Opening upload wizard...')}
          className="px-5 py-2.5 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          + Upload Document
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm">
        <div className="divide-y divide-[#D8E4DC]">
          {docs.map((doc, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <div className="font-bold text-[#111A14]">{doc.title}</div>
                  <div className="text-[#6B7E72] mt-0.5">{doc.category} · Added {doc.date}</div>
                </div>
              </div>
              <button
                onClick={() => alert(`Downloading ${doc.title}...`)}
                className="px-4 py-2 rounded-xl bg-[#F5F9F6] hover:bg-[#EEF7F2] text-[#1A5C3A] font-semibold transition-all"
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
