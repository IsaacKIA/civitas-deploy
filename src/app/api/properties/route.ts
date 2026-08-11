import { NextRequest, NextResponse } from 'next/server';
import { getAuthedProfile, createSupabaseServiceRoleClient } from '@/lib/supabase/server';

const CAN_CREATE_PROPERTY_ROLES = ['org_admin', 'super_admin', 'client'];

const VALID_PROPERTY_TYPES = ['residential', 'commercial', 'mixed_use', 'industrial'];

interface CreatePropertyBody {
  name: string;
  propertyType: string;
  units: number;
  bedrooms: number;
  bathrooms: number;
  monthlyRent: number;
  ghanaPostGps: string;
  address: string;
  city: string;
  region: string;
  hasSolar: boolean;
  solarCapacityKwp: number;
  hasBatteryBackup: boolean;
  ghanaCardId: string;
  landTitleRef: string;
}

function generatePropertyCode(): string {
  return `PROP-GH-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function POST(request: NextRequest) {
  const auth = await getAuthedProfile();
  if (!auth) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (!CAN_CREATE_PROPERTY_ROLES.includes(auth.profile.role)) {
    return NextResponse.json({ error: 'Your role is not permitted to register properties' }, { status: 403 });
  }

  let body: CreatePropertyBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const errors: Record<string, string> = {};
  if (!body.name?.trim()) errors.name = 'Property name is required';
  if (!VALID_PROPERTY_TYPES.includes(body.propertyType)) errors.propertyType = 'Invalid property type';
  if (!(body.monthlyRent > 0)) errors.monthlyRent = 'Monthly rent must be greater than 0';
  if (!body.address?.trim()) errors.address = 'Address is required';
  if (!body.city?.trim()) errors.city = 'City is required';
  if (!body.region?.trim()) errors.region = 'Region is required';
  if (!body.ghanaCardId?.trim()) errors.ghanaCardId = 'Ghana Card PIN is required to verify ownership';

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: 'Validation failed', fieldErrors: errors }, { status: 400 });
  }

  const db = createSupabaseServiceRoleClient();

  // Retry once on the unlikely event of a property_code collision.
  for (let attempt = 0; attempt < 2; attempt++) {
    const propertyCode = generatePropertyCode();

    const { data, error } = await db
      .from('properties')
      .insert({
        organization_id: auth.profile.organization_id,
        owner_id: auth.user.id,
        name: body.name.trim(),
        property_type: body.propertyType,
        total_units: body.units ?? 1,
        bedrooms: body.bedrooms ?? null,
        bathrooms: body.bathrooms ?? null,
        monthly_rent: body.monthlyRent,
        ghana_post_gps: body.ghanaPostGps?.trim() || null,
        address: body.address.trim(),
        city: body.city.trim(),
        region: body.region.trim(),
        has_solar: !!body.hasSolar,
        solar_capacity_kwp: body.hasSolar ? body.solarCapacityKwp ?? null : null,
        has_battery_backup: !!body.hasBatteryBackup,
        ghana_card_pin: body.ghanaCardId.trim(),
        land_title_ref: body.landTitleRef?.trim() || null,
        property_code: propertyCode,
        status: 'vacant',
      })
      .select('id, property_code')
      .single();

    if (!error && data) {
      return NextResponse.json({ propertyId: data.id, propertyCode: data.property_code }, { status: 201 });
    }

    const isCodeCollision = error?.code === '23505' && error.message.includes('property_code');
    if (!isCodeCollision) {
      console.error('[POST /api/properties] insert failed:', error?.message);
      return NextResponse.json({ error: 'Failed to register property' }, { status: 500 });
    }
    // else loop and retry with a fresh code
  }

  return NextResponse.json({ error: 'Failed to register property, please try again' }, { status: 500 });
}
