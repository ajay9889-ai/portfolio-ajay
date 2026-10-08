import React from 'react';
import { PROFILE } from '@/data/portfolioData';

export function AboutSection() {
  const statementLines = [
    "MCA graduate who ships",
    "React and Next.js,",
    "wires them to APIs,",
    "and tests until they hold.",
  ];

  return (
    <section id="about" className="py-28 sm:py-36 px-6 sm:px-10 max-w-7xl mx-auto hairline-b">
      <div className="max-w-4xl">
        <span className="text-xs uppercase tracking-widest text-muted font-mono mb-8 block">
          about
        </span>

        <h2 className="sr-only">About Statement</h2>

        <div className="space-y-2">
          {statementLines.map((line, idx) => (
            <p
              key={idx}
              className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-[-0.04em] text-ink leading-[0.95]"
            >
              {line}
            </p>
          ))}
        </div>

        <p className="mt-12 text-lg sm:text-xl text-muted font-normal max-w-2xl leading-relaxed">
          {PROFILE.aboutSupport}
        </p>
      </div>
    </section>
  );
}
