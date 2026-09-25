'use client';

import React, { useState } from 'react';

export interface ScheduledService {
  id: string;
  propertyId: string;
  propertyName: string;
  assetType: string;
  assetName: string;
  frequency: 'monthly' | 'bimonthly' | 'quarterly' | 'semiannual' | 'annual';
  nextDueDate: string;
  preferredTime: string;
  status: 'active' | 'paused';
  technicianTrade: string;
  notes?: string;
}

interface PropertyOption {
  id: string;
  name: string;
  address?: string;
}

interface MaintenanceSchedulerProps {
  properties: PropertyOption[];
  initialSchedules?: ScheduledService[];
  onScheduleCreated?: (schedule: ScheduledService) => void;
  accentColor?: string;
}

const ASSET_TYPES = [
  { id: 'generator', label: '⚡ Diesel Generator & ATS', trade: 'Diesel Engineering', defaultFreq: 'monthly' as const },
  { id: 'hvac', label: '❄️ Air Conditioners & HVAC', trade: 'HVAC Specialists', defaultFreq: 'bimonthly' as const },
  { id: 'plumbing', label: '💧 Borehole Pump, Polytank & Booster', trade: 'Plumbing & Water Systems', defaultFreq: 'quarterly' as const },
  { id: 'solar', label: '☀️ Solar Panels & Battery Inverters', trade: 'Solar Energy Techs', defaultFreq: 'quarterly' as const },
  { id: 'electrical', label: '🔌 Distribution Boards & Surge Protection', trade: 'Certified Electricians', defaultFreq: 'semiannual' as const },
  { id: 'fumigation', label: '🛡️ Pest Control & Fumigation', trade: 'Environmental Health', defaultFreq: 'quarterly' as const },
  { id: 'deep_clean', label: '🧹 Commercial Deep Cleaning & Façade', trade: 'Facility Cleaning Crew', defaultFreq: 'monthly' as const },
];

const FREQUENCIES = [
  { id: 'monthly', label: 'Monthly', days: 30 },
  { id: 'bimonthly', label: 'Every 2 Months (Bi-monthly)', days: 60 },
  { id: 'quarterly', label: 'Quarterly (Every 3 months)', days: 90 },
  { id: 'semiannual', label: 'Semi-Annually (Every 6 months)', days: 180 },
  { id: 'annual', label: 'Annually (Once a year)', days: 365 },
];

export default function MaintenanceScheduler({
  properties,
  initialSchedules = [],
  onScheduleCreated,
  accentColor = '#0F3D26',
}: MaintenanceSchedulerProps) {
  const [schedules, setSchedules] = useState<ScheduledService[]>(initialSchedules);
  const [isOpen, setIsOpen] = useState(false);
  const [propertyId, setPropertyId] = useState(properties[0]?.id || '');
  const [assetType, setAssetType] = useState('generator');
  const [customAssetName, setCustomAssetName] = useState('');
  const [frequency, setFrequency] = useState<'monthly' | 'bimonthly' | 'quarterly' | 'semiannual' | 'annual'>('monthly');
  const [preferredTime, setPreferredTime] = useState('Saturday Morning (09:00 - 12:00)');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const calculateNextDate = (freq: string): string => {
    const days = FREQUENCIES.find((f) => f.id === freq)?.days || 30;
    const target = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    return target.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const assetObj = ASSET_TYPES.find((a) => a.id === assetType);
    const propObj = properties.find((p) => p.id === propertyId);
    const resolvedName = customAssetName.trim() || assetObj?.label.replace(/^[^\s]+\s/, '') || 'Equipment';

    const newSchedule: ScheduledService = {
      id: `sched-${Date.now()}`,
      propertyId,
      propertyName: propObj?.name || 'Selected Property',
      assetType,
      assetName: resolvedName,
      frequency,
      nextDueDate: calculateNextDate(frequency),
      preferredTime,
      status: 'active',
      technicianTrade: assetObj?.trade || 'Civitas Multi-Skilled Technician',
      notes,
    };

    setTimeout(() => {
      setSchedules([newSchedule, ...schedules]);
      if (onScheduleCreated) onScheduleCreated(newSchedule);
      setSaving(false);
      setSuccessMsg(`Preventive schedule activated for ${newSchedule.assetName}!`);
      setTimeout(() => {
        setSuccessMsg('');
        setIsOpen(false);
        setCustomAssetName('');
        setNotes('');
      }, 1500);
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-[#111A14]">Preventive Servicing Routines</h2>
          <p className="text-xs text-[#6B7E72] mt-0.5">
            Automated servicing appointments to prevent emergency shutdowns and equipment failure
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-5 py-2.5 rounded-full text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2 hover:opacity-95"
          style={{ backgroundColor: accentColor }}
        >
          + Schedule Recurring Routine
        </button>
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#D8E4DC] shadow-2xl max-w-lg w-full p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-[#D8E4DC]">
              <div>
                <h3 className="text-base font-serif font-bold text-[#111A14]">Schedule Preventive Routine</h3>
                <p className="text-[11px] text-[#6B7E72] mt-0.5">Dispatches vetted Civitas engineers automatically</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F5F9F6] text-[#6B7E72] hover:text-[#111A14] flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {successMsg ? (
              <div className="py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-[#D6EDE1] text-[#0F3D26] text-2xl flex items-center justify-center mx-auto mb-3">
                  ✓
                </div>
                <h4 className="text-sm font-bold text-[#0F3D26]">{successMsg}</h4>
                <p className="text-xs text-[#6B7E72] mt-1">Calendar invitations and SMS alerts will be dispatched.</p>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-4 pt-4">
                {/* Property selector */}
                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1">Target Property / Facility</label>
                  <select
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8E4DC] text-xs outline-none focus:border-[#1A5C3A] bg-white"
                  >
                    {properties.length === 0 ? (
                      <option value="">Default Premises</option>
                    ) : (
                      properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} {p.address ? `(${p.address})` : ''}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Equipment Type */}
                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1">Equipment / System</label>
                  <select
                    value={assetType}
                    onChange={(e) => {
                      setAssetType(e.target.value);
                      const sel = ASSET_TYPES.find((a) => a.id === e.target.value);
                      if (sel) setFrequency(sel.defaultFreq);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8E4DC] text-xs outline-none focus:border-[#1A5C3A] bg-white"
                  >
                    {ASSET_TYPES.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specific Equipment Name / Model (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1">
                    Equipment Model / Specific Label <span className="text-[#6B7E72] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={customAssetName}
                    onChange={(e) => setCustomAssetName(e.target.value)}
                    placeholder="e.g. 50kVA Perkins Gen 2, Server Room AC, Rooftop Polytank"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8E4DC] text-xs outline-none focus:border-[#1A5C3A]"
                  />
                </div>

                {/* Servicing Frequency */}
                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1">Servicing Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8E4DC] text-xs outline-none focus:border-[#1A5C3A] bg-white"
                  >
                    {FREQUENCIES.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Window */}
                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1">Preferred Time Window</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8E4DC] text-xs outline-none focus:border-[#1A5C3A] bg-white"
                  >
                    <option>Saturday Morning (09:00 - 12:00)</option>
                    <option>Saturday Afternoon (13:00 - 16:00)</option>
                    <option>Weekday Morning (08:00 - 11:00)</option>
                    <option>Weekday Evening / After-Hours (17:30 - 20:30)</option>
                    <option>Sunday Anytime</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1">Access Notes / Gate Instructions</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Security guard has key to gen house; call manager 30 mins ahead."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8E4DC] text-xs outline-none focus:border-[#1A5C3A]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#D8E4DC] text-xs font-semibold text-[#6B7E72] hover:bg-[#F5F9F6]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl text-white text-xs font-semibold shadow-sm transition-all hover:opacity-95 disabled:opacity-50"
                    style={{ backgroundColor: accentColor }}
                  >
                    {saving ? 'Activating Routine...' : 'Confirm & Activate Routine'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Routine Cards Grid */}
      {schedules.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#D8E4DC] p-10 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF7F2] text-[#0F3D26] text-2xl flex items-center justify-center mx-auto mb-3">
            📅
          </div>
          <h3 className="text-sm font-bold text-[#111A14] mb-1">No preventive routines active</h3>
          <p className="text-xs text-[#6B7E72] max-w-sm mx-auto mb-4">
            Prevent costly breakdowns by scheduling automated maintenance for your generator, ACs, water pumps, or solar system.
          </p>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-5 py-2 rounded-full text-white text-xs font-semibold transition-all hover:opacity-95"
            style={{ backgroundColor: accentColor }}
          >
            Schedule Your First Routine →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedules.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-[#D8E4DC] p-5 shadow-sm hover:border-[#0F3D26]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="text-xs font-bold text-[#111A14]">{s.assetName}</h4>
                    <p className="text-[11px] text-[#6B7E72]">{s.propertyName}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#D6EDE1] text-[#0F3D26] capitalize">
                    {s.frequency}
                  </span>
                </div>

                <div className="space-y-1.5 my-3 pt-3 border-t border-[#D8E4DC] text-xs text-[#3D5044]">
                  <div className="flex justify-between">
                    <span className="text-[#6B7E72]">Next Due Date:</span>
                    <strong className="text-[#0F3D26]">{s.nextDueDate}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7E72]">Technician Trade:</span>
                    <span>{s.technicianTrade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7E72]">Service Window:</span>
                    <span className="text-[11px] text-right">{s.preferredTime}</span>
                  </div>
                  {s.notes && (
                    <div className="text-[11px] text-[#6B7E72] bg-[#F5F9F6] p-2 rounded-lg mt-2">
                      📝 {s.notes}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#D8E4DC] text-xs">
                <span className="text-[10px] text-[#1A5C3A] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A5C3A] animate-pulse" /> Civitas Guaranteed
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSchedules(schedules.filter((x) => x.id !== s.id));
                  }}
                  className="text-[11px] text-[#D94F3D] hover:underline"
                >
                  Cancel Routine
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
