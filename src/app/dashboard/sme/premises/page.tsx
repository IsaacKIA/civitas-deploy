import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { getAuthedProfile, createSupabaseServerClient } from '@/lib/supabase/server';

export default async function SmePremisesPage() {
  const auth = await getAuthedProfile();
  const supabase = await createSupabaseServerClient();

  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('owner_id', auth?.user.id || '')
    .order('created_at', { ascending: false });

  return (
    <DashboardLayout role="sme" userName={auth?.profile.full_name || 'Business Owner'}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#111A14]">Commercial Premises</h1>
            <p className="text-xs text-[#6B7E72] mt-1">
              Branches, retail shops, offices, and facilities under your Civitas maintenance SLA
            </p>
          </div>
          <Link
            href="/dashboard/owner/properties/new"
            className="px-5 py-2.5 rounded-full bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            + Register Commercial Facility
          </Link>
        </div>

        {(!properties || properties.length === 0) ? (
          <div className="bg-white rounded-3xl border border-[#D8E4DC] p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] text-[#1E40AF] text-3xl flex items-center justify-center mx-auto mb-4">
              🏢
            </div>
            <h2 className="text-base font-serif font-bold text-[#111A14] mb-2">No premises registered yet</h2>
            <p className="text-xs text-[#6B7E72] max-w-md mx-auto mb-6">
              Add your store, office, or commercial warehouse to activate scheduled preventive servicing and 4-hour emergency technician dispatch.
            </p>
            <Link
              href="/dashboard/owner/properties/new"
              className="inline-flex px-6 py-2.5 rounded-full bg-[#1E40AF] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-all"
            >
              Add Your First Facility →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-[#D8E4DC] p-6 shadow-sm hover:border-[#1E40AF] transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏢</span>
                    <div>
                      <h3 className="text-sm font-bold text-[#111A14]">{p.name}</h3>
                      <p className="text-[11px] text-[#6B7E72]">{p.address}, {p.city}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#D6EDE1] text-[#0F3D26] capitalize">
                    {p.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-[#D8E4DC] text-xs">
                  <div>
                    <span className="text-[10px] text-[#6B7E72] block">GhanaPost GPS</span>
                    <span className="font-mono font-semibold text-[#111A14]">{p.ghana_post_gps || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B7E72] block">Solar / Backup</span>
                    <span className="font-semibold text-[#1A5C3A]">{p.has_solar ? 'Equipped ☀️' : 'Grid only'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#D8E4DC]">
                  <Link
                    href={`/dashboard/sme/schedule?property=${p.id}`}
                    className="text-xs font-semibold text-[#1E40AF] hover:underline"
                  >
                    View Maintenance Schedule →
                  </Link>
                  <Link
                    href={`/dashboard/sme/maintenance?property=${p.id}`}
                    className="text-xs font-semibold text-[#E87722] hover:underline"
                  >
                    Report Issue
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
