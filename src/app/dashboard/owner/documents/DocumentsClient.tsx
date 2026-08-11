'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'title_deed', label: 'Title & Deeds' },
  { id: 'contract', label: 'Contracts' },
  { id: 'verification', label: 'Verification' },
  { id: 'certificate', label: 'Certificates' },
  { id: 'other', label: 'Other' },
];

interface DocumentRow {
  id: string;
  title: string;
  category: string;
  storagePath: string;
  fileSizeBytes: number;
  mimeType: string;
  createdAt: string;
  propertyName: string | null;
}

interface LeaseRow {
  id: string;
  status: string;
  createdAt: string;
  propertyName: string;
  tenantName: string | null;
}

interface PropertyOption {
  id: string;
  name: string;
}

interface Props {
  userId: string;
  organizationId: string;
  properties: PropertyOption[];
  initialDocuments: DocumentRow[];
  leases: LeaseRow[];
  hasError: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsClient({ userId, organizationId, properties, initialDocuments, leases, hasError }: Props) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('other');
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
        // Clean up the orphaned storage object rather than leaving an
        // untracked file with no metadata row pointing at it.
        await supabase.storage.from('property-documents').remove([storagePath]);
        setUploadError(`Could not save document details: ${insertErr?.message ?? 'unknown error'}`);
        return;
      }

      const property = Array.isArray(row.properties) ? row.properties[0] : row.properties;
      setDocuments((docs) => [
        {
          id: row.id,
          title: row.title,
          category: row.category,
          storagePath: row.storage_path,
          fileSizeBytes: row.file_size_bytes,
          mimeType: row.mime_type,
          createdAt: row.created_at,
          propertyName: property?.name ?? null,
        },
        ...docs,
      ]);
      setShowUpload(false);
      setFile(null);
      setTitle('');
      setCategory('other');
      setPropertyId('');
    } catch {
      setUploadError('Network error — check your connection and try again.');
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Document Vault</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Uploaded documents and auto-generated lease agreements</p>
        </div>
        <button
          onClick={() => setShowUpload((v) => !v)}
          className="px-5 py-2.5 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          {showUpload ? 'Cancel' : '+ Upload Document'}
        </button>
      </div>

      {showUpload && (
        <form onSubmit={handleUpload} className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm mb-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#111A14] mb-1.5">File (max 20 MB)</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              className="w-full text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Land Title Indenture"
                className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] bg-white outline-none focus:border-[#1A5C3A]"
              >
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>
          {properties.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Related Property (optional)</label>
              <select
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] bg-white outline-none focus:border-[#1A5C3A]"
              >
                <option value="">General / not property-specific</option>
                {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}
          {uploadError && (
            <div className="p-3 rounded-xl bg-[#FDECEA] border border-[#FAD4D0] text-xs font-semibold text-[#D94F3D]">⚠ {uploadError}</div>
          )}
          <button
            type="submit"
            disabled={uploading}
            className="w-full py-3 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] disabled:opacity-60 text-white text-xs font-semibold uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
          >
            {uploading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {uploading ? 'Uploading…' : 'Upload →'}
          </button>
        </form>
      )}

      {hasError && (
        <div className="p-4 rounded-2xl bg-[#FDECEA] border border-[#FAD4D0] text-xs text-[#D94F3D] mb-6">
          Couldn&apos;t load some of your documents right now. Please refresh.
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm mb-6">
        <h2 className="text-sm font-bold text-[#111A14] mb-4">📜 Auto-Generated Lease Agreements</h2>
        {leases.length === 0 ? (
          <p className="text-xs text-[#6B7E72] text-center py-6">No leases yet. Once you create one, its PDF summary appears here.</p>
        ) : (
          <div className="divide-y divide-[#D8E4DC]">
            {leases.map((lease) => (
              <div key={lease.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📄</span>
                  <div>
                    <div className="font-bold text-[#111A14]">{lease.propertyName} Lease{lease.tenantName ? ` — ${lease.tenantName}` : ''}</div>
                    <div className="text-[#6B7E72] mt-0.5 capitalize">{lease.status.replace('_', ' ')} · Created {new Date(lease.createdAt).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
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
        )}
      </div>

      <div className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm">
        <h2 className="text-sm font-bold text-[#111A14] mb-4">📁 Uploaded Documents</h2>
        {documents.length === 0 ? (
          <p className="text-xs text-[#6B7E72] text-center py-6">No documents uploaded yet.</p>
        ) : (
          <div className="divide-y divide-[#D8E4DC]">
            {documents.map((doc) => {
              const categoryLabel = CATEGORIES.find((c) => c.id === doc.category)?.label ?? doc.category;
              return (
                <div key={doc.id} className="py-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
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
                    className="px-4 py-2 rounded-xl bg-[#F5F9F6] hover:bg-[#EEF7F2] text-[#1A5C3A] font-semibold transition-all disabled:opacity-60"
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
