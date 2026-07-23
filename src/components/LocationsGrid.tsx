'use client';

import React from 'react';

export default function LocationsGrid() {
  const hubs = [
    {
      region: 'Greater Accra',
      hubs: ['East Legon', 'Airport Residential', 'Cantonments', 'Tema Harbour'],
      imageEmoji: '🏙️',
      stats: '280+ Units Managed',
      badge: 'Primary Regional Hub'
    },
    {
      region: 'Central Region',
      hubs: ['Mankessim Estate', 'Cape Coast Coastline', 'Elmina'],
      imageEmoji: '🌿',
      stats: 'Green Township Hub',
      badge: 'Net Zero Pilot'
    },
    {
      region: 'Ashanti Region',
      hubs: ['Kumasi Metro Eco-City', 'Asokwa', 'Ahodwo'],
      imageEmoji: '🏢',
      stats: '150+ Units Planned',
      badge: 'Smart Transport Hub'
    },
    {
      region: 'Northern Region',
      hubs: ['Tamale Agro-Smart Hub', 'Rural Micro-Grids'],
      imageEmoji: '☀️',
      stats: '12 Solar Micro-Grids',
      badge: 'Agri-Tech Pilot'
    }
  ];

  return (
    <section className="py-24 px-6 md:px-12 bg-[#F5F9F6]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E87722] mb-2 block">
            Nationwide Reach
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0F3D26]">
            Operational Hubs Across Ghana
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {hubs.map((h, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-3xl">{h.imageEmoji}</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-[9px] font-bold uppercase tracking-wider">
                    {h.badge}
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-[#111A14] mb-1">{h.region}</h3>
                <div className="text-xs font-semibold text-[#E87722] mb-4">{h.stats}</div>
                <ul className="space-y-1.5 text-xs text-[#6B7E72] mb-6">
                  {h.hubs.map((item, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-[#1A5C3A] font-bold">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-[#D8E4DC]/60 text-[10px] text-[#A8B8AE] font-mono">
                Ghana Post GPS Integrated
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
