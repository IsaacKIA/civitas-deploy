'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MAINTENANCE_CATEGORIES, MAINTENANCE_PRIORITIES, type MaintenanceCategory, type MaintenancePriority } from '@/lib/maintenance';

type Step = 'details' | 'location' | 'review' | 'success';

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
  hasPhoto: boolean;
}

const STEPS: Step[] = ['details', 'location', 'review', 'success'];
const STEP_LABELS = ['Issue Details', 'Property & Timing', 'Review & Submit'];

export default function OwnerMaintenanceWizard({ properties }: { properties: PropertyOption[] }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>('details');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [refNumber, setRefNumber] = useState('');
  const [form, setForm] = useState<FormState>({
    category: '', priority: '', title: '', description: '',
    propertyId: properties[0]?.id ?? '', preferredDate: '', hasPhoto: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const stepIdx = STEPS.indexOf(step);
  const selectedCategory = MAINTENANCE_CATEGORIES.find((c) => c.id === form.category);
  const selectedPriority = MAINTENANCE_PRIORITIES.find((p) => p.id === form.priority);
  const selectedProperty = properties.find((p) => p.id === form.propertyId);

  const validateStep1 = () => {
    const e: typeof errors = {};
    if (!form.category) e.category = 'Select a category';
    if (!form.priority) e.priority = 'Select a priority level';
    if (!form.title.trim()) e.title = 'Describe the issue briefly';
    if (!form.description.trim()) e.description = 'Please provide more detail';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: typeof errors = {};
    if (!form.propertyId) e.propertyId = 'Select a property';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 'details' && !validateStep1()) return;
    if (step === 'location' && !validateStep2()) return;
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };

  const back = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const handleSubmit = async () => {
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
      setStep('success');
    } catch {
      setSubmitError('Network error — check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl border border-[#D8E4DC] flex items-center justify-center text-[#6B7E72] hover:bg-[#F5F9F6] transition-all"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">New Maintenance Request</h1>
          <p className="text-xs text-[#6B7E72] mt-0.5">Log an issue for one of your properties</p>
        </div>
      </div>

      {step !== 'success' && (
        <div className="flex items-center gap-2 mb-8">
          {STEP_LABELS.map((label, i) => {
            const current = i === stepIdx;
            const done = i < stepIdx;
            return (
              <React.Fragment key={label}>
                <div className={`flex items-center gap-2 text-xs font-semibold transition-all ${current ? 'text-[#1A5C3A]' : done ? 'text-[#A8B8AE]' : 'text-[#D8E4DC]'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${current ? 'border-[#1A5C3A] bg-[#1A5C3A] text-white' : done ? 'border-[#A8B8AE] bg-[#A8B8AE] text-white' : 'border-[#D8E4DC] text-[#D8E4DC]'}`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className="hidden sm:inline">{label}</span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded transition-all ${done ? 'bg-[#A8B8AE]' : 'bg-[#D8E4DC]'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#D8E4DC] shadow-sm overflow-hidden">
        {step === 'details' && (
          <div className="p-6 space-y-6">
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
                    <span className="text-[9px] text-[#6B7E72] mt-0.5 leading-tight">{cat.description}</span>
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
                    {form.priority === p.id && <span className="text-[#1A5C3A] font-bold">✓</span>}
                  </button>
                ))}
              </div>
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
                Photo / Video Evidence <span className="font-normal text-[#6B7E72] normal-case">(optional — coming soon)</span>
              </label>
              <div className="w-full py-6 rounded-xl border-2 border-dashed border-[#D8E4DC] flex flex-col items-center gap-2 text-[#6B7E72] text-xs opacity-70">
                📷 Photo upload isn&apos;t wired up yet — description alone is fine for now
              </div>
            </div>
          </div>
        )}

        {step === 'location' && (
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-xs font-bold text-[#111A14] mb-3 uppercase tracking-wider">Which Property?</label>
              <div className="space-y-2">
                {properties.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, propertyId: p.id }))}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl border-2 text-left transition-all ${form.propertyId === p.id ? 'border-[#1A5C3A] bg-[#EEF7F2]' : 'border-[#D8E4DC] hover:border-[#1A5C3A]/40'}`}
                  >
                    <span className="text-2xl">🏠</span>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-[#111A14]">{p.name}</div>
                      {p.gps && <div className="text-[10px] text-[#6B7E72]">Ghana Post GPS: {p.gps}</div>}
                    </div>
                    {form.propertyId === p.id && <span className="text-[#1A5C3A] font-bold text-lg">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111A14] mb-2 uppercase tracking-wider">
                Preferred Service Date <span className="font-normal text-[#6B7E72] normal-case">(we&apos;ll try to match)</span>
              </label>
              <input
                type="date"
                value={form.preferredDate}
                onChange={(e) => setForm((f) => ({ ...f, preferredDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 text-sm rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A] bg-white"
              />
            </div>

            {selectedPriority && (
              <div className="p-4 rounded-2xl border flex items-center gap-4" style={{ background: selectedPriority.bg, borderColor: selectedPriority.color + '30' }}>
                <span className="text-2xl">⏱</span>
                <div>
                  <div className="text-xs font-bold" style={{ color: selectedPriority.color }}>
                    {selectedPriority.label} — {selectedPriority.slaLabel} target
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: selectedPriority.color + 'AA' }}>
                    A technician assignment workflow is coming soon — for now this creates a tracked request.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'review' && (
          <div className="p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#111A14] mb-5">Review your request before submitting</h2>

            <div className="bg-[#F5F9F6] rounded-2xl divide-y divide-[#D8E4DC]">
              {[
                { label: 'Property', value: `${selectedProperty?.name}${selectedProperty?.gps ? ' · ' + selectedProperty.gps : ''}` },
                { label: 'Category', value: `${selectedCategory?.icon} ${selectedCategory?.label}` },
                { label: 'Priority', value: selectedPriority?.label || '', color: selectedPriority?.color },
                { label: 'Target', value: selectedPriority?.slaLabel || '' },
                { label: 'Issue', value: form.title },
                { label: 'Details', value: form.description },
                { label: 'Pref. Date', value: form.preferredDate || 'No preference' },
              ].map((row, i) => (
                <div key={i} className="flex gap-4 px-4 py-3">
                  <div className="text-[10px] font-semibold text-[#6B7E72] uppercase tracking-wider w-20 pt-0.5 flex-shrink-0">{row.label}</div>
                  <div className="text-xs font-medium text-[#111A14] flex-1" style={row.color ? { color: row.color, fontWeight: 700 } : {}}>{row.value}</div>
                </div>
              ))}
            </div>

            {submitError && (
              <div className="p-3 rounded-xl bg-[#FDECEA] border border-[#FAD4D0] text-xs font-semibold text-[#D94F3D]">
                ⚠ {submitError}
              </div>
            )}
          </div>
        )}

        {step === 'success' && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-[#EEF7F2] text-4xl flex items-center justify-center mx-auto mb-6">✅</div>
            <h2 className="text-2xl font-serif font-bold text-[#0F3D26] mb-2">Request Submitted!</h2>
            <p className="text-xs text-[#6B7E72] mb-6">Your maintenance request has been logged.</p>

            <div className="bg-[#F5F9F6] rounded-2xl p-6 mb-6 inline-block">
              <div className="text-[10px] text-[#6B7E72] uppercase tracking-wider mb-1">Reference Number</div>
              <div className="text-2xl font-mono font-bold text-[#0F3D26]">{refNumber}</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push('/dashboard/owner/maintenance')}
                className="px-6 py-3 rounded-full bg-[#0F3D26] text-white text-xs font-semibold hover:bg-[#1A5C3A] transition-all"
              >
                View All Requests →
              </button>
            </div>
          </div>
        )}

        {step !== 'success' && (
          <div className="px-6 py-5 border-t border-[#D8E4DC] flex items-center justify-between">
            {step !== 'details' ? (
              <button onClick={back} className="px-5 py-2.5 rounded-full border border-[#D8E4DC] text-xs font-semibold text-[#6B7E72] hover:bg-[#F5F9F6] transition-all">
                ← Back
              </button>
            ) : <div />}

            {step === 'review' ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 rounded-full bg-[#E87722] hover:bg-[#B85A10] disabled:opacity-60 text-white text-xs font-semibold transition-all shadow-md flex items-center gap-2"
              >
                {submitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {submitting ? 'Submitting…' : 'Submit Request →'}
              </button>
            ) : (
              <button onClick={next} className="px-8 py-3 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-xs font-semibold transition-all shadow-md">
                Continue →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
