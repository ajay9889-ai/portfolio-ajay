'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Mail, Briefcase, FolderOpen, User, LogOut,
  Menu, X, ChevronRight, ExternalLink, ShieldCheck
} from 'lucide-react';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/contacts', label: 'Contact Logs', icon: Mail },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/profile', label: 'Profile', icon: User },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin';

  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoginPage) {
      setAuthenticated(true);
      return;
    }

    let isMounted = true;
    fetch('/api/admin/auth')
      .then((r) => r.json())
      .then((d) => {
        if (!isMounted) return;
        if (!d.authenticated) {
          router.replace('/admin');
        } else {
          setAuthenticated(true);
        }
      })
      .catch(() => {
        if (isMounted) router.replace('/admin');
      });

    return () => {
      isMounted = false;
    };
  }, [pathname, isLoginPage, router]);

  const logout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch {
      // ignore
    }
    router.replace('/admin');
  };

  // On login page, render plain without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state while checking authentication
  if (authenticated === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0E] text-white">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-[#FF7A00]/20 border-t-[#FF7A00] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[#FF7A00]/30" />
          </div>
        </div>
        <p className="mt-4 text-xs font-mono uppercase tracking-widest text-neutral-400">Verifying Admin Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0E] text-white flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 w-64 bg-[#111116] border-r border-white/[0.08] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.08] bg-black/20">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF5500] to-[#FF7A00] flex items-center justify-center text-sm font-black shadow-lg shadow-[#FF7A00]/25 group-hover:scale-105 transition-transform">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white tracking-tight">Ajay Admin</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-[#FF7A00]/20 text-[#FF7A00]">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">Portfolio Management</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-neutral-300 font-semibold">
            Workspace
          </div>
          {NAV.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF7A00]/20 to-[#FF5500]/10 text-white border border-[#FF7A00]/40 shadow-sm shadow-[#FF7A00]/10 font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#FF7A00]' : 'text-neutral-400 group-hover:text-white'
                  }`}
                />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#FF7A00]" />}
              </Link>
            );
          })}

          <div className="pt-4 px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-neutral-300 font-semibold">
            Quick Links
          </div>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-all group"
          >
            <ExternalLink className="w-4 h-4 shrink-0 text-neutral-400 group-hover:text-[#FF7A00]" />
            <span className="flex-1">View Live Site</span>
          </Link>
        </nav>

        {/* Footer / Logout */}
        <div className="p-3 border-t border-white/[0.08] bg-black/20">
          <div className="px-3 py-2 mb-2 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF7A00]" />
            <span className="text-[11px] text-neutral-400 font-mono">Protected Session</span>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-all group"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile top header */}
        <header className="sticky top-0 z-30 bg-[#0A0A0E]/90 backdrop-blur-md border-b border-white/[0.08] px-4 py-3 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#FF5500] to-[#FF7A00] flex items-center justify-center text-xs font-bold">
                A
              </div>
              <span className="text-sm font-bold text-white">Ajay Admin</span>
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 font-mono"
          >
            Site <ExternalLink className="w-3 h-3" />
          </Link>
        </header>

        {/* Page body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
