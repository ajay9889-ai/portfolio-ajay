import React from 'react';
import { SKILL_GROUPS } from '@/data/portfolioData';

export function SkillsSection() {
  return (
    <section id="skills" className="py-28 sm:py-36 px-6 sm:px-8 max-w-6xl mx-auto border-t border-border">
      <span className="text-xs uppercase tracking-widest text-text-muted font-mono mb-8 block">
        skills
      </span>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        {/* Left Column: Generous whitespace reserved for the 3D canvas */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between min-h-[360px] pr-8">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-normal tracking-tight text-text">
              Technical capability.
            </h2>
            <p className="mt-4 text-text-muted font-light text-sm leading-relaxed max-w-sm">
              From responsive frontend components and state models to backend REST APIs and relational database query tuning.
            </p>
          </div>
          <div className="text-xs font-mono text-text-muted/60">
            [3d interactive core]
          </div>
        </div>

        {/* Right Column: 4 skill groups */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-10 lg:pl-8">
          {SKILL_GROUPS.map((group) => (
            <div key={group.name} className="space-y-4">
              <h3 className="font-heading text-lg font-medium text-text border-b border-border pb-2">
                {group.name}
              </h3>
              <ul className="space-y-2 text-sm text-text-muted">
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
      </div>
    </section>
  );
}
