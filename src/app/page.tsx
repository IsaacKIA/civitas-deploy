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
    service: 'Estate & Property Management',
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
      setFormData({ firstName: '', lastName: '', email: '', phone: '', service: 'Estate & Property Management', message: '' });
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
              Built in Ghana · Designed for West Africa
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight leading-[1.05] mb-6">
              Smart Living.<br />
              <em className="not-italic text-gradient-gold">Sustainable</em><br />
              <span className="text-[#D6EDE1]">Legacy.</span>
            </h1>

            <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed max-w-lg mb-8">
              Ghana&apos;s Rent Act caps advance rent at 6 months — most landlords still ask for two years upfront.
              Civitas bills tenants only what&apos;s legal, collects rent by Mobile Money, and tracks every
              maintenance request until it&apos;s actually fixed.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                href="/portal"
                className="px-8 py-3.5 rounded-full bg-[#E87722] hover:bg-[#B85A10] text-white text-sm font-medium shadow-xl transition-all hover:-translate-y-0.5 glow-orange"
              >
                Explore Portal →
              </Link>
              <a
                href="#how-it-works"
                className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-all backdrop-blur-sm"
              >
                See How It Works
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div className="animate-fade-up-delay-1">
                <div className="text-3xl font-serif font-bold text-white">6 mo</div>
                <div className="text-xs text-white/50 mt-1">Legal Rent Cap (Act 220)</div>
              </div>
              <div className="animate-fade-up-delay-2">
                <div className="text-3xl font-serif font-bold text-[#E87722]">2h</div>
                <div className="text-xs text-white/50 mt-1">Emergency Response Target</div>
              </div>
              <div className="animate-fade-up-delay-3">
                <div className="text-3xl font-serif font-bold text-white">3</div>
                <div className="text-xs text-white/50 mt-1">Mobile Money Rails</div>
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
          <span>⚡ Priority-Based Maintenance Tracking</span>
          <span>🌿 Solar-Ready Property Listings</span>
          <span>☀️ Rent Act 220 Compliant Payments</span>
          <span>📱 MTN MoMo, Telecel Cash & AT Money</span>
          <span>📍 Ghana Post Digital Address Support</span>
          <span>⚡ Priority-Based Maintenance Tracking</span>
          <span>🌿 Solar-Ready Property Listings</span>
        </div>
      </section>

      {/* 3. TRUST & PARTNER BADGES */}
      <TrustBadges />

      {/* 4. SERVICES GRID */}
      <section id="services" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E87722] mb-2 block">
            What Civitas Actually Does
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0F3D26] mb-4">
            Three Problems, Solved for Real
          </h2>
          <p className="text-sm text-[#6B7E72] leading-relaxed">
            No fluff, no vague &quot;smart living&quot; promises — this is what happens when you actually use Civitas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-[#D8E4DC] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#D6EDE1] text-[#1A5C3A] flex items-center justify-center text-2xl mb-6">
              🏠
            </div>
            <h3 className="text-xl font-bold font-serif text-[#111A14] mb-3">Rent, Billed Legally</h3>
            <p className="text-xs text-[#6B7E72] leading-relaxed mb-6">
              When a landlord asks for more than 6 months advance, Civitas only bills what&apos;s legal now —
              the rest becomes ordinary monthly rent, billed as it falls due.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-2.5 py-1 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-[10px] font-medium">Rent Act 220</span>
              <span className="px-2.5 py-1 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-[10px] font-medium">Tenant Portal</span>
            </div>
            <Link href="/portal" className="text-xs font-semibold text-[#1A5C3A] hover:underline">Set Up a Lease →</Link>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#D8E4DC] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#FAE8D5] text-[#E87722] flex items-center justify-center text-2xl mb-6">
              📱
            </div>
            <h3 className="text-xl font-bold font-serif text-[#111A14] mb-3">Rent, Paid By Phone</h3>
            <p className="text-xs text-[#6B7E72] leading-relaxed mb-6">
              Tenants pay via MTN MoMo, Telecel Cash, or AT Money. Every payment ties to a real installment
              both sides can see land, on the day it lands.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-2.5 py-1 rounded-full bg-[#FEF6EF] text-[#B85A10] text-[10px] font-medium">3 MoMo Rails</span>
              <span className="px-2.5 py-1 rounded-full bg-[#FEF6EF] text-[#B85A10] text-[10px] font-medium">Real-Time Ledger</span>
            </div>
            <Link href="/portal" className="text-xs font-semibold text-[#E87722] hover:underline">See a Payment Schedule →</Link>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#D8E4DC] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#D4EFE6] text-[#2E8B6A] flex items-center justify-center text-2xl mb-6">
              🔧
            </div>
            <h3 className="text-xl font-bold font-serif text-[#111A14] mb-3">Repairs, Actually Tracked</h3>
            <p className="text-xs text-[#6B7E72] leading-relaxed mb-6">
              A tenant logs an issue, a landlord assigns someone to fix it, and both sides watch it move from
              assigned to in progress to done — no more &quot;I&apos;ll send someone&quot; and silence.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-2.5 py-1 rounded-full bg-[#D4EFE6]/50 text-[#2E8B6A] text-[10px] font-medium">Priority-Based Targets</span>
              <span className="px-2.5 py-1 rounded-full bg-[#D4EFE6]/50 text-[#2E8B6A] text-[10px] font-medium">Status You Can See</span>
            </div>
            <Link href="/portal" className="text-xs font-semibold text-[#2E8B6A] hover:underline">Log a Request →</Link>
          </div>
        </div>
      </section>

      {/* 4.5 HOW IT WORKS (STEP FLOW) */}
      <section id="how-it-works" className="py-20 px-6 md:px-12 bg-white border-y border-[#D8E4DC]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#E87722] mb-2 block">
              Start to Finish
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0F3D26] mb-4">
              How Civitas Actually Works
            </h2>
            <p className="text-sm text-[#6B7E72] leading-relaxed">
              Four real steps, in order — this is the actual product, not a pitch deck.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#D6EDE1] -translate-y-6 z-0" />

            {[
              {
                step: '01',
                title: 'Register & Invite',
                desc: 'A landlord registers a property and generates a sign-up link for their tenant to join.',
                icon: '📍',
              },
              {
                step: '02',
                title: 'Legal Rent Schedule',
                desc: 'Civitas calculates what\u2019s actually owed under Rent Act 220 and builds the real payment schedule.',
                icon: '⚖️',
              },
              {
                step: '03',
                title: 'Pay By Mobile Money',
                desc: 'The tenant pays each installment via MTN MoMo, Telecel Cash, or AT Money as it comes due.',
                icon: '💳',
              },
              {
                step: '04',
                title: 'Maintenance, Tracked',
                desc: 'Either side logs an issue, a technician gets assigned, and its status is visible until it\u2019s done.',
                icon: '🔧',
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
              Built for Ghana&apos;s Actual Rent Law
            </h2>
            <p className="text-sm text-white/60 leading-relaxed mb-10">
              Most property tools are generic. Civitas starts from the specific gap in Ghana&apos;s rental market:
              the Rent Act caps advance rent at 6 months, but most landlords still demand a year or two upfront.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="text-2xl font-serif font-bold text-[#E87722]">01</div>
                <div>
                  <h4 className="text-base font-semibold text-white">Rent Act 220 Compliant Billing</h4>
                  <p className="text-xs text-white/50 mt-1">Only the legal 6-month advance is billed upfront — the rest becomes ordinary monthly rent.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="text-2xl font-serif font-bold text-[#E87722]">02</div>
                <div>
                  <h4 className="text-base font-semibold text-white">Solar-Ready Property Records</h4>
                  <p className="text-xs text-white/50 mt-1">Owners record whether a property has solar and battery backup at registration.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="text-2xl font-serif font-bold text-[#E87722]">03</div>
                <div>
                  <h4 className="text-base font-semibold text-white">Tracked, Not Guessed</h4>
                  <p className="text-xs text-white/50 mt-1">Every payment and maintenance request has a real status both sides can see.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl">
            <div className="text-6xl font-serif font-bold text-white mb-2">6<span className="text-[#E87722]"> mo</span></div>
            <div className="text-sm text-white/50 mb-8">Legal advance rent cap under Rent Act 220</div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="text-2xl font-serif font-bold text-[#D6EDE1]">3</div>
                <div className="text-[11px] text-white/40 mt-1">Mobile Money Rails Supported</div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="text-2xl font-serif font-bold text-[#E87722]">2h</div>
                <div className="text-[11px] text-white/40 mt-1">Emergency Response Target</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LOCATIONS FOOTPRINT */}
      <LocationsGrid />

      {/* 7. WHO IT'S FOR */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E87722] mb-2 block">
            Get Started
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0F3D26]">
            Built For Everyone In the Lease
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl border border-[#D8E4DC] p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col">
            <span className="text-3xl mb-4">🏠</span>
            <h3 className="text-lg font-serif font-bold text-[#111A14] mb-2">Property Owners</h3>
            <p className="text-xs text-[#6B7E72] leading-relaxed mb-6 flex-1">
              Register a property, invite your tenant, and get a Rent Act compliant payment schedule generated
              automatically — no spreadsheets, no guessing what&apos;s legal to charge.
            </p>
            <Link
              href="/portal?mode=signup&role=client"
              className="text-xs font-semibold text-[#1A5C3A] hover:underline"
            >
              Register a Property →
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-[#D8E4DC] p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col">
            <span className="text-3xl mb-4">🔑</span>
            <h3 className="text-lg font-serif font-bold text-[#111A14] mb-2">Tenants</h3>
            <p className="text-xs text-[#6B7E72] leading-relaxed mb-6 flex-1">
              See exactly what you owe and when, pay by Mobile Money in a few taps, and log a maintenance issue
              without chasing anyone down.
            </p>
            <Link
              href="/portal?mode=signup&role=tenant"
              className="text-xs font-semibold text-[#1A5C3A] hover:underline"
            >
              Find Your Lease →
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-[#D8E4DC] p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col">
            <span className="text-3xl mb-4">🔧</span>
            <h3 className="text-lg font-serif font-bold text-[#111A14] mb-2">Technicians</h3>
            <p className="text-xs text-[#6B7E72] leading-relaxed mb-6 flex-1">
              Get assigned real jobs from property owners, see the full request up front, and mark work
              complete when it&apos;s actually done.
            </p>
            <Link
              href="/portal?mode=signup&role=technician"
              className="text-xs font-semibold text-[#1A5C3A] hover:underline"
            >
              Join as a Technician →
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION SECTION */}
      <FAQSection />

      {/* 9. TESTIMONIAL QUOTE */}
      <section className="bg-[#E87722] text-white py-20 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-2xl sm:text-4xl font-serif font-medium italic leading-snug mb-8">
            Ghana&apos;s Rent Act caps advance rent at 6 months — most landlords still ask for 2 years upfront.
            We built Civitas to close that gap, not paper over it.
          </p>
          <div className="text-xs text-white/80 uppercase tracking-widest font-semibold">
            The Civitas Team
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
              Questions? Just Ask
            </h2>
            <p className="text-sm text-[#6B7E72] leading-relaxed mb-8">
              Whether you&apos;re a property owner setting up your first lease or a tenant trying to figure out
              what you actually owe, send us a message and we&apos;ll get back to you.
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
                <p className="text-xs text-[#6B7E72]">Thanks — we&apos;ll get back to you soon.</p>
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
                    <option>Tenant Support</option>
                    <option>Maintenance Partnership</option>
                    <option>General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your property, lease, or maintenance question..."
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
              Rent Act compliant property management for Ghana. Smart Living. Sustainable Legacy.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Services</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="#services" className="hover:text-white">Rent & Lease Management</Link></li>
              <li><Link href="#services" className="hover:text-white">Mobile Money Payments</Link></li>
              <li><Link href="#services" className="hover:text-white">Maintenance Tracking</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="#why" className="hover:text-white">About Civitas</Link></li>
              <li><Link href="#how-it-works" className="hover:text-white">How It Works</Link></li>
              <li><Link href="/portal" className="hover:text-white">Sign In / Sign Up</Link></li>
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
