import React from 'react';
import { SKILL_GROUPS } from '@/data/portfolioData';

export function SkillsSection() {
  return (
    <section id="skills" className="py-28 sm:py-36 px-6 sm:px-10 max-w-7xl mx-auto hairline-b">
      <div className="mb-14">
        <span className="text-xs uppercase tracking-widest text-muted font-mono mb-4 block">
          skills
        </span>
        <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-[-0.04em] text-ink">
          Core capabilities.
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {SKILL_GROUPS.map((group) => (
          <div key={group.name} className="space-y-4">
            <h3 className="font-display text-xl font-bold text-ink pb-2 hairline-b">
              {group.name}
            </h3>
            <ul className="space-y-2 text-sm text-muted">
              {group.items.map((skill) => (
                <li
                  key={skill}
                  className="hover:text-accent hover:translate-x-1 transition-all duration-200 cursor-default"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
