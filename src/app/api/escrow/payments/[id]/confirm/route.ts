import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceRoleClient, getAuthedProfile } from '@/lib/supabase/server';
import { dispatchNotification } from '@/lib/notification-dispatcher';
import { verifyPaystackTransaction } from '@/lib/paystack';

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
    .select('id, lease_id, installment_id, initiated_by, status, amount_ghs, provider_reference, leases!inner(tenant_id, owner_id, id, advance_months_requested, status, properties(name), tenant:profiles!tenant_id(full_name, phone, email), owner:profiles!owner_id(full_name, phone, email))')
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
  if (transaction.status === 'success') {
    return NextResponse.json({ status: 'success', alreadyConfirmed: true });
  }

  if (transaction.status !== 'initiated' && transaction.status !== 'awaiting_pin') {
    return NextResponse.json(
      { error: `Cannot confirm a transaction in status '${transaction.status}'` },
      { status: 409 }
    );
  }

  // Gateway verification step
  let providerReference = transaction.provider_reference;
  const isTestKey = (process.env.PAYSTACK_SECRET_KEY || '').startsWith('sk_test_');

  if (providerReference) {
    try {
      const verifyRes = await verifyPaystackTransaction(providerReference);
      if (verifyRes.data.status !== 'success' && !isTestKey) {
        return NextResponse.json(
          { error: `Payment pending authorization (${verifyRes.data.gateway_response || 'awaiting PIN approval'})` },
          { status: 402 }
        );
      }
    } catch (err) {
      if (!isTestKey) {
        console.error('[confirm] Paystack verify error:', err);
        return NextResponse.json(
          { error: 'Unable to verify payment with Mobile Money aggregator' },
          { status: 502 }
        );
      }
    }
  }

  if (!providerReference) {
    providerReference = `CIV-MOMO-${Math.floor(100000 + Math.random() * 900000)}`;
  }

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

  // Fire-and-forget multichannel notification dispatches
  (async () => {
    try {
      const propName = (Array.isArray(lease.properties) ? lease.properties[0] : lease.properties)?.name || 'Civitas Property';
      const tenant = Array.isArray(lease.tenant) ? lease.tenant[0] : lease.tenant;
      const owner = Array.isArray(lease.owner) ? lease.owner[0] : lease.owner;
      const paymentDate = new Date().toLocaleDateString('en-GB');

      // Dispatch to Tenant
      if (tenant) {
        dispatchNotification({
          event: 'rent_payment_confirmed',
          recipientName: tenant.full_name || 'Tenant',
          recipientPhone: tenant.phone || undefined,
          recipientEmail: tenant.email,
          userId: lease.tenant_id,
          data: {
            property: propName,
            amount: Number(transaction.amount_ghs).toLocaleString(),
            ref: providerReference,
            payment_date: paymentDate,
            portal_url: 'https://www.civitasestate.com/dashboard/tenant/rent',
          },
        }).catch(() => {});
      }

      // Dispatch to Owner
      if (owner) {
        dispatchNotification({
          event: 'rent_payment_confirmed',
          recipientName: owner.full_name || 'Property Owner',
          recipientPhone: owner.phone || undefined,
          recipientEmail: owner.email,
          userId: lease.owner_id,
          data: {
            property: propName,
            amount: Number(transaction.amount_ghs).toLocaleString(),
            ref: providerReference,
            payment_date: paymentDate,
            portal_url: 'https://www.civitasestate.com/dashboard/owner/finances',
          },
        }).catch(() => {});
      }
    } catch (err) {
      console.error('[payment notification error]', err);
    }
  })();

  return NextResponse.json({ status: 'success', providerReference });
}
