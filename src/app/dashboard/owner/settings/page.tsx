import DashboardLayout from '@/components/DashboardLayout';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';
import SettingsClient from './SettingsClient';

export default async function OwnerSettingsPage() {
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
  const { data: prefs } = await supabase
    .from('notification_preferences')
    .select('phone, email_enabled, sms_enabled, whatsapp_enabled, events')
    .eq('user_id', auth.user.id)
    .maybeSingle();

  return (
    <DashboardLayout role="owner" userName={auth.profile.full_name}>
      <SettingsClient
        userId={auth.user.id}
        userProfile={{
          id: auth.user.id,
          email: auth.user.email || auth.profile.email,
          phone: auth.profile.phone || '',
          fullName: auth.profile.full_name,
        }}
        initialPreferences={
          prefs
            ? {
                phone: prefs.phone || '',
                email_enabled: prefs.email_enabled,
                sms_enabled: prefs.sms_enabled,
                whatsapp_enabled: prefs.whatsapp_enabled,
                events: (prefs.events as Record<string, { email?: boolean; sms?: boolean; whatsapp?: boolean }>) || {},
              }
            : null
        }
      />
    </DashboardLayout>
  );
}
