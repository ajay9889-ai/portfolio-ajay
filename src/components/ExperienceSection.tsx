"use client";

import React from "react";
import { ExperienceItem } from "@/types";
import { Briefcase, Calendar, MapPin, CheckCircle2, ChevronRight } from "lucide-react";

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-24 relative bg-background/60 border-t border-surface-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-emerald/15 border border-brand-emerald/30 text-emerald-300 text-xs font-mono font-semibold mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career Milestones</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Professional Experience
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Track record of designing, scaling, and delivering production systems and AI products.
          </p>
        </div>

        {/* Timeline List */}
        <div className="relative border-l-2 border-brand-primary/30 pl-6 sm:pl-8 ml-4 sm:ml-8 space-y-12">
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="relative group">
              {/* Glowing Dot on timeline */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-brand-primary border-4 border-background shadow-glow group-hover:scale-125 transition-transform" />

              <div className="glass-card rounded-2xl p-6 sm:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-brand-primary transition-colors">
                      {exp.role}
                    </h3>
                    <div className="text-brand-cyan font-semibold text-sm">{exp.company}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Key Achievements Bullet points */}
                <ul className="space-y-2.5 mb-6">
                  {exp.description.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                      <ChevronRight className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-surface-border/60">
                  {exp.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-md bg-surface-100 text-slate-300 text-xs font-mono border border-surface-border/50"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
