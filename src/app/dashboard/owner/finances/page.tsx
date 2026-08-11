import DashboardLayout from '@/components/DashboardLayout';
import RentActEscrowCalculator from '@/components/RentActEscrowCalculator';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';

const INSTALLMENT_STATUS_STYLE: Record<string, string> = {
  due: 'bg-[#F5F9F6] text-[#6B7E72]',
  pending_confirmation: 'bg-[#FEF3C7] text-[#92610A]',
  paid: 'bg-[#EEF7F2] text-[#1A5C3A]',
  overdue: 'bg-[#FDECEA] text-[#D94F3D]',
  waived: 'bg-[#F5F9F6] text-[#6B7E72]',
};

export default async function OwnerFinancesPage() {
  const auth = await getAuthedProfile();

  if (!auth) {
    return (
      <DashboardLayout role="owner">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm text-center text-xs text-[#6B7E72]">
          Your session has expired. Please sign in again.
        </div>
      </DashboardLayout>
    );
  }

  const supabase = await createSupabaseServerClient();

  const { data: leases, error: leaseError } = await supabase
    .from('leases')
    .select(
      'id, status, monthly_rent_ghs, advance_months_requested, legal_advance_months, properties(name), lease_installments(id, installment_number, amount_ghs, due_date, kind, status)'
    )
    .eq('owner_id', auth.user.id)
    .order('created_at', { ascending: false });

  return (
    <DashboardLayout role="owner" userName={auth.profile.full_name}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Financial Statements & Payouts</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Rent Act 220 compliant escrow schedule and property P&L</p>
        </div>
      </div>

      {/* Real escrow / rent schedule ledger */}
      <div className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm mb-8">
        <h2 className="text-base font-serif font-bold text-[#0F3D26] mb-1">Escrow & Rent Schedule</h2>
        <p className="text-[11px] text-[#6B7E72] mb-5">Live payment schedule across all your leases.</p>

        {leaseError && (
          <div className="p-4 rounded-2xl bg-[#FDECEA] border border-[#FAD4D0] text-xs text-[#D94F3D]">
            Couldn&apos;t load your lease schedule right now. Please refresh.
          </div>
        )}

        {!leaseError && (!leases || leases.length === 0) && (
          <div className="p-8 text-center text-xs text-[#6B7E72]">
            No leases yet. Once you create a lease for a tenant, its Rent Act compliant payment schedule appears here.
          </div>
        )}

        {!leaseError && leases && leases.length > 0 && (
          <div className="space-y-6">
            {leases.map((lease) => {
              const property = Array.isArray(lease.properties) ? lease.properties[0] : lease.properties;
              const installments = (lease.lease_installments ?? []).slice().sort(
                (a, b) => a.installment_number - b.installment_number
              );
              const paidTotal = installments
                .filter((i) => i.status === 'paid')
                .reduce((sum, i) => sum + Number(i.amount_ghs), 0);
              const scheduledTotal = installments.reduce((sum, i) => sum + Number(i.amount_ghs), 0);

              return (
                <div key={lease.id} className="border border-[#D8E4DC] rounded-2xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-sm font-bold text-[#111A14]">{property?.name ?? 'Property'}</div>
                      <div className="text-[10px] text-[#6B7E72]">
                        GHS {Number(lease.monthly_rent_ghs).toLocaleString()}/mo · {lease.advance_months_requested} mo requested
                        {lease.advance_months_requested > lease.legal_advance_months
                          ? ` (${lease.legal_advance_months} mo legal, rest billed monthly)`
                          : ' (fully compliant)'}
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-[#6B7E72]">
                      <div>Collected: <strong className="text-[#1A5C3A]">GHS {paidTotal.toLocaleString()}</strong> / GHS {scheduledTotal.toLocaleString()}</div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#F5F9F6] font-bold">{lease.status}</span>
                      <a
                        href={`/api/leases/${lease.id}/pdf`}
                        className="block mt-2 text-[#1A5C3A] font-bold hover:underline"
                      >
                        📥 Download PDF
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {installments.map((installment) => (
                      <div key={installment.id} className="flex justify-between items-center text-[11px] px-3 py-2 rounded-xl bg-[#F5F9F6]">
                        <span className="text-[#6B7E72]">
                          {new Date(installment.due_date).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="font-bold text-[#111A14]">GHS {Number(installment.amount_ghs).toLocaleString()}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${INSTALLMENT_STATUS_STYLE[installment.status] ?? ''}`}>
                          {installment.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Illustrative estimator — not tied to a specific lease */}
      <RentActEscrowCalculator />
    </DashboardLayout>
  );
}
