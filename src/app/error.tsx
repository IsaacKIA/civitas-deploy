'use client';

import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0F3D26] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_50%,rgba(217,79,61,0.2)_0%,transparent_55%)] pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg">
        <div className="w-16 h-16 rounded-full bg-[#D94F3D]/20 text-[#D94F3D] text-3xl flex items-center justify-center mx-auto mb-6">
          ⚠
        </div>
        <h1 className="text-3xl font-serif font-bold text-white mb-3">Something went wrong</h1>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          An unexpected error occurred. If this keeps happening, contact support with the error reference below.
        </p>
        {error?.digest && (
          <code className="block text-[10px] font-mono text-white/30 mb-6 bg-white/5 rounded-xl px-4 py-2">
            Error Ref: {error.digest}
          </code>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-full bg-[#E87722] hover:bg-[#B85A10] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-all"
          >
            ← Back to Homepage
          </Link>
        </div>

        <div className="mt-12 text-xs text-white/30">
          Need help? <a href="mailto:admin@civitasestate.com" className="hover:text-white/60">admin@civitasestate.com</a>
        </div>
      </div>
    </div>
  );
}
