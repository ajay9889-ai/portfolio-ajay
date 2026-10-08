"use client";

import React, { useState } from "react";
import { SkillCategory } from "@/types";
import { Cpu, Layers, Terminal, Database, Cloud, Shield, Sparkles } from "lucide-react";

interface SkillsSectionProps {
  skillCategories: SkillCategory[];
}

export function SkillsSection({ skillCategories }: SkillsSectionProps) {
  const [activeTab, setActiveTab] = useState<number>(0);

  const icons = [Layers, Terminal, Database, Sparkles, Cloud];

  return (
    <section id="skills" className="py-24 relative bg-background border-t border-surface-border mesh-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-secondary/15 border border-brand-secondary/30 text-purple-300 text-xs font-mono font-semibold mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Technical Mastery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Skills & Architecture Matrix
          </h2>
          <p className="text-slate-400 text-base">
            Deep hands-on proficiency across modern frontend engineering, distributed backend systems, AI agents, and cloud infrastructure.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {skillCategories.map((cat, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <button
                key={cat.category}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === idx
                    ? "bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-glow"
                    : "bg-surface-100 text-slate-400 hover:text-white hover:bg-surface-50 border border-surface-border"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.category}</span>
              </button>
            );
          })}
        </div>

        {/* Active Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {skillCategories[activeTab]?.skills.map((skill, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-6 border border-surface-border relative group hover:border-brand-primary/50"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5 font-bold text-white text-base">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan" />
                  <span>{skill.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-brand-cyan">
                  {skill.level}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-surface-300 overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-cyan transition-all duration-1000 ease-out"
                  style={{ width: `${skill.level}%` }}
                />
              </div>

              {skill.highlight && (
                <span className="inline-block text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                  Core Specialization
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
