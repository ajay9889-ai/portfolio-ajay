'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowUpRight, 
  ExternalLink, 
  Github, 
  Globe, 
  Sparkles, 
  Lock, 
  Check, 
  Copy, 
  Layers,
  Activity,
  Maximize2
} from 'lucide-react';
import { LIVE_PROJECTS } from '@/data/portfolioData';
import { ProjectReactions } from '@/components/ProjectReactions';

export function LiveProjectsSection() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (id: string, url?: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="live-projects" className="py-16 sm:py-24 px-6 sm:px-10 max-w-7xl mx-auto hairline-b relative">
      {/* Background ambient decorative glow */}
      <div 
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-accent/10 via-emerald-500/5 to-transparent blur-[120px] pointer-events-none rounded-full" 
      />

      {/* Section Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="tracking-wide uppercase text-[11px]">Production Deployments</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-[-0.04em] text-ink">
            Live Projects.
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-muted max-w-md leading-relaxed">
          Interactive full-stack applications and hardware bridges actively deployed in the cloud. Launch live demos directly in your browser or explore case studies.
        </p>
      </div>

      {/* Live Projects Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {LIVE_PROJECTS.map((project) => (
          <div
            key={project.id}
            className="group relative flex flex-col rounded-3xl backdrop-blur-2xl bg-white/70 dark:bg-[#121218]/80 border border-white/60 dark:border-white/10 shadow-[0_12px_40px_0_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[0_12px_40px_0_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-accent/50 dark:hover:border-accent/40 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-400 overflow-hidden"
          >
            {/* Top Browser Chrome Bar */}
            <div className="px-4 py-2.5 bg-black/[0.03] dark:bg-white/[0.03] border-b border-black/[0.05] dark:border-white/[0.05] flex items-center justify-between gap-2">
              {/* macOS Dots */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>

              {/* Simulated Address Pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-black/30 border border-black/[0.06] dark:border-white/5 text-[10px] font-mono text-muted truncate max-w-[170px] sm:max-w-[200px]">
                <Lock className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                <span className="truncate">{project.displayUrl || 'https://live-app.vercel.app'}</span>
              </div>

              {/* Copy URL Button */}
              {project.liveUrl && (
                <button
                  type="button"
                  onClick={() => handleCopyLink(project.id, project.liveUrl)}
                  title="Copy live URL"
                  className="p-1 rounded-md text-muted hover:text-ink hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
                >
                  {copiedId === project.id ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>

            {/* Card Hero Banner */}
            <div className={`relative p-6 pt-5 bg-gradient-to-br ${project.gradient} border-b border-black/[0.04] dark:border-white/[0.04] flex flex-col justify-between min-h-[140px]`}>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-muted">
                      {project.category}
                    </span>
                    {project.status === 'live' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        LIVE
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-ink group-hover:text-accent transition-colors duration-300">
                    {project.title}
                  </h3>
                </div>

                {project.badge && (
                  <span className="px-2.5 py-1 text-[11px] font-mono rounded-xl bg-accent/15 text-accent border border-accent/30 font-medium shrink-0 shadow-sm">
                    {project.badge}
                  </span>
                )}
              </div>

              {/* Featured Metric Chip */}
              {project.featuredMetric && (
                <div className="mt-4 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[11px] font-mono text-muted w-fit">
                  <Activity className="w-3 h-3 text-accent" />
                  <span>
                    <strong className="text-ink font-semibold">{project.featuredMetric.value}</strong> ({project.featuredMetric.label})
                  </span>
                </div>
              )}
            </div>

            {/* Body Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-muted leading-relaxed line-clamp-3">
                  {project.tagline}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/5 text-muted hover:text-ink transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="space-y-3 pt-3 border-t border-black/[0.05] dark:border-white/[0.05]">
                {/* Live reactions strip */}
                <div className="flex items-center justify-between text-xs font-mono text-muted">
                  <span className="text-[11px]">Reactions</span>
                  <ProjectReactions slug={project.slug} compact />
                </div>

                {/* Direct CTA Buttons */}
                <div className="flex items-center gap-2">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3.5 rounded-xl text-xs font-medium text-white bg-gradient-to-r from-accent to-[#FF9028] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 group/btn"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Launch Live App</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </a>
                  ) : (
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex-1 py-2.5 px-3.5 rounded-xl text-xs font-medium text-muted bg-black/5 dark:bg-white/5 hover:text-ink hover:bg-black/10 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Explore Case Study</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  <Link
                    href={`/projects/${project.slug}`}
                    title="View Detailed Case Study"
                    className="p-2.5 rounded-xl border border-line/80 dark:border-white/10 hover:border-accent hover:text-accent text-muted transition-all flex items-center justify-center"
                  >
                    <Layers className="w-4 h-4" />
                  </Link>

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View GitHub Repository"
                      className="p-2.5 rounded-xl border border-line/80 dark:border-white/10 hover:border-accent hover:text-accent text-muted transition-all flex items-center justify-center"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
