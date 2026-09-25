'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface PreferencesData {
  phone: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  whatsapp_enabled: boolean;
  events: Record<string, { email?: boolean; sms?: boolean; whatsapp?: boolean }>;
}

interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
}

interface SettingsClientProps {
  userId: string;
  userProfile: UserProfile;
  initialPreferences: PreferencesData | null;
}

const EVENT_CATEGORIES = [
  {
    id: 'financial',
    title: 'Financial & Rent Alerts',
    description: 'Rent payments received, tenant payment delays, escrow disbursements',
    events: [
      { id: 'rent_payment_confirmed', label: 'Payment Received Confirmation', desc: 'When tenant pays rent' },
      { id: 'rent_payment_overdue', label: 'Overdue Rent Alert', desc: 'When rent grace period lapses' },
      { id: 'remittance_received', label: 'Overseas Remittance Received', desc: 'Diaspora FX payments' },
    ],
  },
  {
    id: 'maintenance',
    title: 'Maintenance & Service Delivery',
    description: 'Work order dispatch, technician updates, and job resolution',
    events: [
      { id: 'maintenance_request_received', label: 'New Ticket Received', desc: 'When a new issue is submitted' },
      { id: 'maintenance_request_assigned', label: 'Technician Assigned', desc: 'When contractor is dispatched' },
      { id: 'technician_en_route', label: 'Technician En Route', desc: 'Real-time arrival notification' },
      { id: 'maintenance_request_completed', label: 'Job Completion & Sign-off', desc: 'When work is verified complete' },
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance, Leases & Documents',
    description: 'Tenancy renewals, safety certifications, and handover records',
    events: [
      { id: 'lease_expiry_reminder', label: 'Lease Expiry Notice', desc: '60/30 day expiry warning' },
      { id: 'document_expiry_warning', label: 'Document Expiration Alert', desc: 'Fire certs, insurance, title deeds' },
      { id: 'handover_certificate_ready', label: 'Handover Certificate Ready', desc: 'New unit readiness' },
      { id: 'inspection_scheduled', label: 'Property Inspection Alert', desc: 'Routine or handover checks' },
    ],
  },
  {
    id: 'operations',
    title: 'SLA & Critical Escalations',
    description: 'High-priority emergency alerts and SLA threshold notifications',
    events: [
      { id: 'sla_breach_alert', label: 'SLA Breach Warning', desc: 'Response time threshold warning' },
      { id: 'work_order_dispatched', label: 'Emergency Work Order', desc: 'Urgent facility dispatch' },
    ],
  },
];

export default function SettingsClient({ userId, userProfile, initialPreferences }: SettingsClientProps) {
  const [phone, setPhone] = useState(initialPreferences?.phone || userProfile.phone || '');
  const [emailEnabled, setEmailEnabled] = useState(initialPreferences?.email_enabled ?? true);
  const [smsEnabled, setSmsEnabled] = useState(initialPreferences?.sms_enabled ?? true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(initialPreferences?.whatsapp_enabled ?? true);
  const [events, setEvents] = useState<Record<string, { email?: boolean; sms?: boolean; whatsapp?: boolean }>>(
    initialPreferences?.events || {}
  );

  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleToggleChannel = (channel: 'email' | 'sms' | 'whatsapp') => {
    if (channel === 'email') setEmailEnabled((prev) => !prev);
    if (channel === 'sms') setSmsEnabled((prev) => !prev);
    if (channel === 'whatsapp') setWhatsappEnabled((prev) => !prev);
  };

  const handleToggleEventChannel = (eventId: string, channel: 'email' | 'sms' | 'whatsapp') => {
    setEvents((prev) => {
      const current = prev[eventId] || {};
      const currentVal = current[channel] ?? true;
      return {
        ...prev,
        [eventId]: {
          ...current,
          [channel]: !currentVal,
        },
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert(
          {
            user_id: userId,
            phone: phone.trim(),
            email_enabled: emailEnabled,
            sms_enabled: smsEnabled,
            whatsapp_enabled: whatsappEnabled,
            events,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (error) throw error;

      setMessage({ type: 'success', text: 'Notification preferences saved successfully!' });
    } catch (err: unknown) {
      console.error('Save failed:', err);
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save preferences.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSendTest = async (channel: 'whatsapp' | 'sms') => {
    if (!phone.trim()) {
      setMessage({ type: 'error', text: 'Please enter a valid phone number (+233...) before testing.' });
      return;
    }

    setTesting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'rent_payment_confirmed',
          recipientName: userProfile.fullName || 'Valued Partner',
          recipientPhone: phone.trim(),
          recipientEmail: userProfile.email,
          channels: [channel],
          data: {
            property: 'Cantonments Heights Apt 4B',
            amount: '4,500',
            ref: 'CIV-TEST-' + Math.floor(1000 + Math.random() * 9000),
            payment_date: new Date().toLocaleDateString('en-GB'),
            portal_url: 'https://www.civitasestate.com/dashboard',
          },
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to dispatch test notification');

      setMessage({
        type: 'success',
        text: `Test ${channel.toUpperCase()} sent! Check your device (${phone}).`,
      });
    } catch (err: unknown) {
      console.error('Test notification failed:', err);
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to send test message.' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D8E4DC] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1A5C3A] text-xs font-semibold mb-2">
              <span>🔔 Multi-Channel Delivery</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A5C3A]"></span>
              <span>Africa&apos;s Talking & Resend</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F3D26]">Notification Settings</h1>
            <p className="text-xs sm:text-sm text-[#6B7E72] mt-1">
              Configure how and when you receive automated updates across WhatsApp, SMS, and Email.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#0F3D26] hover:bg-[#1A5C3A] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Saving...
                </>
              ) : (
                <>
                  <span>💾</span>
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </div>

        {/* Message banner */}
        {message && (
          <div
            className={`mt-6 p-4 rounded-2xl text-xs flex items-center justify-between ${
              message.type === 'success'
                ? 'bg-[#E8F5E9] text-[#1A5C3A] border border-[#C8E6C9]'
                : 'bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]'
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-sm font-bold opacity-60 hover:opacity-100">
              ×
            </button>
          </div>
        )}
      </div>

      {/* Contact Details & Global Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact info card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#D8E4DC] shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-[#0F3D26] uppercase tracking-wider">Contact Coordinates</h2>

          <div>
            <label className="block text-xs font-medium text-[#3D5044] mb-1.5">
              WhatsApp / Mobile Phone (E.164)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+233 24 000 0000"
                className="w-full text-xs px-4 py-2.5 rounded-xl border border-[#D8E4DC] focus:outline-none focus:border-[#1A5C3A] focus:ring-1 focus:ring-[#1A5C3A] font-mono"
              />
            </div>
            <p className="text-[11px] text-[#788A7F] mt-1.5">
              Include Ghana country code <span className="font-mono text-[#0F3D26]">+233</span> for reliable SMS & WhatsApp delivery.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#3D5044] mb-1.5">Registered Email</label>
            <input
              type="email"
              disabled
              value={userProfile.email}
              className="w-full text-xs px-4 py-2.5 rounded-xl border border-[#E2ECE5] bg-[#F8FAF9] text-[#788A7F] font-mono cursor-not-allowed"
            />
            <p className="text-[11px] text-[#788A7F] mt-1.5">Managed through your main Civitas profile.</p>
          </div>

          <div className="pt-2 border-t border-[#EDF3EF]">
            <span className="text-[11px] font-semibold text-[#0F3D26] uppercase tracking-wider block mb-2">
              Quick Test Trigger
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSendTest('whatsapp')}
                disabled={testing || !phone}
                className="flex-1 px-3 py-2 rounded-xl bg-[#25D366]/10 text-[#0F3D26] hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[11px] font-semibold transition-all disabled:opacity-50"
              >
                📱 Test WhatsApp
              </button>
              <button
                type="button"
                onClick={() => handleSendTest('sms')}
                disabled={testing || !phone}
                className="flex-1 px-3 py-2 rounded-xl bg-[#0F3D26]/10 text-[#0F3D26] hover:bg-[#0F3D26]/20 border border-[#0F3D26]/20 text-[11px] font-semibold transition-all disabled:opacity-50"
              >
                💬 Test SMS
              </button>
            </div>
          </div>
        </div>

        {/* Channels card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-[#D8E4DC] shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-[#0F3D26] uppercase tracking-wider">Active Channels</h2>

          <div className="space-y-4">
            {/* WhatsApp */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-[#D8E4DC] hover:border-[#25D366] transition-all bg-[#FAFDFB]">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 flex items-center justify-center text-xl shrink-0">
                  📱
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0F3D26]">WhatsApp Business Alerts</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#25D366]/20 text-[#128C7E]">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B7E72] mt-0.5">
                    Rich instant notifications with receipts, work order photos, and direct technician contact details.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggleChannel('whatsapp')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  whatsappEnabled ? 'bg-[#25D366]' : 'bg-[#D1D5DB]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    whatsappEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* SMS */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-[#D8E4DC] hover:border-[#1A5C3A] transition-all bg-[#FAFDFB]">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0F3D26]/10 flex items-center justify-center text-xl shrink-0">
                  💬
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0F3D26]">SMS Text Messages</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EDF3EF] text-[#6B7E72]">
                      High Reliability
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B7E72] mt-0.5">
                    160-char concise SMS alerts. Works without mobile internet or data package. Serves as automatic fallback.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggleChannel('sms')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  smsEnabled ? 'bg-[#1A5C3A]' : 'bg-[#D1D5DB]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    smsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-[#D8E4DC] hover:border-[#1A5C3A] transition-all bg-[#FAFDFB]">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0F3D26]/10 flex items-center justify-center text-xl shrink-0">
                  ✉️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0F3D26]">Email Dispatches</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EDF3EF] text-[#6B7E72]">
                      Audit Trail
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B7E72] mt-0.5">
                    Official payment receipts, inspection reports, energy statements, and formal legal notices.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggleChannel('email')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  emailEnabled ? 'bg-[#1A5C3A]' : 'bg-[#D1D5DB]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    emailEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Granular Event Settings */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D8E4DC] shadow-sm space-y-6">
        <div>
          <h2 className="text-sm font-bold text-[#0F3D26] uppercase tracking-wider">Granular Event Matrix</h2>
          <p className="text-xs text-[#6B7E72] mt-1">
            Customize which channels receive specific event updates. If a channel is globally disabled above, it will not be sent regardless of event toggles.
          </p>
        </div>

        <div className="space-y-6">
          {EVENT_CATEGORIES.map((cat) => (
            <div key={cat.id} className="border border-[#E2ECE5] rounded-2xl overflow-hidden">
              <div className="bg-[#F8FAF9] px-5 py-3 border-b border-[#E2ECE5] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h3 className="text-xs font-bold text-[#0F3D26]">{cat.title}</h3>
                  <p className="text-[11px] text-[#788A7F]">{cat.description}</p>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-[10px] font-bold text-[#6B7E72] tracking-wider uppercase pr-4">
                  <span className="w-12 text-center">WhatsApp</span>
                  <span className="w-10 text-center">SMS</span>
                  <span className="w-10 text-center">Email</span>
                </div>
              </div>

              <div className="divide-y divide-[#EDF3EF]">
                {cat.events.map((ev) => {
                  const evSettings = events[ev.id] || {};
                  const isWa = evSettings.whatsapp ?? true;
                  const isSms = evSettings.sms ?? true;
                  const isEmail = evSettings.email ?? true;

                  return (
                    <div
                      key={ev.id}
                      className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FBFDFB] transition-colors"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-[#111A14]">{ev.label}</span>
                        <p className="text-[11px] text-[#6B7E72]">{ev.desc}</p>
                      </div>

                      <div className="flex items-center gap-6 self-end sm:self-center pr-2">
                        {/* WA toggle */}
                        <div className="flex flex-col items-center gap-1 sm:w-12">
                          <span className="sm:hidden text-[9px] text-[#788A7F]">WhatsApp</span>
                          <input
                            type="checkbox"
                            checked={isWa && whatsappEnabled}
                            disabled={!whatsappEnabled}
                            onChange={() => handleToggleEventChannel(ev.id, 'whatsapp')}
                            className="w-4 h-4 rounded text-[#25D366] focus:ring-[#25D366] cursor-pointer disabled:opacity-40"
                          />
                        </div>

                        {/* SMS toggle */}
                        <div className="flex flex-col items-center gap-1 sm:w-10">
                          <span className="sm:hidden text-[9px] text-[#788A7F]">SMS</span>
                          <input
                            type="checkbox"
                            checked={isSms && smsEnabled}
                            disabled={!smsEnabled}
                            onChange={() => handleToggleEventChannel(ev.id, 'sms')}
                            className="w-4 h-4 rounded text-[#1A5C3A] focus:ring-[#1A5C3A] cursor-pointer disabled:opacity-40"
                          />
                        </div>

                        {/* Email toggle */}
                        <div className="flex flex-col items-center gap-1 sm:w-10">
                          <span className="sm:hidden text-[9px] text-[#788A7F]">Email</span>
                          <input
                            type="checkbox"
                            checked={isEmail && emailEnabled}
                            disabled={!emailEnabled}
                            onChange={() => handleToggleEventChannel(ev.id, 'email')}
                            className="w-4 h-4 rounded text-[#0F3D26] focus:ring-[#0F3D26] cursor-pointer disabled:opacity-40"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
