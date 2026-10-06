/**
 * POST /api/escrow/payments/webhook
 *
 * Official Paystack Webhook Handler.
 * Verifies HMAC SHA512 signature on incoming events and transitions
 * transactions and lease installment schedules to 'paid'.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyPaystackWebhookSignature } from '@/lib/paystack';
import { createSupabaseServiceRoleClient } from '@/lib/supabase/server';
import { dispatchNotification } from '@/lib/notification-dispatcher';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-paystack-signature');
  const rawBody = await request.text();

  const isValid = verifyPaystackWebhookSignature(rawBody, signature);
  if (!isValid) {
    console.warn('[Paystack Webhook] Invalid signature rejected');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let event: {
    event: string;
    data: {
      id: number;
      reference: string;
      amount: number;
      currency: string;
      status: string;
      gateway_response?: string;
      paid_at?: string;
      channel?: string;
      metadata?: {
        lease_id?: string;
        installment_id?: string;
        initiated_by?: string;
      };
    };
  };

  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  if (event.event !== 'charge.success') {
    // Acknowledge receipt of other events (refunds, transfers, etc.)
    return NextResponse.json({ received: true });
  }

  const { reference, metadata } = event.data;
  const db = createSupabaseServiceRoleClient();

  // Find transaction by provider_reference or id
  let { data: transaction } = await db
    .from('momo_transactions')
    .select('id, lease_id, installment_id, initiated_by, status, amount_ghs, leases!inner(id, tenant_id, owner_id, status, properties(name), tenant:profiles!tenant_id(full_name, phone, email), owner:profiles!owner_id(full_name, phone, email))')
    .eq('provider_reference', reference)
    .maybeSingle();

  // Fallback if reference matches metadata installment
  if (!transaction && metadata?.installment_id) {
    const { data: fallbackTx } = await db
      .from('momo_transactions')
      .select('id, lease_id, installment_id, initiated_by, status, amount_ghs, leases!inner(id, tenant_id, owner_id, status, properties(name), tenant:profiles!tenant_id(full_name, phone, email), owner:profiles!owner_id(full_name, phone, email))')
      .eq('installment_id', metadata.installment_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    transaction = fallbackTx;
  }

  if (!transaction) {
    console.error(`[Paystack Webhook] No matching transaction found for reference: ${reference}`);
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  }

  // Idempotency: if already confirmed, return success without duplicate side-effects
  if (transaction.status === 'success') {
    return NextResponse.json({ received: true, alreadyProcessed: true });
  }

  // 1. Update momo_transaction
  const { error: txError } = await db
    .from('momo_transactions')
    .update({
      status: 'success',
      provider_reference: reference,
      confirmed_at: event.data.paid_at || new Date().toISOString(),
    })
    .eq('id', transaction.id);

  if (txError) {
    console.error('[Paystack Webhook] Failed to update transaction:', txError.message);
    return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
  }

  // 2. Mark lease installment as paid
  await db
    .from('lease_installments')
    .update({
      status: 'paid',
      paid_at: event.data.paid_at || new Date().toISOString(),
      momo_transaction_id: transaction.id,
    })
    .eq('id', transaction.installment_id);

  // 3. Activate lease if pending first payment
  const lease = Array.isArray(transaction.leases) ? transaction.leases[0] : transaction.leases;
  if (lease && lease.status === 'pending_first_payment') {
    await db.from('leases').update({ status: 'active' }).eq('id', lease.id);
  }

  // 4. Dispatch multichannel receipts (Email, SMS, WhatsApp)
  try {
    const propName = (Array.isArray(lease.properties) ? lease.properties[0] : lease.properties)?.name || 'Civitas Property';
    const tenant = Array.isArray(lease.tenant) ? lease.tenant[0] : lease.tenant;
    const owner = Array.isArray(lease.owner) ? lease.owner[0] : lease.owner;
    const paymentDate = new Date().toLocaleDateString('en-GB');

    if (tenant?.email || tenant?.phone) {
      await dispatchNotification({
        event: 'rent_payment_confirmed',
        recipientName: tenant.full_name || 'Valued Resident',
        recipientPhone: tenant.phone || undefined,
        recipientEmail: tenant.email || undefined,
        data: {
          tenant_name: tenant.full_name || 'Valued Resident',
          amount: Number(transaction.amount_ghs).toLocaleString(),
          property: propName,
          reference: reference,
          date: paymentDate,
          receipt_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.civitasestate.com'}/dashboard/tenant/rent`,
        },
      });
    }

    if (owner?.email || owner?.phone) {
      await dispatchNotification({
        event: 'rent_escrow_deposit_received',
        recipientName: owner.full_name || 'Property Owner',
        recipientPhone: owner.phone || undefined,
        recipientEmail: owner.email || undefined,
        data: {
          owner_name: owner.full_name || 'Property Owner',
          tenant_name: tenant?.full_name || 'Resident',
          amount: Number(transaction.amount_ghs).toLocaleString(),
          property: propName,
          reference: reference,
          escrow_release_window: '24 Hours',
          dashboard_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.civitasestate.com'}/dashboard/owner/finances`,
        },
      });
    }
  } catch (notifyErr) {
    console.warn('[Paystack Webhook] Notification dispatch warning:', notifyErr);
  }

  return NextResponse.json({ status: 'success', reference });
}
