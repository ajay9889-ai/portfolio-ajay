'use client';

import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle, AlertCircle, Send, Copy, Check, Sparkles, Maximize2, X, ExternalLink } from 'lucide-react';
import { PROFILE } from '@/data/portfolioData';

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);

  const topics = [
    { label: 'Say hello 👋', text: "Hi Ajay, I came across your portfolio and wanted to connect!" },
    { label: 'Discuss a role 💼', text: "Hi Ajay, we have an exciting full-stack engineering role and would love to chat." },
    { label: 'Build a project 🚀', text: "Hi Ajay, I'm working on a web project and would like to collaborate on the architecture." },
  ];

  const handleSelectTopic = (topic: typeof topics[0]) => {
    setActiveTopic(topic.label);
    setFormData((prev) => ({
      ...prev,
      message: topic.text,
    }));
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in your name, email, and message before sending.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to deliver message.');
      }

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Server currently unavailable. Please reach out via email directly.');
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', message: '' });
    setActiveTopic(null);
    setStatus('idle');
  };

  return (
    <section id="contact" className="py-14 sm:py-20 px-6 sm:px-10 max-w-7xl mx-auto hairline-b">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-muted font-mono block mb-2">
              contact
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-[-0.04em] text-ink leading-[0.9]">
              Let's talk.
            </h2>
          </div>

          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-line bg-bg/50 text-xs font-mono text-muted">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Available for engineering roles & projects</span>
          </div>

          <p className="text-muted text-base leading-relaxed max-w-md font-normal">
            I am always open to discussing new web architectures, challenging product engineering roles, or interesting hackathon ideas.
          </p>

          <div className="pt-4 space-y-4">
            <div>
              <span className="text-xs font-mono text-muted block mb-1">Direct email</span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="group flex items-center gap-2 font-mono text-ink text-sm sm:text-base hover:text-accent transition-colors"
                title="Click to copy email address"
              >
                <span>{PROFILE.email}</span>
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                )}
                {copied && <span className="text-xs text-emerald-500 font-mono">Copied!</span>}
              </button>
            </div>

            <div className="pt-2 flex items-center gap-6 flex-wrap">
              <a
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors group"
              >
                <span>GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a
                href={PROFILE.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors group"
              >
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              {PROFILE.instagramUrl && (
                <a
                  href={PROFILE.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors group"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
                  <span>Instagram</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}
            </div>

            {/* Instagram QR Card */}
            {PROFILE.instagramQrCode && (
              <div className="mt-6 p-4 rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-[#121218]/80 border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] flex items-center gap-4 max-w-sm">
                <div 
                  onClick={() => setShowQrModal(true)}
                  className="relative w-20 h-20 rounded-xl overflow-hidden bg-white p-1 shrink-0 border border-black/10 dark:border-white/10 shadow-sm cursor-pointer group/qr"
                  title="Click to view full Instagram QR Code"
                >
                  <img
                    src={PROFILE.instagramQrCode}
                    alt="Instagram QR Code"
                    className="w-full h-full object-contain group-hover/qr:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/qr:opacity-100 flex items-center justify-center transition-opacity text-white">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                    <InstagramIcon className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                    <span>Instagram Profile</span>
                  </div>
                  <p className="text-[11px] font-mono text-muted">
                    {PROFILE.instagramHandle}
                  </p>
                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setShowQrModal(true)}
                      className="text-[11px] font-mono text-accent hover:underline flex items-center gap-0.5"
                    >
                      <span>Scan QR</span>
                      <Maximize2 className="w-2.5 h-2.5" />
                    </button>
                    <span className="text-muted/40">•</span>
                    <a
                      href={PROFILE.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-muted hover:text-ink hover:underline flex items-center gap-0.5"
                    >
                      <span>Open Link</span>
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-7">
          {status === 'success' ? (
            <div className="p-8 sm:p-10 rounded-2xl border border-line bg-bg/70 backdrop-blur-sm space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-12 h-12 rounded-full bg-accent/15 text-accent flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                  Message received!
                </h3>
                <p className="text-muted leading-relaxed text-sm sm:text-base">
                  Thank you, <span className="text-ink font-medium">{formData.name}</span>. Your message was successfully dispatched to my inbox. I typically respond within 24 hours.
                </p>
              </div>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-full border border-line text-xs font-mono text-muted hover:text-ink hover:border-ink transition-colors"
                >
                  Send another message →
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Quick Topic Chips */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-muted block flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-accent" />
                  What are you looking to connect on?
                </span>
                <div className="flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => handleSelectTopic(t)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                        activeTopic === t.label
                          ? 'bg-accent text-white font-medium shadow-sm'
                          : 'border border-line text-muted hover:text-ink hover:border-muted/80 bg-bg/40'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Field */}
              <div className="relative group">
                <label htmlFor="name" className="block text-xs font-mono text-muted mb-1">
                  Your name *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-transparent border-b border-line py-3 text-ink text-base placeholder-muted/30 focus:border-accent focus:outline-none transition-colors"
                  disabled={status === 'submitting'}
                />
              </div>

              {/* Email Field */}
              <div className="relative group">
                <label htmlFor="email" className="block text-xs font-mono text-muted mb-1">
                  Your email *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. sarah@company.com"
                  className="w-full bg-transparent border-b border-line py-3 text-ink text-base placeholder-muted/30 focus:border-accent focus:outline-none transition-colors"
                  disabled={status === 'submitting'}
                />
              </div>

              {/* Message Field */}
              <div className="relative group">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="message" className="block text-xs font-mono text-muted">
                    Message *
                  </label>
                  <span className="text-[11px] font-mono text-muted/60">
                    {formData.message.length}/500
                  </span>
                </div>
                <textarea
                  id="message"
                  required
                  rows={4}
                  maxLength={500}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your product, role details, or ideas..."
                  className="w-full bg-transparent border-b border-line py-3 text-ink text-base placeholder-muted/30 focus:border-accent focus:outline-none transition-colors resize-none leading-relaxed"
                  disabled={status === 'submitting'}
                />
              </div>

              {status === 'error' && (
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-accent text-white font-medium text-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {status === 'submitting' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Transmitting message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send message</span>
                      <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Instagram QR Full-Screen Modal */}
      {showQrModal && PROFILE.instagramQrCode && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowQrModal(false)}
        >
          <div 
            className="relative max-w-sm w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#16161D] border border-black/10 dark:border-white/10 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-ink hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="Close QR Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-500 text-xs font-mono font-medium">
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Instagram QR</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-ink">
                Scan to Connect
              </h3>
              <p className="text-xs font-mono text-muted">
                {PROFILE.instagramHandle}
              </p>
            </div>

            {/* QR Image Frame */}
            <div className="p-3 rounded-2xl bg-white border border-neutral-200 shadow-inner max-w-[260px] mx-auto">
              <img
                src={PROFILE.instagramQrCode}
                alt="Instagram QR Code"
                className="w-full h-auto rounded-xl object-contain mx-auto"
              />
            </div>

            {/* Modal Action CTA */}
            <div className="pt-2">
              <a
                href={PROFILE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl font-medium text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25"
              >
                <span>Open in Instagram</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
