'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem { label: string; href: string; icon: string; }
interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'owner' | 'tenant' | 'technician' | 'investor';
  userName?: string;
}

const NAV_ITEMS: Record<string, NavItem[]> = {
  owner: [
    { label: 'Overview',      href: '/dashboard/owner',              icon: '📊' },
    { label: 'Properties',    href: '/dashboard/owner/properties',   icon: '🏠' },
    { label: 'Tenants',       href: '/dashboard/owner/tenants',      icon: '👥' },
    { label: 'Maintenance',   href: '/dashboard/owner/maintenance',  icon: '🔧' },
    { label: 'Finances',      href: '/dashboard/owner/finances',     icon: '💰' },
    { label: 'Energy',        href: '/dashboard/owner/energy',       icon: '☀️' },
    { label: 'Documents',     href: '/dashboard/owner/documents',    icon: '📄' },
  ],
  tenant: [
    { label: 'Overview',      href: '/dashboard/tenant',             icon: '📊' },
    { label: 'Pay Rent',      href: '/dashboard/tenant/rent',        icon: '💳' },
    { label: 'Maintenance',   href: '/dashboard/tenant/maintenance', icon: '🔧' },
    { label: 'My Lease',      href: '/dashboard/tenant/lease',       icon: '📄' },
    { label: 'Utility Bills', href: '/dashboard/tenant/utilities',   icon: '⚡' },
  ],
  technician: [
    { label: 'My Jobs',       href: '/dashboard/technician',            icon: '📋' },
    { label: 'Job History',   href: '/dashboard/technician/history',    icon: '🕐' },
    { label: 'Earnings',      href: '/dashboard/technician/earnings',   icon: '💰' },
    { label: 'My Profile',    href: '/dashboard/technician/profile',    icon: '👤' },
  ],
  investor: [
    { label: 'Portfolio',     href: '/dashboard/investor',              icon: '📈' },
    { label: 'Marketplace',   href: '/dashboard/investor/marketplace',  icon: '🏗️' },
    { label: 'Dividends',     href: '/dashboard/investor/dividends',    icon: '💸' },
    { label: 'ESG Report',    href: '/dashboard/investor/esg',          icon: '🌿' },
    { label: 'Documents',     href: '/dashboard/investor/documents',    icon: '📄' },
  ],
};

const ROLE_META = {
  owner:      { label: 'Property Owner',  color: '#1A5C3A', bg: '#EEF7F2', emoji: '🏠' },
  tenant:     { label: 'Tenant',          color: '#2563EB', bg: '#EFF6FF', emoji: '🔑' },
  technician: { label: 'Technician',      color: '#D97706', bg: '#FEF3C7', emoji: '🔧' },
  investor:   { label: 'Investor',        color: '#7C3AED', bg: '#F5F3FF', emoji: '💼' },
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  desc: string;
  time: string;
}


export default function DashboardLayout({ children, role, userName = 'User' }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifLoading, setNotifLoading] = useState(true);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    fetch('/api/notifications')
      .then((res) => (res.ok ? res.json() : { notifications: [] }))
      .then((data) => {
        if (!cancelled) setNotifications(data.notifications ?? []);
      })
      .catch(() => {
        if (!cancelled) setNotifications([]);
      })
      .finally(() => {
        if (!cancelled) setNotifLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const nav = NAV_ITEMS[role];
  const meta = ROLE_META[role];
  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  const handleSignOut = async () => {
    const { supabase } = await import('@/lib/supabase');
    await supabase.auth.signOut();
    window.location.href = '/portal';
  };

  const markAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#D8E4DC]">
        <Link href="/" className="text-xl font-serif font-bold text-[#0F3D26]">
          Civitas<span className="text-[#E87722]">.</span>
        </Link>
        <div className="mt-3 flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: meta.bg }}>
          <span className="text-lg">{meta.emoji}</span>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: meta.color }}>{meta.label}</div>
            <div className="text-xs font-semibold text-[#111A14] truncate max-w-[130px]">{userName}</div>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {nav.map(item => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                active
                  ? 'bg-[#0F3D26] text-white shadow-sm'
                  : 'text-[#3D5044] hover:bg-[#EEF7F2] hover:text-[#1A5C3A]'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E87722]" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-[#D8E4DC] space-y-2">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-[#6B7E72] hover:bg-[#F5F9F6] transition-all">
          <span>🏡</span> Back to Homepage
        </Link>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-[#D94F3D] hover:bg-[#FDECEA] transition-all">
          <span>🚪</span> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F9F6] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-[#D8E4DC] fixed top-0 left-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-56 bg-white shadow-2xl z-50">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#D8E4DC] h-14 flex items-center px-4 md:px-8 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-xl border border-[#D8E4DC] flex items-center justify-center text-[#6B7E72]">
            ☰
          </button>
          <div className="flex-1" />

          {/* Notifications Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-9 h-9 rounded-xl border border-[#D8E4DC] bg-white flex items-center justify-center text-[#6B7E72] hover:bg-[#F5F9F6] transition-all"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#E87722] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#D8E4DC] shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-3 bg-[#0F3D26] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#E87722] text-[9px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[10px] text-white/80 hover:text-white underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="divide-y divide-[#D8E4DC] max-h-80 overflow-y-auto">
                  {notifLoading && (
                    <div className="p-6 text-center text-xs text-[#6B7E72]">Loading…</div>
                  )}
                  {!notifLoading && notifications.length === 0 && (
                    <div className="p-6 text-center text-xs text-[#6B7E72]">No recent activity yet.</div>
                  )}
                  {!notifLoading && notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-4 transition-colors ${!readIds.has(n.id) ? 'bg-[#EEF7F2]/50' : 'bg-white'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#111A14]">{n.title}</span>
                        <span className="text-[9px] text-[#6B7E72]">{timeAgo(n.time)}</span>
                      </div>
                      <p className="text-xs text-[#6B7E72] leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="p-3 border-t border-[#D8E4DC] bg-[#F5F9F6] text-center">
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="text-[11px] font-semibold text-[#1A5C3A] hover:underline"
                  >
                    Close Center
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm" style={{ background: meta.color }}>
            {userName.charAt(0).toUpperCase()}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
