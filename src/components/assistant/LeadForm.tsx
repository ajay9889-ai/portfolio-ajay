'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Send,
  Copy,
  Check,
  Mail,
  ExternalLink,
  User,
  ArrowRight,
  Edit3,
  Loader2,
  Sparkles,
  X,
} from 'lucide-react';
import { useAssistantContext } from '@/context/AssistantContext';
import type { LeadDraft } from '@/hooks/useAssistant';

interface LeadFormProps {
  initialDraft?: Partial<LeadDraft>;
  onComplete?: () => void;
  className?: string;
}

export const LeadForm: React.FC<LeadFormProps> = ({ initialDraft = {}, onComplete, className = '' }) => {
  const { sessionId, speak, contactsSentThisSession, updateLeadDraft, leadDraft, clearLeadDraft, hideLeadForm } = useAssistantContext();

  const [name, setName] = useState(initialDraft.name || leadDraft.name || '');
  const [email, setEmail] = useState(initialDraft.email || leadDraft.email || '');
  const [message, setMessage] = useState(initialDraft.message || leadDraft.message || '');
  const [company, setCompany] = useState(initialDraft.company || leadDraft.company || '');
  const [purpose, setPurpose] = useState<'hiring' | 'freelance' | 'collaboration' | 'other'>(
    initialDraft.purpose || leadDraft.purpose || 'hiring'
  );
  const [websiteHoneypot, setWebsiteHoneypot] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState<'message' | 'details' | 'confirm'>(
    (initialDraft.message || leadDraft.message) ? ((initialDraft.email || leadDraft.email) ? 'confirm' : 'details') : 'message'
  );

  const lastContextStepRef = useRef<string | undefined>(undefined);

  // Sync only on external step transitions from voice or chat action
  useEffect(() => {
    if (!leadDraft.step || leadDraft.step === lastContextStepRef.current) return;
    lastContextStepRef.current = leadDraft.step;

    if (leadDraft.step === 'awaiting_message') {
      setActiveStep('message');
    } else if (leadDraft.step === 'awaiting_details') {
      if (leadDraft.message && !message) setMessage(leadDraft.message);
      setActiveStep('details');
    } else if (leadDraft.step === 'confirm') {
      if (leadDraft.message && !message) setMessage(leadDraft.message);
      if (leadDraft.email && !email) setEmail(leadDraft.email);
      if (leadDraft.name && !name) setName(leadDraft.name);
      setActiveStep('confirm');
    } else if (leadDraft.step === 'sent') {
      setIsSuccess(true);
    }
  }, [leadDraft.step]);

  // Session limit check
  if (contactsSentThisSession >= 2 && !isSuccess) {
    return (
      <div className="p-4 rounded-2xl backdrop-blur-xl bg-amber-500/10 border border-amber-500/20 text-xs text-neutral-800 dark:text-neutral-200 shadow-lg">
        <p className="font-semibold text-amber-600 dark:text-amber-400 mb-1">Session Limit Reached</p>
        <p>
          You&apos;ve sent 2 messages this session. Ajay has received them! You can also email directly at{' '}
          <a href="mailto:ajayhasrb123@gmail.com" className="text-[var(--color-accent,#FF7A00)] underline font-medium">
            ajayhasrb123@gmail.com
          </a>.
        </p>
      </div>
    );
  }

  const handleMessageChange = (val: string) => {
    setMessage(val);
    updateLeadDraft({ message: val });
  };

  const handleNameChange = (val: string) => {
    setName(val);
    updateLeadDraft({ name: val });
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    updateLeadDraft({ email: val });
  };

  const handleCompanyChange = (val: string) => {
    setCompany(val);
    updateLeadDraft({ company: val });
  };

  const handlePurposeChange = (val: 'hiring' | 'freelance' | 'collaboration' | 'other') => {
    setPurpose(val);
    updateLeadDraft({ purpose: val });
  };

  const handleMessageNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || message.trim().length < 5) {
      setValidationError('Please enter what you would like to send to Ajay (at least 5 characters).');
      return;
    }
    setValidationError(null);
    updateLeadDraft({ message: message.trim() });
    speak("Got your message. Please provide your email address and name so Ajay can reply to you.");
    if (email.trim() && name.trim()) {
      setActiveStep('confirm');
    } else {
      setActiveStep('details');
    }
  };

  const handleDetailsNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      setValidationError('Please enter your name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setValidationError('Please enter a valid email address so Ajay can reply.');
      return;
    }
    setValidationError(null);
    updateLeadDraft({ name: name.trim(), email: email.trim(), company: company.trim() || undefined, purpose });
    setActiveStep('confirm');
  };

  const handleSend = async () => {
    setIsSending(true);
    setValidationError(null);

    const endpoints = [
      '/api/contact', // Next.js native API route
      process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/contact` : null,
      'http://localhost:5001/api/v1/contact',
    ].filter(Boolean) as string[];

    let success = false;
    let errorMsg = '';

    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Session-Id': sessionId,
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            company: company.trim() || undefined,
            purpose,
            website: websiteHoneypot, // Honeypot
            sessionId,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.ok || data.success) {
            success = true;
            break;
          }
        }
      } catch (err: any) {
        errorMsg = err?.message || '';
        continue;
      }
    }

    setIsSending(false);

    if (success) {
      setIsSuccess(true);
      speak(`Done! Ajay has received your message and will reply to ${email.trim()} within 24 hours.`);
      onComplete?.();
    } else {
      setValidationError(errorMsg || 'Failed to deliver message. Your draft is saved below — you can email Ajay directly.');
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(`From: ${name} (${email})\nPurpose: ${purpose}\n\n${message}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Success State ──────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className={`p-4 rounded-2xl backdrop-blur-2xl bg-emerald-500/15 border border-emerald-500/30 text-neutral-900 dark:text-neutral-100 text-xs space-y-2.5 shadow-[0_8px_32px_0_rgba(16,185,129,0.2)] ${className}`}>
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Message Delivered to Ajay!</span>
        </div>
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
          Thank you, <strong className="text-neutral-900 dark:text-white">{name}</strong>. An email notification has been delivered directly to Ajay. He will review your message and reply to{' '}
          <strong className="text-neutral-900 dark:text-white">{email}</strong> within 24 hours.
        </p>
      </div>
    );
  }

  // ── Main Glassmorphism Form Container ─────────────────────────────────────
  return (
    <div
      className={`p-4 rounded-2xl backdrop-blur-2xl bg-white/70 dark:bg-white/[0.06] border border-white/50 dark:border-white/10 text-xs space-y-3.5 shadow-[0_12px_40px_0_rgba(0,0,0,0.18),inset_0_1px_1px_rgba(255,255,255,0.3)] transition-all ${className}`}
    >
      {/* Header with step pill */}
      <div className="flex items-center justify-between pb-1 border-b border-white/30 dark:border-white/10">
        <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent,#FF7A00)]" />
          Send Ajay a Message
        </span>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
            <button
              type="button"
              onClick={() => {
                setValidationError(null);
                setActiveStep('message');
              }}
              className={`px-1.5 py-0.5 rounded transition-colors ${activeStep === 'message' ? 'bg-[var(--color-accent,#FF7A00)] text-white font-bold' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10'}`}
            >
              1. Msg
            </button>
            <span>→</span>
            <button
              type="button"
              onClick={() => {
                if (!message.trim() || message.trim().length < 3) {
                  setValidationError('Please type a message first.');
                  setActiveStep('message');
                } else {
                  setValidationError(null);
                  setActiveStep('details');
                }
              }}
              className={`px-1.5 py-0.5 rounded transition-colors ${activeStep === 'details' ? 'bg-[var(--color-accent,#FF7A00)] text-white font-bold' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10'}`}
            >
              2. Info
            </button>
            <span>→</span>
            <button
              type="button"
              onClick={() => {
                if (!message.trim() || message.trim().length < 3) {
                  setValidationError('Please type a message first.');
                  setActiveStep('message');
                } else if (!email.trim() || !name.trim()) {
                  setValidationError('Please enter your email and name.');
                  setActiveStep('details');
                } else {
                  setValidationError(null);
                  setActiveStep('confirm');
                }
              }}
              className={`px-1.5 py-0.5 rounded transition-colors ${activeStep === 'confirm' ? 'bg-[var(--color-accent,#FF7A00)] text-white font-bold' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10'}`}
            >
              3. Send
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              clearLeadDraft();
              hideLeadForm();
            }}
            title="Dismiss draft"
            aria-label="Dismiss draft"
            className="p-1 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {validationError && (
        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="flex-1">{validationError}</span>
        </div>
      )}

      {/* Honeypot field (hidden from users, traps bots) */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={websiteHoneypot}
        onChange={(e) => setWebsiteHoneypot(e.target.value)}
        style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
        aria-hidden="true"
      />

      {/* ── STEP 1: What should I send? ── */}
      {activeStep === 'message' && (
        <form onSubmit={handleMessageNext} className="space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              What message would you like to send to Ajay? *
            </label>
            <textarea
              required
              rows={3}
              maxLength={1000}
              value={message}
              onChange={(e) => handleMessageChange(e.target.value)}
              placeholder="e.g. Hi Ajay, I loved your ElderNest project and would like to discuss a software engineering opportunity..."
              className="w-full px-3 py-2 rounded-xl backdrop-blur-md bg-white/70 dark:bg-black/40 border border-white/60 dark:border-white/10 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent,#FF7A00)]/60 resize-none leading-relaxed text-xs shadow-inner"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-3 rounded-xl font-medium text-white bg-gradient-to-r from-[var(--color-accent,#FF7A00)] to-[#FF9028] hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20"
          >
            <span>{email.trim() && name.trim() ? 'Save & Review' : 'Next: Enter Email & Name'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      )}

      {/* ── STEP 2: Name & Email details ── */}
      {activeStep === 'details' && (
        <form onSubmit={handleDetailsNext} className="space-y-3">
          {/* Quote of message */}
          <div className="p-2.5 rounded-xl backdrop-blur-md bg-white/50 dark:bg-black/30 border border-white/40 dark:border-white/5 flex items-start justify-between gap-2">
            <div className="line-clamp-2 italic text-[11px] text-neutral-600 dark:text-neutral-300">
              &ldquo;{message}&rdquo;
            </div>
            <button
              type="button"
              onClick={() => setActiveStep('message')}
              className="text-[var(--color-accent,#FF7A00)] hover:underline shrink-0 text-[10px] flex items-center gap-0.5"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Full name"
                className="w-full px-3 py-1.5 rounded-xl backdrop-blur-md bg-white/70 dark:bg-black/40 border border-white/60 dark:border-white/10 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent,#FF7A00)]/60 text-xs shadow-inner"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Your Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-3 py-1.5 rounded-xl backdrop-blur-md bg-white/70 dark:bg-black/40 border border-white/60 dark:border-white/10 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent,#FF7A00)]/60 text-xs shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Company (Optional)
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => handleCompanyChange(e.target.value)}
                placeholder="Company or org"
                className="w-full px-3 py-1.5 rounded-xl backdrop-blur-md bg-white/70 dark:bg-black/40 border border-white/60 dark:border-white/10 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent,#FF7A00)]/60 text-xs shadow-inner"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Purpose
              </label>
              <select
                value={purpose}
                onChange={(e) => handlePurposeChange(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-xl backdrop-blur-md bg-white/70 dark:bg-black/40 border border-white/60 dark:border-white/10 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-accent,#FF7A00)]/60 shadow-inner"
              >
                <option value="hiring">Hiring / Role</option>
                <option value="freelance">Freelance Project</option>
                <option value="collaboration">Collaboration</option>
                <option value="other">General Inquiry</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setActiveStep('message')}
              className="py-2 px-3 rounded-xl backdrop-blur-md bg-white/40 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-white/60 dark:hover:bg-white/15 transition-all text-xs"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-3 rounded-xl font-medium text-white bg-gradient-to-r from-[var(--color-accent,#FF7A00)] to-[#FF9028] hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 text-xs"
            >
              <span>Review & Send</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* ── STEP 3: Confirm & Dispatch ── */}
      {activeStep === 'confirm' && (
        <div className="space-y-3">
          <div className="space-y-2 p-3 rounded-xl backdrop-blur-md bg-white/60 dark:bg-black/40 border border-white/50 dark:border-white/10 text-neutral-800 dark:text-neutral-200 shadow-inner">
            <div className="flex items-center justify-between text-[11px] pb-1 border-b border-white/30 dark:border-white/10">
              <span className="font-semibold text-neutral-900 dark:text-white">Review Message Details</span>
              <span className="px-2 py-0.5 rounded bg-[var(--color-accent,#FF7A00)]/15 text-[var(--color-accent,#FF7A00)] font-medium capitalize">
                {purpose}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 dark:text-neutral-400 font-medium">From:</span> {name} &lt;{email}&gt;
            </div>
            {company && (
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 font-medium">Company:</span> {company}
              </div>
            )}
            <div>
              <span className="text-neutral-500 dark:text-neutral-400 font-medium">Message:</span>
              <p className="mt-1 p-2 rounded-lg bg-black/5 dark:bg-white/5 italic text-[11px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                &ldquo;{message}&rdquo;
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              disabled={isSending}
              onClick={handleSend}
              className="flex-1 py-2.5 px-3 rounded-xl font-medium text-white bg-gradient-to-r from-[var(--color-accent,#FF7A00)] to-[#FF9028] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/25 disabled:opacity-50 text-xs"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending to Ajay...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message to Ajay 🚀</span>
                </>
              )}
            </button>
            <button
              type="button"
              disabled={isSending}
              onClick={() => setActiveStep('message')}
              className="py-2.5 px-2.5 rounded-xl backdrop-blur-md bg-white/40 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-white/60 dark:hover:bg-white/15 transition-all text-xs"
            >
              Edit Msg
            </button>
            <button
              type="button"
              disabled={isSending}
              onClick={() => setActiveStep('details')}
              className="py-2.5 px-2.5 rounded-xl backdrop-blur-md bg-white/40 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-white/60 dark:hover:bg-white/15 transition-all text-xs"
            >
              Edit Details
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 text-[10px] text-neutral-400">
            <span>Direct to Ajay&apos;s verified inbox</span>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="hover:text-neutral-600 dark:hover:text-neutral-200 flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              Copy text
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
