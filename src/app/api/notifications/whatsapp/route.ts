/**
 * POST /api/notifications/whatsapp
 *
 * Dual-purpose route:
 *  1. Inbound webhook receiver — Africa's Talking posts here when a user
 *     replies to a WhatsApp message (e.g. "STOP" for opt-out).
 *  2. Outbound sender — internal services POST here to send a WhatsApp
 *     message to a phone number via Africa's Talking.
 *
 * Environment variables required:
 *   AT_API_KEY        — Africa's Talking API key
 *   AT_USERNAME       — Africa's Talking username (sandbox = "sandbox")
 *   AT_WHATSAPP_FROM  — Sender phone number registered with AT (+233...)
 *   INTERNAL_API_SECRET — Shared secret to authorise internal POST calls
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { renderNotification, type NotificationPayload } from '@/lib/notification-templates';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const AT_API_BASE = 'https://api.africastalking.com/version1/messaging/whatsapp';
const AT_SMS_BASE = 'https://api.africastalking.com/version1/messaging';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function sendAtWhatsApp(to: string, body: string): Promise<{ ok: boolean; raw?: unknown }> {
  const apiKey = process.env.AT_API_KEY;
  const username = process.env.AT_USERNAME;
  const from = process.env.AT_WHATSAPP_FROM;

  if (!apiKey || !username || !from) {
    console.warn('[WhatsApp] Missing Africa\'s Talking env vars — message not sent. Body preview:', body.slice(0, 80));
    return { ok: false };
  }

  const res = await fetch(AT_API_BASE, {
    method: 'POST',
    headers: {
      'apiKey': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ username, to, from, body }),
  });

  const raw = await res.json().catch(() => null);
  return { ok: res.ok, raw };
}

async function sendAtSms(to: string, message: string): Promise<{ ok: boolean; raw?: unknown }> {
  const apiKey = process.env.AT_API_KEY;
  const username = process.env.AT_USERNAME;
  const from = process.env.AT_SMS_FROM ?? 'CIVITAS';

  if (!apiKey || !username) {
    console.warn('[SMS] Missing Africa\'s Talking env vars — SMS not sent.');
    return { ok: false };
  }

  const form = new URLSearchParams({
    username,
    to,
    message,
    from,
  });

  const res = await fetch(AT_SMS_BASE, {
    method: 'POST',
    headers: {
      'apiKey': apiKey,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: form.toString(),
  });

  const raw = await res.json().catch(() => null);
  return { ok: res.ok, raw };
}

async function markOptOut(phone: string): Promise<void> {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase
      .from('notification_preferences')
      .update({ whatsapp_enabled: false, sms_enabled: false })
      .eq('phone', phone);
    console.log('[WhatsApp] Opt-out recorded for', phone);
  } catch (err) {
    console.error('[WhatsApp] Failed to record opt-out:', err);
  }
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') ?? '';

  // ------------------------------------------------------------------
  // Path A: Africa's Talking inbound webhook
  // AT sends application/x-www-form-urlencoded with fields:
  //   from, to, text, date, id, linkId
  // ------------------------------------------------------------------
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const form = await request.formData();
    const from = String(form.get('from') ?? '');
    const text = String(form.get('text') ?? '').trim().toUpperCase();

    console.log('[WhatsApp Inbound]', { from, text });

    if (text === 'STOP' || text === 'OPTOUT' || text === 'UNSUBSCRIBE') {
      await markOptOut(from);
      await sendAtWhatsApp(from, 'You have been unsubscribed from Civitas WhatsApp notifications. Reply START to re-subscribe.');
    } else if (text === 'START' || text === 'SUBSCRIBE') {
      try {
        const supabase = await createSupabaseServerClient();
        await supabase
          .from('notification_preferences')
          .update({ whatsapp_enabled: true })
          .eq('phone', from);
      } catch { /* ignore */ }
      await sendAtWhatsApp(from, 'Welcome back! You have re-subscribed to Civitas WhatsApp notifications. Reply STOP to unsubscribe.');
    }

    // AT expects a 200 OK response for all webhook POSTs
    return new Response('OK', { status: 200 });
  }

  // ------------------------------------------------------------------
  // Path B: Internal outbound send request (JSON)
  // ------------------------------------------------------------------
  const secret = request.headers.get('x-internal-secret');
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: NotificationPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { body: waBody, fallbackSms } = renderNotification({
    ...payload,
    channel: 'whatsapp',
  });

  // Check user prefs before sending
  const supabase = await createSupabaseServerClient();
  const { data: prefs } = await supabase
    .from('notification_preferences')
    .select('whatsapp_enabled, sms_enabled')
    .eq('phone', payload.recipientPhone)
    .maybeSingle();

  if (prefs?.whatsapp_enabled === false) {
    return NextResponse.json({ skipped: true, reason: 'whatsapp_disabled' });
  }

  const result = await sendAtWhatsApp(payload.recipientPhone, waBody);

  // If WhatsApp delivery fails, fall back to SMS if enabled
  if (!result.ok && prefs?.sms_enabled !== false && fallbackSms) {
    const smsResult = await sendAtSms(payload.recipientPhone, fallbackSms);
    return NextResponse.json({
      channel: 'sms_fallback',
      ok: smsResult.ok,
      raw: smsResult.raw,
    });
  }

  return NextResponse.json({ channel: 'whatsapp', ok: result.ok, raw: result.raw });
}
