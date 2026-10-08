import React from 'react';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { PROFILE } from '@/data/portfolioData';

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex flex-col justify-between pt-24 pb-16 px-6 sm:px-8 max-w-6xl mx-auto">
      <div className="max-w-4xl pt-8 sm:pt-16">
        <div className="overflow-hidden mb-6">
          <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-medium tracking-tighter text-text leading-[0.95]">
            Full-stack
            <br />
            developer.
          </h1>
        </div>

        <p className="text-lg sm:text-2xl text-text-muted font-light max-w-2xl leading-relaxed mt-8">
          {PROFILE.subtext}
        </p>

        <div className="mt-10 flex items-center gap-6">
          <Link
            href="#work"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-border text-text hover:border-accent hover:text-accent text-sm transition-colors duration-200"
          >
            view selected work
          </Link>
          <Link
            href="#contact"
            className="text-sm text-text-muted hover:text-accent transition-colors"
          >
            get in touch →
          </Link>
        </div>
      </div>

      <div className="pt-16 flex items-center justify-between text-xs text-text-muted font-mono">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent inline-block animate-pulse" />
          Bengaluru, India (UTC+05:30)
        </span>

        <Link
          href="#about"
          className="flex items-center gap-2 hover:text-accent transition-colors"
        >
          <span>scroll</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
