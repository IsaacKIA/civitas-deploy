'use client';

import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'Maintenance & SLAs' | 'Rent & Ghana Law' | 'Solar & Utilities' | 'Diaspora Investors' | 'Property Records';
  icon: string;
  highlightText?: string;
}

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const categories = [
    'All',
    'Maintenance & SLAs',
    'Rent & Ghana Law',
    'Solar & Utilities',
    'Diaspora Investors',
    'Property Records',
  ];

  const faqs: FAQItem[] = [
    {
      category: 'Maintenance & SLAs',
      icon: '🔧',
      question: 'How does the 2-Hour Emergency SLA Guarantee work?',
      answer: 'When an emergency request (e.g. burst water pipe, electrical failure, lock lockout) is logged in the tenant or owner portal, our AI auto-dispatches the nearest verified technician in Accra, Kumasi, Tema, or Mankessim. Technician dispatch and travel countdown are tracked live with a guaranteed 2-hour arrival.',
      highlightText: 'Guaranteed 2-Hour SLA Dispatch across Accra, Tema, Kumasi & Mankessim.',
    },
    {
      category: 'Rent & Ghana Law',
      icon: '⚖️',
      question: 'How does Civitas enforce Ghana Rent Act (Act 220) compliance?',
      answer: 'Ghana Rent Law restricts advance rent demands to a maximum of 6 months. Civitas provides an automated escrow structure that holds tenant rental deposits safely in Bank of Ghana regulated GHS/USD escrow accounts and releases monthly rental payouts to property owners automatically.',
      highlightText: 'Automatic 6-Month Advance Cap & Escrow Vault Protection.',
    },
    {
      category: 'Solar & Utilities',
      icon: '☀️',
      question: 'Will Civitas solar installation work during grid power outages (dumsor)?',
      answer: 'Yes! All Civitas solar installations feature hybrid lithium battery storage systems that switch seamlessly in less than 10 milliseconds when grid power fails, keeping your ACs, refrigeration, smart security, and lights running 24/7.',
      highlightText: '< 10ms Uninterrupted Power Switch during Dumsor Grid Outages.',
    },
    {
      category: 'Diaspora Investors',
      icon: '💵',
      question: 'Can diaspora investors receive USD dividend payouts outside Ghana?',
      answer: 'Absolutely. Diaspora property owners and impact investors can choose to receive quarterly dividend distributions directly in USD via international bank transfer (Wise/Wire) or in GHS via Mobile Money (MTN MoMo, Telecel Cash).',
      highlightText: 'Dual-Rail Settlement: Wise USD Wire or MTN MoMo / Telecel Cash.',
    },
    {
      category: 'Property Records',
      icon: '📍',
      question: 'Is Ghana Post Digital Address (GPS) verification required?',
      answer: 'Civitas automatically validates every property against the official Ghana Post Digital Address database (e.g. GA-183-9021) and cross-checks deed boundaries with spatial GIS mapping for total title clarity and dispatch precision.',
      highlightText: 'Official Ghana Post GPS Spatial Coordinate Verification.',
    },
    {
      category: 'Maintenance & SLAs',
      icon: '👷‍♂️',
      question: 'How are technicians certified and scored on Civitas?',
      answer: 'Every artisan undergoes background checks, land title checks, and trade skill certifications before joining the Civitas Dispatch Network. After each job, property owners and tenants rate their service quality, maintaining a minimum 4.8/5.0 network standard.',
      highlightText: 'Vetted & Background-Checked Artisans with 4.8/5.0 Quality Rating.',
    },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faq" className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E87722]/10 border border-[#E87722]/25 text-[#E87722] text-[11px] font-semibold tracking-widest uppercase mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E87722] animate-pulse" />
          Clear & Transparent Operations
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#0F3D26] mb-4 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-[#6B7E72] leading-relaxed">
          Everything you need to know about estate management, Ghana Rent Act 220 escrow, solar micro-grids, and diaspora yield payouts.
        </p>
      </div>

      {/* Real-time Search Input */}
      <div className="max-w-xl mx-auto mb-10 relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-[#6B7E72]">🔍</span>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search any question (e.g. SLA, MoMo, Rent Act, Solar, Ghana Post GPS)..."
          className="w-full pl-11 pr-4 py-3.5 text-xs rounded-2xl bg-white border border-[#D8E4DC] shadow-sm outline-none focus:border-[#1A5C3A] focus:ring-2 focus:ring-[#D6EDE1] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#6B7E72] hover:text-[#111A14]"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat, idx) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={idx}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIdx(0);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-[#1A5C3A] text-white shadow-md shadow-[#1A5C3A]/20 scale-105'
                  : 'bg-white border border-[#D8E4DC] text-[#6B7E72] hover:bg-[#EEF7F2] hover:text-[#1A5C3A]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Accordion List */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#D8E4DC] p-8">
            <div className="text-3xl mb-2">🔎</div>
            <h3 className="text-base font-serif font-bold text-[#0F3D26] mb-1">No matching questions found</h3>
            <p className="text-xs text-[#6B7E72]">Try searching for &quot;SLA&quot;, &quot;Escrow&quot;, &quot;Solar&quot;, or reset your category filter.</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="mt-4 px-5 py-2 rounded-full bg-[#1A5C3A] text-white text-xs font-medium"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-[#1A5C3A] shadow-lg shadow-[#1A5C3A]/5 ring-1 ring-[#1A5C3A]/20'
                    : 'border-[#D8E4DC] hover:border-[#A8B8AE] shadow-sm hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-[#F5F9F6]/60 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-10 h-10 rounded-2xl bg-[#EEF7F2] border border-[#D6EDE1] text-[#1A5C3A] text-lg flex items-center justify-center shrink-0">
                      {faq.icon}
                    </span>
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-[10px] font-bold uppercase tracking-wider mb-1">
                        {faq.category}
                      </span>
                      <h3 className="text-sm md:text-base font-serif font-bold text-[#111A14] leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'bg-[#1A5C3A] text-white rotate-180' : 'bg-[#F5F9F6] text-[#1A5C3A]'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-xs text-[#6B7E72] leading-relaxed border-t border-[#EEF7F2] space-y-3 animate-in fade-in">
                    <p className="text-sm font-light text-[#3D5044] leading-relaxed">
                      {faq.answer}
                    </p>

                    {faq.highlightText && (
                      <div className="p-3 rounded-2xl bg-[#EEF7F2] border border-[#D6EDE1] text-xs font-semibold text-[#1A5C3A] flex items-center gap-2">
                        <span>💡 Key Takeaway:</span>
                        <span>{faq.highlightText}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still Have Questions Support Card */}
      <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-br from-[#0F3D26] to-[#1A5C3A] rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_20%,rgba(232,119,34,0.25)_0%,transparent_50%)] pointer-events-none" />
        <div className="relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E87722] block mb-1">
            24/7 Advisory & Concierge
          </span>
          <h3 className="text-xl font-serif font-bold text-white mb-1">Still have questions?</h3>
          <p className="text-xs text-white/70 max-w-md">
            Our Ghanaian engineering and legal compliance team is available to discuss your estate management requirements.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10 shrink-0">
          <a
            href="tel:+233555062589"
            className="px-5 py-3 rounded-full bg-[#E87722] hover:bg-[#B85A10] text-white text-xs font-semibold transition-all shadow-md flex items-center gap-2"
          >
            📞 Call +233 55 506 2589
          </a>
          <a
            href="mailto:admin@civitasestate.com"
            className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-all"
          >
            ✉️ Email Us
          </a>
        </div>
      </div>
    </section>
  );
}
