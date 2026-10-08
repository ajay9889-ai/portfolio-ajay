'use client';

import React from 'react';
import { MARQUEE_TECH } from '@/data/portfolioData';

export function MarqueeBand() {
  const items = [...MARQUEE_TECH, ...MARQUEE_TECH, ...MARQUEE_TECH];

  return (
    <div className="w-full overflow-hidden hairline-t hairline-b py-5 bg-bg select-none">
      <div className="animate-marquee flex items-center gap-6 whitespace-nowrap">
        {items.map((tech, idx) => (
          <span key={idx} className="flex items-center gap-6 text-sm font-mono text-muted tracking-wide">
            <span className="hover:text-ink transition-colors">{tech}</span>
            <span className="text-accent font-bold text-base">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
