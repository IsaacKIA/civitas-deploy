import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ROLE_HOME_ROUTE } from '@/lib/section-roles';
import type { AppRole } from '@/lib/supabase/server';
import type { EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next');

  const supabase = await createSupabaseServerClient();

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const role = (user?.user_metadata?.role as AppRole) || 'client';
      const redirectPath = next || ROLE_HOME_ROUTE[role] || '/dashboard/owner';

      return NextResponse.redirect(`${origin}${redirectPath}`);
    }
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const role = (user?.user_metadata?.role as AppRole) || 'client';
      const redirectPath = next || ROLE_HOME_ROUTE[role] || '/dashboard/owner';

      return NextResponse.redirect(`${origin}${redirectPath}`);
    }
  }

  // Check if user already has an active session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const role = (user?.user_metadata?.role as AppRole) || 'client';
    const redirectPath = next || ROLE_HOME_ROUTE[role] || '/dashboard/owner';
    return NextResponse.redirect(`${origin}${redirectPath}`);
  }

  // If code exchange failed or was missing, redirect to portal with message
  return NextResponse.redirect(`${origin}/portal?mode=signin&verified=true`);
}

