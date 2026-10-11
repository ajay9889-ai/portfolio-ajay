'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

export function HeroPortrait() {
  const [mousePos, setMousePos] = useState({ x: 250, y: 180 });
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

  // Soft feathered reveal mask centered at cursor position
  const revealMask = isHovered
    ? `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, black 35%, rgba(0,0,0,0.5) 65%, transparent 100%)`
    : `radial-gradient(circle 120px at 50% 32%, black 20%, rgba(0,0,0,0.3) 55%, transparent 100%)`;

  return (
    <div className="relative w-full max-w-[440px] sm:max-w-[520px] md:max-w-[580px] mx-auto flex items-center justify-center select-none">
      {/* Enlarged Portrait with bottom cropped/dissolved to fit the screen */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchMove={handleTouchMove}
        onTouchStart={() => setIsHovered(true)}
        className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] cursor-pointer overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to bottom, black 82%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 82%, transparent 100%)',
        }}
      >
        {/* BASE: Black & White Portrait (enlarged, top-anchored, bottom cropped) */}
        <div className="absolute inset-0 w-full h-full flex items-start justify-center pointer-events-none">
          <Image
            src="/ajay-bw.webp"
            alt="Ajay A - Black and White"
            width={800}
            height={1067}
            priority
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* TOP LAYER: Color Image revealed seamlessly as the cursor moves */}
        <div 
          className="absolute inset-0 w-full h-full flex items-start justify-center pointer-events-none"
          style={{
            maskImage: revealMask,
            WebkitMaskImage: revealMask,
          }}
        >
          <Image
            src="/ajay-color.webp"
            alt="Ajay A - Color"
            width={800}
            height={1067}
            priority
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}
