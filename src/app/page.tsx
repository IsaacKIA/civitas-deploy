'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import EcoCalculator from '@/components/EcoCalculator';
import AIChatWidget from '@/components/AIChatWidget';
import TrustBadges from '@/components/TrustBadges';
import LocationsGrid from '@/components/LocationsGrid';
import FAQSection from '@/components/FAQSection';
import Link from 'next/link';

export default function Home() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: 'Estate Management',
    message: ''
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Submission failed');
      setFormSubmitted(true);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', service: 'Estate Management', message: '' });
    } catch {
      setFormError('Something went wrong. Please email us directly at admin@civitasestate.com');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F9F6] text-[#111A14] overflow-x-hidden font-sans">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen bg-[#0F3D26] text-white pt-28 pb-20 px-6 md:px-12 flex items-center overflow-hidden grain">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(46,125,82,0.4)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(232,119,34,0.18)_0%,transparent_45%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(214,237,225,0.06)_0%,transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

        {/* Floating decorative orbs */}
        <div className="absolute top-24 right-[10%] w-72 h-72 rounded-full bg-[#E87722]/8 blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-20 left-[5%] w-56 h-56 rounded-full bg-[#2E7D52]/15 blur-3xl pointer-events-none" style={{animation:'float 7s ease-in-out infinite 1s'}} />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E87722]/15 border border-[#E87722]/30 text-[#E87722] text-[11px] font-semibold tracking-widest uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E87722] animate-pulse" />
              Founded in Ghana · Operating Across Africa
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight leading-[1.05] mb-6">
              Smart Living.<br />
              <em className="not-italic text-gradient-gold">Sustainable</em><br />
              <span className="text-[#D6EDE1]">Legacy.</span>
            </h1>

            <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed max-w-lg mb-8">
              Ghana's pioneering integrated platform for smart estate management, renewable energy, and intelligent community development. We don't just build buildings — we build living systems.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                href="/portal"
                className="px-8 py-3.5 rounded-full bg-[#E87722] hover:bg-[#B85A10] text-white text-sm font-medium shadow-xl transition-all hover:-translate-y-0.5 glow-orange"
              >
                Explore Portal →
              </Link>
              <a
                href="#projects"
                className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-all backdrop-blur-sm"
              >
                View Impact Projects
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div className="animate-fade-up-delay-1">
                <div className="text-3xl font-serif font-bold text-white">500+</div>
                <div className="text-xs text-white/50 mt-1">Eco-homes Planned</div>
              </div>
              <div className="animate-fade-up-delay-2">
                <div className="text-3xl font-serif font-bold text-[#E87722]">2h</div>
                <div className="text-xs text-white/50 mt-1">Maintenance SLA</div>
              </div>
              <div className="animate-fade-up-delay-3">
                <div className="text-3xl font-serif font-bold text-white">$4M+</div>
                <div className="text-xs text-white/50 mt-1">Projects in Pipeline</div>
              </div>
            </div>
          </div>

          <div id="calculator" className="flex justify-center lg:justify-end animate-fade-up-delay-1">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-[#E87722]/10 blur-2xl pointer-events-none" />
              <div className="relative animate-float">
                <EcoCalculator />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 2. MARQUEE STRIP */}
      <section className="bg-[#E87722] text-white py-3.5 overflow-hidden shadow-inner">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] gap-12 text-xs font-semibold uppercase tracking-widest">
          <span>⚡ 24/7 SLA Maintenance Guarantee</span>
          <span>🌿 Net Zero Smart Communities</span>
          <span>☀️ Solar Micro-Grid & Storage Analytics</span>
          <span>💼 14–18% Projected Investor IRR</span>
          <span>📍 Ghana Post GPS Verified Properties</span>
          <span>🤝 AfDB & UNDP Impact Aligned</span>
          <span>⚡ 24/7 SLA Maintenance Guarantee</span>
          <span>🌿 Net Zero Smart Communities</span>
        </div>
      </section>

      {/* 3. TRUST & PARTNER BADGES */}
      <TrustBadges />

      {/* 4. SERVICES GRID */}
      <section id="services" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E87722] mb-2 block">
            End-to-End Excellence
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0F3D26] mb-4">
            Integrated PropTech Services
          </h2>
          <p className="text-sm text-[#6B7E72] leading-relaxed">
            Combining smart estate management, artisan vendor dispatch, solar yield telemetry, and investor dividend distribution into one unified platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-[#D8E4DC] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#D6EDE1] text-[#1A5C3A] flex items-center justify-center text-2xl mb-6">
              🏠
            </div>
            <h3 className="text-xl font-bold font-serif text-[#111A14] mb-3">Estate & Property Management</h3>
            <p className="text-xs text-[#6B7E72] leading-relaxed mb-6">
              Complete digital lease accounting, Ghana Rent Act compliance, tenant screening, and automated escrow rent collection.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-2.5 py-1 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-[10px] font-medium">Rent Escrow</span>
              <span className="px-2.5 py-1 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-[10px] font-medium">Tenant Portal</span>
            </div>
            <Link href="/portal" className="text-xs font-semibold text-[#1A5C3A] hover:underline">Access Management →</Link>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#D8E4DC] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#FAE8D5] text-[#E87722] flex items-center justify-center text-2xl mb-6">
              ☀️
            </div>
            <h3 className="text-xl font-bold font-serif text-[#111A14] mb-3">Solar Micro-Grids & Energy</h3>
            <p className="text-xs text-[#6B7E72] leading-relaxed mb-6">
              Real-time solar panel output monitoring, battery discharge AI optimization, and monthly ESG carbon offset generation.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-2.5 py-1 rounded-full bg-[#FEF6EF] text-[#B85A10] text-[10px] font-medium">85% Bill Reduction</span>
              <span className="px-2.5 py-1 rounded-full bg-[#FEF6EF] text-[#B85A10] text-[10px] font-medium">Carbon Ledger</span>
            </div>
            <Link href="/portal" className="text-xs font-semibold text-[#E87722] hover:underline">Explore Solar Telemetry →</Link>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#D8E4DC] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#D4EFE6] text-[#2E8B6A] flex items-center justify-center text-2xl mb-6">
              🔧
            </div>
            <h3 className="text-xl font-bold font-serif text-[#111A14] mb-3">24/7 SLA Maintenance Dispatch</h3>
            <p className="text-xs text-[#6B7E72] leading-relaxed mb-6">
              Guaranteed emergency repair dispatch within 2 hours, artisan performance scoring, and Mobile Money payout rails.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-2.5 py-1 rounded-full bg-[#D4EFE6]/50 text-[#2E8B6A] text-[10px] font-medium">2h SLA Guarantee</span>
              <span className="px-2.5 py-1 rounded-full bg-[#D4EFE6]/50 text-[#2E8B6A] text-[10px] font-medium">MTN MoMo Payout</span>
            </div>
            <Link href="/portal" className="text-xs font-semibold text-[#2E8B6A] hover:underline">View Dispatch Board →</Link>
          </div>
        </div>
      </section>

      {/* 4.5 HOW IT WORKS (STEP FLOW) */}
      <section className="py-20 px-6 md:px-12 bg-white border-y border-[#D8E4DC]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#E87722] mb-2 block">
              Simplified Operations
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0F3D26] mb-4">
              How Civitas Works
            </h2>
            <p className="text-sm text-[#6B7E72] leading-relaxed">
              From Ghana Post GPS address verification to automated Mobile Money rent payouts and solar energy telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#D6EDE1] -translate-y-6 z-0" />

            {[
              {
                step: '01',
                title: 'Digital Onboarding',
                desc: 'Register properties with Ghana Post GPS digital address validation & land title verification.',
                icon: '📍',
              },
              {
                step: '02',
                title: 'Rent & Escrow Vault',
                desc: 'Collect rent via MTN MoMo or Telecel Cash with automatic 6-month Ghana Rent Act 220 escrow protection.',
                icon: '💳',
              },
              {
                step: '03',
                title: 'Solar & SLA Dispatch',
                desc: 'Monitor solar micro-grid yield and dispatch certified local artisans for 2-hour emergency repair SLAs.',
                icon: '⚡',
              },
              {
                step: '04',
                title: 'Diaspora Yield Payout',
                desc: 'Receive net owner dividends disbursed automatically to Mobile Money or Wise USD bank accounts.',
                icon: '📈',
              },
            ].map((s, idx) => (
              <div key={idx} className="bg-[#F5F9F6] p-6 rounded-3xl border border-[#D8E4DC] relative z-10 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#D6EDE1] text-[#1A5C3A] text-xl flex items-center justify-center font-bold">
                    {s.icon}
                  </div>
                  <span className="text-2xl font-serif font-bold text-[#E87722]">{s.step}</span>
                </div>
                <h3 className="text-base font-serif font-bold text-[#111A14] mb-2">{s.title}</h3>
                <p className="text-xs text-[#6B7E72] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CIVITAS (DARK SECTION) */}
      <section id="why" className="bg-[#0F3D26] text-white py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#E87722] mb-3 block">
              The Civitas Difference
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold leading-tight mb-6">
              Engineered for Ghana. Benchmarked Globally.
            </h2>
            <p className="text-sm text-white/60 leading-relaxed mb-10">
              Unlike generic property tools, Civitas solves the specific infrastructure, title verification, and energy challenges faced by property owners and diaspora investors in West Africa.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="text-2xl font-serif font-bold text-[#E87722]">01</div>
                <div>
                  <h4 className="text-base font-semibold text-white">Guaranteed Maintenance SLAs</h4>
                  <p className="text-xs text-white/50 mt-1">Dedicated on-call technicians across Accra, Kumasi, Tema, and Mankessim.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="text-2xl font-serif font-bold text-[#E87722]">02</div>
                <div>
                  <h4 className="text-base font-semibold text-white">Off-Grid Solar Independence</h4>
                  <p className="text-xs text-white/50 mt-1">Hybrid battery storage shielding properties from power grid outages.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="text-2xl font-serif font-bold text-[#E87722]">03</div>
                <div>
                  <h4 className="text-base font-semibold text-white">Complete Diaspora Transparency</h4>
                  <p className="text-xs text-white/50 mt-1">Real-time video updates, inspection media, and automated USD/GHS dividend distributions.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl">
            <div className="text-6xl font-serif font-bold text-white mb-2">99.7<span className="text-[#E87722]">%</span></div>
            <div className="text-sm text-white/50 mb-8">System & Power Uptime Across Managed Estates</div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="text-2xl font-serif font-bold text-[#D6EDE1]">100%</div>
                <div className="text-[11px] text-white/40 mt-1">Ghana Post GPS Verified</div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="text-2xl font-serif font-bold text-[#E87722]">$142K+</div>
                <div className="text-[11px] text-white/40 mt-1">Impact Dividends Paid</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LOCATIONS FOOTPRINT */}
      <LocationsGrid />

      {/* 7. IMPACT PROJECTS SHOWCASE */}
      <section id="projects" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#E87722] mb-2 block">
              High-Yield Impact Pipeline
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0F3D26]">
              Featured Developments
            </h2>
          </div>
          <Link href="/portal" className="mt-4 md:mt-0 text-xs font-semibold text-[#1A5C3A] hover:underline">
            View All Marketplace Projects →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl border border-[#D8E4DC] overflow-hidden shadow-sm hover:shadow-xl transition-all">
            <div className="h-48 bg-gradient-to-br from-[#0F3D26] to-[#1A5C3A] p-6 text-white flex flex-col justify-between relative">
              <span className="self-end px-3 py-1 rounded-full bg-[#E87722] text-[10px] font-bold uppercase tracking-wider">Closing Soon</span>
              <div>
                <span className="text-2xl">🌿</span>
                <h3 className="text-xl font-serif font-bold mt-2">Civitas Green Township</h3>
                <p className="text-xs text-white/70">Mankessim, Central Region</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-xs text-[#6B7E72] leading-relaxed mb-4">
                500 net-zero homes with integrated solar grids, water recycling, and community biogas waste management.
              </p>
              <div className="flex justify-between text-xs font-semibold text-[#111A14] mb-2">
                <span>$3.2M Raised</span>
                <span>Target: $5.0M</span>
              </div>
              <div className="w-full bg-[#D8E4DC] h-2 rounded-full overflow-hidden mb-4">
                <div className="bg-[#1A5C3A] h-full rounded-full" style={{ width: '64%' }}></div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#1A5C3A]">IRR: 16–18% p.a.</span>
                <Link href="/portal" className="text-[#E87722] font-semibold hover:underline">Invest →</Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#D8E4DC] overflow-hidden shadow-sm hover:shadow-xl transition-all">
            <div className="h-48 bg-gradient-to-br from-[#7c2d12] to-[#E87722] p-6 text-white flex flex-col justify-between relative">
              <span className="self-end px-3 py-1 rounded-full bg-[#1A5C3A] text-[10px] font-bold uppercase tracking-wider">Open</span>
              <div>
                <span className="text-2xl">⚡</span>
                <h3 className="text-xl font-serif font-bold mt-2">Rural Energy Hubs</h3>
                <p className="text-xs text-white/70">Northern & Volta Regions</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-xs text-[#6B7E72] leading-relaxed mb-4">
                Decentralised solar microgrids delivering clean power to 12 rural agricultural communities.
              </p>
              <div className="flex justify-between text-xs font-semibold text-[#111A14] mb-2">
                <span>$1.26M Raised</span>
                <span>Target: $2.0M</span>
              </div>
              <div className="w-full bg-[#D8E4DC] h-2 rounded-full overflow-hidden mb-4">
                <div className="bg-[#E87722] h-full rounded-full" style={{ width: '63%' }}></div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#E87722]">IRR: 14–16% p.a.</span>
                <Link href="/portal" className="text-[#E87722] font-semibold hover:underline">Invest →</Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#D8E4DC] overflow-hidden shadow-sm hover:shadow-xl transition-all">
            <div className="h-48 bg-gradient-to-br from-[#0d4a38] to-[#2E8B6A] p-6 text-white flex flex-col justify-between relative">
              <span className="self-end px-3 py-1 rounded-full bg-[#2E8B6A] text-[10px] font-bold uppercase tracking-wider">Open</span>
              <div>
                <span className="text-2xl">♻️</span>
                <h3 className="text-xl font-serif font-bold mt-2">Clean City Initiative</h3>
                <p className="text-xs text-white/70">Greater Accra Metro</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-xs text-[#6B7E72] leading-relaxed mb-4">
                AI-powered waste collection, recycling infrastructure, and biogas production system for Accra.
              </p>
              <div className="flex justify-between text-xs font-semibold text-[#111A14] mb-2">
                <span>$800K Raised</span>
                <span>Target: $1.5M</span>
              </div>
              <div className="w-full bg-[#D8E4DC] h-2 rounded-full overflow-hidden mb-4">
                <div className="bg-[#2E8B6A] h-full rounded-full" style={{ width: '53%' }}></div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#2E8B6A]">IRR: 12–15% p.a.</span>
                <Link href="/portal" className="text-[#E87722] font-semibold hover:underline">Invest →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION SECTION */}
      <FAQSection />

      {/* 9. TESTIMONIAL QUOTE */}
      <section className="bg-[#E87722] text-white py-20 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-6xl font-serif opacity-30 mb-2">"</div>
          <p className="text-2xl sm:text-4xl font-serif font-medium italic leading-snug mb-8">
            Civitas gave our UK diaspora investment complete transparency. Our Mankessim estate electricity bills dropped by 85%, and maintenance issues are fixed in under 2 hours.
          </p>
          <div className="text-xs text-white/80 uppercase tracking-widest font-semibold">
            Dr. Abena Mensah · Diaspora Property Owner & Investor (London, UK)
          </div>
        </div>
      </section>

      {/* 10. CONTACT FORM */}
      <section id="contact" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#E87722] mb-2 block">
              Get in Touch
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#0F3D26] mb-6">
              Schedule a Consultation
            </h2>
            <p className="text-sm text-[#6B7E72] leading-relaxed mb-8">
              Whether you are looking for smart estate management, custom solar installation, or impact investment opportunities in Ghana, our senior engineering team is ready to consult.
            </p>

            <div className="space-y-6 text-sm text-[#111A14]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#EEF7F2] text-[#1A5C3A] flex items-center justify-center font-bold">📍</div>
                <div>
                  <div className="text-xs text-[#6B7E72] uppercase font-semibold">Headquarters</div>
                  <div className="font-medium">Mankessim, Central Region, Ghana</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#EEF7F2] text-[#1A5C3A] flex items-center justify-center font-bold">📞</div>
                <div>
                  <div className="text-xs text-[#6B7E72] uppercase font-semibold">Phone Line</div>
                  <a href="tel:+233555062589" className="font-medium hover:underline">+233 55 506 2589</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#EEF7F2] text-[#1A5C3A] flex items-center justify-center font-bold">✉️</div>
                <div>
                  <div className="text-xs text-[#6B7E72] uppercase font-semibold">Email Inquiry</div>
                  <a href="mailto:admin@civitasestate.com" className="font-medium hover:underline">admin@civitasestate.com</a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#D8E4DC] shadow-xl">
            {formSubmitted ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-2xl font-serif font-bold text-[#0F3D26] mb-2">Message Sent!</h3>
                <p className="text-xs text-[#6B7E72]">Thank you! A Civitas consultant will reach out to you within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#111A14] mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Isaac"
                      className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#111A14] mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Koomson"
                      className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1">Service Interest</label>
                  <select
                    value={formData.service}
                    onChange={e => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A] bg-white"
                  >
                    <option>Estate & Property Management</option>
                    <option>Solar & Storage Installation</option>
                    <option>24/7 SLA Maintenance Contract</option>
                    <option>Impact Investment Fund</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your property or investment interest..."
                    className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
                  />
                </div>

                {formError && (
                  <div className="p-3 rounded-xl bg-[#FDECEA] text-[#D94F3D] text-xs font-medium">
                    ⚠ {formError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] disabled:opacity-60 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {formSubmitting && (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {formSubmitting ? 'Sending…' : 'Send Message →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="bg-[#111A14] text-white/60 py-16 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <Link href="/" className="text-2xl font-serif font-bold text-white mb-3 block">
              Civitas<span className="text-[#E87722]">.</span>
            </Link>
            <p className="text-xs leading-relaxed text-white/50">
              Building intelligent communities across Africa. Smart Living. Sustainable Legacy.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Services</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="#services" className="hover:text-white">Estate Management</Link></li>
              <li><Link href="#services" className="hover:text-white">Solar Micro-Grids</Link></li>
              <li><Link href="#services" className="hover:text-white">SLA Maintenance</Link></li>
              <li><Link href="#services" className="hover:text-white">Smart Home IoT</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="#why" className="hover:text-white">About Civitas</Link></li>
              <li><Link href="#projects" className="hover:text-white">Impact Projects</Link></li>
              <li><Link href="/portal" className="hover:text-white">Investor Portal</Link></li>
              <li><Link href="#contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Connect</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="tel:+233555062589" className="hover:text-white">+233 55 506 2589</a></li>
              <li><a href="mailto:admin@civitasestate.com" className="hover:text-white">admin@civitasestate.com</a></li>
              <li><span>Mankessim, Central Region, Ghana</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-white/40">
          <div>© 2025 Civitas Estate & Maintenance Ltd. All rights reserved.</div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* Floating AI Chat Assistant */}
      <AIChatWidget />
    </main>
  );
}
