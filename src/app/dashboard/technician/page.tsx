import DashboardLayout from '@/components/DashboardLayout';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';
import { MAINTENANCE_CATEGORIES, MAINTENANCE_PRIORITIES, MAINTENANCE_STATUS_STYLE } from '@/lib/maintenance';
import JobStatusButton from './JobStatusButton';

export default async function TechnicianDashboard() {
  const auth = await getAuthedProfile();

  if (!auth) {
    return (
      <DashboardLayout role="technician">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#D8E4DC] shadow-sm text-center text-xs text-[#6B7E72]">
          Your session has expired. Please sign in again.
        </div>
      </DashboardLayout>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: jobs, error } = await supabase
    .from('maintenance_requests')
    .select('id, reference_code, category, priority, title, description, status, created_at, sla_hours, properties(name, address, ghana_post_gps), profiles:tenant_id(full_name)')
    .eq('technician_id', auth.user.id)
    .order('created_at', { ascending: false });

  const activeJobs = (jobs ?? []).filter((j) => j.status === 'assigned' || j.status === 'in_progress');
  const completedJobs = (jobs ?? []).filter((j) => j.status === 'completed');

  return (
    <DashboardLayout role="technician" userName={auth.profile.full_name}>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">My Jobs</h1>
        <p className="text-xs text-[#6B7E72] mt-1">Maintenance requests assigned to you</p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-[#FDECEA] border border-[#FAD4D0] text-xs text-[#D94F3D] mb-6">
          Couldn&apos;t load your jobs right now. Please refresh.
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-sm font-bold text-[#111A14] mb-4">Active ({activeJobs.length})</h2>
        {activeJobs.length === 0 && !error ? (
          <div className="bg-white rounded-3xl border border-[#D8E4DC] p-10 text-center text-xs text-[#6B7E72]">
            No active jobs right now. New assignments from property owners will appear here.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#D8E4DC] shadow-sm divide-y divide-[#D8E4DC]">
            {activeJobs.map((job) => {
              const property = Array.isArray(job.properties) ? job.properties[0] : job.properties;
              const tenant = Array.isArray(job.profiles) ? job.profiles[0] : job.profiles;
              const category = MAINTENANCE_CATEGORIES.find((c) => c.id === job.category);
              const priority = MAINTENANCE_PRIORITIES.find((p) => p.id === job.priority);
              return (
                <div key={job.id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-xs font-bold text-[#1A5C3A]">{job.reference_code}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: priority?.bg, color: priority?.color }}>
                        {priority?.label ?? job.priority}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${MAINTENANCE_STATUS_STYLE[job.status] ?? ''}`}>
                        {job.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#111A14]">{category?.icon} {job.title}</h3>
                    <p className="text-xs text-[#6B7E72] mt-0.5">{job.description}</p>
                    <p className="text-[10px] text-[#A8B8AE] mt-1.5">
                      {property?.name}{property?.ghana_post_gps ? ` · ${property.ghana_post_gps}` : ''}
                      {tenant?.full_name ? ` · Tenant: ${tenant.full_name}` : ''} · Target: {job.sla_hours}h response
                    </p>
                  </div>
                  <JobStatusButton requestId={job.id} status={job.status} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-bold text-[#111A14] mb-4">Completed ({completedJobs.length})</h2>
        {completedJobs.length === 0 && !error ? (
          <div className="bg-white rounded-3xl border border-[#D8E4DC] p-8 text-center text-xs text-[#6B7E72]">
            No completed jobs yet.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#D8E4DC] shadow-sm divide-y divide-[#D8E4DC]">
            {completedJobs.map((job) => {
              const property = Array.isArray(job.properties) ? job.properties[0] : job.properties;
              const category = MAINTENANCE_CATEGORIES.find((c) => c.id === job.category);
              return (
                <div key={job.id} className="p-5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#1A5C3A] mr-2">{job.reference_code}</span>
                    <span className="font-semibold text-[#111A14]">{category?.icon} {job.title}</span>
                    <span className="text-[#6B7E72]"> · {property?.name}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF7F2] text-[#1A5C3A]">Completed</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
