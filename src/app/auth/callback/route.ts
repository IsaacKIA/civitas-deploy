import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://wbjyktvvmcnbihbcunvg.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndianlrdHZ2bWNuYmloYmN1bnZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwODkzMTQsImV4cCI6MjA5NDY2NTMxNH0.1lp6DyfT3xA-dC_M63em-H3j5UED-WPwJ741GZHRV40';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/portal?verified=true';

  const errorRedirect = `${origin}/portal?error=${encodeURIComponent(
    'Verification link is invalid or has expired. Please request a new one.'
  )}`;

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });

  // ── PKCE flow (code + code_verifier) ──────────────────────────────────────
  if (code) {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error('[Auth Callback] PKCE exchange error:', error.message);
    return NextResponse.redirect(errorRedirect);
  }

  // ── OTP / Magic-link flow (token_hash + type) ─────────────────────────────
  if (token_hash && type) {
    const { error } = await client.auth.verifyOtp({
      token_hash,
      type: type as 'signup' | 'magiclink' | 'email' | 'recovery' | 'invite',
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error('[Auth Callback] OTP verify error:', error.message);
    return NextResponse.redirect(errorRedirect);
  }

  return NextResponse.redirect(errorRedirect);
}

