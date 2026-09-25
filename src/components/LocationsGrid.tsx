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
      tagline: 'Residential & Commercial Hubs',
      areas: ['East Legon', 'Airport Residential', 'Cantonments', 'Tema Harbour', 'Osu & Ridge', 'Dzorwulu'],
      imageEmoji: '🏙️',
      description: 'Luxury estate management, corporate leasing, diaspora rental oversight, and Act 220 advance rent compliance.',
    },
    {
      region: 'Ashanti Region',
      tagline: 'Kumasi Metropolitan & Commercial',
      areas: ['Kumasi Metro', 'Asokwa', 'Ahodwo', 'Nhyiaeso', 'Ridge'],
      imageEmoji: '🏢',
      description: 'Property management, commercial SME premises, Mobile Money rent collection, and reliable technician dispatch.',
    },
    {
      region: 'Central & Western',
      tagline: 'Coastal & Industrial Real Estate',
      areas: ['Cape Coast', 'Elmina', 'Mankessim', 'Takoradi Port'],
      imageEmoji: '🌿',
      description: 'Hospitality, student hostel facilities, solar-ready energy properties, and verified maintenance SLAs.',
    },
    {
      region: 'Northern Region',
      tagline: 'Savannah & Regional Centers',
      areas: ['Tamale Central', 'Vitting', 'Education Ridge'],
      imageEmoji: '☀️',
      description: 'Commercial institutional facilities, solar micro-grid management, and local caretaker digital oversight.',
    },
  ];

  return (
    <section id="locations" className="py-24 px-6 md:px-12 bg-[#F5F9F6]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E87722] mb-2 block">
            Nationwide Coverage & Local Expertise
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0F3D26] mb-4">
            Top Property Management Across Ghana
          </h2>
          <p className="text-sm text-[#6B7E72] leading-relaxed">
            From high-density rental enclaves in East Legon and Cantonments to commercial facilities in Kumasi and Takoradi, Civitas powers compliant, modern real estate operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {regions.map((r, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{r.imageEmoji}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A5C3A] bg-[#D6EDE1]/50 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-[#111A14] mb-1">{r.region}</h3>
                <p className="text-[11px] text-[#E87722] font-semibold mb-3">{r.tagline}</p>
                <p className="text-xs text-[#6B7E72] mb-4 leading-relaxed">{r.description}</p>
                <div className="border-t border-[#D8E4DC]/60 pt-3">
                  <div className="text-[10px] uppercase font-semibold tracking-wider text-[#111A14]/60 mb-2">Prime Target Areas:</div>
                  <ul className="space-y-1.5 text-xs text-[#6B7E72]">
                    {r.areas.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-[#1A5C3A] font-bold">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
