'use client';

import React from 'react';

export default function TrustBadges() {
  const partners = [
    { name: 'Lands Commission Ghana', label: 'Land Title Verified', icon: '🏛️' },
    { name: 'Ghana Energy Commission', label: 'Certified Renewable Grid', icon: '⚡' },
    { name: 'AfDB Development Fund', label: 'ESG Partner', icon: '🌍' },
    { name: 'UNDP Climate Action', label: 'SDG 7 & 11 Aligned', icon: '🌿' },
    { name: 'Verra VCS Carbon', label: 'Verified Offset Ledger', icon: '📜' },
    { name: 'Bank of Ghana BoG', label: 'Multi-Currency Escrow', icon: '🏦' }
  ];

  return (
    <div className="py-12 bg-[#EEF7F2] border-t border-b border-[#D6EDE1]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A5C3A]">
            Accredited Institutions & Strategic Partners
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center">
          {partners.map((p, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/70 border border-[#D8E4DC] text-center hover:bg-white transition-all hover:shadow-md"
            >
              <span className="text-2xl mb-2">{p.icon}</span>
              <div className="text-xs font-bold text-[#111A14]">{p.name}</div>
              <div className="text-[10px] text-[#6B7E72] mt-0.5">{p.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
