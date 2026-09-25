import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, createSupabaseServiceRoleClient, getAuthedProfile } from '@/lib/supabase/server';
import { dispatchNotification } from '@/lib/notification-dispatcher';

interface AssignBody {
  action: 'assign';
  technicianId: string;
}

interface UpdateStatusBody {
  action: 'update_status';
  status: 'in_progress' | 'completed';
}

interface CancelBody {
  action: 'cancel';
}

type PatchBody = AssignBody | UpdateStatusBody | CancelBody;

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthedProfile();
  if (!auth) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id: requestId } = await params;

  let body: PatchBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  if (body.action === 'assign') {
    if (!body.technicianId) {
      return NextResponse.json({ error: 'technicianId is required' }, { status: 400 });
    }

    // Verify the target is actually a technician before assigning — RLS
    // will reject the update either way if this caller doesn't own the
    // request, but a bad technicianId would otherwise silently "succeed"
    // and assign a non-technician profile.
    const serviceDb = createSupabaseServiceRoleClient();
    const { data: technician } = await serviceDb
      .from('profiles')
      .select('id, role')
      .eq('id', body.technicianId)
      .maybeSingle();

    if (!technician || technician.role !== 'technician') {
      return NextResponse.json({ error: 'That profile is not a registered technician' }, { status: 400 });
    }

    const { data: updated, error } = await supabase
      .from('maintenance_requests')
      .update({ technician_id: body.technicianId, status: 'assigned' })
      .eq('id', requestId)
      .select('id');

    if (error || !updated || updated.length === 0) {
      return NextResponse.json({ error: 'Could not assign technician — you may not own this request' }, { status: 403 });
    }

    // Dispatch assignment notifications asynchronously
    (async () => {
      try {
        const { data: reqData } = await serviceDb
          .from('maintenance_requests')
          .select('reference_code, title, category, priority, property:properties(name), reporter:profiles!reported_by(full_name, phone, email), tech:profiles!technician_id(full_name, phone)')
          .eq('id', requestId)
          .single();

        if (reqData) {
          const propName = (Array.isArray(reqData.property) ? reqData.property[0] : reqData.property)?.name || 'Property';
          const reporter = Array.isArray(reqData.reporter) ? reqData.reporter[0] : reqData.reporter;
          const tech = Array.isArray(reqData.tech) ? reqData.tech[0] : reqData.tech;

          if (reporter) {
            dispatchNotification({
              event: 'maintenance_request_assigned',
              recipientName: reporter.full_name || 'Resident',
              recipientPhone: reporter.phone || undefined,
              recipientEmail: reporter.email,
              data: {
                title: reqData.title,
                property: propName,
                technician: tech?.full_name || 'Civitas Technician',
                eta: 'Within 2 hours',
                technician_phone: tech?.phone || '+233 55 506 2589',
              },
            }).catch(() => {});
          }

          if (tech?.phone) {
            dispatchNotification({
              event: 'work_order_dispatched',
              recipientName: tech.full_name,
              recipientPhone: tech.phone,
              data: {
                ref: reqData.reference_code,
                property: propName,
                category: reqData.category,
                priority: reqData.priority,
                respond_by: '30 mins',
              },
            }).catch(() => {});
          }
        }
      } catch (err) {
        console.error('[assign notification error]', err);
      }
    })();

    return NextResponse.json({ ok: true });
  }

  if (body.action === 'update_status') {
    if (!['in_progress', 'completed'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const update: Record<string, unknown> = { status: body.status };
    if (body.status === 'completed') update.resolved_at = new Date().toISOString();

    const { data: updated, error } = await supabase
      .from('maintenance_requests')
      .update(update)
      .eq('id', requestId)
      .select('id');

    if (error || !updated || updated.length === 0) {
      return NextResponse.json({ error: 'Could not update status — this request may not be assigned to you' }, { status: 403 });
    }

    if (body.status === 'completed') {
      (async () => {
        try {
          const serviceDb = createSupabaseServiceRoleClient();
          const { data: reqData } = await serviceDb
            .from('maintenance_requests')
            .select('reference_code, title, property:properties(name), reporter:profiles!reported_by(full_name, phone, email), tech:profiles!technician_id(full_name)')
            .eq('id', requestId)
            .single();

          if (reqData) {
            const propName = (Array.isArray(reqData.property) ? reqData.property[0] : reqData.property)?.name || 'Property';
            const reporter = Array.isArray(reqData.reporter) ? reqData.reporter[0] : reqData.reporter;
            const tech = Array.isArray(reqData.tech) ? reqData.tech[0] : reqData.tech;

            if (reporter) {
              dispatchNotification({
                event: 'maintenance_request_completed',
                recipientName: reporter.full_name || 'Resident',
                recipientPhone: reporter.phone || undefined,
                recipientEmail: reporter.email,
                data: {
                  ref: reqData.reference_code,
                  property: propName,
                  summary: reqData.title,
                  duration: 'Same day',
                  technician: tech?.full_name || 'Civitas Technician',
                  rating_url: 'https://www.civitasestate.com/dashboard/tenant/maintenance',
                },
              }).catch(() => {});
            }
          }
        } catch (err) {
          console.error('[completed notification error]', err);
        }
      })();
    }

    return NextResponse.json({ ok: true });
  }

  if (body.action === 'cancel') {
    const { data: updated, error } = await supabase
      .from('maintenance_requests')
      .update({ status: 'cancelled' })
      .eq('id', requestId)
      .select('id');

    if (error || !updated || updated.length === 0) {
      return NextResponse.json({ error: 'Could not cancel — you may not own this request' }, { status: 403 });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
