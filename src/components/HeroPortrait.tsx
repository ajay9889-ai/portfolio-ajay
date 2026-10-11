'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

export function HeroPortrait() {
  const [mousePos, setMousePos] = useState({ x: 300, y: 220 });
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

  // Expansive soft feathered spotlight mask that reveals color on cursor movement
  const revealMask = isHovered
    ? `radial-gradient(circle 220px at ${mousePos.x}px ${mousePos.y}px, black 35%, rgba(0,0,0,0.5) 65%, transparent 100%)`
    : `radial-gradient(circle 140px at 50% 28%, black 25%, rgba(0,0,0,0.3) 58%, transparent 100%)`;

  return (
    <div className="relative w-full max-w-[560px] sm:max-w-[660px] md:max-w-[760px] mx-auto flex items-center justify-center select-none">
      {/* Big Frameless Portrait Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchMove={handleTouchMove}
        onTouchStart={() => setIsHovered(true)}
        className="relative w-full h-[460px] sm:h-[580px] md:h-[680px] cursor-pointer overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to bottom, black 72%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 72%, transparent 100%)',
        }}
      >
        {/* BASE: Black & White Portrait */}
        <div className="absolute inset-0 w-full h-full flex items-start justify-center pointer-events-none">
          <Image
            src="/ajay-bw.webp"
            alt="Ajay A - Black and White"
            width={800}
            height={1067}
            priority
            className="w-full h-full object-contain object-top"
          />
        </div>

        {/* TOP LAYER: Color Image revealed seamlessly wherever the cursor moves */}
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
            className="w-full h-full object-contain object-top"
          />
        </div>
      </div>
    </div>
  );
}
