import type { AppRole } from '@/lib/supabase/server';

/**
 * Maps a /dashboard/<segment> prefix to the roles allowed in it. A role not
 * listed here is denied — default-deny, not a denylist, so a new dashboard
 * section is inaccessible until someone deliberately grants a role to it.
 *
 * This used to live in proxy.ts (formerly middleware.ts) and required an
 * extra profiles.role database query on every single dashboard request.
 * Per Next.js's own authentication guide: Proxy should stick to optimistic,
 * cookie-only checks and avoid database round-trips for performance —
 * "the majority of security checks should be performed as close as
 * possible to your data source." Real enforcement now happens in each
 * dashboard segment's layout.tsx, where getAuthedProfile() already fetches
 * the profile for legitimate rendering reasons (showing the user's name),
 * so the role check adds no extra query.
 */
export const SECTION_ROLES: Record<string, AppRole[]> = {
  owner: ['org_admin', 'super_admin', 'client'],
  tenant: ['tenant', 'super_admin'],
  investor: ['investor', 'super_admin'],
  technician: ['technician', 'ops_manager', 'super_admin'],
};

/**
 * Where each role lands after login, or after being redirected away from a
 * section they don't have access to. super_admin defaults to the owner
 * section (broadest internal view) since there's no dedicated admin
 * dashboard yet.
 */
export const ROLE_HOME_ROUTE: Record<AppRole, string> = {
  client: '/dashboard/owner',
  org_admin: '/dashboard/owner',
  super_admin: '/dashboard/owner',
  tenant: '/dashboard/tenant',
  investor: '/dashboard/investor',
  technician: '/dashboard/technician',
  ops_manager: '/dashboard/technician',
};
