'use client';

import React, { useState, useEffect } from 'react';
import { Search, Compass, BookOpen, Layers, Mail, Sparkles, Moon, Sun, X } from 'lucide-react';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === '/' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = [
    { label: 'Selected Work', action: () => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }), icon: Layers },
    { label: 'About Statement', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), icon: BookOpen },
    { label: 'Skills & Capabilities', action: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }), icon: Compass },
    { label: 'Experience & Education', action: () => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }), icon: Compass },
    { label: 'Get in Touch (Contact)', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), icon: Mail },
    {
      label: 'Switch 3D Shape to Knot',
      action: () => {
        localStorage.setItem('orbit-shape', 'knot');
        window.dispatchEvent(new CustomEvent('orbit-shape-change', { detail: 'knot' }));
      },
      icon: Sparkles,
    },
    {
      label: 'Switch 3D Shape to Ring',
      action: () => {
        localStorage.setItem('orbit-shape', 'ring');
        window.dispatchEvent(new CustomEvent('orbit-shape-change', { detail: 'ring' }));
      },
      icon: Sparkles,
    },
    {
      label: 'Switch 3D Shape to Orb',
      action: () => {
        localStorage.setItem('orbit-shape', 'orb');
        window.dispatchEvent(new CustomEvent('orbit-shape-change', { detail: 'orb' }));
      },
      icon: Sparkles,
    },
    {
      label: 'Toggle Theme (Light / Dark)',
      action: () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('orbit-theme', next);
      },
      icon: Moon,
    },
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const runCommand = (cmd: typeof commands[0]) => {
    cmd.action();
    setIsOpen(false);
    setQuery('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-3.5 py-2 rounded-full border border-line bg-bg/90 backdrop-blur-xl text-xs font-mono text-muted hover:text-ink shadow-md flex items-center gap-2"
        title="Open Command Palette (Ctrl+K or /)"
      >
        <Search className="w-3.5 h-3.5 text-accent" />
        <span className="hidden sm:inline">Palette</span>
        <kbd className="px-1.5 py-0.5 rounded bg-line/40 text-[10px]">Ctrl K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
      <div className="w-full max-w-xl bg-bg border border-line rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-line flex items-center gap-3">
          <Search className="w-4 h-4 text-accent shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to section..."
            className="w-full bg-transparent text-sm text-ink placeholder-muted/50 focus:outline-none"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted hover:text-ink p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-line/40">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-muted">
              No matching commands.
            </div>
          ) : (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.label}
                  onClick={() => runCommand(cmd)}
                  className="w-full text-left px-3.5 py-3 rounded-lg hover:bg-line/40 flex items-center gap-3 text-xs sm:text-sm text-ink transition-colors"
                >
                  <Icon className="w-4 h-4 text-muted shrink-0" />
                  <span className="font-mono flex-1">{cmd.label}</span>
                  <span className="text-[11px] font-mono text-muted">Jump</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
