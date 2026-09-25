'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

type TeamRole = 'facilities_manager' | 'procurement_officer' | 'safety_officer' | 'technician_lead' | 'viewer';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: TeamRole;
  department: string;
  status: 'active' | 'pending' | 'suspended';
  joinedAt: string;
  lastActive: string;
  permissions: string[];
}

const ROLE_META: Record<TeamRole, { label: string; color: string; bg: string; perms: string[] }> = {
  facilities_manager: {
    label: 'Facilities Manager',
    color: 'text-[#064E3B]',
    bg: 'bg-[#D6EDE1]',
    perms: ['View all assets', 'Create work orders', 'Approve maintenance', 'Manage schedules', 'View reports'],
  },
  procurement_officer: {
    label: 'Procurement Officer',
    color: 'text-[#1E40AF]',
    bg: 'bg-[#DBEAFE]',
    perms: ['View purchase orders', 'Approve vendor quotes', 'Manage suppliers', 'View budget reports'],
  },
  safety_officer: {
    label: 'Safety & Compliance Officer',
    color: 'text-[#92400E]',
    bg: 'bg-[#FEF3C7]',
    perms: ['View compliance vault', 'Upload safety certs', 'Manage inspections', 'View SLA reports'],
  },
  technician_lead: {
    label: 'Lead Technician',
    color: 'text-[#5B21B6]',
    bg: 'bg-[#EDE9FE]',
    perms: ['View assigned work orders', 'Update job status', 'Log maintenance', 'Access asset register'],
  },
  viewer: {
    label: 'Viewer (Read-only)',
    color: 'text-[#374151]',
    bg: 'bg-[#F3F4F6]',
    perms: ['View all dashboards', 'Download reports'],
  },
};

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Abena Mensah',
    email: 'abena.mensah@institution.edu.gh',
    phone: '+233 24 812 3345',
    role: 'facilities_manager',
    department: 'Facilities & Infrastructure',
    status: 'active',
    joinedAt: 'Jan 2025',
    lastActive: '2 hours ago',
    permissions: ROLE_META.facilities_manager.perms,
  },
  {
    id: 'tm-2',
    name: 'Kwame Boateng',
    email: 'k.boateng@institution.edu.gh',
    phone: '+233 50 112 8876',
    role: 'procurement_officer',
    department: 'Finance & Procurement',
    status: 'active',
    joinedAt: 'Mar 2025',
    lastActive: 'Yesterday',
    permissions: ROLE_META.procurement_officer.perms,
  },
  {
    id: 'tm-3',
    name: 'Efua Asante',
    email: 'e.asante@institution.edu.gh',
    phone: '+233 27 445 0011',
    role: 'safety_officer',
    department: 'Health, Safety & Environment',
    status: 'active',
    joinedAt: 'Jun 2025',
    lastActive: '3 days ago',
    permissions: ROLE_META.safety_officer.perms,
  },
  {
    id: 'tm-4',
    name: 'Emmanuel Tetteh',
    email: 'e.tetteh@civitas.gh',
    phone: '+233 55 506 2589',
    role: 'technician_lead',
    department: 'Civitas (External Partner)',
    status: 'active',
    joinedAt: 'Jan 2025',
    lastActive: 'Today',
    permissions: ROLE_META.technician_lead.perms,
  },
  {
    id: 'tm-5',
    name: 'Diana Owusu',
    email: 'd.owusu@institution.edu.gh',
    phone: '+233 24 789 0023',
    role: 'viewer',
    department: 'Office of the Registrar',
    status: 'pending',
    joinedAt: 'Sept 2026',
    lastActive: 'Never',
    permissions: ROLE_META.viewer.perms,
  },
];

const STATUS_STYLES = {
  active:    { dot: 'bg-[#10B981]', badge: 'bg-[#D6EDE1] text-[#064E3B]', label: 'Active' },
  pending:   { dot: 'bg-[#F59E0B]', badge: 'bg-[#FEF3C7] text-[#92400E]', label: 'Invite Pending' },
  suspended: { dot: 'bg-[#EF4444]', badge: 'bg-[#FEE2E2] text-[#991B1B]', label: 'Suspended' },
};

export default function InstitutionTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'viewer' as TeamRole,
    department: '',
  });

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: inviteForm.name,
      email: inviteForm.email,
      phone: inviteForm.phone,
      role: inviteForm.role,
      department: inviteForm.department,
      status: 'pending',
      joinedAt: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
      lastActive: 'Never',
      permissions: ROLE_META[inviteForm.role].perms,
    };
    setMembers(prev => [...prev, newMember]);
    setShowInviteForm(false);
    setInviteForm({ name: '', email: '', phone: '', role: 'viewer', department: '' });
  }

  return (
    <DashboardLayout role="institution" userName="Facilities Director">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#111A14]">Facilities Team Management</h1>
            <p className="text-xs text-[#6B7E72] mt-1">
              Add staff and external partners with role-based access to your campus portal
            </p>
          </div>
          <button
            onClick={() => setShowInviteForm(true)}
            className="px-5 py-2.5 rounded-full bg-[#064E3B] hover:bg-[#0F3D26] text-white text-xs font-semibold transition-all shadow-sm"
          >
            + Invite Team Member
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Members', value: members.length, icon: '👥', bg: '#EEF7F2' },
            { label: 'Active', value: members.filter(m => m.status === 'active').length, icon: '✅', bg: '#D6EDE1' },
            { label: 'Pending Invites', value: members.filter(m => m.status === 'pending').length, icon: '📨', bg: '#FEF3C7' },
            { label: 'External Partners', value: members.filter(m => m.department.includes('External')).length, icon: '🤝', bg: '#EDE9FE' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#D8E4DC] p-5 shadow-sm">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3" style={{ background: s.bg }}>
                {s.icon}
              </div>
              <div className="text-2xl font-bold font-serif text-[#111A14]">{s.value}</div>
              <div className="text-[10px] font-semibold text-[#6B7E72] uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Team List */}
        <div className="bg-white rounded-2xl border border-[#D8E4DC] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D8E4DC] bg-[#F5F9F6]">
            <span className="text-xs font-bold text-[#111A14]">Team Members & Access Roles</span>
          </div>

          <div className="divide-y divide-[#D8E4DC]">
            {members.map(member => {
              const roleMeta = ROLE_META[member.role];
              const statusStyle = STATUS_STYLES[member.status];
              return (
                <div
                  key={member.id}
                  className="p-6 hover:bg-[#F9FBFA] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                  onClick={() => setSelectedMember(prev => prev?.id === member.id ? null : member)}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#064E3B] to-[#10B981] flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-[#111A14]">{member.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${roleMeta.bg} ${roleMeta.color}`}>
                          {roleMeta.label}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusStyle.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          {statusStyle.label}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7E72]">{member.email} · {member.phone}</p>
                      <p className="text-[11px] text-[#A8B8AE]">{member.department} · Joined {member.joinedAt}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 md:text-right">
                    <div>
                      <span className="text-[10px] text-[#6B7E72] uppercase font-semibold block">Last Active</span>
                      <span className="text-xs text-[#3D5044] font-medium">{member.lastActive}</span>
                    </div>
                    <span className="text-[#A8B8AE] text-xs">{selectedMember?.id === member.id ? '▲' : '▼'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Permissions Detail Panel */}
        {selectedMember && (
          <div className="bg-white rounded-2xl border border-[#D8E4DC] shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#111A14]">
                Permissions — {selectedMember.name}
              </h2>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-[#A8B8AE] hover:text-[#6B7E72] text-xs"
              >
                Close ✕
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedMember.permissions.map((perm, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[11px] text-[#065F46] font-semibold">
                  ✓ {perm}
                </span>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button className="px-4 py-2 rounded-full text-xs font-semibold border border-[#D8E4DC] text-[#6B7E72] hover:bg-[#F5F9F6] transition-all">
                Change Role
              </button>
              {selectedMember.status === 'pending' && (
                <button className="px-4 py-2 rounded-full text-xs font-semibold bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#BFDBFE] transition-all">
                  Resend Invite
                </button>
              )}
              <button className="px-4 py-2 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FECACA] transition-all">
                {selectedMember.status === 'active' ? 'Suspend Access' : 'Remove Member'}
              </button>
            </div>
          </div>
        )}

        {/* Invite Modal */}
        {showInviteForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowInviteForm(false)}>
            <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-8 space-y-6" onClick={e => e.stopPropagation()}>
              <div>
                <h2 className="text-lg font-serif font-bold text-[#111A14]">Invite Team Member</h2>
                <p className="text-xs text-[#6B7E72] mt-1">They will receive an email to join your campus portal</p>
              </div>
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold text-[#6B7E72] uppercase tracking-wider">Full Name *</label>
                    <input
                      required
                      value={inviteForm.name}
                      onChange={e => setInviteForm(p => ({ ...p, name: e.target.value }))}
                      className="mt-1 w-full border border-[#D8E4DC] rounded-xl px-3 py-2 text-sm text-[#111A14] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                      placeholder="Ama Boateng"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-[#6B7E72] uppercase tracking-wider">Phone</label>
                    <input
                      value={inviteForm.phone}
                      onChange={e => setInviteForm(p => ({ ...p, phone: e.target.value }))}
                      className="mt-1 w-full border border-[#D8E4DC] rounded-xl px-3 py-2 text-sm text-[#111A14] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                      placeholder="+233 24 ..."
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[#6B7E72] uppercase tracking-wider">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={inviteForm.email}
                    onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))}
                    className="mt-1 w-full border border-[#D8E4DC] rounded-xl px-3 py-2 text-sm text-[#111A14] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                    placeholder="name@institution.edu.gh"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold text-[#6B7E72] uppercase tracking-wider">Department *</label>
                    <input
                      required
                      value={inviteForm.department}
                      onChange={e => setInviteForm(p => ({ ...p, department: e.target.value }))}
                      className="mt-1 w-full border border-[#D8E4DC] rounded-xl px-3 py-2 text-sm text-[#111A14] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                      placeholder="Facilities Office"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-[#6B7E72] uppercase tracking-wider">Access Role *</label>
                    <select
                      value={inviteForm.role}
                      onChange={e => setInviteForm(p => ({ ...p, role: e.target.value as TeamRole }))}
                      className="mt-1 w-full border border-[#D8E4DC] rounded-xl px-3 py-2 text-sm text-[#111A14] focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white"
                    >
                      {(Object.keys(ROLE_META) as TeamRole[]).map(r => (
                        <option key={r} value={r}>{ROLE_META[r].label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Permission Preview */}
                <div className="bg-[#F5F9F6] rounded-xl p-4">
                  <p className="text-[10px] font-semibold text-[#6B7E72] uppercase tracking-wider mb-2">Access Preview</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ROLE_META[inviteForm.role].perms.map((p, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-[#ECFDF5] text-[#065F46] rounded-full border border-[#A7F3D0]">
                        ✓ {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-2.5 rounded-full bg-[#064E3B] hover:bg-[#0F3D26] text-white text-xs font-semibold transition-all">
                    Send Invite
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInviteForm(false)}
                    className="flex-1 py-2.5 rounded-full border border-[#D8E4DC] text-xs font-semibold text-[#6B7E72] hover:bg-[#F5F9F6] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
