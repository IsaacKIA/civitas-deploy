import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceRoleClient, getAuthedProfile } from '@/lib/supabase/server';

/**
 * SIMULATED confirmation step.
 *
 * In production this state transition ("payment succeeded") must come from
 * a signed webhook sent by the Mobile Money aggregator (e.g. Hubtel,
 * Paystack Mobile Money, or a direct MTN/Telecel API), verified by
 * signature — NEVER from the tenant's own browser claiming "I entered my
 * PIN". This route exists so the UI flow (MobileMoneyCheckoutModal) has a
 * real endpoint to call while no aggregator is wired up yet.
 *
 * Before going live: add a POST /api/escrow/payments/webhook route that
 * verifies the provider's signature and performs this same transition, and
 * either remove this route or restrict it to admin/QA use only.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthedProfile();
  if (!auth) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id: transactionId } = await params;

  const db = createSupabaseServiceRoleClient();

  const { data: transaction, error: txError } = await db
    .from('momo_transactions')
    .select('id, lease_id, installment_id, initiated_by, status, amount_ghs, leases!inner(tenant_id, owner_id, id, advance_months_requested, status)')
    .eq('id', transactionId)
    .single();

  if (txError || !transaction) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  }

  const lease = Array.isArray(transaction.leases) ? transaction.leases[0] : transaction.leases;

  const isPermitted =
    transaction.initiated_by === auth.user.id ||
    lease.tenant_id === auth.user.id ||
    ['super_admin', 'org_admin'].includes(auth.profile.role);

  if (!isPermitted) {
    return NextResponse.json({ error: 'Not permitted to confirm this payment' }, { status: 403 });
  }

  // Idempotency: if this has already been confirmed, return success again
  // rather than double-processing — a modal retry or a duplicate webhook
  // delivery must not double-pay/double-mark anything.
  if (transaction.status === 'success') {
    return NextResponse.json({ status: 'success', alreadyConfirmed: true });
  }

  if (transaction.status !== 'initiated' && transaction.status !== 'awaiting_pin') {
    return NextResponse.json(
      { error: `Cannot confirm a transaction in status '${transaction.status}'` },
      { status: 409 }
    );
  }

  const providerReference = `MOMO-GH-${Math.floor(100000 + Math.random() * 900000)}`;

  const { error: txUpdateError } = await db
    .from('momo_transactions')
    .update({ status: 'success', provider_reference: providerReference, confirmed_at: new Date().toISOString() })
    .eq('id', transaction.id);

  if (txUpdateError) {
    console.error('[confirm] transaction update failed:', txUpdateError.message);
    return NextResponse.json({ error: 'Failed to confirm payment' }, { status: 500 });
  }

  const { error: installmentUpdateError } = await db
    .from('lease_installments')
    .update({ status: 'paid', paid_at: new Date().toISOString(), momo_transaction_id: transaction.id })
    .eq('id', transaction.installment_id);

  if (installmentUpdateError) {
    console.error('[confirm] installment update failed:', installmentUpdateError.message);
    return NextResponse.json({ error: 'Payment confirmed but failed to update schedule — contact support' }, { status: 500 });
  }

  // First successful payment on a lease activates it.
  if (lease.status === 'pending_first_payment') {
    await db.from('leases').update({ status: 'active' }).eq('id', lease.id);
  }

  return NextResponse.json({ status: 'success', providerReference });
}
