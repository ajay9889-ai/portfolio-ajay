'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

export function HeroPortrait() {
  const [mousePos, setMousePos] = useState({ x: 200, y: 160 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsHovered(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    setMousePos({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    });
    setIsHovered(true);
  }, []);

  // Soft feathered reveal mask that illuminates full color wherever the cursor moves
  const revealMask = `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, black 35%, rgba(0,0,0,0.5) 65%, transparent 100%)`;

  return (
    <div className="relative w-full max-w-[460px] lg:max-w-[490px] mx-auto flex items-center justify-center select-none">
      {/* 1. Behind: Theme-Aware Soft Cosmic Indigo / Violet Orb Backdrop */}
      <div 
        aria-hidden="true"
        className="absolute top-2 sm:top-4 left-4 sm:left-8 w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] lg:w-[320px] lg:h-[320px] rounded-full bg-gradient-to-tr from-indigo-200/50 via-purple-100/40 to-violet-200/30 border border-indigo-200/40 dark:from-[#1E1B4B]/90 dark:via-[#2A2368]/70 dark:to-[#4338CA]/40 dark:border-indigo-500/20 blur-[1px] pointer-events-none transition-colors duration-400"
      />

      {/* 2. Interactive Portrait Layer (100% Transparent Cutout with Cursor Color Reveal) */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchMove={handleTouchMove}
        onTouchStart={() => setIsHovered(true)}
        className="relative z-10 w-[280px] sm:w-[330px] lg:w-[365px] h-[340px] sm:h-[385px] lg:h-[415px] cursor-pointer overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to bottom, black 84%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 84%, transparent 100%)',
        }}
      >
        {/* BASE: Black & White Transparent Portrait (Default state) */}
        <div className="absolute inset-0 w-full h-full flex items-end justify-center pointer-events-none">
          <Image
            src="/ajay-cutout-bw.webp"
            alt="Ajay A - Black and White"
            width={800}
            height={1067}
            priority
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* TOP LAYER: Color Image ONLY revealed as cursor moves over the image */}
        <div 
          className="absolute inset-0 w-full h-full flex items-end justify-center pointer-events-none transition-opacity duration-300 ease-out"
          style={{
            opacity: isHovered ? 1 : 0,
            maskImage: revealMask,
            WebkitMaskImage: revealMask,
          }}
        >
          <Image
            src="/ajay-cutout-color.webp"
            alt="Ajay A - Color"
            width={800}
            height={1067}
            priority
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>

      {/* 3. Floating Right Badge: Curved Arrow & Bullet Points */}
      <div className="absolute top-8 -right-2 sm:-right-4 z-20 hidden sm:flex items-start gap-1.5 pointer-events-none">
        {/* Curved Hand-Drawn Style Arrow */}
        <svg 
          className="w-7 h-7 text-muted/60 mt-0.5 shrink-0 -rotate-6" 
          viewBox="0 0 40 40" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
        >
          <path d="M 6 26 C 14 12, 24 10, 34 16" strokeLinecap="round" />
          <path d="M 28 13 L 34 16 L 31 22" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <ul className="space-y-1 text-[11px] font-mono text-ink/90 bg-bg/85 backdrop-blur-md p-1.5 sm:p-2 rounded-lg border border-line shadow-sm">
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>Developer</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>Problem Solver</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>Lifelong Learner</span>
          </li>
        </ul>
      </div>

      {/* 4. Cursive Script Signature: Ajay A */}
      <div className="absolute bottom-6 right-2 sm:right-0 z-20 pointer-events-none -rotate-6">
        <span className="font-signature text-2xl sm:text-4xl text-ink dark:text-white/95 font-medium tracking-wide drop-shadow-md">
          Ajay A
        </span>
      </div>
    </div>
  );
}
