import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface LeadPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  source: string;
  created_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, service, message } = body;

    // Basic server-side validation
    if (!email || !firstName || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, email, message' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address format' },
        { status: 400 }
      );
    }

    // Create Supabase service role client for leads insertion
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const lead: LeadPayload = {
      first_name: firstName.trim(),
      last_name: lastName?.trim() ?? '',
      email: email.toLowerCase().trim(),
      phone: phone?.trim() ?? '',
      service: service ?? 'General Enquiry',
      message: message.trim(),
      source: 'homepage_contact_form',
      created_at: new Date().toISOString(),
    };

    const { error: dbError } = await supabase.from('leads').insert(lead);

    if (dbError) {
      console.error('[Leads API] Supabase insert error:', dbError.message);
      // Return 200 to user even if DB write fails — don't expose infra errors
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('[Leads API] Unexpected error:', err);
    return NextResponse.json({ success: true }); // Fail silently to user
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
