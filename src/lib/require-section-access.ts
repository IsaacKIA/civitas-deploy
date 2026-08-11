import { redirect } from 'next/navigation';
import { getAuthedProfile } from '@/lib/supabase/server';
import { SECTION_ROLES, ROLE_HOME_ROUTE } from '@/lib/section-roles';

/**
 * Called from each dashboard segment's layout.tsx. Proxy (src/proxy.ts)
 * already guarantees the request is authenticated at all; this is the
 * actual role check — is this specific user allowed in this specific
 * section — enforced close to the data, as Next's own auth guide
 * recommends, rather than as a database round-trip in Proxy on every
 * request.
 */
export async function requireSectionAccess(section: keyof typeof SECTION_ROLES) {
  const auth = await getAuthedProfile();

  if (!auth) {
    redirect('/portal');
  }

  if (!SECTION_ROLES[section].includes(auth.profile.role)) {
    // Authenticated, but wrong role for this section — don't leak that the
    // route exists via a generic 404; send them to their own dashboard
    // home, not a bare /dashboard (which has no page.tsx at all).
    redirect(ROLE_HOME_ROUTE[auth.profile.role]);
  }

  return auth;
}
