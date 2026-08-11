import DashboardLayout from '@/components/DashboardLayout';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';

export default async function TechnicianEarningsPage() {
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

  return (
    <DashboardLayout role="technician" userName={auth.profile.full_name}>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Earnings</h1>
        <p className="text-xs text-[#6B7E72] mt-1">Mobile Money payouts for completed jobs</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#D8E4DC] shadow-sm p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FEF3C7] text-[#D97706] text-3xl flex items-center justify-center mx-auto mb-4">💰</div>
        <h2 className="text-lg font-serif font-bold text-[#0F3D26] mb-2">Payouts aren&apos;t set up yet</h2>
        <p className="text-xs text-[#6B7E72] max-w-sm mx-auto leading-relaxed">
          Civitas doesn&apos;t have a technician compensation model configured yet — no rates, no payout schedule,
          no Mobile Money dispatch. You&apos;ve completed <strong className="text-[#111A14]">{completedCount ?? 0}</strong>{' '}
          job{completedCount === 1 ? '' : 's'} so far; once payouts are configured, they&apos;ll appear here for real.
        </p>
      </div>
    </DashboardLayout>
  );
}
