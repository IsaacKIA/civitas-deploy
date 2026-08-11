import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export interface ProxyAuthResult {
  response: NextResponse;
  userId: string | null;
}

/**
 * Verifies the caller against Supabase Auth (not just "does a cookie with
 * the right name exist") and refreshes the session cookie if needed.
 *
 * This replaces the old middleware, which accepted ANY cookie named
 * `sb-*-auth-token` without validating it, and additionally accepted a
 * hardcoded `civitas-test-auth` cookie that was committed to the public
 * repo — i.e. anyone could set that cookie in devtools and reach every
 * /dashboard/* route with no real session at all.
 *
 * Deliberately does NOT look up the caller's role here anymore. Per
 * Next.js's own guidance, Proxy should only do optimistic, cookie-based
 * checks and avoid database round-trips; role-based section access is
 * enforced in each dashboard segment's layout.tsx instead, using the
 * profile that's already being fetched there for legitimate rendering
 * reasons. getUser() itself is kept (not swapped for the cheaper but
 * insecure getSession()) because that one round-trip is what actually
 * revalidates the JWT against Supabase's Auth server rather than trusting
 * a client-writable cookie — Supabase's own guidance treats this as the
 * non-negotiable minimum for a real session check, not an optional
 * database check.
 */
export async function verifySupabaseSession(request: NextRequest): Promise<ProxyAuthResult> {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // Fail closed: if env isn't configured, nobody gets into /dashboard.
    return { response, userId: null };
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, userId: user?.id ?? null };
}
