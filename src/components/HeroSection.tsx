"use client";

import React from "react";
import { ProfileData } from "@/types";
import { ArrowRight, Download, Sparkles, Terminal, Shield, Zap, CheckCircle2, Github, Mail } from "lucide-react";

interface HeroSectionProps {
  profile: ProfileData;
}

export function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section id="about" className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden mesh-bg bg-grid-pattern">
      {/* Radial Glow Balls in background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow-pulse" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-brand-cyan/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Availability Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-100/90 border border-brand-primary/30 backdrop-blur-md shadow-glow mb-8 animate-float-slow">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-emerald animate-ping" />
          <span className="w-2 h-2 rounded-full bg-brand-emerald -ml-4" />
          <span className="text-xs font-semibold text-slate-200 font-mono tracking-wide">
            {profile.availability}
          </span>
        </div>

        {/* Huge Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
          Building <span className="text-gradient-brand">High-Performance</span> Web Engines & <span className="text-gradient-cyan">AI Platforms</span>
        </h1>

        {/* Subtitle & Tagline */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
          {profile.tagline}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <a
            href="#projects"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-cyan text-white font-bold text-base shadow-glow hover:shadow-glow-cyan hover:scale-105 active:scale-95 transition-all"
          >
            <span>View Featured Projects</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#contact"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-surface-100/80 hover:bg-surface-50 border border-surface-border hover:border-slate-500 text-slate-200 hover:text-white font-semibold text-base backdrop-blur-md transition-all"
          >
            <Mail className="w-4 h-4 text-brand-cyan" />
            <span>Contact Ajay</span>
          </a>

          <a
            href="https://github.com/ajay9889-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-surface-100/80 hover:bg-surface-50 border border-surface-border text-slate-300 hover:text-white transition-all"
            title="GitHub Profile"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>

        {/* Key Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {profile.stats.map((stat, idx) => (
            <div
              key={idx}
              className="glass-card p-5 rounded-2xl text-center relative group"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-gradient-brand mb-1 tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Live Tech Ribbon */}
        <div className="mt-16 pt-10 border-t border-surface-border/60">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-6">
            Core Technology Architecture
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-mono text-slate-400">
            {["Next.js 15 (App Router)", "TypeScript", "React 19", "Node.js API", "FastAPI", "PostgreSQL", "DuckDB", "LangGraph", "Tailwind CSS", "Docker"].map((tech) => (
              <span
                key={tech}
                className="px-3.5 py-1.5 rounded-lg bg-surface-100 border border-surface-border hover:border-brand-primary/40 hover:text-white transition-all"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
