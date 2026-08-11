'use client';

import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 max-w-sm bg-[#0F3D26] text-white p-4 rounded-2xl border border-white/20 shadow-2xl flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#E87722] flex items-center justify-center text-xl font-bold">
          📱
        </div>
        <div>
          <div className="font-serif font-bold text-xs">Install Civitas App</div>
          <div className="text-[10px] text-white/70">Add to home screen for offline field access & instant SLA alerts</div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleInstallClick}
          className="px-3 py-1.5 rounded-full bg-[#E87722] hover:bg-[#B85A10] text-white text-[10px] font-bold uppercase tracking-wider"
        >
          Install
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-white/50 hover:text-white text-xs px-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
