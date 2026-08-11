'use client';

import React from 'react';

/**
 * Previously called itself "Accredited Institutions & Strategic Partners"
 * and claimed certification/partnership from six real, named institutions
 * (Ghana's Lands Commission, Ghana Energy Commission, the African
 * Development Bank, UNDP, Verra, and the Bank of Ghana) — none of which
 * Civitas has any actual relationship with. That's false claims of
 * institutional accreditation, not marketing puffery, so it's rebuilt
 * around what's actually true: the legal framework Civitas' rent
 * scheduling is built around, and the payment rails it actually uses.
 */
export default function TrustBadges() {
  const facts = [
    { icon: '⚖️', label: 'Rent Act 220 (1963)', desc: 'Payment schedules follow the statutory advance-rent cap' },
    { icon: '📱', label: 'Mobile Money', desc: 'MTN MoMo, Telecel Cash, AT Money supported' },
    { icon: '🔒', label: 'Row-Level Security', desc: 'Every record is access-controlled in the database itself' },
  ];

  return (
    <div className="py-12 bg-[#EEF7F2] border-t border-b border-[#D6EDE1]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A5C3A]">
            Built On
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {facts.map((f, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/70 border border-[#D8E4DC] text-center hover:bg-white transition-all hover:shadow-md"
            >
              <span className="text-2xl mb-2">{f.icon}</span>
              <div className="text-xs font-bold text-[#111A14]">{f.label}</div>
              <div className="text-[10px] text-[#6B7E72] mt-0.5">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
