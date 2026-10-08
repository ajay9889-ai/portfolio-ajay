'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export function Navbar() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Detect system preference or saved theme
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('portfolio-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-bg/85 backdrop-blur-md border-b border-border transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        <Link 
          href="/" 
          className="font-heading text-xl sm:text-2xl font-medium tracking-tight text-text hover:text-accent transition-colors"
        >
          Ajay A
        </Link>

        <nav className="flex items-center gap-6 sm:gap-10 text-sm text-text-muted">
          <Link href="#work" className="hover:text-text transition-colors">
            work
          </Link>
          <Link href="#about" className="hover:text-text transition-colors">
            about
          </Link>
          <Link href="#skills" className="hover:text-text transition-colors">
            skills
          </Link>
          <Link href="#experience" className="hover:text-text transition-colors">
            experience
          </Link>
          <Link href="#contact" className="hover:text-accent transition-colors">
            contact
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="p-2 text-text-muted hover:text-accent transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {theme === 'dark' ? (
              <span className="text-xs uppercase tracking-wider font-mono">light</span>
            ) : (
              <span className="text-xs uppercase tracking-wider font-mono">dark</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
