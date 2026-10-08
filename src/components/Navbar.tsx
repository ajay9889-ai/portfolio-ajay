'use client';

import React from 'react';
import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-bg/85 backdrop-blur-md border-b border-line transition-colors duration-500">
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
        </nav>
      </div>
    </header>
  );
}
