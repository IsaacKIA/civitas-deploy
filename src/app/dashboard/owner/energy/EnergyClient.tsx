'use client';

import { useState } from 'react';

interface PropertySolar {
  id: string;
  name: string;
  has_solar: boolean;
  solar_capacity_kwp: number | null;
  has_battery_backup: boolean | null;
}

interface EnergyClientProps {
  properties: PropertySolar[];
}

export default function EnergyClient({ properties }: EnergyClientProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0]?.id || '');
  const [showWebhookGuide, setShowWebhookGuide] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [telemetry, setTelemetry] = useState({
    generationKw: 6.4,
    consumptionKw: 3.1,
    batterySocPct: 88,
    gridStatus: 'online',
    inverterBrand: 'Victron MultiPlus-II 48V / Fronius Hybrid',
    lastUpdated: 'Just now',
  });

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId) || properties[0];

  const handleSimulateTelemetry = async () => {
    if (!selectedProperty) return;
    setSimulating(true);

    const randomGen = +(4.5 + Math.random() * 3.5).toFixed(1);
    const randomCon = +(2.0 + Math.random() * 2.5).toFixed(1);
    const randomSoc = Math.floor(75 + Math.random() * 24);

    try {
      await fetch('/api/telemetry/solar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-telemetry-key': 'civitas-telemetry-dev',
        },
        body: JSON.stringify({
          propertyId: selectedProperty.id,
          generationKw: randomGen,
          consumptionKw: randomCon,
          batterySocPct: randomSoc,
          gridStatus: 'online',
          inverterBrand: 'Victron MultiPlus-II 48V / Fronius Hybrid',
        }),
      });

      setTelemetry({
        generationKw: randomGen,
        consumptionKw: randomCon,
        batterySocPct: randomSoc,
        gridStatus: 'online',
        inverterBrand: 'Victron MultiPlus-II 48V / Fronius Hybrid',
        lastUpdated: 'Just now',
      });
    } catch {
      // update local preview regardless
      setTelemetry({
        generationKw: randomGen,
        consumptionKw: randomCon,
        batterySocPct: randomSoc,
        gridStatus: 'online',
        inverterBrand: 'Victron MultiPlus-II 48V / Fronius Hybrid',
        lastUpdated: 'Just now',
      });
    } finally {
      setSimulating(false);
    }
  };

  const netExport = +(telemetry.generationKw - telemetry.consumptionKw).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Solar & Energy Intelligence</h1>
          <p className="text-xs text-[#6B7E72] mt-1">
            Real-time IoT inverter telemetry, battery health, and clean solar generation
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowWebhookGuide(true)}
            className="px-4 py-2.5 rounded-full border border-[#D8E4DC] bg-white hover:bg-[#F5F9F6] text-[#0F3D26] text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>🔌</span> Connect Inverter Webhook
          </button>
          <a
            href="/api/reports/energy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F3D26] hover:bg-[#1A5C3A] text-white text-xs font-semibold shadow-sm transition-all"
          >
            ☀️ Energy Report (PDF)
          </a>
        </div>
      </div>

      {/* Property Selector */}
      {properties.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {properties.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPropertyId(p.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
                p.id === selectedPropertyId
                  ? 'bg-[#0F3D26] text-white border-[#0F3D26]'
                  : 'bg-white text-[#3D5044] border-[#D8E4DC] hover:border-[#0F3D26]'
              }`}
            >
              ☀️ {p.name} {p.solar_capacity_kwp ? `(${p.solar_capacity_kwp} kWp)` : ''}
            </button>
          ))}
        </div>
      )}

      {/* Live Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Solar Generation */}
        <div className="bg-white rounded-3xl border border-[#D8E4DC] p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-semibold text-[#6B7E72]">Live Solar Yield</span>
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
          </div>
          <div className="text-3xl font-serif font-bold text-[#10B981] mt-2">
            {telemetry.generationKw} <span className="text-sm font-sans font-normal text-[#6B7E72]">kW</span>
          </div>
          <div className="mt-2 text-[11px] text-[#064E3B] font-medium flex items-center gap-1">
            <span>☀️ Direct Photovoltaic Generation</span>
          </div>
        </div>

        {/* Property Consumption */}
        <div className="bg-white rounded-3xl border border-[#D8E4DC] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-semibold text-[#6B7E72]">Premises Load</span>
            <span className="text-xs">⚡</span>
          </div>
          <div className="text-3xl font-serif font-bold text-[#111A14] mt-2">
            {telemetry.consumptionKw} <span className="text-sm font-sans font-normal text-[#6B7E72]">kW</span>
          </div>
          <div className="mt-2 text-[11px] text-[#6B7E72]">
            {netExport >= 0 ? (
              <span className="text-[#047857] font-semibold">100% Solar-Powered (Self-Sufficient)</span>
            ) : (
              <span className="text-[#D97706] font-semibold">Drawing {-netExport} kW from Grid</span>
            )}
          </div>
        </div>

        {/* Battery State of Charge */}
        <div className="bg-white rounded-3xl border border-[#D8E4DC] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-semibold text-[#6B7E72]">Battery SOC</span>
            <span className="text-xs">🔋</span>
          </div>
          <div className="text-3xl font-serif font-bold text-[#0F3D26] mt-2">
            {telemetry.batterySocPct}
            <span className="text-sm font-sans font-normal text-[#6B7E72]">%</span>
          </div>
          <div className="w-full bg-[#E2ECE5] h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-[#10B981] h-full rounded-full transition-all duration-500"
              style={{ width: `${telemetry.batterySocPct}%` }}
            ></div>
          </div>
        </div>

        {/* Net Flow / Grid Status */}
        <div className="bg-white rounded-3xl border border-[#D8E4DC] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-semibold text-[#6B7E72]">Grid Interface</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ECFDF5] text-[#047857]">
              ECG Connected
            </span>
          </div>
          <div className="text-2xl font-serif font-bold text-[#0F3D26] mt-2">
            {netExport >= 0 ? `+${netExport} kW Surplus` : `${netExport} kW Deficit`}
          </div>
          <div className="mt-2 text-[11px] text-[#788A7F]">
            {netExport >= 0 ? 'Surplus charging battery' : 'Supplementary grid power'}
          </div>
        </div>
      </div>

      {/* Inverter Status Bar */}
      <div className="bg-white rounded-3xl border border-[#D8E4DC] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-xl">
            📡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0F3D26]">Connected Inverter:</span>
              <span className="text-xs font-medium text-[#111A14]">{telemetry.inverterBrand}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#10B981]/20 text-[#047857]">
                Online ✓
              </span>
            </div>
            <p className="text-[11px] text-[#6B7E72] mt-0.5">
              Property:{' '}
              <strong>{selectedProperty?.name || 'Cantonments Heights Apt 4B'}</strong> · Installed Capacity:{' '}
              <strong>{selectedProperty?.solar_capacity_kwp || 10} kWp</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSimulateTelemetry}
            disabled={simulating}
            className="px-4 py-2 rounded-xl border border-[#D8E4DC] text-xs font-semibold text-[#0F3D26] hover:bg-[#F5F9F6] transition-all disabled:opacity-50"
          >
            {simulating ? 'Ingesting...' : '⚡ Simulate Live Telemetry Read'}
          </button>
        </div>
      </div>

      {/* Webhook Integration Guide Modal */}
      {showWebhookGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-[#D8E4DC] shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 bg-[#0F3D26] text-white flex items-center justify-between">
              <div>
                <h2 className="text-base font-serif font-bold">Connect Inverter Telemetry Webhook</h2>
                <p className="text-xs text-[#E87722] mt-0.5">Huawei FusionSolar, Victron VRM, Growatt & Shelly</p>
              </div>
              <button
                onClick={() => setShowWebhookGuide(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-[#3D5044] leading-relaxed">
                Configure your solar inverter monitoring portal or local data logger to send HTTP POST telemetry
                packets to the endpoint below:
              </p>

              <div>
                <label className="block text-[11px] font-semibold text-[#6B7E72] uppercase tracking-wider mb-1">
                  Webhook URL
                </label>
                <div className="p-3 bg-[#F8FAF9] rounded-xl border border-[#D8E4DC] font-mono text-[11px] text-[#0F3D26] select-all">
                  https://www.civitasestate.com/api/telemetry/solar
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#6B7E72] uppercase tracking-wider mb-1">
                  Required HTTP Headers
                </label>
                <div className="p-3 bg-[#F8FAF9] rounded-xl border border-[#D8E4DC] font-mono text-[11px] text-[#3D5044] space-y-1">
                  <div>Content-Type: application/json</div>
                  <div>x-telemetry-key: &lt;YOUR_TELEMETRY_API_KEY&gt;</div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#6B7E72] uppercase tracking-wider mb-1">
                  Sample JSON Payload
                </label>
                <pre className="p-3 bg-[#111A14] text-[#A7F3D0] rounded-xl font-mono text-[11px] overflow-x-auto">
{`{
  "propertyId": "${selectedProperty?.id || 'PROPERTY_UUID'}",
  "generationKw": 6.8,
  "consumptionKw": 3.2,
  "batterySocPct": 92,
  "gridStatus": "online",
  "inverterBrand": "Victron Energy VRM"
}`}
                </pre>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#EDF3EF] flex justify-end">
              <button
                type="button"
                onClick={() => setShowWebhookGuide(false)}
                className="px-5 py-2.5 rounded-xl bg-[#0F3D26] text-white text-xs font-semibold hover:bg-[#1A5C3A]"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
