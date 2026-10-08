import React from 'react';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { PROFILE } from '@/data/portfolioData';

export function Footer() {
  return (
    <footer className="py-16 px-6 sm:px-10 max-w-7xl mx-auto text-xs text-muted font-mono space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span>© {new Date().getFullYear()} {PROFILE.name} — Bengaluru, India</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={PROFILE.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            GitHub
          </a>
          <a
            href={PROFILE.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            LinkedIn
          </a>
          <Link
            href="#"
            className="hover:text-accent transition-colors flex items-center gap-1"
          >
            <span>top</span>
            <ArrowUp className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="hairline-t pt-6 text-[11px] text-muted/70 leading-relaxed max-w-xl">
        <span>
          Privacy note: No personal data or cookies are stored. Live visitor presence and cursors are completely anonymous and throttled.
        </span>
      </div>
    </footer>
  );
}
