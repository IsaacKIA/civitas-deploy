import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceRoleClient } from '@/lib/supabase/server';
import { renderVerificationEmail } from '@/lib/email-templates';


/**
 * POST /api/auth/resend-verification
 *
 * Resends a Supabase signup verification email via the Resend HTTP API
 * directly — bypassing GoTrue's built-in SMTP entirely for reliability.
 *
 * Body: { email: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'email is required' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://www.civitasestate.com';

    if (!resendApiKey) {
      console.error('[resend-verification] RESEND_API_KEY not set');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Use the service-role client to generate an admin-level sign-in link
    // for this email so we can embed it in our own Resend-dispatched email.
    const supabase = createSupabaseServiceRoleClient();
    const { data: linkData, error: linkError } =
      await supabase.auth.admin.generateLink({
        type: 'signup',
        email,
        options: {
          redirectTo: `${siteUrl}/auth/callback`,
        },
      });

    if (linkError || !linkData?.properties?.action_link) {
      console.error('[resend-verification] generateLink error:', linkError?.message);
      return NextResponse.json(
        { error: linkError?.message ?? 'Could not generate verification link' },
        { status: 500 }
      );
    }

    const verificationLink = linkData.properties.action_link;
    const year = new Date().getFullYear();

    // Dispatch via Resend HTTP API
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Civitas Estate <admin@civitasestate.com>',
        to: [email],
        subject: 'Welcome to Civitas — Confirm your account',
        html: renderVerificationEmail({
          name: email.split('@')[0],
          confirmUrl: verificationLink,
        }),
      }),
    });

    if (!resendRes.ok) {
      const resendError = await resendRes.json().catch(() => ({}));
      console.error('[resend-verification] Resend API error:', resendError);
      return NextResponse.json(
        { error: 'Failed to send email via Resend' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('[resend-verification] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
