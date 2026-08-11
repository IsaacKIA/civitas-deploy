'use client';

import React, { useState } from 'react';

export default function InviteTenantWidget() {
  const [email, setEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams({ mode: 'signup', role: 'tenant' });
    if (email.trim()) params.set('email', email.trim());
    setInviteLink(`${origin}/portal?${params.toString()}`);
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Clipboard API can be denied by the browser — the link is still
      // shown and selectable, so this isn't a dead end for the user.
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#D8E4DC] shadow-sm flex flex-col justify-between">
      <div>
        <h2 className="text-base font-serif font-bold text-[#0F3D26] mb-2">Invite a Tenant</h2>
        <p className="text-xs text-[#6B7E72] mb-6">
          Generate a sign-up link, then share it yourself via WhatsApp, SMS, or email. Civitas doesn&apos;t send it
          for you yet — once they sign up, look them up by email on the Create Lease page.
        </p>

        {!inviteLink ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#111A14] mb-1">Tenant Email (optional, pre-fills their form)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tenant@example.com"
                className="w-full px-4 py-3 text-xs rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-xs font-semibold uppercase tracking-wider shadow-md"
            >
              Generate Sign-Up Link →
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#F5F9F6] border border-[#D8E4DC] text-[11px] font-mono break-all text-[#111A14]">
              {inviteLink}
            </div>
            <button
              onClick={handleCopy}
              className="w-full py-3 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-xs font-semibold uppercase tracking-wider shadow-md"
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={() => { setInviteLink(''); setEmail(''); }}
              className="w-full py-2 text-xs font-semibold text-[#6B7E72]"
            >
              Generate another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
