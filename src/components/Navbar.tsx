'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change or ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const links = [
    { label: 'Services',        href: '/#services' },
    { label: 'How It Works',    href: '/#how-it-works' },
    { label: 'Why Civitas',     href: '/#why' },
    { label: 'Contact',         href: '/#contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-12 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-[#D8E4DC] shadow-sm'
            : 'bg-transparent text-white'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 text-2xl font-bold font-serif tracking-tight">
          <span className={scrolled ? 'text-[#0F3D26]' : 'text-white'}>Civitas</span>
          <span className="text-[#E87722]">.</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`${scrolled ? 'text-[#3D5044] hover:text-[#1A5C3A]' : 'text-white/80 hover:text-white'} transition-colors`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/portal"
            className="hidden sm:inline-flex px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#E87722] hover:bg-[#B85A10] text-white shadow-md transition-all hover:-translate-y-0.5"
          >
            Sign In / Sign Up
          </Link>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            className={`md:hidden flex flex-col justify-center items-center gap-1.5 w-9 h-9 rounded-xl border transition-all ${
              scrolled
                ? 'border-[#D8E4DC] bg-white'
                : 'border-white/20 bg-white/10'
            }`}
          >
            <span className={`block w-4.5 h-0.5 rounded-full transition-all ${scrolled ? 'bg-[#0F3D26]' : 'bg-white'} ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-4.5 h-0.5 rounded-full transition-all ${scrolled ? 'bg-[#0F3D26]' : 'bg-white'} ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-4.5 h-0.5 rounded-full transition-all ${scrolled ? 'bg-[#0F3D26]' : 'bg-white'} ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute top-0 right-0 h-full w-72 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 h-16 border-b border-[#D8E4DC]">
              <span className="text-xl font-serif font-bold text-[#0F3D26]">
                Civitas<span className="text-[#E87722]">.</span>
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F5F9F6] flex items-center justify-center text-[#6B7E72] hover:text-[#111A14]"
              >
                ✕
              </button>
            </div>

            <nav className="flex-1 px-6 py-8 flex flex-col gap-2">
              {links.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-[#3D5044] hover:bg-[#EEF7F2] hover:text-[#1A5C3A] transition-all"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="px-6 pb-8 flex flex-col gap-3">
              <Link
                href="/portal"
                onClick={() => setMenuOpen(false)}
                className="w-full py-3 rounded-full text-center text-xs font-semibold uppercase tracking-wider bg-[#E87722] hover:bg-[#B85A10] text-white shadow-md transition-all"
              >
                Sign In / Sign Up →
              </Link>
              <div className="text-center text-xs text-[#6B7E72]">
                <a href="tel:+233555062589" className="font-semibold text-[#1A5C3A]">+233 55 506 2589</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
