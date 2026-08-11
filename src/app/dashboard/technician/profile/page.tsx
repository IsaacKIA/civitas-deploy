import DashboardLayout from '@/components/DashboardLayout';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';

export default async function TechnicianProfilePage() {
  const auth = await getAuthedProfile();

  if (!auth) {
    return (
      <DashboardLayout role="technician">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm text-center text-xs text-[#6B7E72]">
          Your session has expired. Please sign in again.
        </div>
      </DashboardLayout>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { count: completedCount } = await supabase
    .from('maintenance_requests')
    .select('id', { count: 'exact', head: true })
    .eq('technician_id', auth.user.id)
    .eq('status', 'completed');

  const { count: activeCount } = await supabase
    .from('maintenance_requests')
    .select('id', { count: 'exact', head: true })
    .eq('technician_id', auth.user.id)
    .in('status', ['assigned', 'in_progress']);

  const initial = auth.profile.full_name?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <DashboardLayout role="technician" userName={auth.profile.full_name}>
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#D8E4DC]">
          <div className="w-16 h-16 rounded-full bg-[#D97706] text-white flex items-center justify-center font-bold text-2xl">
            {initial}
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">{auth.profile.full_name}</h1>
            <p className="text-xs text-[#6B7E72]">{auth.profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-[#F5F9F6] border border-[#D8E4DC] text-center">
            <div className="text-2xl font-serif font-bold text-[#1A5C3A]">{completedCount ?? 0}</div>
            <div className="text-[10px] text-[#6B7E72] uppercase font-semibold mt-1">Jobs Completed</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#F5F9F6] border border-[#D8E4DC] text-center">
            <div className="text-2xl font-serif font-bold text-[#D97706]">{activeCount ?? 0}</div>
            <div className="text-[10px] text-[#6B7E72] uppercase font-semibold mt-1">Active Jobs</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#F5F9F6] border border-[#D8E4DC] text-[11px] text-[#6B7E72] leading-relaxed">
          Skill certifications, customer ratings, and Mobile Money payout details aren&apos;t collected on Civitas
          yet — this profile shows only what&apos;s actually on your account.
        </div>
      </div>
    </DashboardLayout>
  );
}
