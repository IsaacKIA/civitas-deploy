'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

type JobStatus = 'new' | 'accepted' | 'en_route' | 'on_site' | 'completed';

interface Job {
  id: string;
  property: string;
  address: string;
  type: string;
  priority: 'emergency' | 'urgent' | 'standard' | 'low';
  status: JobStatus;
  slaDeadline: string;
  client: string;
  reward: number;
}

const INITIAL_JOBS: Job[] = [
  { id: 'MR-2025-0042', property: 'East Legon Villa', address: 'GA-183-9021 · East Legon, Accra', type: 'Electrical Fault', priority: 'emergency', status: 'new',       slaDeadline: '1h 20m', client: 'Isaac K.',   reward: 450 },
  { id: 'MR-2025-0041', property: 'Tema Studio Apt',  address: 'GT-001-4567 · Tema Harbour',      type: 'Burst Pipe',    priority: 'urgent',    status: 'accepted',   slaDeadline: '5h 40m', client: 'Abena M.',  reward: 320 },
  { id: 'MR-2025-0038', property: 'Airport Apt 3B',   address: 'GA-445-1130 · Airport Res.',      type: 'Lock Repair',   priority: 'standard',  status: 'on_site',    slaDeadline: '22h 00m',client: 'Kwame A.', reward: 180 },
  { id: 'MR-2025-0035', property: 'Kumasi Eco-Hub',   address: 'AK-220-8801 · Ahodwo, Kumasi',    type: 'HVAC Service',  priority: 'standard',  status: 'completed',  slaDeadline: 'Done',   client: 'Esi Anto.', reward: 280 },
];

const STATUS_STEPS: JobStatus[] = ['new', 'accepted', 'en_route', 'on_site', 'completed'];
const STATUS_LABELS: Record<JobStatus, string> = {
  new: 'New', accepted: 'Accepted', en_route: 'En Route', on_site: 'On Site', completed: 'Completed'
};
const STATUS_NEXT: Record<JobStatus, string> = {
  new: 'Accept Job', accepted: 'Mark En Route', en_route: 'Mark On Site', on_site: 'Mark Completed', completed: 'Done'
};

const priorityColor = (p: string) => ({
  emergency: 'bg-[#FDECEA] text-[#D94F3D]',
  urgent:    'bg-[#FEF3C7] text-[#D97706]',
  standard:  'bg-[#EFF6FF] text-[#2563EB]',
  low:       'bg-[#F5F9F6] text-[#6B7E72]',
}[p] || 'bg-[#F5F9F6] text-[#6B7E72]');

const statusColor = (s: JobStatus) => ({
  new:       'bg-[#F5F9F6] text-[#6B7E72]',
  accepted:  'bg-[#EFF6FF] text-[#2563EB]',
  en_route:  'bg-[#FEF3C7] text-[#D97706]',
  on_site:   'bg-[#D4EFE6] text-[#2E8B6A]',
  completed: 'bg-[#EEF7F2] text-[#1A5C3A]',
}[s]);

export default function TechnicianDashboard() {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [selected, setSelected] = useState<Job | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const advanceStatus = (id: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id !== id) return j;
      const idx = STATUS_STEPS.indexOf(j.status);
      const next = STATUS_STEPS[Math.min(idx + 1, STATUS_STEPS.length - 1)];
      const updated = { ...j, status: next };
      if (selected?.id === id) setSelected(updated);
      return updated;
    }));
  };

  const activeJobs = jobs.filter(j => j.status !== 'completed');
  const completedJobs = jobs.filter(j => j.status === 'completed');
  const todayEarnings = completedJobs.reduce((s, j) => s + j.reward, 0);

  return (
    <DashboardLayout role="technician" userName="Kofi Acheampong">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Job Board</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Today&apos;s dispatch queue · Accra & Tema Zone</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-xs font-bold">
            GHS {todayEarnings.toLocaleString()} earned today
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#2E8B6A] animate-pulse" title="Online & Available" />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Jobs',   value: activeJobs.length.toString(),    color: '#2563EB', bg: '#EFF6FF' },
          { label: 'Emergency',     value: jobs.filter(j=>j.priority==='emergency').length.toString(), color: '#D94F3D', bg: '#FDECEA' },
          { label: 'Completed',     value: completedJobs.length.toString(), color: '#1A5C3A', bg: '#EEF7F2' },
          { label: 'Rating',        value: '4.8 ⭐',                         color: '#D97706', bg: '#FEF3C7' },
        ].map((s,i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#D8E4DC] p-4 shadow-sm text-center">
            <div className="text-xl font-bold font-serif" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] text-[#6B7E72] font-semibold uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Job List */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#D8E4DC] shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[#D8E4DC]">
            {(['active', 'completed'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-xs font-semibold capitalize transition-all ${activeTab === tab ? 'border-b-2 border-[#1A5C3A] text-[#1A5C3A]' : 'text-[#6B7E72]'}`}>
                {tab} ({tab === 'active' ? activeJobs.length : completedJobs.length})
              </button>
            ))}
          </div>

          <div className="divide-y divide-[#D8E4DC] overflow-y-auto max-h-[500px]">
            {(activeTab === 'active' ? activeJobs : completedJobs).map(job => (
              <button key={job.id} onClick={() => setSelected(job)}
                className={`w-full text-left p-4 hover:bg-[#F5F9F6] transition-all ${selected?.id === job.id ? 'bg-[#EEF7F2]' : ''}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#111A14]">{job.type}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${priorityColor(job.priority)}`}>{job.priority}</span>
                </div>
                <div className="text-[10px] text-[#6B7E72] mb-2">{job.property}</div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${statusColor(job.status)}`}>
                    {STATUS_LABELS[job.status]}
                  </span>
                  <span className="text-[10px] font-bold text-[#D94F3D]">⏱ {job.slaDeadline}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Job Detail Panel */}
        <div className="xl:col-span-3">
          {selected ? (
            <div className="bg-white rounded-2xl border border-[#D8E4DC] shadow-sm overflow-hidden">
              <div className="bg-[#0F3D26] p-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-white/50">{selected.id}</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${priorityColor(selected.priority)}`}>{selected.priority.toUpperCase()}</span>
                </div>
                <h2 className="text-xl font-serif font-bold mb-1">{selected.type}</h2>
                <p className="text-sm text-white/70">{selected.property}</p>
                <p className="text-xs text-white/50 mt-1">{selected.address}</p>
              </div>

              <div className="p-6">
                {/* Progress Steps */}
                <div className="flex items-center gap-1 mb-8">
                  {STATUS_STEPS.map((step, i) => {
                    const stepIdx = STATUS_STEPS.indexOf(selected.status);
                    const past = i <= stepIdx;
                    return (
                      <React.Fragment key={step}>
                        <div className={`flex flex-col items-center gap-1 ${i < STATUS_STEPS.length - 1 ? 'flex-1' : ''}`}>
                          <div className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${past ? 'bg-[#1A5C3A] text-white' : 'bg-[#D8E4DC] text-[#6B7E72]'}`}>
                            {past && i < stepIdx ? '✓' : i + 1}
                          </div>
                          <span className="text-[9px] text-[#6B7E72] text-center leading-tight">{STATUS_LABELS[step]}</span>
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div className={`flex-1 h-0.5 mb-4 rounded transition-all ${i < stepIdx ? 'bg-[#1A5C3A]' : 'bg-[#D8E4DC]'}`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Job Info */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
                  <div className="bg-[#F5F9F6] rounded-xl p-3">
                    <div className="text-[#6B7E72] font-semibold uppercase tracking-wider mb-1 text-[10px]">Client</div>
                    <div className="font-semibold text-[#111A14]">{selected.client}</div>
                  </div>
                  <div className="bg-[#F5F9F6] rounded-xl p-3">
                    <div className="text-[#6B7E72] font-semibold uppercase tracking-wider mb-1 text-[10px]">Payment</div>
                    <div className="font-bold text-[#1A5C3A]">GHS {selected.reward}</div>
                  </div>
                  <div className="bg-[#FDECEA] rounded-xl p-3">
                    <div className="text-[#D94F3D] font-semibold uppercase tracking-wider mb-1 text-[10px]">SLA Remaining</div>
                    <div className="font-bold text-[#D94F3D]">⏱ {selected.slaDeadline}</div>
                  </div>
                  <div className="bg-[#EFF6FF] rounded-xl p-3">
                    <div className="text-[#2563EB] font-semibold uppercase tracking-wider mb-1 text-[10px]">Ghana GPS</div>
                    <div className="font-semibold text-[#111A14]">{selected.address.split('·')[0].trim()}</div>
                  </div>
                </div>

                {/* Action Button */}
                {selected.status !== 'completed' && (
                  <button onClick={() => advanceStatus(selected.id)}
                    className="w-full py-3.5 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-sm font-semibold transition-all shadow-md">
                    {STATUS_NEXT[selected.status]} →
                  </button>
                )}
                {selected.status === 'completed' && (
                  <div className="text-center py-3 bg-[#EEF7F2] rounded-2xl">
                    <div className="text-2xl mb-1">✅</div>
                    <div className="text-sm font-semibold text-[#1A5C3A]">Job Complete — GHS {selected.reward} paid via MoMo</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#D8E4DC] shadow-sm h-full flex items-center justify-center p-12 text-center">
              <div>
                <div className="text-4xl mb-3">📋</div>
                <div className="text-sm font-semibold text-[#111A14]">Select a job to see details</div>
                <div className="text-xs text-[#6B7E72] mt-1">Click any job on the left to view and manage it</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
