import DashboardLayout from '@/components/DashboardLayout';

export default function InvestorESGPage() {
  return (
    <DashboardLayout role="investor">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-[#D8E4DC] shadow-sm p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-[#D4EFE6] text-[#2E8B6A] text-3xl flex items-center justify-center mx-auto mb-5">🌿</div>
        <h1 className="text-xl font-serif font-bold text-[#0F3D26] mb-3">No ESG measurement is in place yet</h1>
        <p className="text-xs text-[#6B7E72] leading-relaxed max-w-md mx-auto">
          Carbon offset figures, clean energy generation, and job-creation numbers shown here before were
          invented, and referenced real standards bodies (Verra, UN SDGs) that Civitas has no actual
          certification or relationship with. Nothing is measured yet, so nothing is shown until it is.
        </p>
      </div>
    </DashboardLayout>
  );
}
