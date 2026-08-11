import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySupabaseSession } from '@/lib/supabase/proxy';

/**
 * Next.js 16 renamed `middleware.ts` to `proxy.ts` (functionality is
 * unchanged — see node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md).
 * This does one thing: reject requests to /dashboard/* with no valid
 * session. It deliberately does not do role-based section gating anymore
 * — see src/lib/section-roles.ts and each dashboard segment's layout.tsx
 * for why that moved.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  const { response, userId } = await verifySupabaseSession(request);

  if (!userId) {
    const loginUrl = new URL('/portal', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
