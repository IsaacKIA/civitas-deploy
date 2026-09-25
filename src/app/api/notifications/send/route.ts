/**
 * POST /api/notifications/send
 *
 * Unified Multi-Channel Notification Dispatcher HTTP endpoint.
 *
 * Auth:
 *   - Internal API secret header: x-internal-secret === INTERNAL_API_SECRET
 *   - Or authenticated session via Supabase getAuthedProfile()
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getAuthedProfile } from '@/lib/supabase/server';
import { dispatchNotification, type DispatchNotificationParams } from '@/lib/notification-dispatcher';

export async function POST(request: NextRequest) {
  // 1. Auth verification
  const secret = request.headers.get('x-internal-secret');
  const isInternal = secret && secret === process.env.INTERNAL_API_SECRET;

  if (!isInternal) {
    const auth = await getAuthedProfile();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // 2. Parse payload
  let body: DispatchNotificationParams;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { event, recipientName } = body;
  if (!event || !recipientName) {
    return NextResponse.json({ error: 'Missing required parameters (event, recipientName)' }, { status: 400 });
  }

  // 3. Dispatch
  const result = await dispatchNotification(body);

  return NextResponse.json(result);
}
