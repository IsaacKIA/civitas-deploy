import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
        'Refusing to fall back to a hardcoded project — set real env vars.'
    );
  }

  return { url, anonKey };
}

/**
 * Server Component / Route Handler client. Reads the real session cookie
 * set by Supabase auth and lets RLS enforce row-level access — no service
 * role key here.
 */
export async function createSupabaseServerClient() {
  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll is called from a Server Component in some cases, where
          // cookies() is read-only. Safe to ignore — middleware refreshes
          // the session cookie on every request.
        }
      },
    },
  });
}

/**
 * Service-role client for trusted server-only operations (e.g. disbursement
 * jobs, admin-triggered writes that must bypass RLS deliberately). Never
 * import this into anything that runs in the browser, and never use it to
 * skip an authorization check that should happen anyway — it bypasses RLS
 * entirely, so the calling code IS the access control.
 */
export function createSupabaseServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  }

  // Lazy import keeps this out of any client bundle even if someone
  // mis-imports this module from client code.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require('@supabase/supabase-js');
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Known application roles, matching the `profiles.role` check constraint. */
export type AppRole =
  | 'super_admin'
  | 'org_admin'
  | 'ops_manager'
  | 'technician'
  | 'client'
  | 'tenant'
  | 'investor';

/**
 * Fetches the authenticated user AND their profile role in one place.
 * Route handlers and server components should call this instead of trusting
 * anything client-supplied. Returns null if there is no valid session —
 * callers must handle that as "unauthenticated", not throw past it.
 */
export async function getAuthedProfile() {
  const supabase = await createSupabaseServerClient();

  // getUser() re-validates the JWT against Supabase Auth servers rather than
  // trusting the (client-writable) session cookie contents — required for
  // any check that gates money movement or PII.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, organization_id, role, full_name, email')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return null;
  }

  return { user, profile: profile as { id: string; organization_id: string; role: AppRole; full_name: string; email: string } };
}
