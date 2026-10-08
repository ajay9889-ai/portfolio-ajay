'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { PROFILE } from '@/data/portfolioData';

export function HeroSection() {
  const letters = ['A', 'j', 'a', 'y', ' ', 'A'];
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [weights, setWeights] = useState<number[]>([700, 700, 700, 700, 400, 700]);
  const containerRef = useRef<HTMLDivElement>(null);

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

        // Distance mapped to font weight 400 - 800
        const maxDist = 300;
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

    // Sine-wave ripple when idle or on mobile
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
    <section className="relative min-h-[90vh] flex flex-col justify-between pt-16 pb-12 px-6 sm:px-10 max-w-7xl mx-auto">
      <div className="pt-8 sm:pt-16">
        {/* Giant Hero Name: ~20vw with interactive font weights */}
        <div ref={containerRef} className="overflow-visible select-none py-4">
          <h1 className="font-display text-[17vw] sm:text-[19vw] leading-[0.88] tracking-[-0.04em] text-ink flex items-baseline">
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

        {/* Tagline & Call-to-actions */}
        <div className="mt-8 sm:mt-12 max-w-2xl">
          <p className="text-xl sm:text-2xl text-muted font-normal leading-snug">
            {PROFILE.subtext}
          </p>

          <div className="mt-8 flex items-center gap-6">
            <Link
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-accent text-white font-medium text-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
            >
              Let's talk
            </Link>
            <Link
              href="#work"
              className="text-sm font-medium text-muted hover:text-ink transition-colors"
            >
              view selected work →
            </Link>
          </div>
        </div>
      </div>

      <div className="pt-16 flex items-center justify-between text-xs text-muted font-mono hairline-t">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent inline-block animate-pulse" />
          Bengaluru, India
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
