'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { HeroPortrait } from './HeroPortrait';

export function HeroSection() {
  return (
    <section className="relative w-full h-[88vh] min-h-[500px] max-h-[720px] flex items-center justify-center px-6 sm:px-10 max-w-6xl mx-auto pt-16 sm:pt-20 pb-4 overflow-hidden">
      {/* 2-Column Editorial Grid matching screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center w-full my-auto">
        {/* Left Column: Heading, Bio & CTAs */}
        <div className="lg:col-span-7 space-y-3 sm:space-y-4 lg:space-y-4.5 z-10">
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
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-[-0.03em] text-ink leading-[1.04]">
            Hi, I&apos;m{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-indigo-400 to-purple-300">
              Ajay A
            </span>
          </h1>

          {/* 4. Subtext / Bio */}
          <p className="text-base sm:text-lg text-muted/90 font-normal max-w-lg leading-relaxed">
            I build web products from the interface to the API, and work on AI-powered solutions.
          </p>

          {/* 5. Location Tag */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-muted/80 pt-0.5">
            <MapPin className="w-4 h-4 text-accent shrink-0" />
            <span>Bengaluru, India</span>
          </div>

          {/* 6. Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1 sm:pt-1.5">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-full bg-accent hover:bg-accent/90 text-white font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 shadow-accent/20"
            >
              <span>Let&apos;s talk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#work"
              className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-full border border-line hover:border-ink/40 bg-bg/40 backdrop-blur-sm text-ink font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
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
