'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { HeroPortrait } from './HeroPortrait';

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] lg:min-h-screen flex items-center justify-center px-6 sm:px-10 lg:px-14 xl:px-16 max-w-[1440px] mx-auto pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 overflow-hidden">
      {/* 2-Column Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center w-full my-auto">
        {/* Left Column: Heading, Bio & CTAs */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-4 sm:space-y-6 lg:space-y-7 z-10">
          {/* 1. Availability Status Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-500/35 bg-emerald-950/40 text-emerald-400 text-xs sm:text-sm font-mono shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Available for Freelancing &amp; Projects</span>
          </div>

          {/* 2. Role Tracker */}
          <span className="text-xs sm:text-sm uppercase tracking-[0.2em] text-muted/80 font-mono block">
            FULL-STACK DEVELOPER &bull; AI SYSTEMS
          </span>

          {/* 3. Main Headline */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-extrabold tracking-[-0.035em] text-ink leading-[1.02]">
            Hi, I&apos;m{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-indigo-400 to-purple-300">
              Ajay A
            </span>
          </h1>

          {/* 4. Subtext / Bio */}
          <p className="text-lg sm:text-xl lg:text-2xl text-muted/90 font-normal max-w-xl xl:max-w-2xl leading-relaxed">
            I build web products from the interface to the API, and work on AI-powered solutions.
          </p>

          {/* 5. Location Tag */}
          <div className="flex items-center gap-2.5 text-sm sm:text-base font-mono text-muted/80 pt-0.5">
            <MapPin className="w-4 h-4 text-accent shrink-0" />
            <span>Bengaluru, India</span>
          </div>

          {/* 6. Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-5 pt-2 sm:pt-3">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-accent hover:bg-accent/90 text-white font-medium text-sm sm:text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 shadow-accent/25"
            >
              <span>Let&apos;s talk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#work"
              className="inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full border border-line hover:border-ink/40 bg-bg/40 backdrop-blur-sm text-ink font-medium text-sm sm:text-base transition-all duration-200 hover:-translate-y-0.5"
            >
              <span>View my work</span>
              <ArrowUpRight className="w-4 h-4 opacity-70" />
            </Link>
          </div>
        </div>

        {/* Right Column: Cosmic Orb + Portrait + Signature + Bullets */}
        <div className="lg:col-span-5 xl:col-span-5 w-full flex items-center justify-center relative">
          <HeroPortrait />
        </div>
      </div>
    </section>
  );
}
