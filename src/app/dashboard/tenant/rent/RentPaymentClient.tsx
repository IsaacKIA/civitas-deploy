'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MobileMoneyCheckoutModal from '@/components/MobileMoneyCheckoutModal';

export interface DueInstallmentView {
  id: string;
  amountGhs: number;
  dueDate: string;
  kind: 'legal_advance' | 'monthly_rent';
  status: 'due' | 'pending_confirmation' | 'paid' | 'overdue' | 'waived';
}

export interface PropertyView {
  name: string;
  address: string;
}

interface Props {
  property: PropertyView;
  dueInstallment: DueInstallmentView | null;
  legalAdvanceMonths: number;
  advanceMonthsRequested: number;
}

export default function RentPaymentClient({
  property,
  dueInstallment,
  legalAdvanceMonths,
  advanceMonthsRequested,
}: Props) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [justPaidRef, setJustPaidRef] = useState<string | null>(null);

  if (!dueInstallment) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm text-center py-14">
        <div className="w-16 h-16 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-3xl flex items-center justify-center mx-auto mb-4">🎉</div>
        <h2 className="text-2xl font-serif font-bold text-[#0F3D26] mb-2">You&apos;re fully paid up</h2>
        <p className="text-xs text-[#6B7E72]">
          There&apos;s no rent currently due on {property.name}. We&apos;ll show your next payment here as soon as it&apos;s due.
        </p>
      </div>
    );
  }

  if (justPaidRef) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm text-center py-10">
        <div className="w-16 h-16 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-3xl flex items-center justify-center mx-auto mb-4">✅</div>
        <h2 className="text-2xl font-serif font-bold text-[#0F3D26] mb-2">Rent Payment Received!</h2>
        <p className="text-xs text-[#6B7E72] mb-6">
          GHS {dueInstallment.amountGhs.toLocaleString()} confirmed. Reference <strong className="font-mono">{justPaidRef}</strong>.
        </p>
        <button
          onClick={() => router.refresh()}
          className="px-6 py-3 rounded-full bg-[#1A5C3A] text-white text-xs font-semibold uppercase tracking-wider"
        >
          Back to Overview →
        </button>
      </div>
    );
  }

  const isOverdue = dueInstallment.status === 'overdue';
  const isPendingConfirmation = dueInstallment.status === 'pending_confirmation';

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#E87722]">
          {dueInstallment.kind === 'legal_advance' ? 'Legal Advance Rent Payment' : 'Monthly Rent Payment'}
        </span>
        <h2 className="text-2xl font-serif font-bold text-[#0F3D26] mt-1">{property.name}</h2>
        <p className="text-xs text-[#6B7E72]">{property.address}</p>
      </div>

      {advanceMonthsRequested > legalAdvanceMonths && (
        <div className="p-3 rounded-xl bg-[#FEF6EF] border border-[#FAE8D5] text-[11px] text-[#6B7E72]">
          Your landlord originally requested {advanceMonthsRequested} months upfront. Ghana&apos;s Rent Act 220 caps
          that at {legalAdvanceMonths} — Civitas only ever bills you the legal amount now, then ordinary monthly
          rent as each month falls due. You never pre-pay the rest.
        </div>
      )}

      {isOverdue && (
        <div className="p-3 rounded-xl bg-[#FDECEA] border border-[#FAD4D0] text-[11px] font-semibold text-[#D94F3D]">
          This payment is overdue. Please pay as soon as possible to avoid disruption to your tenancy.
        </div>
      )}

      {isPendingConfirmation && (
        <div className="p-3 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[11px] font-semibold text-[#92610A]">
          A payment for this installment is already being confirmed. If it doesn&apos;t complete within a few
          minutes, refresh this page before trying again.
        </div>
      )}

      <div className="p-4 rounded-2xl bg-[#F5F9F6] border border-[#D8E4DC] flex justify-between items-center">
        <div>
          <div className="text-[10px] uppercase font-semibold text-[#6B7E72]">Amount Due</div>
          <div className="text-2xl font-serif font-bold text-[#111A14]">GHS {dueInstallment.amountGhs.toLocaleString()}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase font-semibold text-[#6B7E72]">Due Date</div>
          <div className="text-sm font-bold text-[#0F3D26]">
            {new Date(dueInstallment.dueDate).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={isPendingConfirmation}
        onClick={() => setModalOpen(true)}
        className="w-full py-3.5 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
      >
        Pay GHS {dueInstallment.amountGhs.toLocaleString()} Rent Now →
      </button>

      <MobileMoneyCheckoutModal
        installmentId={dueInstallment.id}
        amountGhs={dueInstallment.amountGhs}
        purpose={dueInstallment.kind === 'legal_advance' ? 'Legal Advance Rent Payment' : 'Monthly Rent Payment'}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={(ref) => {
          setModalOpen(false);
          setJustPaidRef(ref || 'confirmed');
        }}
      />
    </div>
  );
}
