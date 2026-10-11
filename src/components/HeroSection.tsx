'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { PROFILE } from '@/data/portfolioData';
import { HeroPortrait } from './HeroPortrait';

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col justify-between px-6 sm:px-10 max-w-7xl mx-auto py-3 sm:py-5 overflow-hidden">
      {/* Top Status & Persona Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-muted pt-1 hairline-b pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-ink font-medium">Ajay A</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">Available for Freelancing</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">Bengaluru, India</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted/70 hidden md:inline">Path:</span>
          <button
            onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-2.5 py-0.5 rounded-full border border-line hover:border-accent hover:text-accent transition-colors"
          >
            I'm hiring
          </button>
          <button
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-2.5 py-0.5 rounded-full border border-line hover:border-accent hover:text-accent transition-colors"
          >
            I'm a developer
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-2.5 py-0.5 rounded-full border border-line hover:border-accent hover:text-accent transition-colors"
          >
            I have a project
          </button>
        </div>
      </div>

      {/* Main Hero: Image TOP -> Text BOTTOM */}
      <div className="flex flex-col items-center text-center my-auto py-2 sm:py-3 w-full">
        {/* 1. TOP: Enlarged Portrait (Cropped at bottom to fit the screen) */}
        <div className="w-full flex justify-center mb-2 sm:mb-4">
          <HeroPortrait />
        </div>

        {/* 2. BOTTOM: Status Badge, Name, Title, Subtext & Action Buttons */}
        <div className="space-y-2.5 sm:space-y-3.5 flex flex-col items-center max-w-3xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Available for Freelancing &amp; Projects</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] text-ink leading-[0.92]">
            Ajay A
          </h1>

          <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-accent font-medium">
            Full-Stack Developer &bull; AI Systems
          </p>

          <p className="text-sm sm:text-base md:text-lg text-muted font-normal max-w-xl leading-relaxed">
            {PROFILE.subtext}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
            <Link
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-accent text-white font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            >
              Let's talk
            </Link>
            <Link
              href="#work"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink transition-colors px-4 py-2"
            >
              <span>view selected work</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Hero Bar: Scroll Hint */}
      <div className="flex items-center justify-between text-xs text-muted font-mono hairline-t pt-3">
        <span className="text-[11px] text-muted/60">
          Move cursor over portrait to reveal color
        </span>

        <Link
          href="#about"
          className="flex items-center gap-2 hover:text-accent transition-colors"
        >
          <span>scroll to explore</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
