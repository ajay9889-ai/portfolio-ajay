'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { HeroPortrait } from './HeroPortrait';

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[calc(100vh-3.5rem)] lg:min-h-screen flex items-center justify-center px-4 xs:px-6 sm:px-10 lg:px-14 xl:px-16 max-w-[1440px] mx-auto pt-20 sm:pt-28 lg:pt-32 pb-8 sm:pb-16 overflow-hidden">
      {/* 2-Column Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-14 xl:gap-16 items-center w-full my-auto">
        {/* Left Column: Heading, Bio & CTAs */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-3.5 sm:space-y-6 lg:space-y-7 z-10 text-left">

          {/* 2. Role Tracker */}
          <span className="text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.2em] text-muted/80 font-mono block">
            FULL-STACK DEVELOPER &bull; AI SYSTEMS
          </span>

          {/* 3. Main Headline */}
          <h1 className="font-display text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-extrabold tracking-[-0.035em] text-ink leading-[1.04] break-words">
            Hi, I&apos;m{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-amber-400 to-orange-400">
              Ajay A
            </span>
          </h1>

          {/* 4. Subtext / Bio */}
          <p className="text-sm sm:text-lg lg:text-xl text-muted/90 font-normal max-w-xl xl:max-w-2xl leading-relaxed">
            I build web products from the interface to the API, and work on AI-powered solutions.
          </p>

          {/* 5. Location Tag */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-muted/80 pt-0.5">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
            <span>Bengaluru, India</span>
          </div>

          {/* 6. Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-3">
            <Link
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-full bg-accent hover:bg-accent/90 text-white font-medium text-xs sm:text-sm md:text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 shadow-accent/25"
            >
              <span>Let&apos;s talk</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
            <Link
              href="#work"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-full border border-line hover:border-ink/40 bg-bg/40 backdrop-blur-sm text-ink font-medium text-xs sm:text-sm md:text-base transition-all duration-200 hover:-translate-y-0.5"
            >
              <span>View my work</span>
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70" />
            </Link>
          </div>
        </div>

        {/* Right Column: Cosmic Orb + Portrait + Signature + Bullets */}
        <div className="lg:col-span-5 xl:col-span-5 w-full flex items-center justify-center relative mt-2 lg:mt-0">
          <HeroPortrait />
        </div>
      </div>
    </section>
  );
}
