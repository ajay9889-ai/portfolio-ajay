'use client';

import React, { useState, useEffect } from 'react';

export function PickYourPath() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('orbit-path');
    if (saved) setSelectedPath(saved);
  }, []);

  const choosePath = (path: 'hiring' | 'developer' | 'project') => {
    setSelectedPath(path);
    localStorage.setItem('orbit-path', path);

    // Scroll to the highlighted section
    if (path === 'hiring') {
      document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
    } else if (path === 'developer') {
      document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
    } else if (path === 'project') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full hairline-b py-3 px-6 sm:px-10 bg-bg/50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
        <span className="text-muted">Pick your path:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => choosePath('hiring')}
            className={`px-3 py-1 rounded-full border transition-colors ${
              selectedPath === 'hiring' ? 'border-accent text-accent font-bold' : 'border-line text-muted hover:text-ink'
            }`}
          >
            I'm hiring
          </button>
          <button
            onClick={() => choosePath('developer')}
            className={`px-3 py-1 rounded-full border transition-colors ${
              selectedPath === 'developer' ? 'border-accent text-accent font-bold' : 'border-line text-muted hover:text-ink'
            }`}
          >
            I'm a developer
          </button>
          <button
            onClick={() => choosePath('project')}
            className={`px-3 py-1 rounded-full border transition-colors ${
              selectedPath === 'project' ? 'border-accent text-accent font-bold' : 'border-line text-muted hover:text-ink'
            }`}
          >
            I have a project
          </button>
        </div>
      </div>
    </div>
  );
}
