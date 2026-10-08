'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, CircleDot, Disc, Globe } from 'lucide-react';

export function FloatingControls() {
  const [shape, setShape] = useState<'knot' | 'ring' | 'orb'>('knot');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedShape = localStorage.getItem('orbit-shape') as 'knot' | 'ring' | 'orb' | null;
    if (savedShape) setShape(savedShape);

    const savedTheme = localStorage.getItem('orbit-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const handleShapeChange = (next: 'knot' | 'ring' | 'orb') => {
    setShape(next);
    localStorage.setItem('orbit-shape', next);
    window.dispatchEvent(new CustomEvent('orbit-shape-change', { detail: next }));
  };

  const handleThemeToggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('orbit-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 bg-bg/90 backdrop-blur-xl border border-line rounded-full px-3.5 py-2 flex items-center gap-2 text-xs font-mono shadow-md">
      {/* 3D Shape selector */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleShapeChange('knot')}
          title="Knot shape"
          className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all ${
            shape === 'knot'
              ? 'bg-ink text-bg font-bold shadow-sm'
              : 'text-muted hover:text-ink'
          }`}
        >
          <CircleDot className="w-3 h-3" />
          <span>Knot</span>
        </button>

        <button
          onClick={() => handleShapeChange('ring')}
          title="Ring shape"
          className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all ${
            shape === 'ring'
              ? 'bg-ink text-bg font-bold shadow-sm'
              : 'text-muted hover:text-ink'
          }`}
        >
          <Disc className="w-3 h-3" />
          <span>Ring</span>
        </button>

        <button
          onClick={() => handleShapeChange('orb')}
          title="Orb shape"
          className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all ${
            shape === 'orb'
              ? 'bg-ink text-bg font-bold shadow-sm'
              : 'text-muted hover:text-ink'
          }`}
        >
          <Globe className="w-3 h-3" />
          <span>Orb</span>
        </button>
      </div>

      <span className="w-px h-3.5 bg-line mx-1" />

      {/* Theme Toggle */}
      <button
        onClick={handleThemeToggle}
        title="Toggle color theme"
        className="px-2 py-1 flex items-center gap-1.5 text-muted hover:text-ink transition-colors capitalize font-mono"
      >
        {theme === 'light' ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-accent" />}
        <span>{theme}</span>
      </button>
    </div>
  );
}
