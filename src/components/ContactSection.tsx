'use client';

import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle, AlertCircle, Send, Copy, Check, Sparkles } from 'lucide-react';
import { PROFILE } from '@/data/portfolioData';

export function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

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
    <section id="contact" className="py-28 sm:py-36 px-6 sm:px-10 max-w-7xl mx-auto hairline-b">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-16 items-start">
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-muted font-mono block mb-3">
              contact
            </span>
            <h2 className="font-display text-5xl sm:text-7xl font-bold tracking-[-0.04em] text-ink leading-[0.9]">
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

            <div className="pt-2 flex items-center gap-6">
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
            </div>
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
    </section>
  );
}
