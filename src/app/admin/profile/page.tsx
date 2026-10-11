'use client';

import { useEffect, useState } from 'react';
import {
  User, Save, CheckCircle2, MapPin, Mail, Github,
  Linkedin, Sparkles, Plus, X, Globe, Award
} from 'lucide-react';
import { ProfileData } from '@/lib/adminData';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({
    name: 'Ajay A',
    title: 'Full-Stack Developer & AI Systems Engineer',
    tagline: 'Building high-impact web products from the interface to the API, from Bengaluru.',
    bio: 'MCA graduate who ships React and Next.js applications, wires them to scalable APIs, and engineers AI-powered features. HackVerse 2025 winner. Intern at BrikUp.',
    location: 'Bengaluru, Karnataka, India',
    availability: 'Available for full-time roles, contracts & freelance projects',
    email: 'ajayhasrb123@gmail.com',
    github: 'https://github.com/ajay9889-ai',
    linkedin: 'https://linkedin.com/in/ajay-a',
    stats: [
      { label: 'MCA CGPA', value: '8.5' },
      { label: 'Projects Built', value: '3+' },
      { label: 'Hackathon Win', value: '1st 🏆' },
      { label: 'Available', value: 'Now' },
    ],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/profile');
      const data = await res.json();
      if (data.success && data.data) {
        setProfile(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleStatChange = (index: number, field: 'label' | 'value', val: string) => {
    const updated = [...profile.stats];
    updated[index][field] = val;
    setProfile({ ...profile, stats: updated });
  };

  const addStatRow = () => {
    setProfile({
      ...profile,
      stats: [...profile.stats, { label: '', value: '' }],
    });
  };

  const removeStatRow = (index: number) => {
    if (profile.stats.length === 1) return;
    setProfile({
      ...profile,
      stats: profile.stats.filter((_, i) => i !== index),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    try {
      const cleanStats = profile.stats.filter((s) => s.label.trim() && s.value.trim());
      const updatedProfile = { ...profile, stats: cleanStats };

      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile),
      });

      if (res.ok) {
        showNotification('Profile saved successfully!');
        setProfile(updatedProfile);
      } else {
        alert('Failed to save profile.');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-neutral-400 bg-[#111116] rounded-2xl border border-white/[0.08]">
        Loading profile data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#111116] border border-[#FF7A00]/40 text-white shadow-2xl flex items-center gap-2 font-mono text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#FF7A00]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Profile Configuration
            </h1>
            <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
              <User className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Personal details, bio, contact handles, and portfolio metrics.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-[#FF5500] to-[#FF7A00] hover:from-[#ff661a] hover:to-[#ff8a1a] text-white shadow-lg shadow-[#FF7A00]/20 transition-all disabled:opacity-50 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </div>

      {/* Two Column Grid: Form (2 cols) & Live Preview (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Container */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          {/* Identity & Headline */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#111116] border border-white/[0.08] space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF7A00]" />
              Basic Identity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                  className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  Primary Professional Role *
                </label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  required
                  className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                Hero Tagline
              </label>
              <input
                type="text"
                value={profile.tagline}
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                Detailed Biography
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all leading-relaxed"
              />
            </div>
          </div>

          {/* Location & Status */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#111116] border border-white/[0.08] space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Location & Availability
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  Availability Status
                </label>
                <input
                  type="text"
                  value={profile.availability}
                  onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                  className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Social Links & Contact */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#111116] border border-white/[0.08] space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              Social Handles & Links
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  Public Contact Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={profile.github}
                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={profile.linkedin}
                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    className="w-full bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Metric Pairs */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#111116] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" />
                Featured Metrics & Highlights
              </h2>
              <button
                type="button"
                onClick={addStatRow}
                className="text-xs text-[#FF7A00] hover:text-[#ff8a1a] font-mono"
              >
                + Add Metric
              </button>
            </div>

            <div className="space-y-2">
              {profile.stats.map((s, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={s.label}
                    onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                    placeholder="Metric Label (e.g. MCA CGPA)"
                    className="flex-1 bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2 text-xs text-white outline-none transition-all"
                  />
                  <input
                    type="text"
                    value={s.value}
                    onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    placeholder="Metric Value (e.g. 8.5)"
                    className="flex-1 bg-black/40 border border-white/[0.1] focus:border-[#FF7A00] rounded-xl px-3.5 py-2 text-xs text-white outline-none transition-all font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => removeStatRow(idx)}
                    disabled={profile.stats.length === 1}
                    className="p-2 text-neutral-400 hover:text-red-400 disabled:opacity-20 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Live Preview Sidebar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
              Live Preview
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Dynamic
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#111116] border border-white/[0.08] space-y-5 sticky top-24 shadow-xl">
            {/* Avatar & Name */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF5500] to-[#FF7A00] flex items-center justify-center text-lg font-black text-white shadow-lg shadow-[#FF7A00]/25">
                {profile.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{profile.name}</h3>
                <p className="text-xs text-[#FF7A00] font-medium">{profile.title}</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {profile.tagline}
            </p>

            <div className="space-y-1.5 text-xs text-neutral-400 pt-1 border-t border-white/[0.05]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="truncate">{profile.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="truncate">{profile.email}</span>
              </div>
            </div>

            {/* Availability Pill */}
            <div className="p-2.5 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/25 text-[11px] text-[#FF7A00] font-medium flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF7A00] shrink-0 mt-1" />
              <span>{profile.availability}</span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/[0.05]">
              {profile.stats.map((s, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-white/[0.04] text-center">
                  <p className="text-xs font-bold text-white">{s.value}</p>
                  <p className="text-[10px] text-neutral-400 uppercase font-mono mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Social Icons */}
            <div className="flex items-center justify-center gap-4 pt-2 border-t border-white/[0.05]">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-neutral-400 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-neutral-400 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
