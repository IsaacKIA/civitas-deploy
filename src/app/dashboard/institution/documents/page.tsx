'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

type DocCategory =
  | 'fire_safety'
  | 'elevator_cert'
  | 'generator_cert'
  | 'environmental'
  | 'insurance'
  | 'sla_contract'
  | 'hvac_cert'
  | 'water_quality'
  | 'electrical_cert'
  | 'building_permit';

type DocStatus = 'valid' | 'expiring_soon' | 'expired' | 'pending_renewal';

interface ComplianceDoc {
  id: string;
  name: string;
  category: DocCategory;
  issuer: string;
  issuedDate: string;
  expiryDate: string;
  daysUntilExpiry: number;
  status: DocStatus;
  ref: string;
  fileSize?: string;
}

const CATEGORY_LABELS: Record<DocCategory, { label: string; icon: string }> = {
  fire_safety:       { label: 'Fire Safety Certificate',     icon: '🔥' },
  elevator_cert:     { label: 'Elevator / Lift Inspection',  icon: '🛗' },
  generator_cert:    { label: 'Generator Certification',     icon: '⚡' },
  environmental:     { label: 'Environmental Permit',        icon: '🌿' },
  insurance:         { label: 'Building Insurance Policy',   icon: '🛡️' },
  sla_contract:      { label: 'Civitas SLA Contract',        icon: '📑' },
  hvac_cert:         { label: 'HVAC Maintenance Record',     icon: '❄️' },
  water_quality:     { label: 'Water Quality Analysis',      icon: '💧' },
  electrical_cert:   { label: 'Electrical Safety Certificate',icon: '🔌' },
  building_permit:   { label: 'Building & Occupancy Permit', icon: '🏛️' },
};

const STATUS_CONFIG: Record<DocStatus, { label: string; color: string; bg: string; dot: string }> = {
  valid:           { label: 'Valid',           color: 'text-[#064E3B]', bg: 'bg-[#D6EDE1]', dot: 'bg-[#10B981]' },
  expiring_soon:   { label: 'Expiring Soon',   color: 'text-[#92400E]', bg: 'bg-[#FEF3C7]', dot: 'bg-[#F59E0B]' },
  expired:         { label: 'EXPIRED',         color: 'text-[#991B1B]', bg: 'bg-[#FEE2E2]', dot: 'bg-[#EF4444]' },
  pending_renewal: { label: 'Pending Renewal', color: 'text-[#1E40AF]', bg: 'bg-[#DBEAFE]', dot: 'bg-[#3B82F6]' },
};

const DOCS: ComplianceDoc[] = [
  {
    id: 'doc-1',
    name: 'Ghana National Fire Authority — Campus Fire Safety Certificate',
    category: 'fire_safety',
    issuer: 'Ghana National Fire Authority (GNFA)',
    issuedDate: 'Oct 14, 2025',
    expiryDate: 'Oct 13, 2026',
    daysUntilExpiry: 18,
    status: 'expiring_soon',
    ref: 'GNFA-2025-GHC-4492',
    fileSize: '1.4 MB',
  },
  {
    id: 'doc-2',
    name: 'Factories Department — Lift Inspection Certificate (LIFT-A)',
    category: 'elevator_cert',
    issuer: 'Ghana Factories Inspectorate Department',
    issuedDate: 'Sept 02, 2026',
    expiryDate: 'Sept 01, 2027',
    daysUntilExpiry: 340,
    status: 'valid',
    ref: 'FID-LIFT-2026-0712',
    fileSize: '890 KB',
  },
  {
    id: 'doc-3',
    name: 'Energy Commission — Generator Operating Permit (GEN-01 & GEN-02)',
    category: 'generator_cert',
    issuer: 'Energy Commission of Ghana',
    issuedDate: 'Jan 06, 2026',
    expiryDate: 'Jan 05, 2027',
    daysUntilExpiry: 102,
    status: 'valid',
    ref: 'ECG-2026-GEN-1104',
    fileSize: '2.1 MB',
  },
  {
    id: 'doc-4',
    name: 'EPA — Environmental Permit & Compliance Certificate',
    category: 'environmental',
    issuer: 'Environmental Protection Agency Ghana',
    issuedDate: 'Mar 10, 2024',
    expiryDate: 'Mar 09, 2025',
    daysUntilExpiry: -200,
    status: 'expired',
    ref: 'EPA-2024-CP-3310',
    fileSize: '3.2 MB',
  },
  {
    id: 'doc-5',
    name: 'Vanguard Assurance — Comprehensive Property & Liability Policy',
    category: 'insurance',
    issuer: 'Vanguard Assurance Company Ltd',
    issuedDate: 'Feb 01, 2026',
    expiryDate: 'Jan 31, 2027',
    daysUntilExpiry: 128,
    status: 'valid',
    ref: 'VAC-POL-2026-88123',
    fileSize: '5.6 MB',
  },
  {
    id: 'doc-6',
    name: 'Civitas FM — Institutional SLA Agreement (2026–2027)',
    category: 'sla_contract',
    issuer: 'Civitas Property Services Ltd',
    issuedDate: 'Jan 01, 2026',
    expiryDate: 'Dec 31, 2026',
    daysUntilExpiry: 97,
    status: 'valid',
    ref: 'CPS-SLA-2026-INST-001',
    fileSize: '1.8 MB',
  },
  {
    id: 'doc-7',
    name: 'Ghana Water Company — Borehole Operational Permit',
    category: 'water_quality',
    issuer: 'Ghana Water Company Ltd (GWCL)',
    issuedDate: 'Jun 14, 2026',
    expiryDate: 'Jun 13, 2027',
    daysUntilExpiry: 261,
    status: 'valid',
    ref: 'GWCL-BP-2026-0439',
    fileSize: '780 KB',
  },
  {
    id: 'doc-8',
    name: 'ECG — Electrical Safety Compliance & Meter Certification',
    category: 'electrical_cert',
    issuer: 'Electricity Company of Ghana (ECG)',
    issuedDate: 'Apr 18, 2025',
    expiryDate: 'Apr 17, 2026',
    daysUntilExpiry: -161,
    status: 'pending_renewal',
    ref: 'ECG-COMP-2025-7741',
    fileSize: '1.1 MB',
  },
];

export default function InstitutionDocumentsPage() {
  const [filter, setFilter] = useState<DocStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const expired = DOCS.filter(d => d.status === 'expired').length;
  const expiring = DOCS.filter(d => d.status === 'expiring_soon').length;
  const pending = DOCS.filter(d => d.status === 'pending_renewal').length;
  const valid = DOCS.filter(d => d.status === 'valid').length;

  const filtered = DOCS.filter(d => {
    const matchesFilter = filter === 'all' || d.status === filter;
    const matchesSearch =
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.issuer.toLowerCase().includes(search.toLowerCase()) ||
      d.ref.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout role="institution" userName="Facilities Director">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#111A14]">Compliance Vault</h1>
            <p className="text-xs text-[#6B7E72] mt-1">
              Regulatory certificates, SLA contracts, and statutory inspection records
            </p>
          </div>
          <button className="px-5 py-2.5 rounded-full bg-[#064E3B] hover:bg-[#0F3D26] text-white text-xs font-semibold transition-all shadow-sm">
            + Upload Document
          </button>
        </div>

        {/* Compliance Alert Banner (if expired / expiring) */}
        {(expired > 0 || expiring > 0) && (
          <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-2xl">⚠️</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#92400E]">
                Compliance Action Required
              </p>
              <p className="text-xs text-[#B45309] mt-0.5">
                {expired > 0 && `${expired} certificate${expired > 1 ? 's' : ''} expired. `}
                {expiring > 0 && `${expiring} certificate${expiring > 1 ? 's' : ''} expiring within 30 days. `}
                Upload renewals or contact your safety officer immediately.
              </p>
            </div>
            <button
              onClick={() => setFilter('expired')}
              className="px-4 py-2 rounded-full bg-[#92400E] text-white text-xs font-semibold hover:bg-[#78350F] transition-all shrink-0"
            >
              View Expired →
            </button>
          </div>
        )}

        {/* Status Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Valid', value: valid, status: 'valid' as DocStatus, icon: '✅', bg: '#D6EDE1' },
            { label: 'Expiring Soon', value: expiring, status: 'expiring_soon' as DocStatus, icon: '⏳', bg: '#FEF3C7' },
            { label: 'Expired', value: expired, status: 'expired' as DocStatus, icon: '❌', bg: '#FEE2E2' },
            { label: 'Pending Renewal', value: pending, status: 'pending_renewal' as DocStatus, icon: '📋', bg: '#DBEAFE' },
          ].map((s, i) => (
            <button
              key={i}
              onClick={() => setFilter(filter === s.status ? 'all' : s.status)}
              className={`bg-white rounded-2xl border p-5 shadow-sm text-left transition-all hover:shadow-md ${
                filter === s.status ? 'border-[#064E3B] ring-2 ring-[#064E3B]/20' : 'border-[#D8E4DC]'
              }`}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3" style={{ background: s.bg }}>
                {s.icon}
              </div>
              <div className="text-2xl font-bold font-serif text-[#111A14]">{s.value}</div>
              <div className="text-[10px] font-semibold text-[#6B7E72] uppercase tracking-wider mt-0.5">{s.label}</div>
            </button>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name, issuer, or reference number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#D8E4DC] text-sm text-[#111A14] focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white"
          />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as DocStatus | 'all')}
            className="px-4 py-2.5 rounded-xl border border-[#D8E4DC] text-sm text-[#111A14] focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white min-w-[160px]"
          >
            <option value="all">All Documents</option>
            <option value="valid">Valid</option>
            <option value="expiring_soon">Expiring Soon</option>
            <option value="expired">Expired</option>
            <option value="pending_renewal">Pending Renewal</option>
          </select>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-2xl border border-[#D8E4DC] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D8E4DC] bg-[#F5F9F6] flex items-center justify-between">
            <span className="text-xs font-bold text-[#111A14]">
              {filtered.length} of {DOCS.length} certificates
            </span>
            <span className="text-[10px] text-[#6B7E72]">Click any row to download</span>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#A8B8AE]">No documents match your filter.</div>
          ) : (
            <div className="divide-y divide-[#D8E4DC]">
              {filtered.map(doc => {
                const catMeta = CATEGORY_LABELS[doc.category];
                const sts = STATUS_CONFIG[doc.status];
                const isUrgent = doc.status === 'expired' || doc.status === 'expiring_soon';
                return (
                  <div
                    key={doc.id}
                    className={`p-6 hover:bg-[#F9FBFA] transition-colors cursor-pointer flex flex-col md:flex-row md:items-center gap-4 ${
                      isUrgent ? 'border-l-4 border-l-[#F59E0B]' : ''
                    }`}
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-[#F5F9F6] flex items-center justify-center text-xl shrink-0">
                      {catMeta.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-[#111A14]">{doc.name}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${sts.bg} ${sts.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sts.dot}`} />
                          {sts.label}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7E72]">{catMeta.label} · Issued by {doc.issuer}</p>
                      <p className="text-[11px] font-mono text-[#A8B8AE]">
                        Ref: {doc.ref}
                        {doc.fileSize && <span className="ml-3">📄 {doc.fileSize}</span>}
                      </p>
                    </div>

                    {/* Dates & Actions */}
                    <div className="flex items-center gap-6 shrink-0 text-xs">
                      <div className="text-right">
                        <span className="text-[10px] text-[#6B7E72] uppercase font-semibold block">Issued</span>
                        <span className="text-[#3D5044]">{doc.issuedDate}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#6B7E72] uppercase font-semibold block">Expires</span>
                        <span className={`font-semibold ${isUrgent ? 'text-[#D97706]' : 'text-[#064E3B]'}`}>
                          {doc.expiryDate}
                        </span>
                        {doc.daysUntilExpiry > 0 ? (
                          <span className="text-[10px] text-[#A8B8AE] block">In {doc.daysUntilExpiry} days</span>
                        ) : (
                          <span className="text-[10px] text-[#EF4444] font-semibold block">
                            {Math.abs(doc.daysUntilExpiry)} days overdue
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <button className="px-3 py-1.5 rounded-full bg-[#064E3B] text-white text-[10px] font-semibold hover:bg-[#0F3D26] transition-all">
                          Download
                        </button>
                        {isUrgent && (
                          <button className="px-3 py-1.5 rounded-full border border-[#F59E0B] text-[#92400E] text-[10px] font-semibold hover:bg-[#FEF3C7] transition-all">
                            Upload Renewal
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
