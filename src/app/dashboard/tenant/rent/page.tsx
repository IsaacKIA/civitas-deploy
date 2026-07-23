'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function TenantPayRentPage() {
  const [method, setMethod] = useState<'momo' | 'telecel' | 'card'>('momo');
  const [phone, setPhone] = useState('');
  const [paid, setPaid] = useState(false);

  const rentDue = 3200;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setPaid(true);
  };

  return (
    <DashboardLayout role="tenant" userName="Ama Owusu">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm">
        {paid ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-3xl flex items-center justify-center mx-auto mb-4">✅</div>
            <h2 className="text-2xl font-serif font-bold text-[#0F3D26] mb-2">Rent Payment Received!</h2>
            <p className="text-xs text-[#6B7E72] mb-6">
              GHS {rentDue.toLocaleString()} has been paid via Mobile Money. A copy of your receipt has been emailed to you.
            </p>
            <button
              onClick={() => setPaid(false)}
              className="px-6 py-3 rounded-full bg-[#1A5C3A] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Back to Overview →
            </button>
          </div>
        ) : (
          <form onSubmit={handlePay} className="space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E87722]">Direct Rent Payment</span>
              <h2 className="text-2xl font-serif font-bold text-[#0F3D26] mt-1">Airport Residential Apt 3B</h2>
              <p className="text-xs text-[#6B7E72]">Monthly Rent Due: <strong className="text-[#0F3D26]">GHS {rentDue.toLocaleString()}</strong></p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111A14] mb-2">Payment Rail</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('momo')}
                  className={`py-3 text-xs font-semibold rounded-xl border transition-all ${method === 'momo' ? 'bg-[#EEF7F2] text-[#1A5C3A] border-[#1A5C3A]' : 'bg-white text-[#6B7E72] border-[#D8E4DC]'}`}
                >
                  📱 MTN MoMo
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('telecel')}
                  className={`py-3 text-xs font-semibold rounded-xl border transition-all ${method === 'telecel' ? 'bg-[#EEF7F2] text-[#1A5C3A] border-[#1A5C3A]' : 'bg-white text-[#6B7E72] border-[#D8E4DC]'}`}
                >
                  📲 Telecel Cash
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`py-3 text-xs font-semibold rounded-xl border transition-all ${method === 'card' ? 'bg-[#EEF7F2] text-[#1A5C3A] border-[#1A5C3A]' : 'bg-white text-[#6B7E72] border-[#D8E4DC]'}`}
                >
                  💳 Credit Card
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Mobile Money Phone Number</label>
              <div className="flex">
                <span className="px-3 py-3 text-xs bg-[#F5F9F6] border border-r-0 border-[#D8E4DC] rounded-l-xl text-[#6B7E72]">+233</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="55 901 2234"
                  className="flex-1 px-4 py-3 text-xs rounded-r-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
            >
              Pay GHS {rentDue.toLocaleString()} Rent Now →
            </button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
