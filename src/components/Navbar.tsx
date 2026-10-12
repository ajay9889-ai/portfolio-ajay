'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';

export function Navbar() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem('portfolio-theme') || localStorage.getItem('theme')) as 'dark' | 'light' | null;
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      setTheme('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('portfolio-theme', next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#work' },
    { label: 'Live', href: '#live-projects' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-2.5 sm:top-5 inset-x-0 mx-auto z-40 w-[94%] max-w-5xl transition-all duration-300">
      <div className="relative px-4 sm:px-7 py-2 sm:py-3 rounded-full bg-bg/85 dark:bg-[#121218]/85 backdrop-blur-2xl border border-line/60 dark:border-white/10 shadow-lg shadow-black/[0.04] dark:shadow-black/25 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link 
          href="/" 
          onClick={() => setIsMobileMenuOpen(false)}
          className="font-display text-lg sm:text-2xl font-bold tracking-tight text-ink hover:text-accent transition-colors flex items-center gap-1 shrink-0"
        >
          <span>Ajay A</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block ml-0.5" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-xs sm:text-sm font-medium text-muted">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`transition-colors hover:text-ink ${
                link.label === 'Contact' ? 'text-accent font-semibold' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle light/dark theme"
            className="p-2 rounded-full border border-line/80 dark:border-white/10 bg-line/20 hover:bg-line/40 text-muted hover:text-ink transition-all hover:scale-105 active:scale-95 ml-1 shadow-sm"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-accent" />}
          </button>
        </nav>

        {/* Mobile Action Buttons (Theme Toggle + Hamburger Menu) */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle light/dark theme"
            className="p-2 rounded-full border border-line/80 dark:border-white/10 bg-line/20 text-muted hover:text-ink transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-accent" />}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="p-2 rounded-full border border-line/80 dark:border-white/10 bg-line/20 text-ink hover:bg-line/40 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-3xl bg-bg/95 dark:bg-[#121218]/95 backdrop-blur-2xl border border-line/80 dark:border-white/10 shadow-2xl shadow-black/40 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-2xl text-sm font-medium text-ink hover:bg-line/30 dark:hover:bg-white/[0.06] flex items-center justify-between transition-colors"
              >
                <span>{link.label}</span>
                <span className="text-muted text-xs font-mono">&rarr;</span>
              </Link>
            ))}

            <div className="pt-2 mt-2 border-t border-line/60 dark:border-white/10">
              <Link
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 px-4 rounded-2xl bg-accent text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md shadow-accent/20 active:scale-98 transition-transform"
              >
                <span>Let&apos;s talk</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
