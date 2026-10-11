'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { HeroPortrait } from './HeroPortrait';

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[calc(100vh-5rem)] flex items-center px-6 sm:px-10 max-w-7xl mx-auto py-6 sm:py-10 overflow-hidden">
      {/* 2-Column Editorial Grid matching screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">
        {/* Left Column: Heading, Bio & CTAs */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-7 z-10">
          {/* 1. Availability Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/35 bg-emerald-950/40 text-emerald-400 text-xs font-mono shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Available for Freelancing &amp; Projects</span>
          </div>

          {/* 2. Role Tracker */}
          <span className="text-xs uppercase tracking-widest text-muted/80 font-mono block">
            FULL-STACK DEVELOPER &bull; AI SYSTEMS
          </span>

          {/* 3. Main Headline */}
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[-0.03em] text-ink leading-[1.02]">
            Hi, I&apos;m{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-indigo-400 to-purple-300">
              Ajay A
            </span>
          </h1>

          {/* 4. Subtext / Bio */}
          <p className="text-lg sm:text-xl text-muted/90 font-normal max-w-xl leading-relaxed">
            I build web products from the interface to the API, and work on AI-powered solutions.
          </p>

          {/* 5. Location Tag */}
          <div className="flex items-center gap-2 text-sm font-mono text-muted/80 pt-1">
            <MapPin className="w-4 h-4 text-accent shrink-0" />
            <span>Bengaluru, India</span>
          </div>

          {/* 6. Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent hover:bg-accent/90 text-white font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 shadow-accent/20"
            >
              <span>Let&apos;s talk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#work"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-line hover:border-ink/40 bg-bg/40 backdrop-blur-sm text-ink font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
            >
              <span>View my work</span>
              <ArrowUpRight className="w-4 h-4 opacity-70" />
            </Link>
          </div>
        </div>

        {/* Right Column: Cosmic Orb + Portrait + Signature + Bullets */}
        <div className="lg:col-span-5 w-full flex items-center justify-center relative">
          <HeroPortrait />
        </div>
      </div>
    </section>
  );
}
