import DashboardLayout from '@/components/DashboardLayout';

export default function InvestorMarketplacePage() {
  return (
    <DashboardLayout role="investor">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-[#D8E4DC] shadow-sm p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F5F3FF] text-[#7C3AED] text-3xl flex items-center justify-center mx-auto mb-5">🏗️</div>
        <h1 className="text-xl font-serif font-bold text-[#0F3D26] mb-3">No investment projects are open yet</h1>
        <p className="text-xs text-[#6B7E72] leading-relaxed max-w-md mx-auto">
          This page previously let someone click through a fake &quot;commit to invest&quot; flow into fabricated
          projects with an invented guaranteed rate of return — that&apos;s been removed rather than fixed
          cosmetically, since a working commitment flow requires real investment terms and legal structure to
          exist first, not just a form that appears to work.
        </p>
      </div>
    </DashboardLayout>
  );
}
