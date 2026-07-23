'use client';

import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      category: 'Maintenance & SLAs',
      question: 'How does the 2-Hour Emergency SLA Guarantee work?',
      answer: 'When an emergency request (e.g. burst water pipe, electrical failure, lock lockout) is logged in the tenant or owner portal, our AI auto-dispatches the nearest verified technician in Accra, Kumasi, Tema, or Mankessim. Technician dispatch and travel countdown are tracked live with a guaranteed 2-hour arrival.'
    },
    {
      category: 'Rent & Ghana Law',
      question: 'How does Civitas enforce Ghana Rent Act (Act 220) compliance?',
      answer: 'Ghana Rent Law restricts advance rent demands to a maximum of 6 months. Civitas provides an automated escrow structure that holds tenant rental deposits safely in GHS/USD escrow accounts and releases monthly rental payouts to property owners automatically.'
    },
    {
      category: 'Solar & Utilities',
      question: 'Will Civitas solar installation work during grid power outages (dumsor)?',
      answer: 'Yes! All Civitas solar installations feature hybrid lithium battery storage systems that switch seamlessly in less than 10 milliseconds when grid power fails, keeping your ACs, refrigeration, smart security, and lights running 24/7.'
    },
    {
      category: 'Diaspora Investors',
      question: 'Can diaspora investors receive USD dividend payouts outside Ghana?',
      answer: 'Absolutely. Diaspora property owners and impact investors can choose to receive quarterly dividend distributions directly in USD via international bank transfer (Wise/Wire) or in GHS via Mobile Money (MTN MoMo, Telecel Cash).'
    },
    {
      category: 'Property Records',
      question: 'Is Ghana Post Digital Address (GPS) verification required?',
      answer: 'Civitas automatically validates every property against the official Ghana Post Digital Address database (e.g. GA-183-9021) and cross-checks deed boundaries with spatial GIS mapping for total title clarity.'
    }
  ];

  return (
    <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#E87722] mb-2 block">
          Got Questions?
        </span>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0F3D26]">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#D8E4DC] overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-[#EEF7F2]/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-[10px] font-bold uppercase tracking-wider">
                    {faq.category}
                  </span>
                  <span className="text-base font-bold text-[#111A14]">{faq.question}</span>
                </div>
                <span className="text-xl text-[#1A5C3A] font-bold">{isOpen ? '−' : '+'}</span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 text-xs text-[#6B7E72] leading-relaxed border-t border-[#D8E4DC]/40">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
