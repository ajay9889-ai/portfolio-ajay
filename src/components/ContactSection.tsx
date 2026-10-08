'use client';

import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle, AlertCircle } from 'lucide-react';
import { PROFILE } from '@/data/portfolioData';

export function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setErrorMessage('Please fill in all fields before sending.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';
      const res = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to deliver message.');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Server currently offline. Please reach out via email directly.');
    }
  };

  return (
    <section id="contact" className="py-28 sm:py-36 px-6 sm:px-10 max-w-7xl mx-auto hairline-b">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-start">
        <div className="lg:col-span-5 space-y-6">
          <span className="text-xs uppercase tracking-widest text-muted font-mono block">
            contact
          </span>
          <h2 className="font-display text-5xl sm:text-7xl font-bold tracking-[-0.04em] text-ink leading-[0.9]">
            Let's talk.
          </h2>
          <p className="text-muted text-base leading-relaxed max-w-md">
            I am always open to discussing new web architectures, challenging product engineering roles, or interesting hackathon ideas.
          </p>

          <div className="pt-6 space-y-3 text-sm">
            <div>
              <span className="text-xs font-mono text-muted block">Direct email</span>
              <a
                href={`mailto:${PROFILE.email}`}
                className="font-mono text-ink hover:text-accent transition-colors"
              >
                {PROFILE.email}
              </a>
            </div>

            <div className="pt-4 flex items-center gap-6">
              <a
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent transition-colors"
              >
                <span>GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={PROFILE.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent transition-colors"
              >
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <label htmlFor="name" className="block text-xs font-mono text-muted mb-2">
                Your name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jane Doe"
                className="w-full bg-transparent border-b border-line py-3 text-ink placeholder-muted/40 focus:border-accent focus:outline-none transition-colors"
                disabled={status === 'submitting'}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-mono text-muted mb-2">
                Your email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jane@example.com"
                className="w-full bg-transparent border-b border-line py-3 text-ink placeholder-muted/40 focus:border-accent focus:outline-none transition-colors"
                disabled={status === 'submitting'}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-mono text-muted mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me about your product or team..."
                className="w-full bg-transparent border-b border-line py-3 text-ink placeholder-muted/40 focus:border-accent focus:outline-none transition-colors resize-none"
                disabled={status === 'submitting'}
              />
            </div>

            {status === 'success' && (
              <div className="p-4 rounded border border-accent/40 bg-accent/5 text-accent text-sm flex items-center gap-3">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Message sent! Thank you for reaching out.</span>
              </div>
            )}

            {status === 'error' && (
              <div className="p-4 rounded border border-red-500/30 bg-red-500/5 text-red-500 text-sm flex items-center gap-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="px-8 py-3.5 rounded-full bg-accent text-white font-medium text-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg disabled:opacity-50"
              >
                {status === 'submitting' ? 'sending...' : 'Send message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
