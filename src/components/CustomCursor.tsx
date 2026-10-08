'use client';

import React, { useEffect, useState } from 'react';

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('a') ||
          target.closest('button') ||
          target.closest('.work-row') ||
          target.getAttribute('role') === 'button')
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (isTouch) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className={`rounded-full transition-all duration-200 mix-blend-difference ${
          hovered
            ? 'w-10 h-10 border-2 border-white bg-white/10 scale-100'
            : 'w-3 h-3 bg-white scale-100'
        }`}
      />
    </div>
  );
}
