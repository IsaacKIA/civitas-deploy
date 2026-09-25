import DashboardLayout from '@/components/DashboardLayout';
import { getAuthedProfile } from '@/lib/supabase/server';
import HandoverClient from './HandoverClient';

export default async function DeveloperHandoverPage() {
  const auth = await getAuthedProfile();

  const developerName = auth?.profile.full_name || 'Property Developer';

  return (
    <DashboardLayout role="developer" userName={developerName}>
      <div className="max-w-6xl mx-auto">
        <HandoverClient developerName={developerName} />
      </div>
    </DashboardLayout>
  );
}
