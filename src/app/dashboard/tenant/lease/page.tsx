import DashboardLayout from '@/components/DashboardLayout';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';

const INSTALLMENT_STATUS_STYLE: Record<string, string> = {
  due: 'bg-[#F5F9F6] text-[#6B7E72]',
  pending_confirmation: 'bg-[#FEF3C7] text-[#92610A]',
  paid: 'bg-[#EEF7F2] text-[#1A5C3A]',
  overdue: 'bg-[#FDECEA] text-[#D94F3D]',
  waived: 'bg-[#F5F9F6] text-[#6B7E72]',
};

export default async function TenantLeasePage() {
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
      'id, status, monthly_rent_ghs, advance_months_requested, legal_advance_months, start_date, end_date, created_at, properties(name, address, city, region, ghana_post_gps), lease_installments(id, installment_number, amount_ghs, due_date, kind, status, paid_at)'
    )
    .eq('tenant_id', auth.user.id)
    .in('status', ['pending_first_payment', 'active'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return (
      <DashboardLayout role="tenant" userName={auth.profile.full_name}>
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#FAD4D0] bg-[#FDECEA] shadow-sm text-center text-xs text-[#D94F3D]">
          Couldn&apos;t load your lease right now. Please refresh.
        </div>
      </DashboardLayout>
    );
  }

  if (!lease) {
    return (
      <DashboardLayout role="tenant" userName={auth.profile.full_name}>
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm text-center text-xs text-[#6B7E72] py-14">
          You don&apos;t have an active lease yet. Once your landlord creates one on Civitas, its full terms and payment schedule will appear here.
        </div>
      </DashboardLayout>
    );
  }

  const property = Array.isArray(lease.properties) ? lease.properties[0] : lease.properties;
  const installments = (lease.lease_installments ?? []).slice().sort((a, b) => a.installment_number - b.installment_number);
  const paidCount = installments.filter((i) => i.status === 'paid').length;
  const paidTotal = installments.filter((i) => i.status === 'paid').reduce((sum, i) => sum + Number(i.amount_ghs), 0);
  const scheduledTotal = installments.reduce((sum, i) => sum + Number(i.amount_ghs), 0);

  return (
    <DashboardLayout role="tenant" userName={auth.profile.full_name}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">My Lease</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Lease terms and full payment history, generated from your agreed terms.</p>
        </div>
        <a
          href={`/api/leases/${lease.id}/pdf`}
          className="px-5 py-2.5 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2 w-fit"
        >
          📥 Download PDF Summary
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm">
          <div className="border-b border-[#D8E4DC] pb-6 mb-6 flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E87722]">Lease Summary</span>
              <h2 className="text-2xl font-serif font-bold text-[#0F3D26] mt-1">{property?.name ?? 'Your property'}</h2>
              <p className="text-xs text-[#6B7E72]">{property?.address}{property?.city ? `, ${property.city}` : ''}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-xs font-bold capitalize">
              {lease.status.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-6 text-xs text-[#3D5044] leading-relaxed font-sans">
            <div>
              <h3 className="font-bold text-[#111A14] text-sm mb-1">Term</h3>
              <p>
                This lease begins{' '}
                <strong>{new Date(lease.start_date).toLocaleDateString('en-GH', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                {lease.end_date && (
                  <>
                    {' '}and ends{' '}
                    <strong>{new Date(lease.end_date).toLocaleDateString('en-GH', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                  </>
                )}.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#111A14] text-sm mb-1">Rent Act 220 Compliance</h3>
              <p>
                Ghana&apos;s Rent Act 220 caps advance rent at 6 months. Your landlord requested{' '}
                <strong>{lease.advance_months_requested} months</strong>; you were only billed the legal{' '}
                <strong>{lease.legal_advance_months} months</strong> upfront
                {lease.advance_months_requested > lease.legal_advance_months
                  ? `, with the remaining ${lease.advance_months_requested - lease.legal_advance_months} months billed as ordinary monthly rent as each falls due.`
                  : '.'}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#111A14] text-sm mb-1">Monthly Rent</h3>
              <p>
                <strong>GHS {Number(lease.monthly_rent_ghs).toLocaleString()}</strong> per month, payable via Mobile
                Money from your Civitas dashboard.
              </p>
            </div>

            <div className="pt-4 border-t border-[#D8E4DC]">
              <h3 className="font-bold text-[#111A14] text-sm mb-3">Payment History</h3>
              <div className="space-y-1.5">
                {installments.map((installment) => (
                  <div key={installment.id} className="flex justify-between items-center text-[11px] px-3 py-2 rounded-xl bg-[#F5F9F6]">
                    <span className="text-[#6B7E72]">
                      #{installment.installment_number} ·{' '}
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
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-serif font-bold text-[#0F3D26] mb-4">Lease Quick Facts</h2>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-[#F5F9F6]">
                <span className="text-[#6B7E72]">Monthly Rent</span>
                <span className="font-bold text-[#1A5C3A]">GHS {Number(lease.monthly_rent_ghs).toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-[#F5F9F6]">
                <span className="text-[#6B7E72]">Legal Advance</span>
                <span className="font-bold text-[#111A14]">{lease.legal_advance_months} Months (Act 220)</span>
              </div>
              {property?.ghana_post_gps && (
                <div className="flex justify-between p-3 rounded-xl bg-[#F5F9F6]">
                  <span className="text-[#6B7E72]">Ghana Post GPS</span>
                  <span className="font-mono font-bold text-[#111A14]">{property.ghana_post_gps}</span>
                </div>
              )}
              <div className="flex justify-between p-3 rounded-xl bg-[#F5F9F6]">
                <span className="text-[#6B7E72]">Paid to Date</span>
                <span className="font-bold text-[#2E8B6A]">
                  GHS {paidTotal.toLocaleString()} / {scheduledTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-[#F5F9F6]">
                <span className="text-[#6B7E72]">Installments Paid</span>
                <span className="font-bold text-[#111A14]">{paidCount} / {installments.length}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-[#F5F9F6] text-center border border-[#D8E4DC]">
            <div className="text-[10px] text-[#6B7E72] leading-relaxed">
              This summary reflects the terms your landlord entered on Civitas. It is not a substitute for legal
              advice — for disputes, contact Ghana&apos;s Rent Control Department for your district.
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
