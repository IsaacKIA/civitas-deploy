/**
 * POST /api/notifications/sms
 *
 * Outbound SMS sender via Africa's Talking API.
 * Internal services POST here with JSON payload to trigger transactional SMS.
 *
 * Environment variables:
 *   AT_API_KEY          — Africa's Talking API key
 *   AT_USERNAME         — Africa's Talking username (e.g. "sandbox" or live username)
 *   AT_SMS_FROM         — Alphanumeric sender ID (e.g. "CIVITAS")
 *   INTERNAL_API_SECRET — Shared secret for service-to-service auth
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { renderNotification, type NotificationPayload } from '@/lib/notification-templates';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const AT_SMS_BASE = 'https://api.africastalking.com/version1/messaging';

async function sendAtSms(to: string, message: string): Promise<{ ok: boolean; raw?: unknown }> {
  const apiKey = process.env.AT_API_KEY;
  const username = process.env.AT_USERNAME;
  const from = process.env.AT_SMS_FROM ?? 'CIVITAS';

  if (!apiKey || !username) {
    console.warn('[SMS] Missing Africa\'s Talking env vars — SMS not sent. Message preview:', message.slice(0, 80));
    return { ok: false, raw: { warning: 'Missing Africa\'s Talking credentials' } };
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

export async function POST(request: NextRequest) {
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

  if (!payload.recipientPhone || !payload.event) {
    return NextResponse.json({ error: 'Missing recipientPhone or event' }, { status: 400 });
  }

  // Check user preferences
  const supabase = await createSupabaseServerClient();
  const { data: prefs } = await supabase
    .from('notification_preferences')
    .select('sms_enabled, events')
    .eq('phone', payload.recipientPhone)
    .maybeSingle();

  if (prefs?.sms_enabled === false) {
    return NextResponse.json({ skipped: true, reason: 'sms_disabled' });
  }

  if (prefs?.events && typeof prefs.events === 'object') {
    const eventPrefs = (prefs.events as Record<string, { sms?: boolean }>)[payload.event];
    if (eventPrefs?.sms === false) {
      return NextResponse.json({ skipped: true, reason: 'event_sms_disabled' });
    }
  }

  const { body } = renderNotification({
    ...payload,
    channel: 'sms',
  });

  if (!body) {
    return NextResponse.json({ error: 'Empty message body' }, { status: 400 });
  }

  const result = await sendAtSms(payload.recipientPhone, body);

  return NextResponse.json({
    channel: 'sms',
    ok: result.ok,
    raw: result.raw,
  });
}
