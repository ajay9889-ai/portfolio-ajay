'use client';

import React, { useState, useEffect } from 'react';
import { Shapes } from 'lucide-react';

export function FloatingControls() {
  const [shape, setShape] = useState<'icosa' | 'knot' | 'ring' | 'orb'>('icosa');

  useEffect(() => {
    const saved = localStorage.getItem('orbit-shape') as 'icosa' | 'knot' | 'ring' | 'orb' | null;
    if (saved) setShape(saved);
  }, []);

  const handleShapeChange = (next: 'icosa' | 'knot' | 'ring' | 'orb') => {
    setShape(next);
    localStorage.setItem('orbit-shape', next);
    window.dispatchEvent(new CustomEvent('orbit-shape-change', { detail: next }));
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 bg-bg/90 backdrop-blur-xl border border-line rounded-full px-3.5 py-1.5 flex items-center gap-1.5 text-xs font-mono shadow-lg">
      <div className="flex items-center gap-1 text-muted pr-1">
        <Shapes className="w-3.5 h-3.5 text-accent" />
        <span className="text-[11px] hidden sm:inline">Shape:</span>
      </div>

      <div className="flex items-center gap-1">
        {(['icosa', 'knot', 'ring', 'orb'] as const).map((s) => (
          <button
            key={s}
            onClick={() => handleShapeChange(s)}
            className={`px-2.5 py-1 rounded-full capitalize transition-all duration-200 ${
              shape === s
                ? 'bg-accent text-white font-bold shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
