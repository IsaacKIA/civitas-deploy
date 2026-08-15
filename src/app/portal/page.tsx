'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ROLE_HOME_ROUTE } from '@/lib/section-roles';

type Role = 'client' | 'tenant' | 'investor' | 'technician';
type AuthMode = 'signin' | 'signup' | 'verify';

const ROLES: { id: Role; emoji: string; label: string; description: string }[] = [
  { id: 'client',     emoji: '🏠', label: 'Property Owner', description: 'Manage estates, rentals & energy' },
  { id: 'tenant',     emoji: '🔑', label: 'Tenant',         description: 'Pay rent, log issues & track status' },
  { id: 'investor',   emoji: '💼', label: 'Investor',       description: 'For future investment features' },
  { id: 'technician', emoji: '🔧', label: 'Technician',     description: 'Receive & complete dispatch orders' },
];

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const strength = checks.filter(Boolean).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-[#D94F3D]', 'bg-[#D97706]', 'bg-[#2E8B6A]', 'bg-[#1A5C3A]'];

  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? colors[strength] : 'bg-[#D8E4DC]'}`} />
        ))}
      </div>
      <div className={`text-[10px] font-medium ${strength <= 1 ? 'text-[#D94F3D]' : strength <= 2 ? 'text-[#D97706]' : 'text-[#1A5C3A]'}`}>
        {labels[strength]}
      </div>
    </div>
  );
}

function FieldError({ msg }: { msg: string }) {
  if (!msg) return null;
  return <p className="text-[10px] text-[#D94F3D] mt-1 flex items-center gap-1">⚠ {msg}</p>;
}

function PortalPageInner() {
  const searchParams = useSearchParams();
  const [mode, setMode]   = useState<AuthMode>(() => (searchParams.get('mode') === 'signup' ? 'signup' : 'signin'));
  const [role, setRole]   = useState<Role>(() => {
    const roleParam = searchParams.get('role');
    return roleParam && ROLES.some((r) => r.id === roleParam) ? (roleParam as Role) : 'client';
  });
  const [showRoles, setShowRoles] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sign-in
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [siErrors, setSiErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  // Sign-up
  const [firstName, setFirstName]   = useState('');
  const [lastName, setLastName]     = useState('');
  const [suEmail, setSuEmail]       = useState(() => searchParams.get('email') ?? '');
  const [phone, setPhone]           = useState('');
  const [suPass, setSuPass]         = useState('');
  const [suConfirm, setSuConfirm]   = useState('');
  const [suErrors, setSuErrors]     = useState<Record<string, string>>({});

  const activeRole = ROLES.find(r => r.id === role)!;

  // ─── Validation helpers ─────────────────────────────────────────────────────
  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address';
  const validatePhone = (v: string) => /^[0-9]{9,10}$/.test(v.replace(/\s/g,'')) ? '' : 'Enter a valid Ghana number (9-10 digits)';

  // ─── Sign In ────────────────────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof siErrors = {};
    const emailErr = validateEmail(email);
    if (emailErr) errors.email = emailErr;
    if (!password) errors.password = 'Password is required';
    if (Object.keys(errors).length) { setSiErrors(errors); return; }
    setSiErrors({});
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setSiErrors({ general: error.message }); return; }
      if (data.session) {
        // Get role from user metadata and redirect
        const userRole = (data.user?.user_metadata?.role as Role) || role;
        window.location.href = ROLE_HOME_ROUTE[userRole];
      }
    } catch {
      setSiErrors({ general: 'Connection error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // ─── Sign Up ────────────────────────────────────────────────────────────────
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim())  errors.lastName  = 'Last name is required';
    const emailErr = validateEmail(suEmail);
    if (emailErr) errors.email = emailErr;
    const phoneErr = validatePhone(phone);
    if (phoneErr) errors.phone = phoneErr;
    if (suPass.length < 8)         errors.password = 'Minimum 8 characters';
    if (suPass !== suConfirm)      errors.confirm  = 'Passwords do not match';
    if (Object.keys(errors).length) { setSuErrors(errors); return; }
    setSuErrors({});
    setLoading(true);

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ||
        (typeof window !== 'undefined' ? window.location.origin : '');
      const redirectTo = siteUrl ? `${siteUrl}/auth/callback` : undefined;
      const { data, error } = await supabase.auth.signUp({
        email: suEmail,
        password: suPass,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: `${firstName.trim()} ${lastName.trim()}`,
            phone: `+233${phone.replace(/\s/g,'')}`,
            role,
          }
        }
      });
      if (error) { setSuErrors({ general: error.message }); return; }
      
      // If email confirmation is disabled in Supabase project, session will be returned immediately
      if (data.session) {
        window.location.href = ROLE_HOME_ROUTE[role];
        return;
      }
      
      setMode('verify');
    } catch {
      setSuErrors({ general: 'Connection error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!suEmail) return;
    setLoading(true);
    setResendStatus(null);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: suEmail }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        setResendStatus(`Resend failed: ${json.error ?? 'Unknown error'}`);
      } else {
        setResendStatus('Verification email resent! Please check your Inbox and Spam folder.');
      }
    } catch {
      setResendStatus('Failed to resend email. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const inputCls = (err?: string) =>
    `w-full px-4 py-3 text-xs rounded-xl border outline-none transition-all ${
      err ? 'border-[#D94F3D] bg-[#FDECEA] focus:ring-2 focus:ring-[#D94F3D]/10' : 'border-[#D8E4DC] focus:border-[#1A5C3A] focus:ring-2 focus:ring-[#1A5C3A]/10'
    }`;

  return (
    <div className="min-h-screen bg-[#0F3D26] flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 px-6 py-5 flex justify-between items-center z-20 max-w-7xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-all hover:-translate-x-0.5">
          ← Back to Homepage
        </Link>
        <span className="text-white/40 text-xs font-mono uppercase tracking-widest hidden sm:inline">Civitas PropTech v2.0</span>
      </header>

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(46,125,82,0.3)_0%,transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(232,119,34,0.12)_0%,transparent_45%)] pointer-events-none" />

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl relative z-10 my-20 overflow-hidden">

        {/* Card Header */}
        <div className="px-8 pt-8 pb-6 text-center border-b border-[#D8E4DC]">
          <Link href="/" className="inline-block text-3xl font-serif font-bold text-[#0F3D26] mb-1">
            Civitas<span className="text-[#E87722]">.</span>
          </Link>
          <p className="text-xs text-[#6B7E72] mb-5">
            {mode === 'signin' ? 'Welcome back! Sign in to continue.' : mode === 'signup' ? 'Create your free Civitas account.' : ''}
          </p>
          {mode !== 'verify' && (
            <div className="inline-flex rounded-full bg-[#F5F9F6] border border-[#D8E4DC] p-1 gap-1">
              <button onClick={() => setMode('signin')} className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${mode === 'signin' ? 'bg-[#1A5C3A] text-white shadow' : 'text-[#6B7E72] hover:text-[#111A14]'}`}>Sign In</button>
              <button onClick={() => setMode('signup')} className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${mode === 'signup' ? 'bg-[#1A5C3A] text-white shadow' : 'text-[#6B7E72] hover:text-[#111A14]'}`}>Create Account</button>
            </div>
          )}
        </div>

        {/* EMAIL VERIFY STATE */}
        {mode === 'verify' && (
          <div className="px-8 py-10 text-center">
            <div className="w-16 h-16 rounded-full bg-[#EEF7F2] text-3xl flex items-center justify-center mx-auto mb-4">📧</div>
            <h3 className="text-2xl font-serif font-bold text-[#0F3D26] mb-2">Check your email</h3>
            <p className="text-xs text-[#6B7E72] mb-2">
              We sent a verification link to <span className="font-semibold text-[#111A14]">{suEmail}</span>.
            </p>
            <p className="text-xs text-[#6B7E72] mb-4">Click the link in the email to activate your account.</p>

            <div className="bg-[#F5F9F6] border border-[#D8E4DC] rounded-xl p-3.5 text-[11px] text-[#4A5D50] text-left mb-6 space-y-1">
              <p className="font-semibold text-[#0F3D26]">💡 Not seeing the email?</p>
              <ul className="list-disc pl-4 space-y-0.5 text-[#6B7E72]">
                <li>Check your <strong>Spam / Junk</strong> folder (especially for Yahoo & Gmail).</li>
                <li>Ensure <code>{suEmail || 'your email'}</code> was entered correctly.</li>
                <li>Verify your domain's SMTP settings if using a custom mail server.</li>
              </ul>
            </div>

            {resendStatus && (
              <p className={`text-xs mb-4 font-medium ${resendStatus.includes('failed') ? 'text-[#D94F3D]' : 'text-[#1A5C3A]'}`}>
                {resendStatus}
              </p>
            )}

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={loading}
                className="w-full py-3 rounded-full border border-[#1A5C3A] text-[#1A5C3A] hover:bg-[#EEF7F2] text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Resend Verification Email'}
              </button>
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="w-full py-3 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-xs font-semibold uppercase tracking-wider transition-all"
              >
                Go to Sign In →
              </button>
            </div>
          </div>
        )}

        {/* SIGN IN */}
        {mode === 'signin' && (
          <div className="px-8 py-6">
            {/* Role dropdown */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-[#111A14] mb-2">I am a…</label>
              <button type="button" onClick={() => setShowRoles(!showRoles)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-[#D8E4DC] bg-[#F5F9F6] text-xs font-semibold text-[#111A14] hover:border-[#1A5C3A] transition-all">
                <span>{activeRole.emoji} {activeRole.label}</span>
                <span className="text-[#6B7E72]">{showRoles ? '▲' : '▼'}</span>
              </button>
              {showRoles && (
                <div className="mt-2 rounded-2xl border border-[#D8E4DC] overflow-hidden shadow-lg">
                  {ROLES.map(r => (
                    <button key={r.id} type="button" onClick={() => { setRole(r.id); setShowRoles(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left text-xs transition-all border-b border-[#D8E4DC]/50 last:border-none ${role === r.id ? 'bg-[#EEF7F2] text-[#1A5C3A] font-semibold' : 'bg-white text-[#111A14] hover:bg-[#F5F9F6]'}`}>
                      <span className="text-lg">{r.emoji}</span>
                      <div><div className="font-semibold">{r.label}</div><div className="text-[10px] text-[#6B7E72] font-normal">{r.description}</div></div>
                      {role === r.id && <span className="ml-auto text-[#1A5C3A]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {siErrors.general && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-[#FDECEA] border border-[#D94F3D]/30 text-xs text-[#D94F3D] font-medium">
                ⚠ {siErrors.general}
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4" noValidate>
              <div>
                <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Email Address</label>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setSiErrors(p => ({...p, email: ''})); }}
                  placeholder="you@civitasestate.com" className={inputCls(siErrors.email)} />
                <FieldError msg={siErrors.email || ''} />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-[#111A14]">Password</label>
                  <button type="button" className="text-[10px] text-[#1A5C3A] hover:underline font-medium">Forgot password?</button>
                </div>
                <input type="password" value={password} onChange={e => { setPassword(e.target.value); setSiErrors(p => ({...p, password: ''})); }}
                  placeholder="••••••••" className={inputCls(siErrors.password)} />
                <FieldError msg={siErrors.password || ''} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] disabled:opacity-60 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2">
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {loading ? 'Signing in…' : `Sign In as ${activeRole.label} →`}
              </button>
            </form>

            <p className="text-center text-xs text-[#6B7E72] mt-5">
              Don&apos;t have an account?{' '}
              <button onClick={() => setMode('signup')} className="text-[#1A5C3A] font-semibold hover:underline">Create one free →</button>
            </p>
          </div>
        )}

        {/* SIGN UP */}
        {mode === 'signup' && (
          <div className="px-8 py-6">
            {/* Role cards */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-[#111A14] mb-2">I am registering as…</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(r => (
                  <button key={r.id} type="button" onClick={() => setRole(r.id)}
                    className={`flex flex-col items-start p-3 rounded-xl border text-xs transition-all ${role === r.id ? 'border-[#1A5C3A] bg-[#EEF7F2] text-[#1A5C3A]' : 'border-[#D8E4DC] bg-white text-[#111A14] hover:border-[#1A5C3A]/40'}`}>
                    <span className="text-lg mb-1">{r.emoji}</span>
                    <span className="font-semibold leading-tight">{r.label}</span>
                    <span className="text-[10px] text-[#6B7E72] font-normal mt-0.5 leading-snug">{r.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {suErrors.general && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-[#FDECEA] border border-[#D94F3D]/30 text-xs text-[#D94F3D] font-medium">
                ⚠ {suErrors.general}
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1.5">First Name</label>
                  <input type="text" value={firstName} onChange={e => { setFirstName(e.target.value); setSuErrors(p => ({...p, firstName: ''})); }}
                    placeholder="Kwame" className={inputCls(suErrors.firstName)} />
                  <FieldError msg={suErrors.firstName || ''} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Last Name</label>
                  <input type="text" value={lastName} onChange={e => { setLastName(e.target.value); setSuErrors(p => ({...p, lastName: ''})); }}
                    placeholder="Mensah" className={inputCls(suErrors.lastName)} />
                  <FieldError msg={suErrors.lastName || ''} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Email Address</label>
                <input type="email" value={suEmail} onChange={e => { setSuEmail(e.target.value); setSuErrors(p => ({...p, email: ''})); }}
                  placeholder="you@example.com" className={inputCls(suErrors.email)} />
                <FieldError msg={suErrors.email || ''} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Ghana Phone (MTN / Telecel / AT)</label>
                <div className="flex">
                  <span className="px-3 py-3 text-xs bg-[#F5F9F6] border border-r-0 border-[#D8E4DC] rounded-l-xl text-[#6B7E72] font-medium">+233</span>
                  <input type="tel" value={phone} onChange={e => { setPhone(e.target.value); setSuErrors(p => ({...p, phone: ''})); }}
                    placeholder="55 123 4567" className={`flex-1 px-4 py-3 text-xs rounded-r-xl border outline-none transition-all ${suErrors.phone ? 'border-[#D94F3D] bg-[#FDECEA]' : 'border-[#D8E4DC] focus:border-[#1A5C3A]'}`} />
                </div>
                <FieldError msg={suErrors.phone || ''} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Password</label>
                  <input type="password" value={suPass} onChange={e => { setSuPass(e.target.value); setSuErrors(p => ({...p, password: ''})); }}
                    placeholder="••••••••" className={inputCls(suErrors.password)} />
                  <PasswordStrength password={suPass} />
                  <FieldError msg={suErrors.password || ''} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Confirm</label>
                  <input type="password" value={suConfirm} onChange={e => { setSuConfirm(e.target.value); setSuErrors(p => ({...p, confirm: ''})); }}
                    placeholder="••••••••" className={inputCls(suErrors.confirm)} />
                  {suConfirm && suPass !== suConfirm && <FieldError msg="Passwords don't match" />}
                  {suConfirm && suPass === suConfirm && suConfirm.length > 0 && <p className="text-[10px] text-[#1A5C3A] mt-1">✓ Passwords match</p>}
                </div>
              </div>

              <p className="text-[10px] text-[#6B7E72] leading-relaxed">
                By creating an account you agree to Civitas&apos;{' '}
                <span className="text-[#1A5C3A] font-semibold cursor-pointer hover:underline">Terms of Service</span>{' '}and{' '}
                <span className="text-[#1A5C3A] font-semibold cursor-pointer hover:underline">Privacy Policy</span>.
              </p>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-full bg-[#E87722] hover:bg-[#B85A10] disabled:opacity-60 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2">
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {loading ? 'Creating account…' : `Create ${activeRole.label} Account →`}
              </button>
            </form>

            <p className="text-center text-xs text-[#6B7E72] mt-5">
              Already have an account?{' '}
              <button onClick={() => setMode('signin')} className="text-[#1A5C3A] font-semibold hover:underline">Sign in →</button>
            </p>
          </div>
        )}

        {/* Footer */}
        {mode !== 'verify' && (
          <div className="px-8 py-5 border-t border-[#D8E4DC] flex flex-col items-center gap-2 text-xs text-[#6B7E72]">
            <Link href="/" className="text-[#1A5C3A] font-semibold hover:underline">← Return to Homepage</Link>
            <div>Support: <a href="tel:+233555062589" className="text-[#1A5C3A] font-semibold">+233 55 506 2589</a></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PortalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F3D26]" />}>
      <PortalPageInner />
    </Suspense>
  );
}
