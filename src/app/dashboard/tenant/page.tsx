import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';
import RentPaymentClient from './rent/RentPaymentClient';

export default async function TenantDashboard() {
  const auth = await getAuthedProfile();

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

  const { data: lease, error } = await supabase
    .from('leases')
    .select(
      'id, status, monthly_rent_ghs, legal_advance_months, advance_months_requested, start_date, end_date, properties(name, address, ghana_post_gps), lease_installments(id, amount_ghs, due_date, kind, status)'
    )
    .eq('tenant_id', auth.user.id)
    .in('status', ['pending_first_payment', 'active'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const property = lease ? (Array.isArray(lease.properties) ? lease.properties[0] : lease.properties) : null;
  const dueInstallment = lease
    ? (lease.lease_installments ?? [])
        .filter((i) => ['due', 'pending_confirmation', 'overdue'].includes(i.status))
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0] ?? null
    : null;

  return (
    <DashboardLayout role="tenant" userName={auth.profile.full_name}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">My Home</h1>
          {property && (
            <p className="text-xs text-[#6B7E72] mt-1">
              {property.name}{property.ghana_post_gps ? ` · ${property.ghana_post_gps}` : ''}
            </p>
          )}
        </div>
        <Link
          href="/dashboard/tenant/maintenance/new"
          className="px-5 py-2.5 rounded-full bg-[#E87722] hover:bg-[#B85A10] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          + Log Issue
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-[#FDECEA] border border-[#FAD4D0] text-xs text-[#D94F3D] mb-6">
          Couldn&apos;t load your lease right now. Please refresh.
        </div>
      )}

      {!error && !lease && (
        <div className="bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm text-center text-xs text-[#6B7E72] py-14">
          You don&apos;t have an active lease yet. Once your landlord creates one on Civitas, it&apos;ll appear here.
        </div>
      )}

      {!error && lease && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
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
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-[#D8E4DC] shadow-sm p-5">
              <h2 className="text-sm font-bold text-[#111A14] mb-4">📄 My Lease</h2>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between"><span className="text-[#6B7E72]">Property</span><span className="font-semibold text-[#111A14]">{property?.name ?? '—'}</span></div>
                <div className="flex justify-between">
                  <span className="text-[#6B7E72]">Start Date</span>
                  <span className="font-semibold text-[#111A14]">{new Date(lease.start_date).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                {lease.end_date && (
                  <div className="flex justify-between">
                    <span className="text-[#6B7E72]">End Date</span>
                    <span className="font-semibold text-[#D97706]">{new Date(lease.end_date).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                )}
                <div className="flex justify-between"><span className="text-[#6B7E72]">Monthly Rent</span><span className="font-bold text-[#1A5C3A]">GHS {Number(lease.monthly_rent_ghs).toLocaleString()}</span></div>
                <div className="flex justify-between">
                  <span className="text-[#6B7E72]">Status</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-[10px] font-bold capitalize">{lease.status.replace('_', ' ')}</span>
                </div>
              </div>
              <Link href="/dashboard/tenant/lease" className="mt-4 block text-center text-xs text-[#1A5C3A] font-semibold hover:underline">
                View Full Lease & Payment History →
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-[#D8E4DC] shadow-sm p-5">
              <h2 className="text-sm font-bold text-[#111A14] mb-2">🔧 Maintenance</h2>
              <p className="text-[10px] text-[#6B7E72] leading-relaxed">
                <Link href="/dashboard/tenant/maintenance" className="text-[#1A5C3A] font-semibold hover:underline">
                  View your requests →
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
