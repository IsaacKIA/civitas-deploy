'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

const PAYMENT_METHODS = [
  { id: 'mtn',      label: 'MTN Mobile Money',   icon: '📱', color: '#FFCC00', textColor: '#111A14' },
  { id: 'telecel',  label: 'Telecel Cash',        icon: '📲', color: '#E87722', textColor: '#fff' },
  { id: 'card',     label: 'Card (Paystack)',      icon: '💳', color: '#2563EB', textColor: '#fff' },
];

const maintenance = [
  { id: 'MR-0039', type: 'Leaking Tap', status: 'In Progress', priority: 'standard', date: 'Jul 22', tech: 'Kofi A.' },
  { id: 'MR-0031', type: 'Door Lock',   status: 'Completed',   priority: 'low',      date: 'Jul 14', tech: 'Abena M.' },
];

export default function TenantDashboard() {
  const [payStep, setPayStep] = useState<'idle' | 'method' | 'confirm' | 'success'>('idle');
  const [payMethod, setPayMethod] = useState(PAYMENT_METHODS[0]);
  const [momoNumber, setMomoNumber] = useState('');

  const rentDue = 3200;
  const daysUntilDue = 5;

  return (
    <DashboardLayout role="tenant" userName="Ama Owusu">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">My Home</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Airport Residential Apartment 3B · GA-445-1130</p>
        </div>
        <Link href="/dashboard/tenant/maintenance"
          className="px-5 py-2.5 rounded-full bg-[#E87722] hover:bg-[#B85A10] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2">
          + Log Issue
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rent Payment Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#D8E4DC] shadow-sm overflow-hidden">
          <div className="bg-[#0F3D26] p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-white/60 uppercase tracking-wider font-semibold">Monthly Rent Due</div>
                <div className="text-4xl font-serif font-bold mt-1">GHS {rentDue.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/60 uppercase tracking-wider font-semibold">Due In</div>
                <div className={`text-3xl font-serif font-bold mt-1 ${daysUntilDue <= 2 ? 'text-[#E87722]' : 'text-white'}`}>
                  {daysUntilDue}d
                </div>
              </div>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#E87722] h-full rounded-full" style={{ width: `${((30 - daysUntilDue) / 30) * 100}%` }} />
            </div>
            <div className="text-[10px] text-white/50 mt-2">Due: 28 July 2025 · Period: Jul 2025</div>
          </div>

          <div className="p-6">
            {payStep === 'idle' && (
              <button onClick={() => setPayStep('method')}
                className="w-full py-3.5 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-sm font-semibold transition-all shadow-md">
                💳 Pay Rent Now →
              </button>
            )}

            {payStep === 'method' && (
              <div>
                <h3 className="text-sm font-bold text-[#111A14] mb-4">Choose Payment Method</h3>
                <div className="space-y-3 mb-4">
                  {PAYMENT_METHODS.map(m => (
                    <button key={m.id} onClick={() => setPayMethod(m)}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 transition-all ${payMethod.id === m.id ? 'border-[#1A5C3A] bg-[#EEF7F2]' : 'border-[#D8E4DC] hover:border-[#1A5C3A]/40'}`}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: m.color }}>
                        <span>{m.icon}</span>
                      </div>
                      <span className="text-sm font-semibold text-[#111A14]">{m.label}</span>
                      {payMethod.id === m.id && <span className="ml-auto text-[#1A5C3A] font-bold">✓</span>}
                    </button>
                  ))}
                </div>
                {(payMethod.id === 'mtn' || payMethod.id === 'telecel') && (
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Mobile Money Number</label>
                    <div className="flex">
                      <span className="px-3 py-3 text-xs bg-[#F5F9F6] border border-r-0 border-[#D8E4DC] rounded-l-xl text-[#6B7E72]">+233</span>
                      <input type="tel" value={momoNumber} onChange={e => setMomoNumber(e.target.value)}
                        placeholder="55 123 4567"
                        className="flex-1 px-4 py-3 text-xs rounded-r-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]" />
                    </div>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setPayStep('idle')} className="flex-1 py-3 rounded-full border border-[#D8E4DC] text-xs font-semibold text-[#6B7E72] hover:bg-[#F5F9F6]">Cancel</button>
                  <button onClick={() => setPayStep('confirm')} className="flex-1 py-3 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-xs font-semibold transition-all">
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {payStep === 'confirm' && (
              <div className="text-center">
                <div className="bg-[#F5F9F6] rounded-2xl p-6 mb-5">
                  <div className="text-xs text-[#6B7E72] uppercase tracking-wider mb-1">You are paying</div>
                  <div className="text-3xl font-serif font-bold text-[#0F3D26]">GHS {rentDue.toLocaleString()}</div>
                  <div className="text-xs text-[#6B7E72] mt-2">via {payMethod.label}</div>
                  {momoNumber && <div className="text-xs font-semibold text-[#111A14] mt-1">+233 {momoNumber}</div>}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setPayStep('method')} className="flex-1 py-3 rounded-full border border-[#D8E4DC] text-xs font-semibold text-[#6B7E72]">Back</button>
                  <button onClick={() => setPayStep('success')} className="flex-1 py-3 rounded-full bg-[#1A5C3A] text-white text-xs font-semibold transition-all hover:bg-[#2E7D52]">
                    Confirm & Pay →
                  </button>
                </div>
              </div>
            )}

            {payStep === 'success' && (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-[#EEF7F2] text-3xl flex items-center justify-center mx-auto mb-3">✅</div>
                <h3 className="text-lg font-serif font-bold text-[#0F3D26] mb-1">Payment Sent!</h3>
                <p className="text-xs text-[#6B7E72] mb-4">GHS {rentDue.toLocaleString()} via {payMethod.label}. Receipt emailed to you.</p>
                <button onClick={() => setPayStep('idle')} className="px-6 py-2.5 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-xs font-semibold hover:bg-[#D6EDE1] transition-all">
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Lease Info */}
          <div className="bg-white rounded-2xl border border-[#D8E4DC] shadow-sm p-5">
            <h2 className="text-sm font-bold text-[#111A14] mb-4">📄 My Lease</h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between"><span className="text-[#6B7E72]">Property</span><span className="font-semibold text-[#111A14]">Apt 3B, Airport Res.</span></div>
              <div className="flex justify-between"><span className="text-[#6B7E72]">Start Date</span><span className="font-semibold text-[#111A14]">1 Feb 2025</span></div>
              <div className="flex justify-between"><span className="text-[#6B7E72]">End Date</span><span className="font-semibold text-[#D97706]">31 Jan 2026</span></div>
              <div className="flex justify-between"><span className="text-[#6B7E72]">Monthly Rent</span><span className="font-bold text-[#1A5C3A]">GHS 3,200</span></div>
              <div className="flex justify-between"><span className="text-[#6B7E72]">Status</span><span className="px-2 py-0.5 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-[10px] font-bold">Active</span></div>
            </div>
            <Link href="/dashboard/tenant/lease" className="mt-4 block text-center text-xs text-[#1A5C3A] font-semibold hover:underline">View Lease Document →</Link>
          </div>

          {/* Recent Maintenance */}
          <div className="bg-white rounded-2xl border border-[#D8E4DC] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#D8E4DC] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#111A14]">🔧 My Requests</h2>
              <Link href="/dashboard/tenant/maintenance" className="text-[10px] text-[#1A5C3A] font-semibold hover:underline">New →</Link>
            </div>
            <div className="divide-y divide-[#D8E4DC]">
              {maintenance.map(m => (
                <div key={m.id} className="px-5 py-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-[#111A14]">{m.type}</div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${m.status === 'Completed' ? 'bg-[#EEF7F2] text-[#1A5C3A]' : 'bg-[#FEF3C7] text-[#D97706]'}`}>{m.status}</span>
                  </div>
                  <div className="text-[10px] text-[#6B7E72] mt-0.5">{m.date} · {m.tech}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
