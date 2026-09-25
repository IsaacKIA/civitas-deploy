'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentType: 'handover_cert' | 'sla_contract' | 'lease' | 'snag_clearance';
  documentId?: string;
  defaultSignatoryName?: string;
  defaultRoleTitle?: string;
  onSigned?: (record: {
    signatureRef: string;
    signedAt: string;
    signatoryName: string;
    signatoryTitle: string;
    dataUrl: string;
  }) => void;
}

export default function SignaturePadModal({
  isOpen,
  onClose,
  documentTitle,
  documentType,
  documentId,
  defaultSignatoryName = '',
  defaultRoleTitle = '',
  onSigned,
}: SignaturePadModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [strokes, setStrokes] = useState<ImageData[]>([]);

  const [signatoryName, setSignatoryName] = useState(defaultSignatoryName);
  const [signatoryTitle, setSignatoryTitle] = useState(defaultRoleTitle);
  const [ghanaCardNumber, setGhanaCardNumber] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize canvas
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#0F3D26'; // Civitas Forest Green ink

    // Save blank state
    setStrokes([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(setupCanvas, 50);
    }
  }, [isOpen, setupCanvas]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save snapshot for undo
    setStrokes((prev) => [...prev, ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setStrokes([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  };

  const handleUndo = () => {
    if (strokes.length <= 1) {
      handleClear();
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newStrokes = strokes.slice(0, -1);
    const last = newStrokes[newStrokes.length - 1];
    ctx.putImageData(last, 0, 0);
    setStrokes(newStrokes);
    if (newStrokes.length <= 1) setHasDrawn(false);
  };

  const handleSubmit = async () => {
    if (!hasDrawn) {
      setError('Please draw your signature in the signing area below.');
      return;
    }
    if (!signatoryName.trim()) {
      setError('Full legal name is required.');
      return;
    }
    if (!agreed) {
      setError('You must confirm the legal agreement checkbox.');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    setSubmitting(true);
    setError(null);

    const signatureDataUrl = canvas.toDataURL('image/png');

    try {
      const res = await fetch('/api/signatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: documentId || `DOC-${Date.now()}`,
          documentTitle,
          documentType,
          signatureDataUrl,
          signatoryName: signatoryName.trim(),
          signatoryTitle: signatoryTitle.trim(),
          ghanaCardNumber: ghanaCardNumber.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to submit signature');

      if (onSigned) {
        onSigned({
          signatureRef: json.signatureRef,
          signedAt: json.signedAt,
          signatoryName: signatoryName.trim(),
          signatoryTitle: signatoryTitle.trim(),
          dataUrl: signatureDataUrl,
        });
      }

      onClose();
    } catch (err: unknown) {
      console.error('Signature submit error:', err);
      setError(err instanceof Error ? err.message : 'Failed to register signature');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-[#D8E4DC] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-[#0F3D26] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">✍️</span>
              <h2 className="text-base font-serif font-bold">Civitas Digital Signature</h2>
            </div>
            <p className="text-xs text-[#E87722] mt-0.5 truncate max-w-md">{documentTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-xs">
              {error}
            </div>
          )}

          {/* Signer credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#3D5044] uppercase tracking-wider mb-1">
                Legal Signatory Name *
              </label>
              <input
                type="text"
                value={signatoryName}
                onChange={(e) => setSignatoryName(e.target.value)}
                placeholder="e.g. Kwame Mensah"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#D8E4DC] focus:outline-none focus:border-[#1A5C3A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#3D5044] uppercase tracking-wider mb-1">
                Designation / Capacity
              </label>
              <input
                type="text"
                value={signatoryTitle}
                onChange={(e) => setSignatoryTitle(e.target.value)}
                placeholder="e.g. Unit Owner / Facilities Lead"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#D8E4DC] focus:outline-none focus:border-[#1A5C3A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#3D5044] uppercase tracking-wider mb-1">
              Ghana Card / National ID (Optional)
            </label>
            <input
              type="text"
              value={ghanaCardNumber}
              onChange={(e) => setGhanaCardNumber(e.target.value)}
              placeholder="GHA-XXXXXXXXX-X"
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-[#D8E4DC] focus:outline-none focus:border-[#1A5C3A] font-mono"
            />
          </div>

          {/* Interactive Canvas Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-[#3D5044] uppercase tracking-wider">
                Sign in the box below *
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={!hasDrawn}
                  className="text-[11px] text-[#6B7E72] hover:text-[#0F3D26] disabled:opacity-30"
                >
                  ↩ Undo
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-[11px] text-[#DC2626] hover:text-[#B91C1C]"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="relative border-2 border-dashed border-[#A8B8AE] rounded-2xl bg-[#FCFDFD] overflow-hidden cursor-crosshair">
              <canvas
                ref={canvasRef}
                className="w-full h-44 touch-none block"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              {!hasDrawn && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-[#A8B8AE] select-none">
                  <span className="text-2xl mb-1 opacity-50">🖊️</span>
                  <span className="text-xs">Draw signature with finger, stylus, or mouse</span>
                </div>
              )}
            </div>
            <p className="text-[10px] text-[#788A7F] mt-1 text-right">
              Ink: Forest Green · High-DPI Vector Capture
            </p>
          </div>

          {/* Legal affirmation */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F5F9F6] border border-[#E2ECE5] cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded text-[#0F3D26] focus:ring-[#0F3D26] cursor-pointer"
            />
            <span className="text-[11px] text-[#3D5044] leading-relaxed">
              I certify that this digital mark is executed by me, constitutes my legally binding agreement to{' '}
              <strong>{documentTitle}</strong>, and may be audited under Ghana Electronic Transactions Act (Act 772).
            </span>
          </label>
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#EDF3EF] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl border border-[#D8E4DC] text-xs font-semibold text-[#6B7E72] hover:bg-white transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-[#0F3D26] hover:bg-[#1A5C3A] text-white text-xs font-semibold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Sealing Signature...
              </>
            ) : (
              <>
                <span>✓</span>
                Affix Legal Signature
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
