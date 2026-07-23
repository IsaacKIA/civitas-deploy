'use client';

import React, { useState } from 'react';

export default function EcoCalculator() {
  const [bill, setBill] = useState(1000);

  const savings = Math.round(bill * 0.85);
  const kwp = (bill * 0.0032).toFixed(1);
  const panels = Math.ceil(bill * 0.0032 * 2.5);
  const co2 = Math.round(bill * 1.45);
  const trees = Math.ceil(co2 / 21.7);

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 text-white max-w-xl w-full shadow-2xl">
      <div className="mb-6">
        <h3 className="text-2xl font-serif font-bold text-white mb-1">
          Ghana Eco-Savings Calculator ☀️
        </h3>
        <p className="text-xs text-white/60">
          Estimate your monthly utility savings with Civitas Solar & Storage installation.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-white/50">
            Monthly Power Bill (ECG)
          </span>
          <span className="text-2xl font-bold font-serif text-[#E87722]">
            GHS {bill.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min="200"
          max="5000"
          step="100"
          value={bill}
          onChange={(e) => setBill(Number(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#E87722]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#0F3D26]/60 border border-[#2E8B6A]/30 rounded-2xl p-4">
          <div className="text-[10px] uppercase tracking-wider font-bold text-[#2E8B6A] mb-1">
            Estimated Savings
          </div>
          <div className="text-2xl font-bold font-serif text-white">
            GHS {savings.toLocaleString()}
          </div>
          <div className="text-[10px] text-white/60 mt-1">Per month (~85% reduction)</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="text-[10px] uppercase tracking-wider font-bold text-white/50 mb-1">
            Recommended System
          </div>
          <div className="text-2xl font-bold font-serif text-white">
            {kwp} kWp
          </div>
          <div className="text-[10px] text-white/60 mt-1">{panels} High-efficiency Panels</div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl text-xs text-white/70">
        <div>
          🌿 <strong className="text-white">{co2.toLocaleString()} kg</strong> CO₂ offset/yr
        </div>
        <div>
          🌳 Equivalent to <strong className="text-white">{trees} trees</strong> planted
        </div>
      </div>
    </div>
  );
}
