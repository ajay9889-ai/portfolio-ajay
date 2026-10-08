import React from 'react';
import { TIMELINE } from '@/data/portfolioData';

export function ExperienceSection() {
  const experiences = TIMELINE.filter((item) => item.type === 'experience');
  const education = TIMELINE.filter((item) => item.type === 'education');

  return (
    <section id="experience" className="py-28 sm:py-36 px-6 sm:px-8 max-w-6xl mx-auto border-t border-border">
      <div className="mb-16">
        <span className="text-xs uppercase tracking-widest text-text-muted font-mono mb-4 block">
          experience & education
        </span>
        <h2 className="font-heading text-4xl sm:text-5xl font-medium tracking-tight text-text">
          Background.
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
        {/* Work Experience */}
        <div>
          <h3 className="font-heading text-xl font-medium text-text mb-8 border-b border-border pb-3">
            Experience
          </h3>

          <div className="relative pl-6 border-l border-border space-y-12">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative group">
                {/* Timeline node */}
                <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-border group-hover:bg-accent transition-colors duration-200" />

                <div className="space-y-1 mb-3">
                  <h4 className="font-heading text-lg font-medium text-text">
                    {exp.role}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
                    <span className="text-accent">{exp.organization}</span>
                    <span>•</span>
                    <span>{exp.location}</span>
                    <span>•</span>
                    <span>{exp.period}</span>
                  </div>
                </div>

                {exp.highlights && (
                  <ul className="space-y-2 text-sm text-text-muted font-light leading-relaxed">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="list-disc list-outside ml-4">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <h3 className="font-heading text-xl font-medium text-text mb-8 border-b border-border pb-3">
            Education
          </h3>

          <div className="relative pl-6 border-l border-border space-y-12">
            {education.map((edu) => (
              <div key={edu.id} className="relative group">
                {/* Timeline node */}
                <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-border group-hover:bg-accent transition-colors duration-200" />

                <div className="space-y-1 mb-3">
                  <h4 className="font-heading text-lg font-medium text-text">
                    {edu.role}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
                    <span>{edu.organization}</span>
                    <span>•</span>
                    <span>{edu.period}</span>
                  </div>
                </div>

                {edu.highlights && (
                  <ul className="space-y-2 text-sm text-text-muted font-light leading-relaxed">
                    {edu.highlights.map((h, i) => (
                      <li key={i} className="list-disc list-outside ml-4">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
