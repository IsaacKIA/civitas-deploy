/**
 * Civitas — Multi-Channel Notification Dispatcher Library
 *
 * Core engine for evaluating user preferences and dispatching automated
 * transactional alerts across WhatsApp, SMS, and Email.
 */

import {
  renderNotification,
  type NotificationChannel,
  type NotificationEvent,
} from '@/lib/notification-templates';
import { sendBrandedEmail } from '@/lib/email-templates';
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from '@/lib/supabase/server';

export interface DispatchNotificationParams {
  event: NotificationEvent;
  recipientName: string;
  recipientPhone?: string;
  recipientEmail?: string;
  userId?: string;
  channels?: NotificationChannel[];
  data: Record<string, string | number>;
}

export interface DispatchResult {
  success: boolean;
  event: NotificationEvent;
  dispatched: string[];
  results: Record<string, unknown>;
}

const AT_API_BASE = 'https://api.africastalking.com/version1/messaging/whatsapp';
const AT_SMS_BASE = 'https://api.africastalking.com/version1/messaging';

async function sendWhatsApp(to: string, body: string): Promise<{ ok: boolean; raw?: unknown }> {
  const apiKey = process.env.AT_API_KEY;
  const username = process.env.AT_USERNAME;
  const from = process.env.AT_WHATSAPP_FROM;

  if (!apiKey || !username || !from) {
    console.warn('[NotificationDispatcher] WhatsApp credentials not configured. Body preview:', body.slice(0, 80));
    return { ok: false, raw: { warning: 'Missing Africa\'s Talking WhatsApp credentials' } };
  }

  try {
    const res = await fetch(AT_API_BASE, {
      method: 'POST',
      headers: {
        apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ username, to, from, body }),
    });
    const raw = await res.json().catch(() => null);
    return { ok: res.ok, raw };
  } catch (err) {
    console.error('[NotificationDispatcher] WhatsApp send failed:', err);
    return { ok: false, raw: { error: err instanceof Error ? err.message : String(err) } };
  }
}

async function sendSms(to: string, message: string): Promise<{ ok: boolean; raw?: unknown }> {
  const apiKey = process.env.AT_API_KEY;
  const username = process.env.AT_USERNAME;
  const from = process.env.AT_SMS_FROM ?? 'CIVITAS';

  if (!apiKey || !username) {
    console.warn('[NotificationDispatcher] SMS credentials not configured. Message preview:', message.slice(0, 80));
    return { ok: false, raw: { warning: 'Missing Africa\'s Talking SMS credentials' } };
  }

  try {
    const form = new URLSearchParams({ username, to, message, from });
    const res = await fetch(AT_SMS_BASE, {
      method: 'POST',
      headers: {
        apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: form.toString(),
    });
    const raw = await res.json().catch(() => null);
    return { ok: res.ok, raw };
  } catch (err) {
    console.error('[NotificationDispatcher] SMS send failed:', err);
    return { ok: false, raw: { error: err instanceof Error ? err.message : String(err) } };
  }
}

function getEventEmailSubject(event: NotificationEvent, data: Record<string, string | number>): string {
  switch (event) {
    case 'rent_payment_confirmed':
      return `Payment Confirmed: GHS ${data.amount ?? ''} for ${data.property ?? 'Civitas'}`;
    case 'rent_payment_overdue':
      return `Overdue Rent Notice: ${data.property ?? 'Civitas Property'}`;
    case 'maintenance_request_received':
      return `Maintenance Request Received: #${data.ref ?? ''}`;
    case 'maintenance_request_assigned':
      return `Technician Assigned to #${data.ref ?? ''} (${data.property ?? ''})`;
    case 'maintenance_request_completed':
      return `Job Completed: #${data.ref ?? ''} (${data.property ?? ''})`;
    case 'lease_expiry_reminder':
      return `Important: Lease Expiry Notice for ${data.property ?? 'your property'}`;
    case 'inspection_scheduled':
      return `Inspection Scheduled: ${data.property ?? ''} on ${data.date ?? ''}`;
    case 'document_expiry_warning':
      return `Compliance Notice: ${data.doc_name ?? 'Document'} expiring soon`;
    case 'sla_breach_alert':
      return `URGENT: SLA Alert for Ticket #${data.ref ?? ''}`;
    case 'work_order_dispatched':
      return `New Work Order Dispatched: #${data.ref ?? ''}`;
    case 'technician_en_route':
      return `Technician is en route to ${data.property ?? 'your property'}`;
    case 'handover_certificate_ready':
      return `Handover Certificate Ready for Signature: Unit ${data.unit ?? ''}`;
    case 'agent_delegation_accepted':
      return `Agent Delegation Confirmed for ${data.property ?? ''}`;
    case 'remittance_received':
      return `Remittance Received: ${data.currency ?? 'USD'} ${data.amount ?? ''}`;
    default:
      return `Civitas Notification: ${String(event).replace(/_/g, ' ')}`;
  }
}

function buildDefaultEmailHtml(title: string, recipientName: string, data: Record<string, string | number>): string {
  const rows = Object.entries(data)
    .filter(([k]) => !k.includes('url'))
    .map(([key, val]) => `
      <tr>
        <td style="padding: 10px 12px; color: #6B7E72; font-size: 13px; text-transform: capitalize; border-bottom: 1px solid #EAF2EC;">${key.replace(/_/g, ' ')}</td>
        <td style="padding: 10px 12px; color: #111A14; font-size: 13px; font-weight: 600; text-align: right; border-bottom: 1px solid #EAF2EC;">${val}</td>
      </tr>
    `).join('');

  const ctaUrl = String(data.portal_url || data.rating_url || 'https://www.civitasestate.com/dashboard');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin: 0; padding: 24px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #EDF3EF;">
  <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E2ECE5; box-shadow: 0 4px 20px rgba(15,61,38,0.05);">
    <div style="background-color: #0F3D26; padding: 24px 32px;">
      <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff;">Civitas <span style="color: #E87722;">Estate Management</span></h1>
    </div>
    <div style="padding: 32px 32px 24px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #0F3D26; margin: 0 0 12px; font-family: Georgia, serif;">${title}</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #3D5044; margin: 0 0 20px;">Hi ${recipientName}, here are the details for your recent platform update:</p>
      <table style="width: 100%; border-collapse: collapse; background-color: #F8FAF9; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
        ${rows}
      </table>
      <div style="text-align: center; margin: 28px 0 16px;">
        <a href="${ctaUrl}" style="display: inline-block; background-color: #0F3D26; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 12px 28px; border-radius: 9999px;">Open Civitas Dashboard →</a>
      </div>
    </div>
    <div style="background-color: #F8FAF9; padding: 20px 32px; border-top: 1px solid #EBF1ED; font-size: 11px; color: #788A7F; line-height: 1.5;">
      <p style="margin: 0;">Civitas Estate Management · Accra, Ghana · Support: +233 55 506 2589</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Universal dispatcher function
 */
export async function dispatchNotification(params: DispatchNotificationParams): Promise<DispatchResult> {
  const { event, recipientName, recipientPhone, recipientEmail, userId, data } = params;

  // Use service role if available or server client
  let prefs: {
    phone?: string;
    email_enabled?: boolean;
    sms_enabled?: boolean;
    whatsapp_enabled?: boolean;
    events?: unknown;
  } | null = null;

  try {
    const db = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? createSupabaseServiceRoleClient()
      : await createSupabaseServerClient();

    let query = db.from('notification_preferences').select('*');
    if (userId) {
      query = query.eq('user_id', userId);
    } else if (recipientPhone) {
      query = query.eq('phone', recipientPhone);
    }

    const { data: p } = await query.maybeSingle();
    prefs = p;
  } catch (err) {
    console.warn('[NotificationDispatcher] Could not fetch preferences, using defaults:', err);
  }

  const emailAllowed = prefs ? prefs.email_enabled !== false : true;
  const whatsappAllowed = prefs ? prefs.whatsapp_enabled !== false : true;
  const smsAllowed = prefs ? prefs.sms_enabled !== false : true;

  const eventSettings = (prefs?.events as Record<string, { email?: boolean; sms?: boolean; whatsapp?: boolean }>) || {};
  const currentEventSettings = eventSettings[event] || {};

  const canEmail = emailAllowed && (currentEventSettings.email !== false) && Boolean(recipientEmail);
  const canWhatsApp = whatsappAllowed && (currentEventSettings.whatsapp !== false) && Boolean(recipientPhone);
  const canSms = smsAllowed && (currentEventSettings.sms !== false) && Boolean(recipientPhone);

  const targetChannels = params.channels || (canWhatsApp ? ['whatsapp', 'email'] : ['sms', 'email']);

  const dispatched: string[] = [];
  const results: Record<string, unknown> = {};

  // WhatsApp
  if (targetChannels.includes('whatsapp') && canWhatsApp && recipientPhone) {
    const { body: waBody, fallbackSms } = renderNotification({
      event,
      recipientName,
      recipientPhone,
      channel: 'whatsapp',
      data,
    });

    const waRes = await sendWhatsApp(recipientPhone, waBody);
    results.whatsapp = waRes;

    if (waRes.ok) {
      dispatched.push('whatsapp');
    } else if (fallbackSms && canSms) {
      const smsRes = await sendSms(recipientPhone, fallbackSms);
      results.sms_fallback = smsRes;
      if (smsRes.ok) dispatched.push('sms_fallback');
    }
  }

  // SMS
  if (
    targetChannels.includes('sms') &&
    !dispatched.includes('whatsapp') &&
    !dispatched.includes('sms_fallback') &&
    canSms &&
    recipientPhone
  ) {
    const { body: smsBody } = renderNotification({
      event,
      recipientName,
      recipientPhone,
      channel: 'sms',
      data,
    });

    const smsRes = await sendSms(recipientPhone, smsBody);
    results.sms = smsRes;
    if (smsRes.ok) dispatched.push('sms');
  }

  // Email
  if (targetChannels.includes('email') && canEmail && recipientEmail) {
    const subject = getEventEmailSubject(event, data);
    const html = buildDefaultEmailHtml(subject, recipientName, data);

    const emailRes = await sendBrandedEmail({
      to: recipientEmail,
      subject,
      html,
    });

    results.email = emailRes;
    if ('success' in emailRes && emailRes.success) {
      dispatched.push('email');
    }
  }

  return {
    success: true,
    event,
    dispatched,
    results,
  };
}
