'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MAINTENANCE_CATEGORIES, MAINTENANCE_PRIORITIES, type MaintenanceCategory, type MaintenancePriority } from '@/lib/maintenance';

interface PropertyOption {
  id: string;
  name: string;
  gps: string;
}

interface FormState {
  category: MaintenanceCategory | '';
  priority: MaintenancePriority | '';
  title: string;
  description: string;
  propertyId: string;
  preferredDate: string;
}

export default function TenantMaintenanceWizard({ properties }: { properties: PropertyOption[] }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [refNumber, setRefNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({
    category: '', priority: '', title: '', description: '',
    propertyId: properties[0]?.id ?? '', preferredDate: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const selectedPriority = MAINTENANCE_PRIORITIES.find((p) => p.id === form.priority);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.category) e.category = 'Select a category';
    if (!form.priority) e.priority = 'Select a priority level';
    if (!form.title.trim()) e.title = 'Describe the issue briefly';
    if (!form.description.trim()) e.description = 'Please provide more detail';
    if (!form.propertyId) e.propertyId = 'Select a property';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: form.propertyId,
          category: form.category,
          priority: form.priority,
          title: form.title,
          description: form.description,
          preferredDate: form.preferredDate || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? 'Failed to submit request. Please try again.');
        return;
      }

      setRefNumber(data.referenceCode);
      setSubmitted(true);
    } catch {
      setSubmitError('Network error — check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-12 border border-[#D8E4DC] shadow-sm text-center">
        <div className="w-20 h-20 rounded-full bg-[#EEF7F2] text-4xl flex items-center justify-center mx-auto mb-6">✅</div>
        <h2 className="text-2xl font-serif font-bold text-[#0F3D26] mb-2">Request Submitted!</h2>
        <p className="text-xs text-[#6B7E72] mb-6">Your maintenance request has been logged.</p>
        <div className="bg-[#F5F9F6] rounded-2xl p-6 mb-6 inline-block">
          <div className="text-[10px] text-[#6B7E72] uppercase tracking-wider mb-1">Reference Number</div>
          <div className="text-2xl font-mono font-bold text-[#0F3D26]">{refNumber}</div>
        </div>
        <div>
          <button
            onClick={() => router.push('/dashboard/tenant/maintenance')}
            className="px-6 py-3 rounded-full bg-[#0F3D26] text-white text-xs font-semibold hover:bg-[#1A5C3A] transition-all"
          >
            View All Requests →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Log a Maintenance Issue</h1>
        <p className="text-xs text-[#6B7E72] mt-1">Describe what&apos;s wrong — we&apos;ll track it and follow up.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#D8E4DC] shadow-sm p-6 space-y-6">
        {properties.length > 1 && (
          <div>
            <label className="block text-xs font-bold text-[#111A14] mb-2 uppercase tracking-wider">Property</label>
            <select
              value={form.propertyId}
              onChange={(e) => setForm((f) => ({ ...f, propertyId: e.target.value }))}
              className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] bg-white outline-none focus:border-[#1A5C3A]"
            >
              {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-[#111A14] mb-3 uppercase tracking-wider">
            Issue Category {errors.category && <span className="text-[#D94F3D] normal-case font-normal ml-2">— {errors.category}</span>}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {MAINTENANCE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => { setForm((f) => ({ ...f, category: cat.id })); setErrors((e) => ({ ...e, category: '' })); }}
                className={`flex flex-col items-center p-3 rounded-xl border-2 text-center transition-all ${form.category === cat.id ? 'border-[#1A5C3A] bg-[#EEF7F2]' : 'border-[#D8E4DC] hover:border-[#1A5C3A]/40'}`}
              >
                <span className="text-xl mb-1">{cat.icon}</span>
                <span className="text-[11px] font-semibold text-[#111A14]">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#111A14] mb-3 uppercase tracking-wider">
            Priority Level {errors.priority && <span className="text-[#D94F3D] normal-case font-normal ml-2">— {errors.priority}</span>}
          </label>
          <div className="space-y-2">
            {MAINTENANCE_PRIORITIES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => { setForm((f) => ({ ...f, priority: p.id })); setErrors((e) => ({ ...e, priority: '' })); }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${form.priority === p.id ? 'border-[#1A5C3A] bg-[#EEF7F2]' : 'border-[#D8E4DC] hover:border-[#1A5C3A]/40'}`}
              >
                <div className="flex-1">
                  <div className="text-xs font-bold text-[#111A14]">{p.label}</div>
                  <div className="text-[10px] text-[#6B7E72]">{p.desc}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: p.bg, color: p.color }}>{p.slaLabel}</span>
              </button>
            ))}
          </div>
          {selectedPriority && (
            <p className="text-[10px] text-[#6B7E72] mt-2">Target response: {selectedPriority.slaLabel}.</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#111A14] mb-2 uppercase tracking-wider">Issue Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value })); setErrors((e2) => ({ ...e2, title: '' })); }}
            placeholder="e.g. Bathroom tap leaking badly"
            className={`w-full px-4 py-3 text-sm rounded-xl border outline-none transition-all ${errors.title ? 'border-[#D94F3D] bg-[#FDECEA]' : 'border-[#D8E4DC] focus:border-[#1A5C3A]'}`}
          />
          {errors.title && <p className="text-[10px] text-[#D94F3D] mt-1">⚠ {errors.title}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#111A14] mb-2 uppercase tracking-wider">Detailed Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => { setForm((f) => ({ ...f, description: e.target.value })); setErrors((e2) => ({ ...e2, description: '' })); }}
            placeholder="Describe when it started, how severe it is, and any other relevant details..."
            className={`w-full px-4 py-3 text-sm rounded-xl border outline-none transition-all resize-none ${errors.description ? 'border-[#D94F3D] bg-[#FDECEA]' : 'border-[#D8E4DC] focus:border-[#1A5C3A]'}`}
          />
          {errors.description && <p className="text-[10px] text-[#D94F3D] mt-1">⚠ {errors.description}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#111A14] mb-2 uppercase tracking-wider">
            Preferred Service Date <span className="font-normal text-[#6B7E72] normal-case">(optional)</span>
          </label>
          <input
            type="date"
            value={form.preferredDate}
            onChange={(e) => setForm((f) => ({ ...f, preferredDate: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 text-sm rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A] bg-white"
          />
        </div>

        {submitError && (
          <div className="p-3 rounded-xl bg-[#FDECEA] border border-[#FAD4D0] text-xs font-semibold text-[#D94F3D]">
            ⚠ {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-full bg-[#E87722] hover:bg-[#B85A10] disabled:opacity-60 text-white text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2"
        >
          {submitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {submitting ? 'Submitting…' : 'Submit Request →'}
        </button>
      </form>
    </div>
  );
}
