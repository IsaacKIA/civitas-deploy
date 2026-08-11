import DashboardLayout from '@/components/DashboardLayout';

export default function InvestorDocumentsPage() {
  return (
    <DashboardLayout role="investor">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-[#D8E4DC] shadow-sm p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F5F3FF] text-[#7C3AED] text-3xl flex items-center justify-center mx-auto mb-5">📄</div>
        <h1 className="text-xl font-serif font-bold text-[#0F3D26] mb-3">No investment documents yet</h1>
        <p className="text-xs text-[#6B7E72] leading-relaxed max-w-md mx-auto">
          Term sheets, capital account statements, and legal documents will appear here once Civitas has a real
          investment product to generate them from.
        </p>
      </div>
    </DashboardLayout>
  );
}
