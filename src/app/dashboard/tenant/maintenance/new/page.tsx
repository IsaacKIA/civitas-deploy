import DashboardLayout from '@/components/DashboardLayout';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';
import TenantMaintenanceWizard from './TenantMaintenanceWizard';

export default async function NewTenantMaintenanceRequestPage() {
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
  const { data: leases, error } = await supabase
    .from('leases')
    .select('property_id, properties(id, name, ghana_post_gps)')
    .eq('tenant_id', auth.user.id)
    .in('status', ['active', 'pending_first_payment']);

  const properties = (leases ?? [])
    .map((l) => (Array.isArray(l.properties) ? l.properties[0] : l.properties))
    .filter((p): p is { id: string; name: string; ghana_post_gps: string | null } => !!p);

  if (error || properties.length === 0) {
    return (
      <DashboardLayout role="tenant" userName={auth.profile.full_name}>
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm text-center text-xs text-[#6B7E72] py-14">
          You need an active lease before logging a maintenance request.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="tenant" userName={auth.profile.full_name}>
      <TenantMaintenanceWizard
        properties={properties.map((p) => ({ id: p.id, name: p.name, gps: p.ghana_post_gps ?? '' }))}
      />
    </DashboardLayout>
  );
}
