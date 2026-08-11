import { NextRequest, NextResponse } from 'next/server';
import { getAuthedProfile, createSupabaseServiceRoleClient } from '@/lib/supabase/server';

const CAN_LOOKUP_ROLES = ['org_admin', 'super_admin', 'client'];
const LOOKUPABLE_ROLES = ['tenant', 'technician'];

/**
 * GET /api/profiles/lookup?email=someone@example.com&role=tenant
 *
 * Used when an owner creates a lease (role=tenant) or assigns a
 * maintenance request (role=technician) and needs to attach an existing
 * account. Deliberately narrow:
 *  - Only owner/admin roles may call this at all.
 *  - Only role=tenant or role=technician profiles are returned (an owner
 *    shouldn't be able to use this to fish for other owners' or admins'
 *    emails), and only the role explicitly requested.
 *  - Only id + full name are returned — never phone, never anything else.
 */
export async function GET(request: NextRequest) {
  const auth = await getAuthedProfile();
  if (!auth) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (!CAN_LOOKUP_ROLES.includes(auth.profile.role)) {
    return NextResponse.json({ error: 'Not permitted' }, { status: 403 });
  }

  const email = request.nextUrl.searchParams.get('email')?.trim().toLowerCase();
  const role = request.nextUrl.searchParams.get('role') ?? 'tenant';

  if (!email) {
    return NextResponse.json({ error: 'email query param is required' }, { status: 400 });
  }
  if (!LOOKUPABLE_ROLES.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const db = createSupabaseServiceRoleClient();

  const { data: profile } = await db
    .from('profiles')
    .select('id, full_name')
    .eq('email', email)
    .eq('role', role)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({ found: true, profileId: profile.id, fullName: profile.full_name });
}
