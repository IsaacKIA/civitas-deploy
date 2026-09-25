'use client';

import { useState } from 'react';
import SignaturePadModal from '@/components/SignaturePadModal';

interface SnagItem {
  id: string;
  unit: string;
  buyer: string;
  issue: string;
  category: string;
  assignedTo: string;
  status: string;
  statusStyle: string;
  reportedAt: string;
  signedRef?: string;
}

const INITIAL_SNAGS: SnagItem[] = [
  {
    id: 'snag-1',
    unit: 'Unit 4B - Osu Palm Residences',
    buyer: 'Dr. Kwame Bediako',
    issue: 'Master bathroom shower mixer pressure valve adjustment required',
    category: 'Plumbing',
    assignedTo: 'Civitas Plumbing Crew',
    status: 'In Progress',
    statusStyle: 'bg-[#EFF6FF] text-[#1E40AF]',
    reportedAt: '2 days ago',
  },
  {
    id: 'snag-2',
    unit: 'Unit 7A - Osu Palm Residences',
    buyer: 'Nana Yaa Serwaa',
    issue: 'Balcony sliding door rubber seal realignment',
    category: 'Joinery / Glazing',
    assignedTo: 'Lead Carpenter',
    status: 'Resolved',
    statusStyle: 'bg-[#D6EDE1] text-[#0F3D26]',
    reportedAt: '4 days ago',
  },
  {
    id: 'snag-3',
    unit: 'Lot 3 - Mankessim Green Estate',
    buyer: 'Mr. & Mrs. Mensah',
    issue: 'Kitchen countertop mastic sealant touch-up around sink bowl',
    category: 'Finishes',
    assignedTo: 'Finishing Team',
    status: 'Scheduled',
    statusStyle: 'bg-[#FEF3C7] text-[#D97706]',
    reportedAt: 'Yesterday',
  },
  {
    id: 'snag-4',
    unit: 'Lot 5 - Mankessim Green Estate',
    buyer: 'Alhaji Fuseini',
    issue: 'Distribution board breaker trip during solar inverter changeover',
    category: 'Electrical',
    assignedTo: 'Electrical Lead',
    status: 'Urgent Action',
    statusStyle: 'bg-[#FDECEA] text-[#D94F3D]',
    reportedAt: 'Today',
  },
];

export default function HandoverClient({ developerName }: { developerName: string }) {
  const [snags, setSnags] = useState<SnagItem[]>(INITIAL_SNAGS);
  const [signingItem, setSigningItem] = useState<{
    id: string;
    title: string;
    type: 'handover_cert' | 'snag_clearance';
  } | null>(null);

  const [toast, setToast] = useState<string | null>(null);

  const handleMarkCleared = (id: string) => {
    setSnags((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: 'Resolved',
              statusStyle: 'bg-[#D6EDE1] text-[#0F3D26]',
            }
          : s
      )
    );
    setToast('Snag item marked resolved. Ready for buyer sign-off.');
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenCertSign = (unit: string) => {
    setSigningItem({
      id: `CERT-${Date.now()}`,
      title: `Handover Certificate: ${unit}`,
      type: 'handover_cert',
    });
  };

  const handleSigned = (record: { signatureRef: string; signatoryName: string }) => {
    if (signingItem?.type === 'snag_clearance') {
      setSnags((prev) =>
        prev.map((s) =>
          s.id === signingItem.id
            ? {
                ...s,
                status: 'Signed & Closed ✓',
                statusStyle: 'bg-[#0F3D26] text-white',
                signedRef: record.signatureRef,
              }
            : s
        )
      );
    }
    setToast(`Document signed successfully! Audit Reference: ${record.signatureRef}`);
    setTimeout(() => setToast(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toast && (
        <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#1A5C3A] text-xs font-semibold flex items-center justify-between shadow-sm animate-fadeIn">
          <span>✓ {toast}</span>
          <button onClick={() => setToast(null)} className="text-sm font-bold opacity-60 hover:opacity-100">
            ×
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#111A14]">Snagging & Handover Punchlists</h1>
          <p className="text-xs text-[#6B7E72] mt-1">
            Clear all defects and digitally sign handover certificates to ensure smooth buyer key releases.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleOpenCertSign('Unit 4B - Osu Palm Residences')}
          className="px-5 py-2.5 rounded-full bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <span>✍️</span> Sign Handover Certificate
        </button>
      </div>

      {/* Digital Handover Pack summary */}
      <div className="bg-[#FAF5FF] border border-[#DDD6FE] rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📁</span>
          <div>
            <h3 className="text-sm font-bold text-[#4C1D95]">Civitas Digital Handover & Warranty Pack</h3>
            <p className="text-xs text-[#6D28D9] mt-0.5">
              Automatically compiles architectural drawings, warranties, solar schematics, and digital signatures.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenCertSign('Master Estate Handover')}
            className="px-4 py-2 rounded-xl bg-[#5B21B6] text-white text-xs font-semibold hover:bg-[#4C1D95] transition-all"
          >
            Sign Master Pack ✍️
          </button>
          <a
            href="/api/reports/maintenance"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-white border border-[#DDD6FE] text-xs font-semibold text-[#5B21B6] hover:bg-[#F5F3FF] transition-all whitespace-nowrap"
          >
            Export Pack (PDF)
          </a>
        </div>
      </div>

      {/* Snagging list */}
      <div className="bg-white rounded-3xl border border-[#D8E4DC] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#D8E4DC] flex items-center justify-between bg-[#F5F9F6]">
          <span className="text-xs font-bold text-[#111A14]">Active Unit Snagging Punchlist</span>
          <span className="text-[11px] text-[#6B7E72]">{snags.length} items logged</span>
        </div>

        <div className="divide-y divide-[#D8E4DC]">
          {snags.map((snag) => (
            <div
              key={snag.id}
              className="p-6 hover:bg-[#F9FBFA] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[#111A14]">{snag.unit}</span>
                  <span className="text-[10px] text-[#6B7E72] bg-[#EEF4F0] px-2 py-0.5 rounded-full">
                    Buyer: {snag.buyer}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${snag.statusStyle}`}>
                    {snag.status}
                  </span>
                  {snag.signedRef && (
                    <span className="text-[9px] font-mono text-[#0F3D26] bg-[#D6EDE1] px-2 py-0.5 rounded-full">
                      Sealed: {snag.signedRef}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#111A14] font-medium">{snag.issue}</p>
                <div className="flex flex-wrap gap-4 text-[11px] text-[#6B7E72]">
                  <span>
                    🔧 <strong>Trade:</strong> {snag.category}
                  </span>
                  <span>
                    👤 <strong>Assigned:</strong> {snag.assignedTo}
                  </span>
                  <span>
                    ⏱️ <strong>Reported:</strong> {snag.reportedAt}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {snag.status !== 'Signed & Closed ✓' && (
                  <>
                    {snag.status !== 'Resolved' && (
                      <button
                        type="button"
                        onClick={() => handleMarkCleared(snag.id)}
                        className="px-3.5 py-1.5 rounded-xl border border-[#D8E4DC] text-xs font-semibold text-[#111A14] hover:bg-[#F5F9F6] transition-all"
                      >
                        Mark Resolved ✓
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setSigningItem({
                          id: snag.id,
                          title: `Snag Clearance Sign-off: ${snag.unit}`,
                          type: 'snag_clearance',
                        })
                      }
                      className="px-3.5 py-1.5 rounded-xl bg-[#0F3D26] text-white text-xs font-semibold hover:bg-[#1A5C3A] transition-all"
                    >
                      Sign Off ✍️
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signature Modal */}
      {signingItem && (
        <SignaturePadModal
          isOpen={true}
          onClose={() => setSigningItem(null)}
          documentId={signingItem.id}
          documentTitle={signingItem.title}
          documentType={signingItem.type}
          defaultSignatoryName={developerName}
          defaultRoleTitle="Lead Developer / Site Director"
          onSigned={handleSigned}
        />
      )}
    </div>
  );
}
