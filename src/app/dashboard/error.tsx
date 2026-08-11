'use client';

import Link from 'next/link';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#F5F9F6] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#D8E4DC] shadow-sm p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-[#FDECEA] text-[#D94F3D] text-2xl flex items-center justify-center mx-auto mb-5">
          ⚠
        </div>
        <h2 className="text-xl font-serif font-bold text-[#0F3D26] mb-2">Dashboard Error</h2>
        <p className="text-xs text-[#6B7E72] leading-relaxed mb-5">
          Something went wrong loading this dashboard. Your data is safe. Please try again or return to the main dashboard.
        </p>
        {error?.digest && (
          <code className="block text-[9px] font-mono text-[#A8B8AE] mb-5 bg-[#F5F9F6] rounded-xl px-4 py-2">
            Ref: {error.digest}
          </code>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-xs font-semibold transition-all"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-full border border-[#D8E4DC] text-[#6B7E72] hover:bg-[#F5F9F6] text-xs font-semibold transition-all"
          >
            ← Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
