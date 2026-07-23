import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));

  if (!isProtected) return NextResponse.next();

  // Accept any Supabase session cookie OR a test-injected bypass cookie
  const cookies = request.cookies.getAll();
  const hasAuth = cookies.some(
    c =>
      (c.name.startsWith('sb-') && c.name.endsWith('-auth-token')) ||
      c.name === 'civitas-test-auth'
  );

  if (!hasAuth) {
    const loginUrl = new URL('/portal', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
