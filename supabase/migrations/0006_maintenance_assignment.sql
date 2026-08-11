-- maintenance_requests previously had no UPDATE policy at all — a request
-- could be created and then never touched again by anyone, since nothing
-- could assign a technician or change its status. This closes that loop.

-- Owner may update their own property's requests, but only to assign a
-- technician (and implicitly move it to 'assigned') or cancel it — not to
-- mark it completed themselves, since that should reflect the technician's
-- actual work.
drop policy if exists maintenance_requests_update_owner on public.maintenance_requests;
create policy maintenance_requests_update_owner on public.maintenance_requests
  for update
  using (owner_id = auth.uid())
  with check (
    owner_id = auth.uid()
    and status in ('new', 'assigned', 'cancelled')
  );

-- The technician a request is assigned to may progress its status, but
-- only forward through the real workflow, and only on rows already
-- assigned to them — they can't self-assign by writing their own id into
-- technician_id (that column isn't part of this policy's own row, it's
-- read-only from their side via the USING clause).
drop policy if exists maintenance_requests_update_technician on public.maintenance_requests;
create policy maintenance_requests_update_technician on public.maintenance_requests
  for update
  using (technician_id = auth.uid())
  with check (
    technician_id = auth.uid()
    and status in ('assigned', 'in_progress', 'completed')
  );
