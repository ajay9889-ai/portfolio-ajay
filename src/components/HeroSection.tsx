'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowDown, Sparkles } from 'lucide-react';
import { PROFILE } from '@/data/portfolioData';

const OrbitCanvas = dynamic(
  () => import('./OrbitCanvas').then((mod) => mod.OrbitCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center text-xs font-mono text-muted">
        Loading 3D engine...
      </div>
    ),
  }
);

export function HeroSection() {
  const letters = ['A', 'j', 'a', 'y', ' ', 'A'];
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [weights, setWeights] = useState<number[]>([700, 700, 700, 700, 400, 700]);

  useEffect(() => {
    let animId: number;
    let isIdle = true;
    let idleTimer: NodeJS.Timeout;

    const onMouseMove = (e: MouseEvent) => {
      isIdle = false;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isIdle = true;
      }, 2500);

      letterRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2;
        const letterCenterY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - letterCenterX, e.clientY - letterCenterY);

        const maxDist = 280;
        const normalized = Math.max(0, 1 - dist / maxDist);
        const targetWeight = Math.round(400 + normalized * 400);

        setWeights((prev) => {
          const next = [...prev];
          next[index] = targetWeight;
          return next;
        });
      });
    };

    window.addEventListener('mousemove', onMouseMove);

    let phase = 0;
    const rippleLoop = () => {
      if (isIdle) {
        phase += 0.05;
        setWeights(
          letters.map((_, i) => {
            const w = 550 + Math.sin(phase + i * 0.8) * 200;
            return Math.round(Math.min(800, Math.max(400, w)));
          })
        );
      }
      animId = requestAnimationFrame(rippleLoop);
    };

    animId = requestAnimationFrame(rippleLoop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
      clearTimeout(idleTimer);
    };
  }, []);

  return (
    <section className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col justify-between px-6 sm:px-10 max-w-7xl mx-auto py-6 sm:py-8 overflow-hidden">
      {/* Top Banner Badge */}
      <div className="flex items-center justify-between text-xs font-mono text-muted pt-2">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Bengaluru, India (UTC+05:30) • Available</span>
        </span>
        <span className="hidden sm:inline-block text-[11px] text-muted/70">
          Scroll-linked 3D Orbit
        </span>
      </div>

      {/* Main Hero Body: Left Typography + Right 3D Orbit Object */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center my-auto py-4">
        {/* Left Column: Headline, Tagline, CTAs */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8 z-10">
          {/* Giant Name with Responsive Clamp: Never overflows screen */}
          <div className="select-none overflow-visible">
            <h1 className="font-display text-[clamp(3.8rem,9.5vw,9.5rem)] leading-[0.88] tracking-[-0.04em] text-ink flex items-baseline">
              {letters.map((char, idx) => (
                <span
                  key={idx}
                  ref={(el) => { letterRefs.current[idx] = el; }}
                  style={{ fontWeight: weights[idx] || 700 }}
                  className="transition-[font-weight] duration-75 inline-block"
                >
                  {char === ' ' ? ' ' : char}
                </span>
              ))}
            </h1>
          </div>

          <p className="text-lg sm:text-2xl text-muted font-normal max-w-xl leading-snug">
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
              className="inline-flex items-center text-sm font-medium text-muted hover:text-ink transition-colors"
            >
              view selected work →
            </Link>
          </div>
        </div>

        {/* Right Column: 3D Living Orbit Object (Right of center) */}
        <div className="lg:col-span-5 h-[320px] sm:h-[400px] lg:h-[480px] w-full flex items-center justify-center relative">
          <OrbitCanvas />
        </div>
      </div>

      {/* Bottom Hero Bar: Scroll Hint */}
      <div className="flex items-center justify-between text-xs text-muted font-mono hairline-t pt-4">
        <span className="text-[11px] text-muted/60">
          Drag 3D object to rotate parallax
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
