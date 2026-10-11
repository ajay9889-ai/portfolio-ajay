'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, ArrowLeft, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingInitial, setCheckingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect straight to dashboard
  useEffect(() => {
    let active = true;
    fetch('/api/admin/auth')
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        if (data.authenticated) {
          router.replace('/admin/dashboard');
        } else {
          setCheckingInitial(false);
        }
      })
      .catch(() => {
        if (active) setCheckingInitial(false);
      });

    return () => {
      active = false;
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || loading) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid credentials. Access denied.');
        setLoading(false);
        return;
      }

      // Success -> navigate to dashboard
      router.push('/admin/dashboard');
    } catch {
      setError('Connection failure. Check network or server.');
      setLoading(false);
    }
  };

  if (checkingInitial) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0E] text-white">
        <div className="w-10 h-10 border-2 border-[#FF7A00]/20 border-t-[#FF7A00] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0E] text-white flex flex-col justify-between relative overflow-hidden selection:bg-[#FF7A00]/30 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF7A00]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#FF5500]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 p-6 flex justify-between items-center max-w-6xl mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors group px-3 py-1.5 rounded-lg hover:bg-white/[0.04]"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Portfolio</span>
        </Link>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FF7A00]" />
          <span>v2.4 Protected</span>
        </div>
      </header>

      {/* Center Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-[#111116]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-black/80 relative">
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#FF7A00] to-transparent opacity-80" />

            {/* Badge & Avatar */}
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-[#FF5500]/20 to-[#FF7A00]/10 border border-[#FF7A00]/30 text-[#FF7A00] mb-4 shadow-inner">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                Admin Console
                <Sparkles className="w-4 h-4 text-[#FF7A00]" />
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Enter your security key to manage logs, experience, and projects.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase tracking-wider">
                  Admin Passkey
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password..."
                    autoFocus
                    required
                    className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-400 outline-none transition-all pr-12 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#FF5500] to-[#FF7A00] hover:from-[#ff661a] hover:to-[#ff8a1a] text-white shadow-lg shadow-[#FF7A00]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Unlock Dashboard</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Info hint */}
            <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
              <p className="text-[11px] text-neutral-400 font-mono">
                Credentials configured in <span className="text-neutral-400 font-semibold">.env.local</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-xs text-neutral-400 font-mono">
        &copy; {new Date().getFullYear()} Ajay Portfolio Engine &middot; Autonomous Admin
      </footer>
    </div>
  );
}
