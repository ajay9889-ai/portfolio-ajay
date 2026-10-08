import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '@/data/portfolioData';
import { ProjectReactions } from '@/components/ProjectReactions';

export function WorkSection() {
  return (
    <section id="work" className="py-28 sm:py-36 px-6 sm:px-10 max-w-7xl mx-auto hairline-b">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-muted font-mono mb-4 block">
            work
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-[-0.04em] text-ink">
            Selected projects.
          </h2>
        </div>
        <p className="text-sm text-muted max-w-xs">
          Tap any emoji to leave a live reaction; click to open the case study.
        </p>
      </div>

      <div className="divide-y divide-line hairline-t hairline-b">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            className="work-row group relative py-10 sm:py-14 px-4 sm:px-6 transition-all duration-300"
          >
            <div className="relative z-10 flex flex-col md:flex-row md:items-baseline justify-between gap-6">
              <Link
                href={`/projects/${project.slug}`}
                className="space-y-2 max-w-2xl flex-1 focus-visible:outline-none"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-display text-2xl sm:text-4xl font-bold tracking-[-0.04em] text-ink work-text-invert transition-colors duration-300">
                    {project.title}
                  </h3>
                  {project.badge && (
                    <span className="px-2.5 py-0.5 text-xs font-mono rounded-full border border-accent/40 text-accent group-hover:text-white group-hover:border-white transition-colors duration-300">
                      {project.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm sm:text-base text-muted work-muted-invert leading-relaxed transition-colors duration-300">
                  {project.tagline}
                </p>
              </Link>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted work-muted-invert font-mono shrink-0 transition-colors duration-300">
                {/* One-tap live reactions */}
                <ProjectReactions slug={project.slug} compact />

                <div className="hidden lg:flex items-center gap-2">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="px-2 py-0.5 border border-line rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                <span>{project.timeline}</span>
                <Link
                  href={`/projects/${project.slug}`}
                  aria-label={`Open ${project.title}`}
                  className="hover:text-accent"
                >
                  <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
