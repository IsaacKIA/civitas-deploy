import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';
import { PROPERTY_STATUS_LABEL, PROPERTY_STATUS_STYLE, type PropertyStatus } from '@/lib/property-status';

export default async function OwnerDashboard() {
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

  const [{ data: properties, error: propertiesError }, { data: leases, error: leasesError }] = await Promise.all([
    supabase
      .from('properties')
      .select('id, name, status, monthly_rent, has_solar, leases(status, tenant:profiles!tenant_id(full_name))')
      .eq('owner_id', auth.user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('leases')
      .select('id, status, lease_installments(amount_ghs, status, paid_at)')
      .eq('owner_id', auth.user.id),
  ]);

  if (propertiesError) console.error('[OwnerDashboard] propertiesError:', propertiesError);
  if (leasesError) console.error('[OwnerDashboard] leasesError:', leasesError);

  const hasError = !!propertiesError || !!leasesError;


  const totalProperties = properties?.length ?? 0;
  const occupiedCount = properties?.filter((p) => p.status === 'active').length ?? 0;
  const vacantCount = properties?.filter((p) => p.status === 'vacant').length ?? 0;
  const solarCount = properties?.filter((p) => p.has_solar).length ?? 0;
  const activeLeaseCount = leases?.filter((l) => l.status === 'active' || l.status === 'pending_first_payment').length ?? 0;

  const now = new Date();
  const rentCollectedThisMonth = (leases ?? [])
    .flatMap((l) => l.lease_installments ?? [])
    .filter((i) => {
      if (i.status !== 'paid' || !i.paid_at) return false;
      const paidDate = new Date(i.paid_at);
      return paidDate.getMonth() === now.getMonth() && paidDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, i) => sum + Number(i.amount_ghs), 0);

  const stats = [
    {
      label: 'Total Properties',
      value: String(totalProperties),
      sub: `${occupiedCount} occupied · ${vacantCount} vacant`,
      icon: '🏠',
      bg: '#EEF7F2',
    },
    {
      label: 'Rent Collected',
      value: `GHS ${rentCollectedThisMonth.toLocaleString()}`,
      sub: 'This month',
      icon: '💰',
      bg: '#FEF3C7',
    },
    {
      label: 'Active Leases',
      value: String(activeLeaseCount),
      sub: 'Across all properties',
      icon: '📜',
      bg: '#D4EFE6',
    },
    {
      label: 'Solar-Equipped',
      value: String(solarCount),
      sub: `of ${totalProperties} properties`,
      icon: '☀️',
      bg: '#FEF3C7',
    },
  ];

  return (
    <DashboardLayout role="owner" userName={auth.profile.full_name}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Owner Dashboard</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Here&apos;s your portfolio snapshot.</p>
        </div>
        <Link
          href="/dashboard/owner/properties/new"
          className="px-5 py-2.5 rounded-full bg-[#0F3D26] hover:bg-[#1A5C3A] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          + Add Property
        </Link>
      </div>

      {hasError && (
        <div className="p-4 rounded-2xl bg-[#FDECEA] border border-[#FAD4D0] text-xs text-[#D94F3D] mb-6">
          Couldn&apos;t load some of your portfolio data. Please refresh.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#D8E4DC] p-5 shadow-sm hover:shadow-md transition-all">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3" style={{ background: s.bg }}>
              {s.icon}
            </div>
            <div className="text-xl font-bold font-serif text-[#111A14]">{s.value}</div>
            <div className="text-[10px] font-semibold text-[#6B7E72] uppercase tracking-wider mt-0.5">{s.label}</div>
            <div className="text-[10px] text-[#A8B8AE] mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#D8E4DC] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D8E4DC] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#111A14]">My Properties</h2>
            <Link href="/dashboard/owner/properties" className="text-[10px] text-[#1A5C3A] font-semibold hover:underline">View All →</Link>
          </div>

          {!totalProperties && !hasError && (
            <div className="p-8 text-center text-xs text-[#6B7E72]">
              No properties yet.{' '}
              <Link href="/dashboard/owner/properties/new" className="text-[#1A5C3A] font-semibold hover:underline">
                Register your first one →
              </Link>
            </div>
          )}

          {!!totalProperties && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#F5F9F6] border-b border-[#D8E4DC]">
                    <th className="px-4 py-3 text-left text-[#6B7E72] font-semibold uppercase tracking-wider">Property</th>
                    <th className="px-4 py-3 text-left text-[#6B7E72] font-semibold uppercase tracking-wider">Tenant</th>
                    <th className="px-4 py-3 text-left text-[#6B7E72] font-semibold uppercase tracking-wider">Rent/mo</th>
                    <th className="px-4 py-3 text-left text-[#6B7E72] font-semibold uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8E4DC]">
                  {properties!.slice(0, 6).map((p) => {
                    const activeLease = (p.leases ?? []).find((l) => l.status === 'active' || l.status === 'pending_first_payment');
                    const tenant = activeLease
                      ? Array.isArray(activeLease.profiles) ? activeLease.profiles[0] : activeLease.profiles
                      : null;
                    return (
                      <tr key={p.id} className="hover:bg-[#F5F9F6] transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-[#111A14]">{p.name}</div>
                        </td>
                        <td className="px-4 py-3 text-[#3D5044]">{tenant?.full_name ?? '—'}</td>
                        <td className="px-4 py-3 font-semibold text-[#1A5C3A]">GHS {Number(p.monthly_rent).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${PROPERTY_STATUS_STYLE[p.status as PropertyStatus] ?? ''}`}>
                            {PROPERTY_STATUS_LABEL[p.status as PropertyStatus] ?? p.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-[#D8E4DC] shadow-sm p-5">
            <h2 className="text-sm font-bold text-[#111A14] mb-2">🔧 Maintenance</h2>
            <p className="text-[10px] text-[#6B7E72] leading-relaxed">
              <Link href="/dashboard/owner/maintenance" className="text-[#1A5C3A] font-semibold hover:underline">
                View all requests →
              </Link>
            </p>
          </div>

          <div className="bg-[#0F3D26] rounded-2xl p-5 text-white">
            <h2 className="text-sm font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: 'Invite Tenant', icon: '👤', href: '/dashboard/owner/tenants' },
                { label: 'Create a Lease', icon: '📜', href: '/dashboard/owner/leases/new' },
                { label: 'View Escrow & Payouts', icon: '💰', href: '/dashboard/owner/finances' },
                { label: 'Log Maintenance Issue', icon: '🔧', href: '/dashboard/owner/maintenance/new' },
                { label: 'View Energy Report', icon: '☀️', href: '/dashboard/owner/energy' },
              ].map((a, i) => (
                <Link
                  key={i}
                  href={a.href}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium transition-all"
                >
                  <span>{a.icon}</span>{a.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
