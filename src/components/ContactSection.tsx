"use client";

import React, { useState } from "react";
import { ProfileData } from "@/types";
import { sendContactMessage } from "@/lib/api";
import { Mail, Send, CheckCircle2, AlertCircle, Copy, Check, MessageSquare, Sparkles } from "lucide-react";

interface ContactSectionProps {
  profile: ProfileData;
}

export function ContactSection({ profile }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Project Inquiry",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatusMessage({ type: "error", text: "Please fill out all required fields." });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    const result = await sendContactMessage(formData);
    setLoading(false);

    if (result.success) {
      setStatusMessage({ type: "success", text: result.message });
      setFormData({ name: "", email: "", subject: "Project Inquiry", message: "" });
    } else {
      setStatusMessage({ type: "error", text: result.message });
    }
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="contact" className="py-24 relative bg-background border-t border-surface-border mesh-bg bg-grid-pattern">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-cyan/15 border border-brand-cyan/30 text-cyan-300 text-xs font-mono font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Let's Build Together</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                Get in Touch
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Have an ambitious engineering project, technical role, or consulting opportunity? I'd love to discuss how we can build something exceptional.
              </p>
            </div>

            {/* Email card with quick copy */}
            <div className="glass-card p-6 rounded-2xl border border-surface-border space-y-3">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Direct Inbox</div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-white text-sm sm:text-base font-semibold truncate">
                  {profile.email}
                </span>
                <button
                  onClick={copyEmailToClipboard}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-50 hover:bg-surface-100 text-xs font-mono text-slate-300 hover:text-white border border-surface-border transition-all"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Availability SLA */}
            <div className="p-5 rounded-2xl bg-surface-100/60 border border-surface-border text-sm text-slate-300 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Response Guarantee</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                All inquiries submitted through this form are pushed directly to my Node.js API queue and answered within 24 hours.
              </p>
            </div>
          </div>

          {/* Right Column: Live Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-8 sm:p-10 rounded-3xl border border-brand-primary/30 shadow-glow">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 rounded-xl bg-surface-200 border border-surface-border focus:border-brand-primary focus:outline-none text-white text-sm placeholder:text-slate-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-surface-200 border border-surface-border focus:border-brand-primary focus:outline-none text-white text-sm placeholder:text-slate-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Project Inquiry / Technical Opportunity"
                    className="w-full px-4 py-3 rounded-xl bg-surface-200 border border-surface-border focus:border-brand-primary focus:outline-none text-white text-sm placeholder:text-slate-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                    Message Details *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project, engineering challenge, or timeline..."
                    className="w-full px-4 py-3 rounded-xl bg-surface-200 border border-surface-border focus:border-brand-primary focus:outline-none text-white text-sm placeholder:text-slate-600 transition-colors resize-none"
                  />
                </div>

                {/* Status alert message */}
                {statusMessage && (
                  <div
                    className={`p-4 rounded-xl text-sm flex items-start gap-2.5 ${
                      statusMessage.type === "success"
                        ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-200"
                        : "bg-red-950/80 border border-red-500/40 text-red-200"
                    }`}
                  >
                    {statusMessage.type === "success" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <span>{statusMessage.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-cyan text-white font-bold text-base shadow-glow hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Direct Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
