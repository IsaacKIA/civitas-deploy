import DashboardLayout from '@/components/DashboardLayout';

export default function InvestorDashboard() {
  return (
    <DashboardLayout role="investor">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-[#D8E4DC] shadow-sm p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F5F3FF] text-[#7C3AED] text-3xl flex items-center justify-center mx-auto mb-5">💼</div>
        <h1 className="text-xl font-serif font-bold text-[#0F3D26] mb-3">Investing isn&apos;t open on Civitas yet</h1>
        <p className="text-xs text-[#6B7E72] leading-relaxed max-w-md mx-auto">
          There&apos;s no real investment product, portfolio, or dividend history to show here yet — earlier
          numbers on this page were placeholder content, not real figures. A real investor module needs the
          underlying investment terms, legal structure, and any required regulatory registration defined first,
          not just a UI built on top of invented numbers.
        </p>
      </div>
    </DashboardLayout>
  );
}
