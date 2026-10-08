'use client';

import React, { useState, useEffect } from 'react';

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
    <div className="fixed bottom-6 left-6 z-40 bg-bg/90 backdrop-blur-md border border-line rounded-full px-4 py-2 flex items-center gap-3 text-xs font-mono shadow-sm">
      <div className="flex items-center gap-1.5">
        {(['knot', 'ring', 'orb'] as const).map((s) => (
          <button
            key={s}
            onClick={() => handleShapeChange(s)}
            className={`px-2.5 py-1 rounded-full transition-all duration-200 capitalize ${
              shape === s
                ? 'bg-ink text-bg font-bold'
                : 'text-muted hover:text-ink'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <span className="w-px h-3 bg-line" />

      <button
        onClick={handleThemeToggle}
        className="px-2 py-1 text-muted hover:text-ink transition-colors uppercase tracking-wider"
      >
        {theme}
      </button>
    </div>
  );
}
