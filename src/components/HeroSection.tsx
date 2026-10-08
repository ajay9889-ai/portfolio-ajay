'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { PROFILE } from '@/data/portfolioData';

const OrbitCanvas = dynamic(
  () => import('./OrbitCanvas').then((mod) => mod.OrbitCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] flex items-center justify-center text-xs font-mono text-muted">
        Initializing 3D Orbit engine...
      </div>
    ),
  }
);

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col justify-between px-6 sm:px-10 max-w-7xl mx-auto py-4 sm:py-8 overflow-hidden">
      {/* Top Status & Persona Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-muted pt-2 hairline-b pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-ink font-medium">Ajay A</span>
          <span>•</span>
          <span>Bengaluru, India (UTC+05:30)</span>
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

      {/* Main Hero Split: Left Editorial Typography + Right 3D Orbit Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center my-auto py-6">
        {/* Left Column: Heading, Subtext, CTAs */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8 z-10">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-accent font-mono block">
              Full-Stack Developer
            </span>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[-0.04em] text-ink leading-[0.92]">
              Full-stack
              <br />
              developer.
            </h1>
          </div>

          <p className="text-lg sm:text-xl text-muted font-normal max-w-xl leading-relaxed">
            {PROFILE.subtext}
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
            <Link
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-accent text-white font-medium text-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
            >
              Let's talk
            </Link>
            <Link
              href="#work"
              className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink transition-colors"
            >
              <span>view selected work</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Column: 3D Living Orbit Object (Right of center, prominent & glowing) */}
        <div className="lg:col-span-5 w-full flex items-center justify-center relative">
          <OrbitCanvas />
        </div>
      </div>

      {/* Bottom Hero Bar: Scroll Hint */}
      <div className="flex items-center justify-between text-xs text-muted font-mono hairline-t pt-4">
        <span className="text-[11px] text-muted/60">
          Living 3D Orbit • Drag to inspect
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
