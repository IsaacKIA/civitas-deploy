/**
 * POST /api/developer/units/bulk-import
 *
 * Batch provisions properties and initial handover records for estate developers.
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getAuthedProfile, createSupabaseServiceRoleClient } from '@/lib/supabase/server';
import type { ParsedUnitRow } from '@/lib/csv-importer';
import { dispatchNotification } from '@/lib/notification-dispatcher';

interface BulkImportPayload {
  projectName: string;
  units: ParsedUnitRow[];
}

export async function POST(request: NextRequest) {
  const auth = await getAuthedProfile();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized — please sign in' }, { status: 401 });
  }

  const allowedRoles = ['developer', 'org_admin', 'super_admin'];
  if (!allowedRoles.includes(auth.profile.role)) {
    return NextResponse.json({ error: 'Forbidden — developer role required' }, { status: 403 });
  }

  let body: BulkImportPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const { projectName, units } = body;
  if (!projectName || !Array.isArray(units) || units.length === 0) {
    return NextResponse.json({ error: 'projectName and non-empty units array are required' }, { status: 400 });
  }

  const validUnits = units.filter((u) => u.isValid);
  if (validUnits.length === 0) {
    return NextResponse.json({ error: 'No valid unit rows to import' }, { status: 400 });
  }

  const serviceDb = createSupabaseServiceRoleClient();

  const propertyRows = validUnits.map((u) => ({
    organization_id: auth.profile.organization_id,
    owner_id: auth.user.id,
    name: `${u.unit_number} — ${projectName}`,
    address: `${u.block_phase || 'Phase 1'}, ${projectName}, Greater Accra`,
    city: 'Accra',
    region: 'Greater Accra',
    property_type: u.property_type,
    status: 'under_build' as const,
    bedrooms: u.bedrooms || null,
    bathrooms: u.bathrooms || null,
    monthly_rent: u.monthly_rent || null,
    has_solar: false,
    has_smart_home: false,
  }));

  const { data: insertedProperties, error: insertError } = await serviceDb
    .from('properties')
    .insert(propertyRows)
    .select('id, name');

  if (insertError) {
    console.error('[Bulk Import properties insert error]', insertError);
    return NextResponse.json({ error: `Failed to insert properties: ${insertError.message}` }, { status: 500 });
  }

  // Create initial handover certificate entries in property_documents
  try {
    const docRows = ((insertedProperties as Array<{ id: string; name: string }>) || []).map((p) => ({
      property_id: p.id,
      owner_id: auth.user.id,
      organization_id: auth.profile.organization_id,
      title: `Handover Certificate & Snagpack: ${p.name}`,
      category: 'handover_cert',
      storage_path: `handovers/${p.id}/certificate.pdf`,
      file_size_bytes: 1024 * 128,
      mime_type: 'application/pdf',
    }));

    await serviceDb.from('property_documents').insert(docRows);
  } catch (err) {
    console.warn('[Bulk Import document creation warning]', err);
  }

  // Dispatch buyer onboarding alerts if buyer contacts were provided
  validUnits.forEach((u) => {
    if (u.buyer_name && (u.buyer_phone || u.buyer_email)) {
      dispatchNotification({
        event: 'handover_certificate_ready',
        recipientName: u.buyer_name,
        recipientPhone: u.buyer_phone,
        recipientEmail: u.buyer_email,
        data: {
          project: projectName,
          unit: u.unit_number,
          ref: `UNIT-${u.unit_number.replace(/\s+/g, '')}`,
          deadline: u.handover_date || new Date(Date.now() + 86400000 * 14).toLocaleDateString('en-GB'),
          portal_url: 'https://www.civitasestate.com/portal',
        },
      }).catch(() => {});
    }
  });

  return NextResponse.json({
    success: true,
    importedCount: insertedProperties?.length || 0,
    projectName,
    message: `Successfully batch-provisioned ${insertedProperties?.length || 0} estate units.`,
  });
}
