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
          className="font-display text-2xl font-bold tracking-tight text-ink hover:text-accent transition-colors flex items-center gap-1"
        >
          <span>Ajay A</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block ml-0.5" />
        </Link>

        <nav className="flex items-center gap-6 sm:gap-8 text-sm font-medium text-muted">
          <Link href="/" className="text-ink relative py-1 transition-colors">
            <span>Home</span>
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-ink rounded-full" />
          </Link>
          <Link href="#about" className="hover:text-ink transition-colors">
            About
          </Link>
          <Link href="#skills" className="hover:text-ink transition-colors">
            Skills
          </Link>
          <Link href="#experience" className="hover:text-ink transition-colors">
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
            className="p-2 rounded-full border border-line text-muted hover:text-ink transition-colors ml-2"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-accent" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
