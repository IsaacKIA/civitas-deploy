import DashboardLayout from '@/components/DashboardLayout';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';
import CreateLeaseClient from './CreateLeaseClient';

export default async function CreateLeasePage({
  searchParams,
}: {
  searchParams: Promise<{ propertyId?: string }>;
}) {
  const auth = await getAuthedProfile();
  const { propertyId } = await searchParams;

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
    .select('id, name, monthly_rent')
    .eq('owner_id', auth.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <DashboardLayout role="owner" userName={auth.profile.full_name}>
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#FAD4D0] bg-[#FDECEA] shadow-sm text-center text-xs text-[#D94F3D]">
          Couldn&apos;t load your properties. Please refresh.
        </div>
      </DashboardLayout>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <DashboardLayout role="owner" userName={auth.profile.full_name}>
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm text-center text-xs text-[#6B7E72] py-14">
          You need to register a property before you can create a lease.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="owner" userName={auth.profile.full_name}>
      <CreateLeaseClient
        properties={properties.map((p) => ({ id: p.id, name: p.name, monthlyRent: Number(p.monthly_rent) }))}
        initialPropertyId={propertyId ?? properties[0].id}
      />
    </DashboardLayout>
  );
}
