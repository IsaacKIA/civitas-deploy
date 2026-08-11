'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  requestId: string;
  status: string;
  assignedTechnicianName: string | null;
}

export default function AssignTechnicianControl({ requestId, status, assignedTechnicianName }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      const lookupRes = await fetch(`/api/profiles/lookup?email=${encodeURIComponent(email.trim())}&role=technician`);
      const lookupData = await lookupRes.json();

      if (!lookupRes.ok || !lookupData.found) {
        setError('No technician account found with that email.');
        return;
      }

      const assignRes = await fetch(`/api/maintenance/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'assign', technicianId: lookupData.profileId }),
      });

      if (!assignRes.ok) {
        const data = await assignRes.json();
        setError(data.error ?? 'Could not assign technician.');
        return;
      }

      setOpen(false);
      setEmail('');
      router.refresh();
    } catch {
      setError('Network error — try again.');
    } finally {
      setBusy(false);
    }
  };

  if (status === 'completed' || status === 'cancelled') {
    return null;
  }

  if (assignedTechnicianName) {
    return <span className="text-[10px] text-[#6B7E72]">Assigned to <strong className="text-[#111A14]">{assignedTechnicianName}</strong></span>;
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-[10px] font-semibold text-[#1A5C3A] hover:underline"
      >
        Assign Technician →
      </button>
    );
  }

  return (
    <form onSubmit={handleAssign} className="flex items-center gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="technician@example.com"
        className="px-2.5 py-1.5 text-[10px] rounded-lg border border-[#D8E4DC] outline-none focus:border-[#1A5C3A] w-40"
      />
      <button type="submit" disabled={busy} className="px-3 py-1.5 rounded-lg bg-[#1A5C3A] text-white text-[10px] font-semibold disabled:opacity-60">
        {busy ? '…' : 'Assign'}
      </button>
      <button type="button" onClick={() => { setOpen(false); setError(''); }} className="text-[10px] text-[#6B7E72]">Cancel</button>
      {error && <span className="text-[10px] text-[#D94F3D]">{error}</span>}
    </form>
  );
}
