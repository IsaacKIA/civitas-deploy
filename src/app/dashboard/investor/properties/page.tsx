import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { getAuthedProfile, createSupabaseServerClient } from '@/lib/supabase/server';
import { CurrencyAmount } from '@/components/CurrencyToggle';

export default async function DiasporaPropertiesPage() {
  const auth = await getAuthedProfile();
  const supabase = await createSupabaseServerClient();

  const { data: properties } = await supabase
    .from('properties')
    .select('*, leases(status, monthly_rent_ghs, tenant:profiles!tenant_id(full_name))')
    .eq('owner_id', auth?.user.id || '')
    .order('created_at', { ascending: false });

  return (
    <DashboardLayout role="investor" userName={auth?.profile.full_name}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">My Ghana Properties</h1>
            <p className="text-xs text-[#6B7E72] mt-1">
              Real-time occupancy, rental status, and local oversight of your real estate assets
            </p>
          </div>
          <Link
            href="/dashboard/owner/properties/new"
            className="px-5 py-2.5 rounded-full bg-[#0F3D26] hover:bg-[#1A5C3A] text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            + Register Ghana Property
          </Link>
        </div>

        {(!properties || properties.length === 0) ? (
          <div className="bg-white rounded-3xl border border-[#D8E4DC] p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#EEF7F2] text-[#0F3D26] text-3xl flex items-center justify-center mx-auto mb-4">
              🏠
            </div>
            <h2 className="text-base font-serif font-bold text-[#111A14] mb-2">No properties listed yet</h2>
            <p className="text-xs text-[#6B7E72] max-w-md mx-auto mb-6">
              Register your house, apartment, or commercial plot in Ghana to activate remote inspection scheduling and rental remittance.
            </p>
            <Link
              href="/dashboard/owner/properties/new"
              className="inline-flex px-6 py-2.5 rounded-full bg-[#0F3D26] text-white text-xs font-semibold hover:bg-[#1A5C3A] transition-all"
            >
              Add Your Ghana Property →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.map((p) => {
              const activeLease = (p.leases ?? []).find(
                (l: { status: string }) => l.status === 'active' || l.status === 'pending_first_payment'
              );
              return (
                <div key={p.id} className="bg-white rounded-2xl border border-[#D8E4DC] p-6 shadow-sm hover:border-[#1A5C3A] transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#111A14]">{p.name}</h3>
                      <p className="text-[11px] text-[#6B7E72]">{p.address}, {p.city}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#D6EDE1] text-[#0F3D26] capitalize">
                      {p.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-[#D8E4DC] text-xs">
                    <div>
                      <span className="text-[10px] text-[#6B7E72] block">Monthly Rent</span>
                      <span className="font-bold text-[#1A5C3A]">
                        <CurrencyAmount amountGhs={Number(p.monthly_rent || 0)} />
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#6B7E72] block">Tenant</span>
                      <span className="font-semibold text-[#111A14]">
                        {activeLease?.tenant ? (Array.isArray(activeLease.tenant) ? activeLease.tenant[0]?.full_name : activeLease.tenant?.full_name) : 'Vacant'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#D8E4DC] text-xs">
                    <Link
                      href={`/dashboard/investor/inspection?property=${p.id}`}
                      className="font-semibold text-[#1A5C3A] hover:underline"
                    >
                      Book Remote Inspection →
                    </Link>
                    <Link
                      href={`/dashboard/investor/agent?property=${p.id}`}
                      className="text-[#6B7E72] hover:text-[#111A14]"
                    >
                      Local Agent 🤝
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
