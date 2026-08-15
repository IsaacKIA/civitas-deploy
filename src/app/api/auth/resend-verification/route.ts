import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceRoleClient } from '@/lib/supabase/server';

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
        subject: 'Confirm your Civitas Estate account',
        html: `
          <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #D8E4DC">
            <div style="background:#0F3D26;padding:32px 40px;text-align:center">
              <h1 style="color:#fff;font-size:28px;margin:0;letter-spacing:-0.5px">
                Civitas<span style="color:#E87722">.</span>
              </h1>
              <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:8px 0 0">PropTech Platform</p>
            </div>
            <div style="padding:40px">
              <h2 style="color:#0F3D26;font-size:22px;margin:0 0 12px">Verify your email address</h2>
              <p style="color:#4A5D50;font-size:14px;line-height:1.6;margin:0 0 28px">
                Thank you for signing up to Civitas Estate. Click the button below to verify your email address and activate your account.
              </p>
              <a href="${verificationLink}" style="display:inline-block;background:#1A5C3A;color:#fff;text-decoration:none;padding:14px 32px;border-radius:999px;font-size:13px;font-weight:600;letter-spacing:0.5px">
                Verify Email Address &rarr;
              </a>
              <p style="color:#9CA3AF;font-size:11px;margin:28px 0 0;line-height:1.6">
                This link expires in 24 hours. If you did not create a Civitas account, you can safely ignore this email.
              </p>
            </div>
            <div style="background:#F5F9F6;padding:20px 40px;text-align:center;border-top:1px solid #D8E4DC">
              <p style="color:#9CA3AF;font-size:11px;margin:0">
                &copy; ${year} Civitas Estate &middot; Ghana
              </p>
            </div>
          </div>
        `,
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
