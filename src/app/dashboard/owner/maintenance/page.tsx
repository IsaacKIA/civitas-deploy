'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

type Category = 'electrical' | 'plumbing' | 'hvac' | 'structural' | 'solar' | 'cleaning' | 'smart_home' | 'general';
type Priority = 'emergency' | 'urgent' | 'standard' | 'low';
type Step = 'details' | 'location' | 'review' | 'success';

const CATEGORIES: { id: Category; label: string; icon: string; description: string }[] = [
  { id: 'electrical', label: 'Electrical',   icon: '⚡', description: 'Power, wiring, sockets, lights' },
  { id: 'plumbing',   label: 'Plumbing',     icon: '🚿', description: 'Pipes, taps, drainage, water' },
  { id: 'hvac',       label: 'HVAC / AC',    icon: '❄️', description: 'Air conditioning, ventilation' },
  { id: 'structural', label: 'Structural',   icon: '🏗️', description: 'Walls, roof, doors, windows' },
  { id: 'solar',      label: 'Solar / IoT',  icon: '☀️', description: 'Panels, inverter, battery, smart devices' },
  { id: 'cleaning',   label: 'Cleaning',     icon: '🧹', description: 'Deep cleaning, fumigation, waste' },
  { id: 'smart_home', label: 'Smart Home',   icon: '🏠', description: 'Security cameras, locks, automation' },
  { id: 'general',    label: 'General',      icon: '🔧', description: 'Other maintenance needs' },
];

const PRIORITIES: { id: Priority; label: string; desc: string; sla: string; color: string; bg: string }[] = [
  { id: 'emergency', label: '🚨 Emergency', desc: 'Safety risk / flooding / no power', sla: '2-hour response', color: '#D94F3D', bg: '#FDECEA' },
  { id: 'urgent',    label: '⚠️ Urgent',    desc: 'Severely affecting daily life',     sla: '24-hour response', color: '#D97706', bg: '#FEF3C7' },
  { id: 'standard',  label: '🔵 Standard',  desc: 'Important but not time-critical',   sla: '72-hour response', color: '#2563EB', bg: '#EFF6FF' },
  { id: 'low',       label: '⬇️ Low',       desc: 'Minor inconvenience, can wait',     sla: '7-day response',   color: '#6B7E72', bg: '#F5F9F6' },
];

const PROPERTIES = [
  { id: 'P001', name: 'East Legon Villa',     gps: 'GA-183-9021' },
  { id: 'P002', name: 'Airport Res. Apt 3B',  gps: 'GA-445-1130' },
  { id: 'P003', name: 'Tema Harbour Studio',  gps: 'GT-001-4567' },
];

interface FormState {
  category: Category | '';
  priority: Priority | '';
  title: string;
  description: string;
  propertyId: string;
  preferredDate: string;
  hasPhoto: boolean;
}

const STEPS: Step[] = ['details', 'location', 'review', 'success'];
const STEP_LABELS = ['Issue Details', 'Property & Timing', 'Review & Submit'];

export default function MaintenanceNewPage() {
  const [step, setStep] = useState<Step>('details');
  const [submitting, setSubmitting] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [form, setForm] = useState<FormState>({
    category: '', priority: '', title: '', description: '',
    propertyId: 'P001', preferredDate: '', hasPhoto: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const stepIdx = STEPS.indexOf(step);
  const selectedCategory = CATEGORIES.find(c => c.id === form.category);
  const selectedPriority = PRIORITIES.find(p => p.id === form.priority);
  const selectedProperty = PROPERTIES.find(p => p.id === form.propertyId);

  const validateStep1 = () => {
    const e: typeof errors = {};
    if (!form.category)    e.category    = 'Select a category';
    if (!form.priority)    e.priority    = 'Select a priority level';
    if (!form.title.trim()) e.title      = 'Describe the issue briefly';
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
    await new Promise(r => setTimeout(r, 1500));
    const ref = `MR-2025-${String(Math.floor(1000 + Math.random() * 9000))}`;
    setRefNumber(ref);
    setStep('success');
    setSubmitting(false);
  };

  const urgencyPriority = PRIORITIES.find(p => p.id === form.priority);

  return (
    <DashboardLayout role="owner" userName="Property Owner">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => window.history.back()}
            className="w-9 h-9 rounded-xl border border-[#D8E4DC] flex items-center justify-center text-[#6B7E72] hover:bg-[#F5F9F6] transition-all">
            ←
          </button>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">New Maintenance Request</h1>
            <p className="text-xs text-[#6B7E72] mt-0.5">Log an issue — our team responds within your SLA window</p>
          </div>
        </div>

        {/* Progress Steps */}
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

          {/* STEP 1: Issue Details */}
          {step === 'details' && (
            <div className="p-6 space-y-6">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-[#111A14] mb-3 uppercase tracking-wider">
                  Issue Category {errors.category && <span className="text-[#D94F3D] normal-case font-normal ml-2">— {errors.category}</span>}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat.id} type="button" onClick={() => { setForm(f => ({...f, category: cat.id})); setErrors(e => ({...e, category: ''})); }}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 text-center transition-all ${form.category === cat.id ? 'border-[#1A5C3A] bg-[#EEF7F2]' : 'border-[#D8E4DC] hover:border-[#1A5C3A]/40'}`}>
                      <span className="text-xl mb-1">{cat.icon}</span>
                      <span className="text-[11px] font-semibold text-[#111A14]">{cat.label}</span>
                      <span className="text-[9px] text-[#6B7E72] mt-0.5 leading-tight">{cat.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-bold text-[#111A14] mb-3 uppercase tracking-wider">
                  Priority Level {errors.priority && <span className="text-[#D94F3D] normal-case font-normal ml-2">— {errors.priority}</span>}
                </label>
                <div className="space-y-2">
                  {PRIORITIES.map(p => (
                    <button key={p.id} type="button" onClick={() => { setForm(f => ({...f, priority: p.id})); setErrors(e => ({...e, priority: ''})); }}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${form.priority === p.id ? 'border-[#1A5C3A] bg-[#EEF7F2]' : 'border-[#D8E4DC] hover:border-[#1A5C3A]/40'}`}>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-[#111A14]">{p.label}</div>
                        <div className="text-[10px] text-[#6B7E72]">{p.desc}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: p.bg, color: p.color }}>{p.sla}</span>
                      {form.priority === p.id && <span className="text-[#1A5C3A] font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-[#111A14] mb-2 uppercase tracking-wider">Issue Title</label>
                <input type="text" value={form.title} onChange={e => { setForm(f => ({...f, title: e.target.value})); setErrors(e2 => ({...e2, title: ''})); }}
                  placeholder="e.g. Bathroom tap leaking badly"
                  className={`w-full px-4 py-3 text-sm rounded-xl border outline-none transition-all ${errors.title ? 'border-[#D94F3D] bg-[#FDECEA]' : 'border-[#D8E4DC] focus:border-[#1A5C3A]'}`} />
                {errors.title && <p className="text-[10px] text-[#D94F3D] mt-1">⚠ {errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#111A14] mb-2 uppercase tracking-wider">Detailed Description</label>
                <textarea rows={4} value={form.description} onChange={e => { setForm(f => ({...f, description: e.target.value})); setErrors(e2 => ({...e2, description: ''})); }}
                  placeholder="Describe when it started, how severe it is, and any other relevant details..."
                  className={`w-full px-4 py-3 text-sm rounded-xl border outline-none transition-all resize-none ${errors.description ? 'border-[#D94F3D] bg-[#FDECEA]' : 'border-[#D8E4DC] focus:border-[#1A5C3A]'}`} />
                {errors.description && <p className="text-[10px] text-[#D94F3D] mt-1">⚠ {errors.description}</p>}
              </div>

              {/* Photo Upload (UI) */}
              <div>
                <label className="block text-xs font-bold text-[#111A14] mb-2 uppercase tracking-wider">Photo / Video Evidence <span className="font-normal text-[#6B7E72] normal-case">(optional — helps speed up diagnosis)</span></label>
                <button type="button" onClick={() => setForm(f => ({...f, hasPhoto: !f.hasPhoto}))}
                  className={`w-full py-6 rounded-xl border-2 border-dashed flex flex-col items-center gap-2 transition-all ${form.hasPhoto ? 'border-[#1A5C3A] bg-[#EEF7F2]' : 'border-[#D8E4DC] hover:border-[#1A5C3A]/40'}`}>
                  <span className="text-2xl">{form.hasPhoto ? '✅' : '📷'}</span>
                  <span className="text-xs text-[#6B7E72]">{form.hasPhoto ? 'Photo attached (simulated)' : 'Click to attach photo or video'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Property & Timing */}
          {step === 'location' && (
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#111A14] mb-3 uppercase tracking-wider">Which Property?</label>
                <div className="space-y-2">
                  {PROPERTIES.map(p => (
                    <button key={p.id} type="button" onClick={() => setForm(f => ({...f, propertyId: p.id}))}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl border-2 text-left transition-all ${form.propertyId === p.id ? 'border-[#1A5C3A] bg-[#EEF7F2]' : 'border-[#D8E4DC] hover:border-[#1A5C3A]/40'}`}>
                      <span className="text-2xl">🏠</span>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-[#111A14]">{p.name}</div>
                        <div className="text-[10px] text-[#6B7E72]">Ghana Post GPS: {p.gps}</div>
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
                <input type="date" value={form.preferredDate} onChange={e => setForm(f => ({...f, preferredDate: e.target.value}))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A] bg-white" />
              </div>

              {/* SLA Banner */}
              {selectedPriority && (
                <div className="p-4 rounded-2xl border flex items-center gap-4" style={{ background: urgencyPriority?.bg, borderColor: urgencyPriority?.color + '30' }}>
                  <span className="text-2xl">⏱</span>
                  <div>
                    <div className="text-xs font-bold" style={{ color: urgencyPriority?.color }}>
                      {selectedPriority.label} — {selectedPriority.sla} guaranteed
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: urgencyPriority?.color + 'AA' }}>
                      Technician dispatched from nearest Civitas hub once request is confirmed
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Review */}
          {step === 'review' && (
            <div className="p-6 space-y-4">
              <h2 className="text-sm font-bold text-[#111A14] mb-5">Review your request before submitting</h2>

              <div className="bg-[#F5F9F6] rounded-2xl divide-y divide-[#D8E4DC]">
                {[
                  { label: 'Property',    value: `${selectedProperty?.name} · ${selectedProperty?.gps}` },
                  { label: 'Category',    value: `${selectedCategory?.icon} ${selectedCategory?.label}` },
                  { label: 'Priority',    value: selectedPriority?.label || '', color: urgencyPriority?.color },
                  { label: 'SLA',         value: selectedPriority?.sla || '' },
                  { label: 'Issue',       value: form.title },
                  { label: 'Details',     value: form.description },
                  { label: 'Pref. Date',  value: form.preferredDate || 'No preference' },
                  { label: 'Photo',       value: form.hasPhoto ? '📎 1 file attached' : 'No photo' },
                ].map((row, i) => (
                  <div key={i} className="flex gap-4 px-4 py-3">
                    <div className="text-[10px] font-semibold text-[#6B7E72] uppercase tracking-wider w-20 pt-0.5 flex-shrink-0">{row.label}</div>
                    <div className="text-xs font-medium text-[#111A14] flex-1" style={ row.color ? { color: row.color, fontWeight: 700 } : {}}>{row.value}</div>
                  </div>
                ))}
              </div>

              <div className="pt-2 px-4 py-4 bg-[#EEF7F2] rounded-2xl text-xs text-[#1A5C3A] font-medium">
                🔔 You&apos;ll receive an SMS + email confirmation with your reference number and assigned technician details.
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {step === 'success' && (
            <div className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-[#EEF7F2] text-4xl flex items-center justify-center mx-auto mb-6">✅</div>
              <h2 className="text-2xl font-serif font-bold text-[#0F3D26] mb-2">Request Submitted!</h2>
              <p className="text-xs text-[#6B7E72] mb-6">
                Your maintenance request has been logged and a technician will be dispatched shortly.
              </p>

              <div className="bg-[#F5F9F6] rounded-2xl p-6 mb-6 inline-block">
                <div className="text-[10px] text-[#6B7E72] uppercase tracking-wider mb-1">Reference Number</div>
                <div className="text-2xl font-mono font-bold text-[#0F3D26]">{refNumber}</div>
                <div className="text-xs text-[#6B7E72] mt-2">
                  SLA Guarantee: <span className="font-bold" style={{ color: urgencyPriority?.color }}>{selectedPriority?.sla}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => { setStep('details'); setForm({ category: '', priority: '', title: '', description: '', propertyId: 'P001', preferredDate: '', hasPhoto: false }); setRefNumber(''); }}
                  className="px-6 py-3 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-xs font-semibold hover:bg-[#D6EDE1] transition-all">
                  Submit Another Request
                </button>
                <button onClick={() => window.history.back()}
                  className="px-6 py-3 rounded-full bg-[#0F3D26] text-white text-xs font-semibold hover:bg-[#1A5C3A] transition-all">
                  Back to Dashboard →
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {step !== 'success' && (
            <div className="px-6 py-5 border-t border-[#D8E4DC] flex items-center justify-between">
              {step !== 'details' ? (
                <button onClick={back} className="px-5 py-2.5 rounded-full border border-[#D8E4DC] text-xs font-semibold text-[#6B7E72] hover:bg-[#F5F9F6] transition-all">
                  ← Back
                </button>
              ) : <div />}

              {step === 'review' ? (
                <button onClick={handleSubmit} disabled={submitting}
                  className="px-8 py-3 rounded-full bg-[#E87722] hover:bg-[#B85A10] disabled:opacity-60 text-white text-xs font-semibold transition-all shadow-md flex items-center gap-2">
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
    </DashboardLayout>
  );
}
