'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

// ─── Update these once your store listings are live ───────────────────────────
const APP_STORE_URL = 'https://apps.apple.com/app/civitas-estate/idPLACEHOLDER';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.civitasestate.app';
// ──────────────────────────────────────────────────────────────────────────────

type Platform = 'ios' | 'android' | 'desktop';

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

// iOS App Store badge SVG inline (official shape)
function AppStoreBadge() {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
      aria-label="Download on the App Store"
    >
      <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="40" rx="8" fill="black"/>
        <text x="60" y="16" textAnchor="middle" fill="white" fontSize="7" fontFamily="system-ui, -apple-system">Download on the</text>
        <text x="60" y="28" textAnchor="middle" fill="white" fontSize="13" fontFamily="system-ui, -apple-system" fontWeight="bold">App Store</text>
        <text x="16" y="26" textAnchor="middle" fill="white" fontSize="18">🍎</text>
      </svg>
    </a>
  );
}

// Google Play badge SVG inline (official shape)
function PlayStoreBadge() {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
      aria-label="Get it on Google Play"
    >
      <svg width="135" height="40" viewBox="0 0 135 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="135" height="40" rx="8" fill="black"/>
        <text x="72" y="16" textAnchor="middle" fill="white" fontSize="7" fontFamily="system-ui, -apple-system">Get it on</text>
        <text x="72" y="28" textAnchor="middle" fill="white" fontSize="13" fontFamily="system-ui, -apple-system" fontWeight="bold">Google Play</text>
        <text x="18" y="27" textAnchor="middle" fill="white" fontSize="18">▶</text>
      </svg>
    </a>
  );
}

export default function PWAInstallPrompt() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Register service worker for PWA caching
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
    }

    // Only show on mobile devices
    const p = detectPlatform();
    setPlatform(p);

    // Don't show on desktop or if user already dismissed this session
    if (p === 'desktop') return;

    // Check if user dismissed recently (persisted across refreshes for 7 days)
    const dismissed = localStorage.getItem('civitas_app_banner_dismissed');
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return;
    }

    // Delay banner appearance slightly for a polished feel
    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
    localStorage.setItem('civitas_app_banner_dismissed', Date.now().toString());
  };

  // Desktop: show a subtle app download nudge in the corner
  const renderDesktopBadges = () => (
    <div className="fixed bottom-6 right-6 z-50 bg-[#0F3D26] text-white p-4 rounded-2xl border border-white/20 shadow-2xl max-w-[260px]">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white p-0.5 flex items-center justify-center overflow-hidden shrink-0">
          <Image src="/brand/civitas-mark.png" alt="Civitas" width={36} height={36} className="w-full h-full object-contain" />
        </div>
        <div>
          <div className="font-serif font-bold text-sm leading-tight">Civitas Mobile App</div>
          <div className="text-[10px] text-white/70 mt-0.5">Access your dashboard on the go</div>
        </div>
        <button onClick={handleDismiss} className="ml-auto text-white/40 hover:text-white text-sm shrink-0 -mt-1">✕</button>
      </div>
      <div className="flex gap-2 flex-wrap">
        <AppStoreBadge />
        <PlayStoreBadge />
      </div>
    </div>
  );

  // iOS: direct to App Store
  const renderIOSBanner = () => (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0F3D26] text-white px-4 py-3 flex items-center gap-3 border-t border-white/20 shadow-2xl">
      <div className="w-10 h-10 rounded-xl bg-white p-0.5 flex items-center justify-center overflow-hidden shrink-0">
        <Image src="/brand/civitas-mark.png" alt="Civitas" width={36} height={36} className="w-full h-full object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-serif font-bold text-sm leading-tight">Civitas Estate</div>
        <div className="text-[10px] text-white/70 truncate">Rent, maintenance & property management</div>
      </div>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 px-4 py-2 rounded-full bg-white text-[#0F3D26] text-xs font-bold hover:bg-[#D6EDE1] transition-colors"
        onClick={handleDismiss}
      >
        View
      </a>
      <button onClick={handleDismiss} className="text-white/40 hover:text-white text-sm shrink-0 px-1">✕</button>
    </div>
  );

  // Android: direct to Play Store
  const renderAndroidBanner = () => (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0F3D26] text-white px-4 py-3 flex items-center gap-3 border-t border-white/20 shadow-2xl">
      <div className="w-10 h-10 rounded-xl bg-white p-0.5 flex items-center justify-center overflow-hidden shrink-0">
        <Image src="/brand/civitas-mark.png" alt="Civitas" width={36} height={36} className="w-full h-full object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-serif font-bold text-sm leading-tight">Civitas Estate</div>
        <div className="text-[10px] text-white/70 truncate">Rent, maintenance & property management</div>
      </div>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 px-4 py-2 rounded-full bg-white text-[#0F3D26] text-xs font-bold hover:bg-[#D6EDE1] transition-colors"
        onClick={handleDismiss}
      >
        Get App
      </a>
      <button onClick={handleDismiss} className="text-white/40 hover:text-white text-sm shrink-0 px-1">✕</button>
    </div>
  );

  if (dismissed || !visible) return null;

  if (platform === 'ios') return renderIOSBanner();
  if (platform === 'android') return renderAndroidBanner();
  return renderDesktopBadges();
}
