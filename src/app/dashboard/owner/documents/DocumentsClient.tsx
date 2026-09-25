'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const CATEGORIES: { id: string; label: string; icon: string }[] = [
  { id: 'title_deed', label: 'Title & Deeds', icon: '📜' },
  { id: 'lease', label: 'Lease Agreements', icon: '📝' },
  { id: 'contract', label: 'Contracts & SLAs', icon: '🤝' },
  { id: 'handover_cert', label: 'Handover & Snagging', icon: '📋' },
  { id: 'inspection_report', label: 'Inspection Reports', icon: '📸' },
  { id: 'fire_safety_cert', label: 'Fire Safety & EPA', icon: '🧯' },
  { id: 'warranty', label: 'Warranties & DLP', icon: '⚡' },
  { id: 'tax_receipt', label: 'GRA Tax & Invoicing', icon: '🧾' },
  { id: 'insurance', label: 'Insurance Policies', icon: '🛡️' },
  { id: 'certificate', label: 'Certificates', icon: '🎖️' },
  { id: 'verification', label: 'Verification & KYC', icon: '🔍' },
  { id: 'other', label: 'Other Documents', icon: '📁' },
];

export interface DocumentRow {
  id: string;
  title: string;
  category: string;
  storagePath: string;
  fileSizeBytes: number;
  mimeType: string;
  createdAt: string;
  propertyName: string | null;
}

export interface LeaseRow {
  id: string;
  status: string;
  createdAt: string;
  propertyName: string;
  tenantName: string | null;
}

export interface PropertyOption {
  id: string;
  name: string;
}

export interface DocumentsClientProps {
  userId: string;
  organizationId: string;
  properties: PropertyOption[];
  initialDocuments: DocumentRow[];
  leases: LeaseRow[];
  hasError: boolean;
  titleText?: string;
  subtitleText?: string;
  accentColor?: string;
  hideLeases?: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsClient({
  userId,
  organizationId,
  properties,
  initialDocuments,
  leases,
  hasError,
  titleText = 'Document Vault',
  subtitleText = 'Uploaded certificates, inspection reports, and auto-generated agreements',
  accentColor = '#1A5C3A',
  hideLeases = false,
}: DocumentsClientProps) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('title_deed');
  const [propertyId, setPropertyId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleFileChange = (f: File | null) => {
    setFile(f);
    if (f && !title) setTitle(f.name.replace(/\.[^/.]+$/, ''));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setUploadError('Choose a file to upload.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError('File is too large — 20 MB max.');
      return;
    }

    setUploading(true);
    setUploadError('');

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${userId}/${Date.now()}-${safeName}`;

    try {
      const { error: uploadErr } = await supabase.storage
        .from('property-documents')
        .upload(storagePath, file, { contentType: file.type || 'application/octet-stream' });

      if (uploadErr) {
        setUploadError(`Upload failed: ${uploadErr.message}`);
        return;
      }

      const { data: row, error: insertErr } = await supabase
        .from('property_documents')
        .insert({
          organization_id: organizationId,
          owner_id: userId,
          uploaded_by: userId,
          property_id: propertyId || null,
          title: title.trim() || file.name,
          category,
          storage_path: storagePath,
          file_size_bytes: file.size,
          mime_type: file.type || 'application/octet-stream',
        })
        .select('id, title, category, storage_path, file_size_bytes, mime_type, created_at, properties(name)')
        .single();

      if (insertErr || !row) {
        await supabase.storage.from('property-documents').remove([storagePath]);
        setUploadError(`Could not save document details: ${insertErr?.message ?? 'unknown error'}`);
        return;
      }

      const property = Array.isArray(row.properties) ? row.properties[0] : row.properties;
      const newDoc: DocumentRow = {
        id: row.id,
        title: row.title,
        category: row.category,
        storagePath: row.storage_path,
        fileSizeBytes: Number(row.file_size_bytes),
        mimeType: row.mime_type,
        createdAt: row.created_at,
        propertyName: property?.name ?? null,
      };

      setDocuments([newDoc, ...documents]);
      setShowUpload(false);
      setFile(null);
      setTitle('');
      setCategory('title_deed');
      setPropertyId('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc: DocumentRow) => {
    setDownloadingId(doc.id);
    try {
      const { data, error } = await supabase.storage
        .from('property-documents')
        .createSignedUrl(doc.storagePath, 60);

      if (error || !data) {
        alert(`Could not generate a download link: ${error?.message ?? 'unknown error'}`);
        return;
      }
      window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.propertyName && doc.propertyName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#111A14]">{titleText}</h1>
          <p className="text-xs text-[#6B7E72] mt-1">{subtitleText}</p>
        </div>
        <button
          onClick={() => setShowUpload((v) => !v)}
          className="px-5 py-2.5 rounded-full text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2 hover:opacity-95"
          style={{ backgroundColor: accentColor }}
        >
          {showUpload ? 'Cancel' : '+ Upload Document'}
        </button>
      </div>

      {hasError && (
        <div className="p-4 rounded-2xl bg-[#FDECEA] border border-[#FAD4D0] text-xs text-[#D94F3D]">
          Couldn&apos;t load some documents. Please refresh the page.
        </div>
      )}

      {showUpload && (
        <form onSubmit={handleUpload} className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm space-y-4 animate-in fade-in">
          <div>
            <label className="block text-xs font-semibold text-[#111A14] mb-1.5">File (max 20 MB, PDF, JPG, PNG, DOCX)</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              className="w-full text-xs"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Document Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Land Title Certificate / Handover Punchlist"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-[#D8E4DC] bg-white outline-none focus:border-[#1A5C3A]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {properties.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Related Property / Site (optional)</label>
              <select
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-[#D8E4DC] bg-white outline-none focus:border-[#1A5C3A]"
              >
                <option value="">General / Entire Portfolio</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {uploadError && <div className="text-xs text-[#D94F3D] font-medium">{uploadError}</div>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowUpload(false)}
              className="px-4 py-2 rounded-xl border border-[#D8E4DC] text-xs font-semibold text-[#6B7E72]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 rounded-xl text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
              style={{ backgroundColor: accentColor }}
            >
              {uploading ? 'Uploading…' : 'Save to Vault'}
            </button>
          </div>
        </form>
      )}

      {/* Auto-generated Leases (if enabled) */}
      {!hideLeases && leases.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm">
          <h2 className="text-sm font-bold text-[#111A14] mb-4">📜 Auto-Generated Tenancy Agreements</h2>
          <div className="divide-y divide-[#D8E4DC]">
            {leases.map((lease) => (
              <div key={lease.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📄</span>
                  <div>
                    <div className="font-bold text-[#111A14]">
                      {lease.propertyName} Lease{lease.tenantName ? ` — ${lease.tenantName}` : ''}
                    </div>
                    <div className="text-[#6B7E72] mt-0.5 capitalize">
                      {lease.status.replace('_', ' ')} · Created{' '}
                      {new Date(lease.createdAt).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <a
                  href={`/api/leases/${lease.id}/pdf`}
                  className="px-4 py-2 rounded-xl bg-[#F5F9F6] hover:bg-[#EEF7F2] text-[#1A5C3A] font-semibold transition-all"
                >
                  Download PDF
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-[#111A14]">📁 Document Archive & Compliance Records</h2>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or property..."
            className="w-full sm:w-64 px-3.5 py-1.5 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#111A14] text-white shadow-xs'
                : 'bg-[#F5F9F6] text-[#6B7E72] hover:bg-[#EEF4F0]'
            }`}
          >
            All ({documents.length})
          </button>
          {CATEGORIES.map((c) => {
            const count = documents.filter((d) => d.category === c.id).length;
            if (count === 0 && selectedCategory !== c.id) return null;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                  selectedCategory === c.id
                    ? 'text-white shadow-xs'
                    : 'bg-[#F5F9F6] text-[#6B7E72] hover:bg-[#EEF4F0]'
                }`}
                style={{ backgroundColor: selectedCategory === c.id ? accentColor : undefined }}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Documents List */}
        {filteredDocuments.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#6B7E72]">
            No documents found {selectedCategory !== 'all' ? `in category "${selectedCategory}"` : ''}.
          </div>
        ) : (
          <div className="divide-y divide-[#D8E4DC] pt-2">
            {filteredDocuments.map((doc) => {
              const catObj = CATEGORIES.find((c) => c.id === doc.category);
              const categoryLabel = catObj?.label ?? doc.category;
              const categoryIcon = catObj?.icon ?? '📄';

              return (
                <div key={doc.id} className="py-4 flex items-center justify-between text-xs hover:bg-[#F9FBFA] transition-colors rounded-xl px-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{categoryIcon}</span>
                    <div>
                      <div className="font-bold text-[#111A14]">{doc.title}</div>
                      <div className="text-[#6B7E72] mt-0.5">
                        {categoryLabel}{doc.propertyName ? ` · ${doc.propertyName}` : ''} · Added{' '}
                        {new Date(doc.createdAt).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(doc)}
                    disabled={downloadingId === doc.id}
                    className="px-4 py-2 rounded-xl bg-[#F5F9F6] hover:bg-[#EEF7F2] text-[#1A5C3A] font-semibold transition-all disabled:opacity-60 shrink-0"
                  >
                    {downloadingId === doc.id ? 'Generating link…' : `Download (${formatBytes(doc.fileSizeBytes)})`}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
