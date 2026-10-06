import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';
import { isValidGhanaMobileNumber, type MomoRail } from '@/lib/escrow';
import { initializePaystackTransaction } from '@/lib/paystack';

interface InitiatePaymentBody {
  installmentId: string;
  rail: MomoRail;
  phoneNumber: string;
}

const VALID_RAILS: MomoRail[] = ['mtn_momo', 'telecel_cash', 'at_money'];

export async function POST(request: NextRequest) {
  const auth = await getAuthedProfile();
  if (!auth) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let body: InitiatePaymentBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { installmentId, rail, phoneNumber } = body;

  if (!installmentId || !VALID_RAILS.includes(rail) || !isValidGhanaMobileNumber(phoneNumber ?? '')) {
    return NextResponse.json({ error: 'Missing or invalid payment details' }, { status: 400 });
  }

  // Uses the session-bound client (RLS enforced), not the service role —
  // ownership of the installment's lease is verified by Postgres itself via
  // the momo_transactions_insert_by_tenant policy, not just by app code.
  const supabase = await createSupabaseServerClient();

  const { data: installment, error: installmentError } = await supabase
    .from('lease_installments')
    .select('id, lease_id, amount_ghs, status, leases!inner(tenant_id)')
    .eq('id', installmentId)
    .single();

  if (installmentError || !installment) {
    return NextResponse.json({ error: 'Installment not found' }, { status: 404 });
  }

  if (installment.status !== 'due') {
    return NextResponse.json(
      { error: `This installment is not payable (status: ${installment.status})` },
      { status: 409 }
    );
  }

  // Generate distinct Paystack reference
  const paystackRef = `CIV-${installment.id.slice(0, 8)}-${Date.now()}`;
  let authorizationUrl: string | undefined;

  // Initialize with Paystack if secret key is configured
  if (process.env.PAYSTACK_SECRET_KEY) {
    try {
      const paystackRes = await initializePaystackTransaction({
        email: auth.profile.email || auth.user.email || 'billing@civitasestate.com',
        amountGhs: Number(installment.amount_ghs),
        reference: paystackRef,
        callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/tenant/rent?paid=${installment.id}`,
        metadata: {
          lease_id: installment.lease_id,
          installment_id: installment.id,
          initiated_by: auth.user.id,
          rail,
          phone_number: phoneNumber,
        },
      });
      authorizationUrl = paystackRes.data.authorization_url;
    } catch (paystackErr) {
      console.warn('[POST /api/escrow/payments] Paystack init note:', paystackErr instanceof Error ? paystackErr.message : paystackErr);
    }
  }

  const { data: transaction, error: insertError } = await supabase
    .from('momo_transactions')
    .insert({
      lease_id: installment.lease_id,
      installment_id: installment.id,
      initiated_by: auth.user.id,
      rail,
      phone_number: phoneNumber,
      amount_ghs: installment.amount_ghs,
      provider_reference: paystackRef,
      status: 'initiated',
    })
    .select('id, amount_ghs, rail, phone_number, provider_reference')
    .single();

  if (insertError || !transaction) {
    console.error('[POST /api/escrow/payments] insert failed:', insertError?.message);
    return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 });
  }

  // Mark the installment as awaiting confirmation so it can't be paid twice concurrently
  await supabase
    .from('lease_installments')
    .update({ status: 'pending_confirmation' })
    .eq('id', installment.id)
    .eq('status', 'due');

  return NextResponse.json({
    transactionId: transaction.id,
    reference: paystackRef,
    authorizationUrl,
  }, { status: 201 });
}

