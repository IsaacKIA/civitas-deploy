'use client';

import React, { useState } from 'react';
import { RENT_ACT_LEGAL_ADVANCE_MONTHS, buildRentActPlan } from '@/lib/escrow';

/**
 * Illustrative estimator — not tied to a real lease. Uses buildRentActPlan
 * from lib/escrow.ts (the same function the real lease-creation API uses)
 * so the numbers shown here can never drift from what actually gets billed
 * once a real lease is created.
 *
 * Earlier version of this component had its own duplicate math AND claimed
 * Civitas deposits the excess into "Bank of Ghana regulated escrow
 * accounts" — no such integration exists. What actually happens: the
 * tenant is simply never billed the excess upfront. It becomes ordinary
 * monthly rent, billed when each month falls due. No money changes hands
 * before then, so there's nothing held in custody to describe as escrow.
 */
export default function RentActEscrowCalculator() {
  const [monthlyRent, setMonthlyRent] = useState(3000);
  const [advanceMonths, setAdvanceMonths] = useState(12); // Commonly requested 1-2 years

  const plan = buildRentActPlan(monthlyRent, advanceMonths, new Date());

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm space-y-6">
      <div className="border-b border-[#D8E4DC] pb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#E87722]">Ghana Rent Act (Act 220) Estimator</span>
        <h3 className="text-xl font-serif font-bold text-[#0F3D26] mt-1">Advance Rent Compliance Calculator</h3>
        <p className="text-xs text-[#6B7E72] mt-0.5">See what you&apos;d actually be billed under Rent Act 220 — this is an estimate; real leases use the same calculation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#111A14] mb-1">Agreed Monthly Rent (GHS)</label>
          <input
            type="number"
            value={monthlyRent}
            onChange={e => setMonthlyRent(Math.max(1, Number(e.target.value)))}
            className="w-full px-4 py-3 text-xs font-bold rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#111A14] mb-1">Advance Rent Requested (Months)</label>
          <select
            value={advanceMonths}
            onChange={e => setAdvanceMonths(Number(e.target.value))}
            className="w-full px-4 py-3 text-xs font-bold rounded-xl border border-[#D8E4DC] bg-white outline-none focus:border-[#1A5C3A]"
          >
            <option value={1}>1 Month (Monthly Lease)</option>
            <option value={3}>3 Months (Quarterly Lease)</option>
            <option value={6}>6 Months (Legal Cap under Act 220)</option>
            <option value={12}>12 Months (1 Year Advance)</option>
            <option value={24}>24 Months (2 Years Advance)</option>
          </select>
        </div>
      </div>

      {plan.isNonCompliantDemand ? (
        <div className="p-4 rounded-2xl bg-[#FDECEA] border border-[#FAD4D0] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#D94F3D]">
            <span>⚠️ Rent Act 220 Non-Compliance Alert</span>
          </div>
          <p className="text-xs text-[#111A14] leading-relaxed">
            Under <strong>Ghana Rent Act 220 Section 25</strong>, demanding more than {RENT_ACT_LEGAL_ADVANCE_MONTHS} months
            advance rent is illegal. Civitas only bills the legal <strong>GHS {plan.legalAdvanceAmountGhs.toLocaleString()}</strong>{' '}
            now — the remaining <strong>GHS {plan.protectedAmountGhs.toLocaleString()}</strong> is simply never
            collected upfront. It becomes ordinary monthly rent, billed as each month actually falls due.
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-[#EEF7F2] border border-[#D6EDE1]">
          <div className="text-xs font-bold text-[#1A5C3A]">✅ Fully Compliant with Ghana Rent Act 220</div>
          <div className="text-[10px] text-[#6B7E72] mt-0.5">Advance rent requested is within the {RENT_ACT_LEGAL_ADVANCE_MONTHS}-month statutory limit.</div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 pt-2 text-xs border-t border-[#D8E4DC]">
        <div className="p-3 rounded-xl bg-[#F5F9F6]">
          <span className="text-[10px] text-[#6B7E72] uppercase font-semibold block">Billed Now</span>
          <span className="font-serif font-bold text-base text-[#1A5C3A]">GHS {plan.legalAdvanceAmountGhs.toLocaleString()}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#FEF6EF]">
          <span className="text-[10px] text-[#E87722] uppercase font-semibold block">Never Pre-Paid</span>
          <span className="font-serif font-bold text-base text-[#E87722]">GHS {plan.protectedAmountGhs.toLocaleString()}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#F5F9F6]">
          <span className="text-[10px] text-[#6B7E72] uppercase font-semibold block">Total Over Full Term</span>
          <span className="font-serif font-bold text-base text-[#111A14]">GHS {(monthlyRent * advanceMonths).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
