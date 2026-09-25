'use client';

import { useState } from 'react';
import Link from 'next/link';
import BulkImportModal from './BulkImportModal';

interface Development {
  id: string;
  name: string;
  type: string;
  location: string;
  totalUnits: number;
  completedUnits: number;
  handedOver: number;
  dlpActive: number;
  amenities: string[];
  completionDate: string;
}

export default function ProjectsClient({ initialDevelopments }: { initialDevelopments: Development[] }) {
  const [developments, setDevelopments] = useState(initialDevelopments);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleImportComplete = (count: number) => {
    setToast(`Successfully imported and provisioned ${count} new units!`);
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#1A5C3A] text-xs font-semibold flex items-center justify-between shadow-sm animate-fadeIn">
          <span>✓ {toast}</span>
          <button onClick={() => setToast(null)} className="text-sm font-bold opacity-60 hover:opacity-100">
            ×
          </button>
        </div>
      )}

      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#111A14]">Development Sites & Projects</h1>
          <p className="text-xs text-[#6B7E72] mt-1">
            Multi-unit residential schemes, gated communities, and commercial developments
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsBulkOpen(true)}
            className="px-4 py-2.5 rounded-full border border-[#DDD6FE] bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#5B21B6] text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>📥</span> Bulk Import Units (CSV)
          </button>
          <Link
            href="/dashboard/owner/properties/new"
            className="px-5 py-2.5 rounded-full bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            + Register New Development
          </Link>
        </div>
      </div>

      {/* Developments list */}
      <div className="grid grid-cols-1 gap-6">
        {developments.map((dev) => (
          <div
            key={dev.id}
            className="bg-white rounded-3xl border border-[#D8E4DC] p-6 sm:p-8 shadow-sm space-y-6 hover:border-[#5B21B6]/30 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-serif font-bold text-[#111A14]">{dev.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF5FF] text-[#5B21B6]">
                    {dev.type}
                  </span>
                </div>
                <p className="text-xs text-[#6B7E72] mt-1">
                  📍 {dev.location} · Expected Target: <strong>{dev.completionDate}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#D8E4DC] text-xs font-semibold text-[#5B21B6] hover:bg-[#FAF5FF] transition-all"
                >
                  + Add Units via CSV
                </button>
                <Link
                  href="/dashboard/developer/handover"
                  className="px-3.5 py-1.5 rounded-xl bg-[#0F3D26] text-white text-xs font-semibold hover:bg-[#1A5C3A] transition-all"
                >
                  Handover Dashboard →
                </Link>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F8FAF9] border border-[#E2ECE5]">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#6B7E72] block">Total Units</span>
                <span className="text-xl font-bold font-serif text-[#111A14]">{dev.totalUnits} Units</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#6B7E72] block">Completed</span>
                <span className="text-xl font-bold font-serif text-[#047857]">{dev.completedUnits}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#6B7E72] block">Keys Handed Over</span>
                <span className="text-xl font-bold font-serif text-[#5B21B6]">{dev.handedOver}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#6B7E72] block">DLP Warranty Active</span>
                <span className="text-xl font-bold font-serif text-[#D97706]">{dev.dlpActive} Units</span>
              </div>
            </div>

            {/* Amenities tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#EDF3EF]">
              <span className="text-[11px] text-[#6B7E72] font-semibold">Standard Spec:</span>
              {dev.amenities.map((amenity, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-[#F5F9F6] border border-[#D8E4DC] text-[10px] font-medium text-[#3D5044]"
                >
                  ✓ {amenity}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Import Modal */}
      <BulkImportModal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        defaultProjectName="Osu Palm Residences (Phase 2)"
        onImportComplete={handleImportComplete}
      />
    </div>
  );
}
