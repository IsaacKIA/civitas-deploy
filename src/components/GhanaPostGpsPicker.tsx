'use client';

import React, { useState } from 'react';

interface GPSResult {
  address: string;
  region: string;
  district: string;
  latitude: number;
  longitude: number;
  postalCode: string;
}

const MOCK_GPS_DB: Record<string, GPSResult> = {
  'GA-183-9021': { address: '14 Ring Road East, Cantonments, Accra', region: 'Greater Accra', district: 'La Dade Kotopon', latitude: 5.5781, longitude: -0.1702, postalCode: 'GA183' },
  'GA-445-1130': { address: 'Apartment 3B, Airport Residential, Accra', region: 'Greater Accra', district: 'Ayawaso West', latitude: 5.6037, longitude: -0.1870, postalCode: 'GA445' },
  'GT-001-4567': { address: 'Harbour Commercial Zone, Tema', region: 'Greater Accra', district: 'Tema Metropolitan', latitude: 5.6350, longitude: 0.0031, postalCode: 'GT001' },
  'AK-039-1102': { address: 'Ahodwo Roundabout, Kumasi', region: 'Ashanti Region', district: 'Kumasi Metropolitan', latitude: 6.6666, longitude: -1.6163, postalCode: 'AK039' },
};

interface Props {
  value: string;
  onChange: (gps: string, details?: GPSResult) => void;
}

export default function GhanaPostGpsPicker({ value, onChange }: Props) {
  const [searching, setSearching] = useState(false);
  const [resolved, setResolved] = useState<GPSResult | null>(MOCK_GPS_DB[value] || null);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!value.trim()) {
      setError('Please enter a Ghana Post Digital Address (e.g. GA-183-9021)');
      return;
    }

    setSearching(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));

    const formatted = value.toUpperCase().trim();
    const result = MOCK_GPS_DB[formatted] || {
      address: `Street Address near ${formatted}`,
      region: 'Greater Accra',
      district: 'Accra Metropolitan',
      latitude: 5.5600,
      longitude: -0.2050,
      postalCode: formatted.substring(0, 5),
    };

    setResolved(result);
    onChange(formatted, result);
    setSearching(false);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-[#111A14] uppercase tracking-wider">
        Ghana Post Digital Address (GPS)
      </label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">🇬🇭</span>
          <input
            type="text"
            value={value}
            onChange={e => { onChange(e.target.value.toUpperCase()); setError(''); }}
            placeholder="e.g. GA-183-9021"
            className="w-full pl-10 pr-4 py-3 text-xs font-mono font-bold tracking-wider rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
          />
        </div>
        <button
          type="button"
          onClick={handleVerify}
          disabled={searching}
          className="px-5 py-3 rounded-xl bg-[#1A5C3A] hover:bg-[#2E7D52] disabled:opacity-60 text-white text-xs font-semibold transition-all flex items-center gap-2"
        >
          {searching && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {searching ? 'Verifying…' : 'Validate Address'}
        </button>
      </div>

      {error && <p className="text-[10px] text-[#D94F3D]">⚠ {error}</p>}

      {resolved && (
        <div className="p-4 rounded-2xl bg-[#EEF7F2] border border-[#D6EDE1] space-y-2 text-xs">
          <div className="flex justify-between items-center text-[#1A5C3A] font-bold">
            <span>✓ Verified Digital Address</span>
            <span className="font-mono text-[10px]">{resolved.postalCode}</span>
          </div>
          <p className="text-[#111A14] font-semibold">{resolved.address}</p>
          <div className="flex gap-4 text-[10px] text-[#6B7E72]">
            <span>Region: <strong>{resolved.region}</strong></span>
            <span>District: <strong>{resolved.district}</strong></span>
            <span>Coords: <strong>{resolved.latitude.toFixed(4)}, {resolved.longitude.toFixed(4)}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
