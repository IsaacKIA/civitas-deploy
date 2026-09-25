'use client';

import { useState, useRef } from 'react';
import { parseUnitsCsv, generateSampleCsvTemplate, type ParsedUnitRow } from '@/lib/csv-importer';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectName?: string;
  onImportComplete?: (count: number) => void;
}

export default function BulkImportModal({
  isOpen,
  onClose,
  defaultProjectName = 'Osu Palm Residences (Phase 2)',
  onImportComplete,
}: BulkImportModalProps) {
  const [projectName, setProjectName] = useState(defaultProjectName);
  const [parsedRows, setParsedRows] = useState<ParsedUnitRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{ count: number; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDownloadTemplate = () => {
    const csvContent = generateSampleCsvTemplate();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'civitas_units_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);
    setSuccessResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        const result = parseUnitsCsv(text);
        if (result.rows.length === 0) {
          setError('CSV file is empty or missing headers.');
          return;
        }
        setParsedRows(result.rows);
      } catch (err) {
        console.error('CSV parse error:', err);
        setError('Failed to parse CSV file. Please verify format.');
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = async () => {
    if (!projectName.trim()) {
      setError('Please provide a Project / Estate name.');
      return;
    }
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      setError('No valid unit rows to import.');
      return;
    }

    setImporting(true);
    setError(null);

    try {
      const res = await fetch('/api/developer/units/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: projectName.trim(),
          units: validRows,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Bulk import failed');

      setSuccessResult({
        count: json.importedCount,
        message: json.message,
      });

      if (onImportComplete) {
        onImportComplete(json.importedCount);
      }
    } catch (err: unknown) {
      console.error('Import execution error:', err);
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  if (!isOpen) return null;

  const validCount = parsedRows.filter((r) => r.isValid).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-[#D8E4DC] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-[#5B21B6] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <h2 className="text-base font-serif font-bold">Bulk Units & Estate Importer</h2>
            </div>
            <p className="text-xs text-purple-200 mt-0.5">
              Batch-provision 20 to 200+ residential and commercial units from a spreadsheet
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-xs">
              {error}
            </div>
          )}

          {successResult ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#1A5C3A] text-3xl flex items-center justify-center mx-auto">
                ✓
              </div>
              <h3 className="text-lg font-serif font-bold text-[#0F3D26]">Import Completed Successfully!</h3>
              <p className="text-xs text-[#6B7E72] max-w-md mx-auto">{successResult.message}</p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#0F3D26] text-white text-xs font-semibold hover:bg-[#1A5C3A] transition-all"
                >
                  Done & Return to Projects
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Target Project Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-[#3D5044] uppercase tracking-wider mb-1">
                    Development / Scheme Name *
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Ridge Heights Apartments (Phase 2)"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#D8E4DC] focus:outline-none focus:border-[#5B21B6]"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DDD6FE] bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#5B21B6] text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>📥</span> CSV Template
                  </button>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#DDD6FE] hover:border-[#5B21B6] rounded-2xl p-6 bg-[#FAF5FF]/50 text-center cursor-pointer transition-all"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="text-3xl block mb-2">📁</span>
                <span className="text-xs font-bold text-[#5B21B6] block">
                  {fileName ? fileName : 'Click to select or drag and drop your units CSV'}
                </span>
                <span className="text-[11px] text-[#6B7E72] mt-1 block">
                  Supports .csv with unit_number, block_phase, bedrooms, monthly_rent, buyer info
                </span>
              </div>

              {/* Parsed Rows Preview */}
              {parsedRows.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#111A14]">
                      Parsed Preview ({parsedRows.length} units total)
                    </span>
                    <span className="text-[11px] font-semibold text-[#1A5C3A]">
                      {validCount} ready for provisioning
                    </span>
                  </div>

                  <div className="border border-[#D8E4DC] rounded-2xl max-h-56 overflow-y-auto divide-y divide-[#EDF3EF] text-xs">
                    {parsedRows.slice(0, 50).map((r) => (
                      <div
                        key={r.rowIndex}
                        className={`p-3 flex items-center justify-between ${
                          r.isValid ? 'bg-white' : 'bg-[#FFF5F5]'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#111A14]">{r.unit_number}</span>
                            <span className="text-[10px] text-[#788A7F]">{r.block_phase || 'Standard Block'}</span>
                            <span className="text-[10px] uppercase font-semibold text-[#5B21B6] bg-[#F5F3FF] px-2 py-0.5 rounded-full">
                              {r.property_type}
                            </span>
                          </div>
                          {r.buyer_name && (
                            <p className="text-[11px] text-[#6B7E72]">
                              Buyer: {r.buyer_name} ({r.buyer_phone || r.buyer_email || 'No contact'})
                            </p>
                          )}
                          {!r.isValid && (
                            <p className="text-[11px] text-[#DC2626] font-medium">{r.errors.join(', ')}</p>
                          )}
                        </div>

                        <div>
                          {r.isValid ? (
                            <span className="text-[10px] font-semibold bg-[#E8F5E9] text-[#1A5C3A] px-2.5 py-1 rounded-full">
                              Valid ✓
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold bg-[#FEE2E2] text-[#DC2626] px-2.5 py-1 rounded-full">
                              Invalid
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {parsedRows.length > 50 && (
                    <p className="text-[10px] text-[#788A7F] text-center">
                      Showing first 50 of {parsedRows.length} units
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer controls */}
        {!successResult && (
          <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#EDF3EF] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={importing}
              className="px-5 py-2.5 rounded-xl border border-[#D8E4DC] text-xs font-semibold text-[#6B7E72] hover:bg-white transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExecuteImport}
              disabled={importing || validCount === 0}
              className="px-6 py-2.5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-semibold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {importing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Batch-Provisioning {validCount} Units...
                </>
              ) : (
                <>
                  <span>⚡</span>
                  Import & Provision {validCount} Units
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
