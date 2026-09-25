'use client';

import { useState } from 'react';
import SignaturePadModal from '@/components/SignaturePadModal';

interface SlaMetric {
  tier: string;
  description: string;
  target: string;
  actual: string;
  compliance: string;
  complianceColor: string;
  incidentsYear: number;
}

interface SlaClientProps {
  directorName: string;
  slaMetrics: SlaMetric[];
}

export default function SlaClient({ directorName, slaMetrics }: SlaClientProps) {
  const [isSigning, setIsSigning] = useState(false);
  const [signedRecord, setSignedRecord] = useState<{ signatureRef: string; signedAt: string; signatoryName: string } | null>(null);

  return (
    <div className="space-y-6">
      {/* Toast banner when signed */}
      {signedRecord && (
        <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#1A5C3A] text-xs font-semibold flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <span>🛡️</span>
            <span>
              Institutional SLA Agreement digitally sealed by <strong>{signedRecord.signatoryName}</strong> (Ref:{' '}
              <span className="font-mono">{signedRecord.signatureRef}</span>).
            </span>
          </div>
          <span className="text-[10px] text-[#2E7D32]">Active Contract · 100% Enforced</span>
        </div>
      )}

      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#111A14]">Service Level Agreement (SLA) & Uptime</h1>
          <p className="text-xs text-[#6B7E72] mt-1">
            Live tracking of Civitas response times and contractual maintenance performance
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsSigning(true)}
            className="px-4 py-2 rounded-full bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            <span>✍️</span> {signedRecord ? 'Update Signature' : 'Sign SLA Agreement'}
          </button>
          <a
            href="/api/reports/maintenance"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full border border-[#D8E4DC] text-xs font-semibold text-[#047857] hover:bg-[#F5F9F6] transition-all"
          >
            📥 Maintenance Report
          </a>
          <a
            href="/api/reports/financials"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full border border-[#D8E4DC] text-xs font-semibold text-[#047857] hover:bg-[#F5F9F6] transition-all"
          >
            📑 Download Contract SLA (PDF)
          </a>
        </div>
      </div>

      {/* Uptime KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-[#D8E4DC] p-6 shadow-sm">
          <span className="text-[10px] uppercase font-semibold text-[#6B7E72] block">Overall Campus Uptime</span>
          <div className="text-3xl font-serif font-bold text-[#047857] mt-1">99.82%</div>
          <span className="text-[11px] text-[#A8B8AE]">Year-to-date availability</span>
        </div>

        <div className="bg-white rounded-3xl border border-[#D8E4DC] p-6 shadow-sm">
          <span className="text-[10px] uppercase font-semibold text-[#6B7E72] block">Average Emergency Response</span>
          <div className="text-3xl font-serif font-bold text-[#10B981] mt-1">42 mins</div>
          <span className="text-[11px] text-[#A8B8AE]">Contract limit: 120 mins</span>
        </div>

        <div className="bg-white rounded-3xl border border-[#D8E4DC] p-6 shadow-sm">
          <span className="text-[10px] uppercase font-semibold text-[#6B7E72] block">Contractual SLA Compliance</span>
          <div className="text-3xl font-serif font-bold text-[#064E3B] mt-1">99.1%</div>
          <span className="text-[11px] text-[#047857]">Exceeding institutional standards</span>
        </div>
      </div>

      {/* SLA Tiers Table */}
      <div className="bg-white rounded-3xl border border-[#D8E4DC] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#D8E4DC] flex items-center justify-between bg-[#F5F9F6]">
          <span className="text-xs font-bold text-[#111A14]">Contractual Incident Response Tiers</span>
          <span className="text-[11px] text-[#6B7E72]">32 total dispatches resolved this year</span>
        </div>

        <div className="divide-y divide-[#D8E4DC]">
          {slaMetrics.map((sla, idx) => (
            <div
              key={idx}
              className="p-6 hover:bg-[#F9FBFA] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-bold text-[#111A14]">{sla.tier}</h3>
                <p className="text-xs text-[#6B7E72]">{sla.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-[#3D5044] pt-2">
                  <span>
                    Target: <strong>{sla.target}</strong>
                  </span>
                  <span>
                    Actual Avg: <strong className="text-[#047857]">{sla.actual}</strong>
                  </span>
                  <span>
                    Dispatches: <strong>{sla.incidentsYear}</strong>
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-[#6B7E72] uppercase font-semibold block">SLA Met Rate</span>
                <div className={`text-xl font-bold font-serif ${sla.complianceColor}`}>{sla.compliance}</div>
                <span className="text-[10px] text-[#047857] bg-[#ECFDF5] px-2 py-0.5 rounded-full font-semibold">
                  Zero Penalty
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signature Modal */}
      {isSigning && (
        <SignaturePadModal
          isOpen={true}
          onClose={() => setIsSigning(false)}
          documentTitle="Institutional Facilities Management SLA Contract (Tier 1)"
          documentType="sla_contract"
          documentId="SLA-INST-2026"
          defaultSignatoryName={directorName}
          defaultRoleTitle="Facilities & Operations Director"
          onSigned={(record) => {
            setSignedRecord(record);
          }}
        />
      )}
    </div>
  );
}
