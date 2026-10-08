'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';

export function Navbar() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme') as 'dark' | 'light' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('portfolio-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-bg/85 backdrop-blur-md border-b border-line transition-colors duration-400">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        <Link 
          href="/" 
          className="font-display text-2xl font-bold tracking-tight text-ink hover:text-accent transition-colors"
        >
          Ajay A
        </Link>

        <nav className="flex items-center gap-6 sm:gap-10 text-sm font-medium text-muted">
          <Link href="#work" className="hover:text-ink transition-colors">
            work
          </Link>
          <Link href="#about" className="hover:text-ink transition-colors">
            about
          </Link>
          <Link href="#skills" className="hover:text-ink transition-colors">
            skills
          </Link>
          <Link href="#experience" className="hover:text-ink transition-colors">
            experience
          </Link>
          <Link href="#contact" className="hover:text-accent transition-colors">
            contact
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Toggle light/dark theme"
            className="p-2 rounded-full border border-line text-muted hover:text-ink transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-accent" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
