'use client';

import React, { useState } from 'react';

type Rail = 'mtn_momo' | 'telecel_cash' | 'at_money';

interface Props {
  amountGhs: number;
  purpose: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (txRef: string) => void;
}

export default function MobileMoneyCheckoutModal({ amountGhs, purpose, isOpen, onClose, onSuccess }: Props) {
  const [rail, setRail] = useState<Rail>('mtn_momo');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'details' | 'prompt' | 'success'>('details');
  const [loading, setLoading] = useState(false);
  const [txRef, setTxRef] = useState('');

  if (!isOpen) return null;

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 9) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setStep('prompt');
    setLoading(false);
  };

  const handleConfirmPin = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const ref = `MOMO-GH-${Math.floor(100000 + Math.random() * 900000)}`;
    setTxRef(ref);
    setStep('success');
    setLoading(false);
    onSuccess(ref);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        <button onClick={onClose} className="absolute top-5 right-5 text-xl text-[#6B7E72] hover:text-[#111A14]">
          ✕
        </button>

        {step === 'details' && (
          <form onSubmit={handleInitiate} className="space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E87722]">Ghana Mobile Money Checkout</span>
              <h3 className="text-xl font-serif font-bold text-[#0F3D26] mt-1">{purpose}</h3>
              <div className="mt-2 p-3 rounded-xl bg-[#EEF7F2] flex justify-between items-center text-xs">
                <span className="text-[#6B7E72]">Total Amount Due:</span>
                <span className="font-serif font-bold text-lg text-[#1A5C3A]">GHS {amountGhs.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111A14] mb-2 uppercase tracking-wider">Select Mobile Network</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'mtn_momo', label: 'MTN MoMo', icon: '🟡' },
                  { id: 'telecel_cash', label: 'Telecel', icon: '🔴' },
                  { id: 'at_money', label: 'AT Money', icon: '🔵' },
                ].map(n => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setRail(n.id as Rail)}
                    className={`p-3 rounded-xl border text-center transition-all ${rail === n.id ? 'border-[#1A5C3A] bg-[#EEF7F2]' : 'border-[#D8E4DC]'}`}
                  >
                    <div className="text-xl mb-1">{n.icon}</div>
                    <div className="text-[10px] font-bold text-[#111A14]">{n.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111A14] mb-1.5 uppercase tracking-wider">Mobile Money Phone Number</label>
              <div className="flex">
                <span className="px-3.5 py-3 text-xs bg-[#F5F9F6] border border-r-0 border-[#D8E4DC] rounded-l-xl text-[#6B7E72] font-mono">+233</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="24 412 8890"
                  className="flex-1 px-4 py-3 text-xs font-mono font-bold rounded-r-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] disabled:opacity-60 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? 'Initiating Prompt…' : `Pay GHS ${amountGhs.toLocaleString()} via Mobile Money →`}
            </button>
          </form>
        )}

        {step === 'prompt' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FEF3C7] text-[#D97706] text-3xl flex items-center justify-center mx-auto animate-bounce">
              📲
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#0F3D26]">USSD Prompt Sent!</h3>
              <p className="text-xs text-[#6B7E72] mt-1">
                A Mobile Money authorization prompt has been sent to <strong className="text-[#111A14]">+233 {phone}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F9F6] border border-[#D8E4DC] text-xs text-left space-y-1 font-mono">
              <div className="text-[10px] text-[#6B7E72] uppercase font-sans">Simulated Phone Display:</div>
              <div className="font-bold text-[#111A14]">Authorize Payment to Civitas Estate Management?</div>
              <div className="text-[#1A5C3A]">Amount: GHS {amountGhs.toLocaleString()}</div>
            </div>

            <button
              onClick={handleConfirmPin}
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#E87722] hover:bg-[#B85A10] disabled:opacity-60 text-white text-xs font-semibold uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
            >
              {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? 'Verifying PIN Authorization…' : 'Simulate Customer Entered PIN →'}
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-3xl flex items-center justify-center mx-auto">
              ✅
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-[#0F3D26]">Payment Successful!</h3>
              <p className="text-xs text-[#6B7E72] mt-1">Receipt reference: <strong className="font-mono text-[#1A5C3A]">{txRef}</strong></p>
            </div>

            <div className="p-4 rounded-2xl bg-[#EEF7F2] text-xs text-[#1A5C3A] font-medium">
              📱 SMS receipt dispatched to +233 {phone}. Instant confirmation sent to Landlord & Escrow Vault.
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-full bg-[#0F3D26] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Done & Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
