'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { buildRentActPlan } from '@/lib/escrow';

interface PropertyOption {
  id: string;
  name: string;
  monthlyRent: number;
}

interface Props {
  properties: PropertyOption[];
  initialPropertyId: string;
}

type TenantLookupState =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'found'; tenantId: string; fullName: string }
  | { status: 'not_found' }
  | { status: 'error' };

export default function CreateLeaseClient({ properties, initialPropertyId }: Props) {
  const router = useRouter();
  const [propertyId, setPropertyId] = useState(initialPropertyId);
  const [tenantEmail, setTenantEmail] = useState('');
  const [tenantLookup, setTenantLookup] = useState<TenantLookupState>({ status: 'idle' });
  const [monthlyRent, setMonthlyRent] = useState(
    properties.find((p) => p.id === initialPropertyId)?.monthlyRent ?? properties[0]?.monthlyRent ?? 0
  );
  const [advanceMonths, setAdvanceMonths] = useState(12);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [leaseTermMonths, setLeaseTermMonths] = useState(12);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [created, setCreated] = useState(false);

  const plan = useMemo(() => {
    if (!(monthlyRent > 0) || !advanceMonths || !startDate) return null;
    try {
      return buildRentActPlan(monthlyRent, advanceMonths, new Date(startDate), leaseTermMonths);
    } catch {
      return null;
    }
  }, [monthlyRent, advanceMonths, startDate, leaseTermMonths]);

  const handlePropertyChange = (id: string) => {
    setPropertyId(id);
    const prop = properties.find((p) => p.id === id);
    if (prop) setMonthlyRent(prop.monthlyRent);
  };

  const handleLookupTenant = async () => {
    if (!tenantEmail.trim()) return;
    setTenantLookup({ status: 'checking' });
    try {
      const res = await fetch(`/api/profiles/lookup?email=${encodeURIComponent(tenantEmail.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setTenantLookup({ status: 'error' });
        return;
      }
      if (data.found) {
        setTenantLookup({ status: 'found', tenantId: data.profileId, fullName: data.fullName });
      } else {
        setTenantLookup({ status: 'not_found' });
      }
    } catch {
      setTenantLookup({ status: 'error' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tenantLookup.status !== 'found') {
      setSubmitError('Look up and confirm a registered tenant before creating the lease.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/leases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          tenantId: tenantLookup.tenantId,
          monthlyRentGhs: monthlyRent,
          advanceMonthsRequested: advanceMonths,
          startDate,
          leaseTermMonths,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? 'Failed to create lease. Please try again.');
        return;
      }

      setCreated(true);
    } catch {
      setSubmitError('Network error — check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (created) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm text-center py-12">
        <div className="w-16 h-16 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-3xl flex items-center justify-center mx-auto mb-4">📜</div>
        <h2 className="text-2xl font-serif font-bold text-[#0F3D26] mb-2">Lease Created</h2>
        <p className="text-xs text-[#6B7E72] mb-6">
          {tenantLookup.status === 'found' ? tenantLookup.fullName : 'The tenant'} can now see their payment
          schedule and pay via Mobile Money from their dashboard.
        </p>
        <button
          onClick={() => router.push('/dashboard/owner/finances')}
          className="px-6 py-3 rounded-full bg-[#1A5C3A] text-white text-xs font-semibold uppercase tracking-wider"
        >
          View Escrow Schedule →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Create a Lease</h1>
        <p className="text-xs text-[#6B7E72] mt-1">Rent Act 220 compliant payment schedule, generated automatically.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Property</label>
          <select
            value={propertyId}
            onChange={(e) => handlePropertyChange(e.target.value)}
            className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] bg-white outline-none focus:border-[#1A5C3A]"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Tenant&apos;s Civitas Email</label>
          <div className="flex gap-2">
            <input
              type="email"
              required
              value={tenantEmail}
              onChange={(e) => { setTenantEmail(e.target.value); setTenantLookup({ status: 'idle' }); }}
              placeholder="tenant@example.com"
              className="flex-1 px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
            />
            <button
              type="button"
              onClick={handleLookupTenant}
              disabled={tenantLookup.status === 'checking'}
              className="px-4 py-3 rounded-xl bg-[#0F3D26] text-white text-xs font-semibold disabled:opacity-60"
            >
              {tenantLookup.status === 'checking' ? 'Checking…' : 'Look Up'}
            </button>
          </div>
          {tenantLookup.status === 'found' && (
            <p className="text-[11px] text-[#1A5C3A] font-semibold mt-1.5">✓ Found: {tenantLookup.fullName}</p>
          )}
          {tenantLookup.status === 'not_found' && (
            <p className="text-[11px] text-[#D94F3D] mt-1.5">
              No tenant account with that email yet. Ask them to sign up at /portal as a tenant first, then look up again.
            </p>
          )}
          {tenantLookup.status === 'error' && (
            <p className="text-[11px] text-[#D94F3D] mt-1.5">Couldn&apos;t check that email. Try again.</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Monthly Rent (GHS)</label>
            <input
              type="number"
              min={1}
              required
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Number(e.target.value))}
              className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Months of Advance Requested</label>
            <input
              type="number"
              min={1}
              max={36}
              required
              value={advanceMonths}
              onChange={(e) => setAdvanceMonths(Number(e.target.value))}
              className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Lease Start Date</label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Lease Term (months)</label>
            <input
              type="number"
              min={1}
              max={60}
              required
              value={leaseTermMonths}
              onChange={(e) => setLeaseTermMonths(Number(e.target.value))}
              className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
            />
          </div>
        </div>

        {plan && (
          <div className="p-4 rounded-2xl bg-[#F5F9F6] border border-[#D8E4DC]">
            <div className="text-xs font-bold text-[#0F3D26] mb-2">Payment Schedule Preview</div>
            {plan.isNonCompliantDemand ? (
              <p className="text-[11px] text-[#6B7E72] mb-3">
                {advanceMonths} months requested exceeds the legal 6-month cap. The tenant pays{' '}
                <strong className="text-[#111A14]">GHS {plan.legalAdvanceAmountGhs.toLocaleString()}</strong> now,
                then ordinary monthly rent for the remaining {plan.protectedMonths} months as each falls due.
              </p>
            ) : (
              <p className="text-[11px] text-[#6B7E72] mb-3">Fully compliant — no excess advance requested.</p>
            )}
            <div className="max-h-40 overflow-y-auto space-y-1">
              {plan.installments.slice(0, 8).map((i) => (
                <div key={i.installmentNumber} className="flex justify-between text-[10px] px-2 py-1.5 rounded-lg bg-white">
                  <span className="text-[#6B7E72]">{new Date(i.dueDate).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span className="font-bold text-[#111A14]">GHS {i.amountGhs.toLocaleString()}</span>
                </div>
              ))}
              {plan.installments.length > 8 && (
                <div className="text-[10px] text-[#6B7E72] text-center pt-1">+ {plan.installments.length - 8} more installments</div>
              )}
            </div>
          </div>
        )}

        {submitError && (
          <div className="p-3 rounded-xl bg-[#FDECEA] border border-[#FAD4D0] text-xs font-semibold text-[#D94F3D]">
            ⚠ {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || tenantLookup.status !== 'found'}
          className="w-full py-3.5 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
        >
          {submitting && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {submitting ? 'Creating Lease…' : 'Create Lease & Generate Schedule →'}
        </button>
      </form>
    </div>
  );
}
