"use client";

import React from "react";
import { Project } from "@/types";
import { X, ExternalLink, Github, CheckCircle2, Layers, Cpu, ShieldCheck } from "lucide-react";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="glass-card max-w-2xl w-full rounded-3xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto border border-brand-primary/40 shadow-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-surface-100 hover:bg-surface-50 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category & Title */}
        <div className="mb-4">
          <span className="px-3 py-1 rounded-md bg-brand-primary/20 text-brand-cyan text-xs font-mono font-semibold">
            {project.category}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {project.title}
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-mono">{project.tagline}</p>
        </div>

        {/* Description */}
        <div className="mb-6 text-slate-300 text-sm sm:text-base leading-relaxed">
          <p>{project.description}</p>
        </div>

        {/* Metrics Grid */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-3 tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-emerald" />
              <span>Verified Benchmarks & SLA</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {project.metrics.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-surface-100 border border-surface-border">
                  <div className="text-xs text-slate-400 font-mono">{m.label}</div>
                  <div className="text-lg font-bold text-gradient-brand font-mono mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complete Tech Stack */}
        <div className="mb-8">
          <h4 className="text-xs font-mono uppercase text-slate-400 mb-3 tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-brand-cyan" />
            <span>Technologies & Frameworks</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <span
                key={t}
                className="px-3 py-1.5 rounded-lg bg-surface-100 border border-surface-border text-xs font-mono text-slate-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-border">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-surface-border text-sm font-semibold text-white transition-all"
            >
              <Github className="w-4 h-4" />
              <span>Source Repository</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-cyan text-sm font-bold text-white shadow-glow hover:opacity-95 transition-all"
            >
              <span>Live Application</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
