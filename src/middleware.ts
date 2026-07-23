import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard'];
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));

  if (!isProtected) return NextResponse.next();

  const cookies = request.cookies.getAll();

  // Check for an active Supabase session token
  const hasSupabaseSession = cookies.some(
    c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  );

  // Allow test-bypass cookie ONLY in non-production (CI / local dev)
  const hasTestBypass =
    !IS_PRODUCTION && cookies.some(c => c.name === 'civitas-test-auth');

  const hasAuth = hasSupabaseSession || hasTestBypass;

  if (!hasAuth) {
    const loginUrl = new URL('/portal', request.url);
    // Preserve the originally requested path so post-login redirect works
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
