'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function EnergyTelemetryPage() {
  const [selectedProperty, setSelectedProperty] = useState('East Legon Villa');

  const hourlyGeneration = [
    { hour: '06:00', kwh: 0.4 },
    { hour: '08:00', kwh: 2.1 },
    { hour: '10:00', kwh: 4.8 },
    { hour: '12:00', kwh: 6.5 },
    { hour: '14:00', kwh: 5.9 },
    { hour: '16:00', kwh: 3.4 },
    { hour: '18:00', kwh: 1.1 },
  ];

  return (
    <DashboardLayout role="owner" userName="Property Owner">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Solar Micro-Grid & Energy Telemetry</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Real-time solar panel output, battery storage state, and carbon credits ledger</p>
        </div>

        <select
          value={selectedProperty}
          onChange={e => setSelectedProperty(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[#D8E4DC] bg-white text-xs font-semibold text-[#111A14] outline-none focus:border-[#1A5C3A]"
        >
          <option>East Legon Villa (5.5 kWp)</option>
          <option>Airport Res. Apt 3B (3.2 kWp)</option>
          <option>Tema Harbour Studio (2.0 kWp)</option>
        </select>
      </div>

      {/* Top Telemetry Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-[#D8E4DC] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#1A5C3A] mb-1">Today&apos;s Solar Generation</div>
          <div className="text-2xl font-serif font-bold text-[#111A14]">24.2 kWh</div>
          <div className="text-[10px] text-[#6B7E72] mt-1">☀️ 85% of total home demand</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D8E4DC] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] mb-1">Battery Storage</div>
          <div className="text-2xl font-serif font-bold text-[#111A14]">88% Charged</div>
          <div className="text-[10px] text-[#2E8B6A] mt-1">🔋 14.2 kWh Lithium Bank (Active)</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D8E4DC] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#E87722] mb-1">Monthly Utility Bill Saved</div>
          <div className="text-2xl font-serif font-bold text-[#111A14]">GHS 3,120</div>
          <div className="text-[10px] text-[#6B7E72] mt-1">vs. standard ECG grid bill</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D8E4DC] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED] mb-1">Verra Carbon Offsets</div>
          <div className="text-2xl font-serif font-bold text-[#111A14]">1.42 Tons</div>
          <div className="text-[10px] text-[#7C3AED] font-semibold mt-1">📜 Certificate #VCS-GH-8821</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Generation Chart Simulation */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-[#D8E4DC] pb-4">
            <div>
              <h2 className="text-base font-serif font-bold text-[#0F3D26]">Hourly Generation Profile (kWh)</h2>
              <p className="text-xs text-[#6B7E72]">Peak output reached at 12:00 GMT</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-[10px] font-bold uppercase">Grid Off-Line Protection Active</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-4 pt-6 px-4">
            {hourlyGeneration.map((item, idx) => {
              const heightPct = (item.kwh / 7.0) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold text-[#1A5C3A]">{item.kwh} kW</span>
                  <div className="w-full bg-[#EEF7F2] rounded-t-xl overflow-hidden h-40 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-[#1A5C3A] to-[#2E8B6A] rounded-t-xl transition-all duration-500"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#6B7E72] font-mono">{item.hour}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Battery Health & Grid Telemetry Panel */}
        <div className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-serif font-bold text-[#0F3D26] mb-4">Battery & Backup Telemetry</h2>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#F5F9F6] border border-[#D8E4DC]">
                <div className="flex justify-between text-xs font-semibold text-[#111A14] mb-1">
                  <span>Battery Health (LiFePO4)</span>
                  <span className="text-[#1A5C3A]">99.4% (Optimal)</span>
                </div>
                <div className="w-full bg-[#D8E4DC] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#1A5C3A] h-full rounded-full" style={{ width: '99%' }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F9F6] border border-[#D8E4DC]">
                <div className="flex justify-between text-xs font-semibold text-[#111A14] mb-1">
                  <span>Grid Failover Switch Time</span>
                  <span className="text-[#E87722] font-mono">&lt; 8 milliseconds</span>
                </div>
                <p className="text-[10px] text-[#6B7E72] mt-1">Zero interruption to home appliances during power outages.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FEF6EF] border border-[#FAE8D5]">
                <div className="text-xs font-bold text-[#B85A10] mb-1">🌿 ESG Impact Summary</div>
                <div className="text-xs text-[#6B7E72] leading-relaxed">
                  Your solar system has offset <strong>1,420 kg</strong> of carbon emissions this year, equivalent to planting <strong>65 trees</strong> in Ghana.
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('Downloading official Verra VCS Carbon Offset Certificate (PDF)...')}
            className="w-full mt-6 py-3 rounded-full bg-[#0F3D26] hover:bg-[#1A5C3A] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
          >
            Download Carbon Certificate →
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
