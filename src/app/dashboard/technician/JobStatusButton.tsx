'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  requestId: string;
  status: string;
}

const NEXT_ACTION: Record<string, { label: string; nextStatus: 'in_progress' | 'completed' } | null> = {
  assigned: { label: 'Start Job →', nextStatus: 'in_progress' },
  in_progress: { label: 'Mark Completed →', nextStatus: 'completed' },
  completed: null,
  cancelled: null,
};

export default function JobStatusButton({ requestId, status }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const action = NEXT_ACTION[status] ?? null;
  if (!action) return null;

  const handleClick = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/maintenance/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', status: action.nextStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Could not update status.');
        return;
      }
      router.refresh();
    } catch {
      setError('Network error — try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleClick}
        disabled={busy}
        className="px-4 py-2 rounded-xl bg-[#1A5C3A] hover:bg-[#2E7D52] disabled:opacity-60 text-white text-xs font-semibold transition-all"
      >
        {busy ? 'Updating…' : action.label}
      </button>
      {error && <span className="text-[10px] text-[#D94F3D]">{error}</span>}
    </div>
  );
}
