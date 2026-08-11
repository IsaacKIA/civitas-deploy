import { NextRequest, NextResponse } from 'next/server';
import { getAuthedProfile, createSupabaseServiceRoleClient } from '@/lib/supabase/server';
import { buildRentActPlan, RENT_ACT_LEGAL_ADVANCE_MONTHS } from '@/lib/escrow';

interface CreateLeaseBody {
  propertyId: string;
  tenantId: string;
  monthlyRentGhs: number;
  advanceMonthsRequested: number;
  startDate: string; // ISO date
  leaseTermMonths: number;
}

const CAN_CREATE_LEASE_ROLES = ['org_admin', 'super_admin', 'client'];

export async function POST(request: NextRequest) {
  const auth = await getAuthedProfile();

  if (!auth) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  if (!CAN_CREATE_LEASE_ROLES.includes(auth.profile.role)) {
    return NextResponse.json(
      { error: 'Your role is not permitted to create leases' },
      { status: 403 }
    );
  }

  let body: CreateLeaseBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { propertyId, tenantId, monthlyRentGhs, advanceMonthsRequested, startDate, leaseTermMonths } =
    body;

  if (
    !propertyId ||
    !tenantId ||
    typeof monthlyRentGhs !== 'number' ||
    monthlyRentGhs <= 0 ||
    !Number.isInteger(advanceMonthsRequested) ||
    advanceMonthsRequested < 1 ||
    !startDate ||
    !Number.isInteger(leaseTermMonths) ||
    leaseTermMonths < 1
  ) {
    return NextResponse.json({ error: 'Missing or invalid lease fields' }, { status: 400 });
  }

  const parsedStartDate = new Date(startDate);
  if (Number.isNaN(parsedStartDate.getTime())) {
    return NextResponse.json({ error: 'Invalid startDate' }, { status: 400 });
  }

  // Service-role client: leases has no client-writable RLS policy by
  // design (see migration 0002) — every lease is created here, where the
  // Rent Act math is authoritative and the creator's role has already been
  // checked above.
  const db = createSupabaseServiceRoleClient();

  // Verify the property belongs to this owner/org before creating a lease
  // against it — the role check above is not enough on its own, an
  // org_admin for a DIFFERENT organization must not be able to lease out
  // someone else's property.
  const { data: property, error: propertyError } = await db
    .from('properties')
    .select('id, organization_id, owner_id')
    .eq('id', propertyId)
    .single();

  if (propertyError || !property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  const isOwnProperty =
    property.owner_id === auth.user.id || property.organization_id === auth.profile.organization_id;

  if (!isOwnProperty) {
    return NextResponse.json(
      { error: 'You do not have permission to lease this property' },
      { status: 403 }
    );
  }

  const plan = buildRentActPlan(
    monthlyRentGhs,
    advanceMonthsRequested,
    parsedStartDate,
    leaseTermMonths
  );

  const { data: lease, error: leaseError } = await db
    .from('leases')
    .insert({
      organization_id: property.organization_id,
      property_id: propertyId,
      tenant_id: tenantId,
      owner_id: property.owner_id,
      monthly_rent_ghs: monthlyRentGhs,
      advance_months_requested: advanceMonthsRequested,
      legal_advance_months: Math.min(advanceMonthsRequested, RENT_ACT_LEGAL_ADVANCE_MONTHS),
      start_date: startDate,
      status: 'pending_first_payment',
    })
    .select('id')
    .single();

  if (leaseError || !lease) {
    console.error('[POST /api/leases] insert failed:', leaseError?.message);
    return NextResponse.json({ error: 'Failed to create lease' }, { status: 500 });
  }

  const installmentRows = plan.installments.map((installment) => ({
    lease_id: lease.id,
    installment_number: installment.installmentNumber,
    month_offset: installment.monthOffset,
    due_date: installment.dueDate,
    amount_ghs: installment.amountGhs,
    kind: installment.kind,
    status: 'due' as const,
  }));

  const { error: installmentsError } = await db.from('lease_installments').insert(installmentRows);

  if (installmentsError) {
    // Roll back the orphaned lease rather than leaving a lease with no
    // payment schedule sitting in the database.
    await db.from('leases').delete().eq('id', lease.id);
    console.error('[POST /api/leases] installment insert failed:', installmentsError.message);
    return NextResponse.json({ error: 'Failed to create payment schedule' }, { status: 500 });
  }

  // Property status previously never left 'vacant' once a lease was
  // created — nothing updated it. A property with an active tenant paying
  // rent should read as occupied ('active' in the status enum) everywhere
  // it's shown, not sit marked vacant forever.
  const { error: propertyStatusError } = await db
    .from('properties')
    .update({ status: 'active' })
    .eq('id', propertyId);

  if (propertyStatusError) {
    // Non-fatal: the lease and schedule are already correctly created:
    // don't fail the whole request over a display-status update, just log
    // it so it can be fixed rather than silently drifting.
    console.error('[POST /api/leases] property status update failed:', propertyStatusError.message);
  }

  return NextResponse.json({ leaseId: lease.id, plan }, { status: 201 });
}
