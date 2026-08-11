import DashboardLayout from '@/components/DashboardLayout';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';
import RentPaymentClient from './RentPaymentClient';

export default async function TenantPayRentPage() {
  const auth = await getAuthedProfile();

  // Middleware already gates unauthenticated/wrong-role access to this
  // route, but a server component must never assume that held — treat this
  // page as if it could be reached directly.
  if (!auth) {
    return (
      <DashboardLayout role="tenant">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm text-center text-xs text-[#6B7E72]">
          Your session has expired. Please sign in again.
        </div>
      </DashboardLayout>
    );
  }

  const supabase = await createSupabaseServerClient();

  const { data: lease, error: leaseError } = await supabase
    .from('leases')
    .select('id, legal_advance_months, advance_months_requested, properties(name, address)')
    .eq('tenant_id', auth.user.id)
    .in('status', ['pending_first_payment', 'active'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (leaseError) {
    return (
      <DashboardLayout role="tenant" userName={auth.profile.full_name}>
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#FAD4D0] bg-[#FDECEA] shadow-sm text-center text-xs text-[#D94F3D]">
          We couldn&apos;t load your rent details right now. Please refresh, or contact support if this continues.
        </div>
      </DashboardLayout>
    );
  }

  if (!lease) {
    return (
      <DashboardLayout role="tenant" userName={auth.profile.full_name}>
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm text-center text-xs text-[#6B7E72] py-14">
          You don&apos;t have an active lease yet. Once your landlord sets one up on Civitas, your payment schedule will appear here.
        </div>
      </DashboardLayout>
    );
  }

  const { data: dueInstallment } = await supabase
    .from('lease_installments')
    .select('id, amount_ghs, due_date, kind, status')
    .eq('lease_id', lease.id)
    .in('status', ['due', 'pending_confirmation', 'overdue'])
    .order('installment_number', { ascending: true })
    .limit(1)
    .maybeSingle();

  const property = Array.isArray(lease.properties) ? lease.properties[0] : lease.properties;

  return (
    <DashboardLayout role="tenant" userName={auth.profile.full_name}>
      <RentPaymentClient
        property={{ name: property?.name ?? 'Your property', address: property?.address ?? '' }}
        dueInstallment={
          dueInstallment
            ? {
                id: dueInstallment.id,
                amountGhs: Number(dueInstallment.amount_ghs),
                dueDate: dueInstallment.due_date,
                kind: dueInstallment.kind,
                status: dueInstallment.status,
              }
            : null
        }
        legalAdvanceMonths={lease.legal_advance_months}
        advanceMonthsRequested={lease.advance_months_requested}
      />
    </DashboardLayout>
  );
}
