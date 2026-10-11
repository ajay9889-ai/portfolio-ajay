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
    <header className="fixed top-3 sm:top-5 inset-x-0 mx-auto z-40 w-[94%] max-w-5xl transition-all duration-300">
      <div className="relative px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-bg/80 dark:bg-[#121218]/80 backdrop-blur-2xl border border-line/60 dark:border-white/10 shadow-lg shadow-black/[0.04] dark:shadow-black/25 flex items-center justify-between">
        <Link 
          href="/" 
          className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink hover:text-accent transition-colors flex items-center gap-1"
        >
          <span>Ajay A</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block ml-0.5" />
        </Link>

        <nav className="flex items-center gap-4 sm:gap-7 text-xs sm:text-sm font-medium text-muted">
          <Link href="/" className="text-ink relative py-1 transition-colors">
            <span>Home</span>
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent rounded-full" />
          </Link>
          <Link href="#about" className="hover:text-ink transition-colors">
            About
          </Link>
          <Link href="#skills" className="hover:text-ink transition-colors">
            Skills
          </Link>
          <Link href="#experience" className="hover:text-ink transition-colors hidden sm:inline">
            Experience
          </Link>
          <Link href="#work" className="hover:text-ink transition-colors">
            Projects
          </Link>
          <Link href="#contact" className="hover:text-accent transition-colors">
            Contact
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Toggle light/dark theme"
            className="p-2 rounded-full border border-line/80 dark:border-white/10 bg-line/20 hover:bg-line/40 text-muted hover:text-ink transition-all hover:scale-105 active:scale-95 ml-1 sm:ml-2 shadow-sm"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-accent" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
