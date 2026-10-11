'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

export function HeroPortrait() {
  const [mousePos, setMousePos] = useState({ x: 160, y: 140 });
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

  // Soft feathered reveal mask that illuminates full color wherever the cursor/finger moves
  const revealMask = `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, black 35%, rgba(0,0,0,0.5) 65%, transparent 100%)`;

  return (
    <div className="relative w-full max-w-[320px] xs:max-w-[360px] sm:max-w-[460px] lg:max-w-[560px] xl:max-w-[640px] mx-auto flex items-center justify-center select-none my-2 sm:my-0">
      {/* 1. Behind: Theme-Aware Soft Solar Amber / Orange Orb Backdrop */}
      <div 
        aria-hidden="true"
        className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 w-[230px] h-[230px] xs:w-[270px] xs:h-[270px] sm:w-[360px] sm:h-[360px] lg:w-[440px] lg:h-[440px] xl:w-[500px] xl:h-[500px] rounded-full bg-gradient-to-tr from-orange-200/40 via-amber-100/30 to-orange-100/20 border border-orange-200/40 dark:from-[#2A1605]/90 dark:via-[#3D1E04]/70 dark:to-[#5E2B06]/40 dark:border-orange-500/20 blur-[1px] pointer-events-none transition-colors duration-400"
      />

      {/* 2. Interactive Portrait Layer (100% Transparent Cutout with Cursor Color Reveal) */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchMove={handleTouchMove}
        onTouchStart={() => setIsHovered(true)}
        className="relative z-10 w-[250px] xs:w-[290px] sm:w-[380px] lg:w-[460px] xl:w-[520px] h-[330px] xs:h-[380px] sm:h-[480px] lg:h-[570px] xl:h-[630px] cursor-pointer overflow-hidden touch-pan-y"
        style={{
          maskImage: 'linear-gradient(to bottom, black 86%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 86%, transparent 100%)',
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

        {/* TOP LAYER: Color Image ONLY revealed as cursor/touch moves over the image */}
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

      {/* 3. Floating Right Badge: Curved Arrow & Bullet Points (Hidden on small screens) */}
      <div className="absolute top-12 sm:top-18 -right-2 sm:-right-6 lg:-right-8 xl:-right-10 z-20 hidden sm:flex items-start gap-2.5 pointer-events-none">
        {/* Curved Hand-Drawn Style Arrow */}
        <svg 
          className="w-8 h-8 sm:w-9 sm:h-9 text-muted/60 mt-1 shrink-0 -rotate-6" 
          viewBox="0 0 40 40" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
        >
          <path d="M 6 26 C 14 12, 24 10, 34 16" strokeLinecap="round" />
          <path d="M 28 13 L 34 16 L 31 22" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <ul className="space-y-2 text-xs sm:text-sm font-mono text-ink/90 bg-bg/85 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-line shadow-md">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>Developer</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>Problem Solver</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>Lifelong Learner</span>
          </li>
        </ul>
      </div>

      {/* 4. Cursive Script Signature: Ajay A */}
      <div className="absolute bottom-6 xs:bottom-8 sm:bottom-12 right-1 xs:right-2 sm:right-4 z-20 pointer-events-none -rotate-6">
        <span className="font-signature text-3xl xs:text-4xl sm:text-6xl lg:text-7xl text-ink dark:text-white/95 font-medium tracking-wide drop-shadow-md">
          Ajay A
        </span>
      </div>
    </div>
  );
}
