'use client';

import React from 'react';

/**
 * Previously called itself "Operational Hubs Across Ghana" with fabricated
 * unit counts ("280+ Units Managed", "150+ Units Planned", "12 Solar
 * Micro-Grids") implying an existing managed portfolio and physical
 * operational presence that doesn't exist — there are zero properties on
 * the platform until a real owner registers one. Reframed as target
 * service areas, not claimed existing scale.
 */
export default function LocationsGrid() {
  const regions = [
    {
      region: 'Greater Accra',
      areas: ['East Legon', 'Airport Residential', 'Cantonments', 'Tema Harbour'],
      imageEmoji: '🏙️',
    },
    {
      region: 'Central Region',
      areas: ['Mankessim', 'Cape Coast', 'Elmina'],
      imageEmoji: '🌿',
    },
    {
      region: 'Ashanti Region',
      areas: ['Kumasi Metro', 'Asokwa', 'Ahodwo'],
      imageEmoji: '🏢',
    },
    {
      region: 'Northern Region',
      areas: ['Tamale'],
      imageEmoji: '☀️',
    },
  ];

  return (
    <section className="py-24 px-6 md:px-12 bg-[#F5F9F6]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E87722] mb-2 block">
            Where Civitas Works
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0F3D26]">
            Built for Properties Across Ghana
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {regions.map((r, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="mb-4">
                  <span className="text-3xl">{r.imageEmoji}</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-[#111A14] mb-4">{r.region}</h3>
                <ul className="space-y-1.5 text-xs text-[#6B7E72] mb-6">
                  {r.areas.map((item, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-[#1A5C3A] font-bold">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
