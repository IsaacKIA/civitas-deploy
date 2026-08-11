'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F3D26] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(46,125,82,0.3)_0%,transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(232,119,34,0.1)_0%,transparent_45%)] pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg">
        <div className="text-8xl font-serif font-bold text-[#E87722] mb-4">404</div>
        <h1 className="text-3xl font-serif font-bold text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-white/60 leading-relaxed mb-8">
          This page doesn&apos;t exist or has been moved. Return to the Civitas platform to continue managing your properties.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-[#E87722] hover:bg-[#B85A10] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
          >
            ← Back to Homepage
          </Link>
          <Link
            href="/portal"
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-all"
          >
            Sign In to Portal →
          </Link>
        </div>

        <div className="mt-12 text-xs text-white/30">
          Civitas PropTech v2.0 · <a href="tel:+233555062589" className="hover:text-white/60">+233 55 506 2589</a>
        </div>
      </div>
    </div>
  );
}
