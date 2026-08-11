'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type PropertyType = 'residential' | 'commercial' | 'mixed_use' | 'industrial';
type Step = 'details' | 'location' | 'solar' | 'legal' | 'success';

interface PropertyForm {
  name: string;
  propertyType: PropertyType;
  units: number;
  bedrooms: number;
  bathrooms: number;
  monthlyRent: number;
  ghanaPostGps: string;
  address: string;
  city: string;
  region: string;
  hasSolar: boolean;
  solarCapacityKwp: number;
  hasBatteryBackup: boolean;
  ghanaCardId: string;
  landTitleRef: string;
  agreedToTerms: boolean;
}

const REGIONS = [
  'Greater Accra',
  'Central Region',
  'Ashanti Region',
  'Northern Region',
  'Western Region',
  'Volta Region',
  'Eastern Region'
];

export default function NewPropertyOnboardingPage() {
  const [step, setStep] = useState<Step>('details');
  const [submitting, setSubmitting] = useState(false);
  const [userName, setUserName] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle();
      if (!cancelled && profile?.full_name) setUserName(profile.full_name);
    })();
    return () => { cancelled = true; };
  }, []);
  const [propertyCode, setPropertyCode] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [form, setForm] = useState<PropertyForm>({
    name: '',
    propertyType: 'residential',
    units: 1,
    bedrooms: 3,
    bathrooms: 2,
    monthlyRent: 3500,
    ghanaPostGps: '',
    address: '',
    city: '',
    region: 'Greater Accra',
    hasSolar: true,
    solarCapacityKwp: 5.5,
    hasBatteryBackup: true,
    ghanaCardId: '',
    landTitleRef: '',
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateDetails = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Property name is required';
    if (form.monthlyRent <= 0) errs.monthlyRent = 'Monthly rent must be greater than 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateLocation = () => {
    const errs: Record<string, string> = {};
    if (!form.ghanaPostGps.trim()) errs.ghanaPostGps = 'Ghana Post Digital Address is required (e.g. GA-183-9021)';
    if (!form.address.trim()) errs.address = 'Street address is required';
    if (!form.city.trim()) errs.city = 'Town / city is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateLegal = () => {
    const errs: Record<string, string> = {};
    if (!form.ghanaCardId.trim()) errs.ghanaCardId = 'Ghana Card PIN is required (e.g. GHA-720194810-2)';
    if (!form.agreedToTerms) errs.agreedToTerms = 'You must accept the Civitas Management Agreement';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 'details' && !validateDetails()) return;
    if (step === 'location' && !validateLocation()) return;
    if (step === 'details') setStep('location');
    else if (step === 'location') setStep('solar');
    else if (step === 'solar') setStep('legal');
  };

  const handleBack = () => {
    if (step === 'location') setStep('details');
    else if (step === 'solar') setStep('location');
    else if (step === 'legal') setStep('solar');
  };

  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLegal()) return;
    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setSubmitError(data.error ?? 'Failed to register property. Please try again.');
        return;
      }

      setPropertyCode(data.propertyCode);
      setPropertyId(data.propertyId);
      setStep('success');
    } catch {
      setSubmitError('Network error — check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="owner" userName={userName}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/owner" className="w-9 h-9 rounded-xl border border-[#D8E4DC] flex items-center justify-center text-[#6B7E72] hover:bg-[#F5F9F6] transition-all">
            ←
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Property Onboarding Wizard</h1>
            <p className="text-xs text-[#6B7E72] mt-0.5">Register a new property for digital lease management, solar telemetry & 24/7 SLA dispatch</p>
          </div>
        </div>

        {/* Wizard Steps */}
        {step !== 'success' && (
          <div className="grid grid-cols-4 gap-2 mb-8 text-center text-xs font-semibold">
            {[
              { id: 'details', label: '1. Details' },
              { id: 'location', label: '2. Location & GPS' },
              { id: 'solar', label: '3. Solar & IoT' },
              { id: 'legal', label: '4. Title & Terms' },
            ].map(s => {
              const active = step === s.id;
              return (
                <div key={s.id} className={`py-2.5 rounded-xl border transition-all ${active ? 'bg-[#1A5C3A] text-white border-[#1A5C3A] shadow-sm' : 'bg-white text-[#6B7E72] border-[#D8E4DC]'}`}>
                  {s.label}
                </div>
              );
            })}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-[#D8E4DC] p-8 shadow-sm">
          {/* STEP 1: DETAILS */}
          {step === 'details' && (
            <div className="space-y-6">
              <h2 className="text-lg font-serif font-bold text-[#0F3D26] border-b border-[#D8E4DC] pb-3">Step 1: Property Specifications</h2>

              <div>
                <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Property Name / Title</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Cantonments Luxury Residence"
                  className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
                />
                {errors.name && <p className="text-[10px] text-[#D94F3D] mt-1">⚠ {errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Property Category</label>
                  <select
                    value={form.propertyType}
                    onChange={e => setForm({ ...form, propertyType: e.target.value as PropertyType })}
                    className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] bg-white outline-none focus:border-[#1A5C3A]"
                  >
                    <option value="residential">Residential Villa / Apartment</option>
                    <option value="commercial">Commercial Office Space</option>
                    <option value="mixed_use">Mixed-Use Complex</option>
                    <option value="industrial">Industrial Warehouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Expected Monthly Rent (GHS)</label>
                  <input
                    type="number"
                    value={form.monthlyRent}
                    onChange={e => setForm({ ...form, monthlyRent: Number(e.target.value) })}
                    className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
                  />
                  {errors.monthlyRent && <p className="text-[10px] text-[#D94F3D] mt-1">⚠ {errors.monthlyRent}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Bedrooms</label>
                  <input
                    type="number"
                    value={form.bedrooms}
                    onChange={e => setForm({ ...form, bedrooms: Number(e.target.value) })}
                    className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Bathrooms</label>
                  <input
                    type="number"
                    value={form.bathrooms}
                    onChange={e => setForm({ ...form, bathrooms: Number(e.target.value) })}
                    className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Total Units</label>
                  <input
                    type="number"
                    value={form.units}
                    onChange={e => setForm({ ...form, units: Number(e.target.value) })}
                    className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button onClick={handleNext} className="px-6 py-3 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-xs font-semibold transition-all">
                  Next: Location & GPS →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 'location' && (
            <div className="space-y-6">
              <h2 className="text-lg font-serif font-bold text-[#0F3D26] border-b border-[#D8E4DC] pb-3">Step 2: Location & Ghana Post GPS</h2>

              <div>
                <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Ghana Post Digital Address (GPS)</label>
                <input
                  type="text"
                  value={form.ghanaPostGps}
                  onChange={e => setForm({ ...form, ghanaPostGps: e.target.value.toUpperCase() })}
                  placeholder="e.g. GA-183-9021"
                  className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A] font-mono tracking-wider"
                />
                <p className="text-[10px] text-[#6B7E72] mt-1">Validated against Ghana Post Digital Address Database.</p>
                {errors.ghanaPostGps && <p className="text-[10px] text-[#D94F3D] mt-1">⚠ {errors.ghanaPostGps}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Region</label>
                  <select
                    value={form.region}
                    onChange={e => setForm({ ...form, region: e.target.value })}
                    className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] bg-white outline-none focus:border-[#1A5C3A]"
                  >
                    {REGIONS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Physical Street Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    placeholder="e.g. 14 Ring Road East, Cantonments"
                    className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
                  />
                  {errors.address && <p className="text-[10px] text-[#D94F3D] mt-1">⚠ {errors.address}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Town / City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  placeholder="e.g. Accra"
                  className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
                />
                {errors.city && <p className="text-[10px] text-[#D94F3D] mt-1">⚠ {errors.city}</p>}
              </div>

              <div className="pt-4 flex justify-between">
                <button onClick={handleBack} className="px-6 py-3 rounded-full border border-[#D8E4DC] text-xs font-semibold text-[#6B7E72]">
                  ← Back
                </button>
                <button onClick={handleNext} className="px-6 py-3 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-xs font-semibold transition-all">
                  Next: Solar & IoT →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SOLAR & IOT */}
          {step === 'solar' && (
            <div className="space-y-6">
              <h2 className="text-lg font-serif font-bold text-[#0F3D26] border-b border-[#D8E4DC] pb-3">Step 3: Renewable Energy & Telemetry</h2>

              <div className="p-4 rounded-2xl bg-[#EEF7F2] border border-[#D6EDE1]">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.hasSolar}
                    onChange={e => setForm({ ...form, hasSolar: e.target.checked })}
                    className="w-4 h-4 accent-[#1A5C3A]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#0F3D26]">This property has Solar Panels / Battery Storage</div>
                    <div className="text-[10px] text-[#6B7E72]">Enables 85% bill reduction calculation & telemetry dashboard.</div>
                  </div>
                </label>
              </div>

              {form.hasSolar && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#111A14] mb-1.5">System Capacity (kWp)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={form.solarCapacityKwp}
                      onChange={e => setForm({ ...form, solarCapacityKwp: Number(e.target.value) })}
                      className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#111A14]">
                      <input
                        type="checkbox"
                        checked={form.hasBatteryBackup}
                        onChange={e => setForm({ ...form, hasBatteryBackup: e.target.checked })}
                        className="w-4 h-4 accent-[#1A5C3A]"
                      />
                      Includes Hybrid Lithium Battery Storage
                    </label>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button onClick={handleBack} className="px-6 py-3 rounded-full border border-[#D8E4DC] text-xs font-semibold text-[#6B7E72]">
                  ← Back
                </button>
                <button onClick={handleNext} className="px-6 py-3 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-xs font-semibold transition-all">
                  Next: Legal & Terms →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: LEGAL & TERMS */}
          {step === 'legal' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-lg font-serif font-bold text-[#0F3D26] border-b border-[#D8E4DC] pb-3">Step 4: Title Verification & Agreement</h2>

              <div>
                <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Ghana Card PIN Number</label>
                <input
                  type="text"
                  value={form.ghanaCardId}
                  onChange={e => setForm({ ...form, ghanaCardId: e.target.value.toUpperCase() })}
                  placeholder="e.g. GHA-720194810-2"
                  className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A] font-mono"
                />
                {errors.ghanaCardId && <p className="text-[10px] text-[#D94F3D] mt-1">⚠ {errors.ghanaCardId}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Land Title / Indenture Registration Ref (Optional)</label>
                <input
                  type="text"
                  value={form.landTitleRef}
                  onChange={e => setForm({ ...form, landTitleRef: e.target.value })}
                  placeholder="e.g. LC-ACC-2024-8849"
                  className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F9F6] border border-[#D8E4DC]">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agreedToTerms}
                    onChange={e => setForm({ ...form, agreedToTerms: e.target.checked })}
                    className="w-4 h-4 mt-0.5 accent-[#1A5C3A]"
                  />
                  <div className="text-xs text-[#6B7E72] leading-relaxed">
                    I confirm that I am the authorized owner or manager of this property and agree to Civitas Estate Management terms, including 24/7 SLA maintenance dispatch and Rent Act 220 escrow provisions.
                  </div>
                </label>
                {errors.agreedToTerms && <p className="text-[10px] text-[#D94F3D] mt-2">⚠ {errors.agreedToTerms}</p>}
              </div>

              {submitError && (
                <div className="p-3 rounded-xl bg-[#FDECEA] border border-[#FAD4D0] text-xs font-semibold text-[#D94F3D]">
                  ⚠ {submitError}
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button type="button" onClick={handleBack} className="px-6 py-3 rounded-full border border-[#D8E4DC] text-xs font-semibold text-[#6B7E72]">
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-full bg-[#E87722] hover:bg-[#B85A10] text-white text-xs font-semibold transition-all shadow-md flex items-center gap-2"
                >
                  {submitting && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {submitting ? 'Registering Property…' : 'Complete Registration →'}
                </button>
              </div>
            </form>
          )}

          {/* SUCCESS STATE */}
          {step === 'success' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-3xl flex items-center justify-center mx-auto mb-4">🏠</div>
              <h2 className="text-2xl font-serif font-bold text-[#0F3D26] mb-2">Property Onboarded!</h2>
              <p className="text-xs text-[#6B7E72] mb-6">
                <strong className="text-[#111A14]">{form.name}</strong> is now live on Civitas PropTech with code <span className="font-mono font-bold text-[#1A5C3A]">{propertyCode}</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`/dashboard/owner/leases/new?propertyId=${propertyId}`}
                  className="px-6 py-3 rounded-full bg-[#E87722] hover:bg-[#B85A10] text-white text-xs font-semibold transition-all shadow-md"
                >
                  Create a Lease for This Property →
                </Link>
                <Link
                  href="/dashboard/owner/properties"
                  className="px-6 py-3 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-xs font-semibold transition-all shadow-md"
                >
                  View All Properties
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
