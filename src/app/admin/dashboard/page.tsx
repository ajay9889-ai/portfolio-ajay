'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Mail, Briefcase, FolderOpen, User, ArrowUpRight,
  Clock, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Send
} from 'lucide-react';
import { ContactEntry, ExperienceEntry, ProjectEntry, ProfileData } from '@/lib/adminData';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [experience, setExperience] = useState<ExperienceEntry[]>([]);
  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const loadData = async () => {
    setLoading(true);
    try {
      const [cRes, eRes, pRes, profRes] = await Promise.all([
        fetch('/api/admin/contacts').then((r) => r.json()),
        fetch('/api/admin/experience').then((r) => r.json()),
        fetch('/api/admin/projects').then((r) => r.json()),
        fetch('/api/admin/profile').then((r) => r.json()),
      ]);

      if (cRes.success) setContacts(cRes.data || []);
      if (eRes.success) setExperience(eRes.data || []);
      if (pRes.success) setProjects(pRes.data || []);
      if (profRes.success) setProfile(profRes.data || null);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check Render backend health
  useEffect(() => {
    loadData();

    fetch('https://portfolio-backend-yxfu.onrender.com/health')
      .then((r) => (r.ok ? setBackendStatus('online') : setBackendStatus('offline')))
      .catch(() => setBackendStatus('offline'));
  }, []);

  const unreadCount = contacts.filter((c) => !c.read).length;
  const featuredCount = projects.filter((p) => p.featured).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Command Dashboard
            </h1>
            <span className="p-1 rounded-md bg-[#FF7A00]/20 text-[#FF7A00]">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Real-time control center for Ajay's portfolio logs, content, and profile.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#FF7A00]' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Messages Card */}
        <Link
          href="/admin/contacts"
          className="group relative p-5 rounded-2xl bg-[#111116] border border-white/[0.08] hover:border-[#FF7A00]/40 transition-all hover:shadow-xl hover:shadow-[#FF7A00]/5 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-[#FF7A00]/15 text-[#FF7A00] group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            {unreadCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF7A00] text-black font-mono animate-pulse">
                {unreadCount} NEW
              </span>
            ) : (
              <span className="text-neutral-400 group-hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-white">{contacts.length}</p>
            <p className="text-xs text-neutral-400 mt-0.5">Contact Submissions</p>
          </div>
        </Link>

        {/* Experience Card */}
        <Link
          href="/admin/experience"
          className="group relative p-5 rounded-2xl bg-[#111116] border border-white/[0.08] hover:border-[#FF7A00]/40 transition-all hover:shadow-xl hover:shadow-[#FF7A00]/5 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-white">{experience.length}</p>
            <p className="text-xs text-neutral-400 mt-0.5">Timeline Entries</p>
          </div>
        </Link>

        {/* Projects Card */}
        <Link
          href="/admin/projects"
          className="group relative p-5 rounded-2xl bg-[#111116] border border-white/[0.08] hover:border-[#FF7A00]/40 transition-all hover:shadow-xl hover:shadow-[#FF7A00]/5 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 group-hover:scale-110 transition-transform">
              <FolderOpen className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-white/[0.05] text-neutral-400">
              {featuredCount} Featured
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-white">{projects.length}</p>
            <p className="text-xs text-neutral-400 mt-0.5">Showcase Projects</p>
          </div>
        </Link>

        {/* Profile Card */}
        <Link
          href="/admin/profile"
          className="group relative p-5 rounded-2xl bg-[#111116] border border-white/[0.08] hover:border-[#FF7A00]/40 transition-all hover:shadow-xl hover:shadow-[#FF7A00]/5 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-bold text-white truncate">{profile?.name || 'Ajay A'}</p>
            <p className="text-xs text-neutral-400 truncate mt-0.5">{profile?.title || 'Full-Stack Developer'}</p>
          </div>
        </Link>
      </div>

      {/* Main Grid: Recent Contact Logs + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Contact Logs (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Recent Inquiries</h2>
              <span className="text-xs font-mono text-neutral-400">({contacts.length} total)</span>
            </div>
            <Link
              href="/admin/contacts"
              className="text-xs font-medium text-[#FF7A00] hover:text-[#ff8a1a] flex items-center gap-1 group"
            >
              <span>View all logs</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="bg-[#111116] border border-white/[0.08] rounded-2xl overflow-hidden divide-y divide-white/[0.05]">
            {loading ? (
              <div className="p-8 text-center text-xs text-neutral-400">Loading inquiries...</div>
            ) : contacts.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mx-auto mb-3 text-neutral-400">
                  <Mail className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-white">No contact submissions yet</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Messages submitted through the portfolio contact form will automatically appear here.
                </p>
              </div>
            ) : (
              contacts.slice(0, 4).map((msg) => (
                <div key={msg.id} className="p-4 hover:bg-white/[0.02] transition-colors flex items-start gap-4">
                  <div
                    className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${
                      msg.read ? 'bg-neutral-600' : 'bg-[#FF7A00] shadow-sm shadow-[#FF7A00]'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-white truncate">{msg.name}</p>
                      <span className="text-[11px] font-mono text-neutral-400 shrink-0">
                        {new Date(msg.receivedAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-[#FF7A00]/80 truncate mt-0.5">{msg.email}</p>
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-1.5">{msg.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Status & Quick Actions (1 col) */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="p-5 rounded-2xl bg-[#111116] border border-white/[0.08] space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-[#FF7A00]" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-2 pt-1">
              <Link
                href="/admin/experience"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] text-xs font-medium text-white transition-all group"
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  Add New Experience
                </span>
                <span className="text-neutral-400 group-hover:text-white transition-colors">+</span>
              </Link>

              <Link
                href="/admin/projects"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] text-xs font-medium text-white transition-all group"
              >
                <span className="flex items-center gap-2">
                  <FolderOpen className="w-3.5 h-3.5 text-purple-400" />
                  Add New Project
                </span>
                <span className="text-neutral-400 group-hover:text-white transition-colors">+</span>
              </Link>

              <Link
                href="/admin/profile"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] text-xs font-medium text-white transition-all group"
              >
                <span className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  Edit Profile & Bio
                </span>
                <span className="text-neutral-400 group-hover:text-white transition-colors">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Infrastructure Health */}
          <div className="p-5 rounded-2xl bg-[#111116] border border-white/[0.08] space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF7A00]" />
              System Status
            </h3>

            <div className="space-y-2 text-xs pt-1">
              {/* Backend API */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-neutral-400">Render Backend API</span>
                <span className="flex items-center gap-1.5 font-mono">
                  {backendStatus === 'online' && (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Online</span>
                    </>
                  )}
                  {backendStatus === 'checking' && (
                    <>
                      <div className="w-3 h-3 rounded-full border border-neutral-400 border-t-[#FF7A00] animate-spin" />
                      <span className="text-neutral-400">Checking</span>
                    </>
                  )}
                  {backendStatus === 'offline' && (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />
                      <span className="text-yellow-400">Standby</span>
                    </>
                  )}
                </span>
              </div>

              {/* Next.js Store */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-neutral-400">Storage Layer</span>
                <span className="flex items-center gap-1.5 font-mono text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  JSON DB Active
                </span>
              </div>

              {/* AI Gemini */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-neutral-400">Gemini Voice & Chat</span>
                <span className="flex items-center gap-1.5 font-mono text-[#FF7A00]">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
                  Integrated
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
