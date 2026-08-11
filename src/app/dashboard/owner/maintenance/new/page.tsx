import DashboardLayout from '@/components/DashboardLayout';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';
import OwnerMaintenanceWizard from './OwnerMaintenanceWizard';

export default async function NewOwnerMaintenanceRequestPage() {
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
  const { data: properties, error } = await supabase
    .from('properties')
    .select('id, name, ghana_post_gps')
    .eq('owner_id', auth.user.id)
    .order('created_at', { ascending: false });

  if (error || !properties || properties.length === 0) {
    return (
      <DashboardLayout role="owner" userName={auth.profile.full_name}>
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm text-center text-xs text-[#6B7E72] py-14">
          You need to register a property before logging a maintenance request.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="owner" userName={auth.profile.full_name}>
      <OwnerMaintenanceWizard
        properties={properties.map((p) => ({ id: p.id, name: p.name, gps: p.ghana_post_gps ?? '' }))}
      />
    </DashboardLayout>
  );
}
