import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';
import {
  MAINTENANCE_CATEGORIES,
  MAINTENANCE_PRIORITIES,
  generateMaintenanceReference,
  slaHoursFor,
  type MaintenanceCategory,
  type MaintenancePriority,
} from '@/lib/maintenance';

interface CreateMaintenanceBody {
  propertyId: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  title: string;
  description: string;
  preferredDate?: string;
}

export async function POST(request: NextRequest) {
  const auth = await getAuthedProfile();
  if (!auth) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let body: CreateMaintenanceBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const errors: Record<string, string> = {};
  if (!body.propertyId) errors.propertyId = 'A property is required';
  if (!MAINTENANCE_CATEGORIES.some((c) => c.id === body.category)) errors.category = 'Invalid category';
  if (!MAINTENANCE_PRIORITIES.some((p) => p.id === body.priority)) errors.priority = 'Invalid priority';
  if (!body.title?.trim()) errors.title = 'A short title is required';
  if (!body.description?.trim()) errors.description = 'A description is required';

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: 'Validation failed', fieldErrors: errors }, { status: 400 });
  }

  const isTenant = auth.profile.role === 'tenant';

  // Session-bound client: RLS (maintenance_requests_insert) independently
  // re-verifies that a tenant has an active lease on this property, or that
  // an owner actually owns it — this app-level check is a fast-fail, not
  // the real access control.
  const supabase = await createSupabaseServerClient();

  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('id, organization_id, owner_id')
    .eq('id', body.propertyId)
    .maybeSingle();

  if (propertyError || !property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  if (isTenant) {
    const { data: lease } = await supabase
      .from('leases')
      .select('id')
      .eq('property_id', body.propertyId)
      .eq('tenant_id', auth.user.id)
      .in('status', ['active', 'pending_first_payment'])
      .maybeSingle();

    if (!lease) {
      return NextResponse.json({ error: 'You do not have an active lease on this property' }, { status: 403 });
    }
  } else if (property.owner_id !== auth.user.id) {
    return NextResponse.json({ error: 'You do not own this property' }, { status: 403 });
  }

  const { data: request_, error: insertError } = await supabase
    .from('maintenance_requests')
    .insert({
      reference_code: generateMaintenanceReference(),
      organization_id: property.organization_id,
      property_id: body.propertyId,
      reported_by: auth.user.id,
      tenant_id: isTenant ? auth.user.id : null,
      owner_id: property.owner_id,
      category: body.category,
      priority: body.priority,
      sla_hours: slaHoursFor(body.priority),
      title: body.title.trim(),
      description: body.description.trim(),
      preferred_date: body.preferredDate || null,
      status: 'new',
    })
    .select('id, reference_code')
    .single();

  if (insertError || !request_) {
    console.error('[POST /api/maintenance] insert failed:', insertError?.message);
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
  }

  return NextResponse.json({ requestId: request_.id, referenceCode: request_.reference_code }, { status: 201 });
}
