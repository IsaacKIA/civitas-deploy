import { NextResponse } from 'next/server';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';

export interface NotificationItem {
  id: string;
  type: 'financial' | 'maintenance';
  title: string;
  desc: string;
  time: string; // ISO timestamp — client formats relative time
}

/**
 * GET /api/notifications
 *
 * Real notifications derived from actual recent activity, not a hardcoded
 * list. There's no dedicated notifications table (and no push/SMS delivery
 * system) yet — this reads straight from lease_installments and
 * maintenance_requests, which are already RLS-scoped to what this user is
 * allowed to see, so there's no separate access check needed here beyond
 * requiring authentication.
 */
export async function GET() {
  const auth = await getAuthedProfile();
  if (!auth) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient();
  const isTenant = auth.profile.role === 'tenant';
  const items: NotificationItem[] = [];

  const leaseFilter = isTenant ? { column: 'tenant_id' as const } : { column: 'owner_id' as const };

  const { data: recentPayments } = await supabase
    .from('lease_installments')
    .select('id, amount_ghs, paid_at, leases!inner(properties(name), tenant_id, owner_id)')
    .eq('status', 'paid')
    .not('paid_at', 'is', null)
    .eq(`leases.${leaseFilter.column}`, auth.user.id)
    .order('paid_at', { ascending: false })
    .limit(5);

  for (const p of recentPayments ?? []) {
    const lease = Array.isArray(p.leases) ? p.leases[0] : p.leases;
    const property = lease ? (Array.isArray(lease.properties) ? lease.properties[0] : lease.properties) : null;
    items.push({
      id: `payment-${p.id}`,
      type: 'financial',
      title: 'Rent Payment Confirmed',
      desc: `GHS ${Number(p.amount_ghs).toLocaleString()} confirmed for ${property?.name ?? 'your property'}.`,
      time: p.paid_at as string,
    });
  }

  const maintenanceFilter = isTenant ? { column: 'tenant_id' as const } : { column: 'owner_id' as const };

  const { data: recentMaintenance } = await supabase
    .from('maintenance_requests')
    .select('id, title, status, updated_at, properties(name)')
    .eq(maintenanceFilter.column, auth.user.id)
    .order('updated_at', { ascending: false })
    .limit(5);

  for (const m of recentMaintenance ?? []) {
    const property = Array.isArray(m.properties) ? m.properties[0] : m.properties;
    items.push({
      id: `maintenance-${m.id}`,
      type: 'maintenance',
      title: `Maintenance Request ${m.status.replace('_', ' ')}`,
      desc: `"${m.title}" at ${property?.name ?? 'your property'} is now ${m.status.replace('_', ' ')}.`,
      time: m.updated_at,
    });
  }

  items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return NextResponse.json({ notifications: items.slice(0, 8) });
}
