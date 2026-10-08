import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '@/data/portfolioData';

export function WorkSection() {
  return (
    <section id="work" className="py-28 sm:py-36 px-6 sm:px-8 max-w-6xl mx-auto border-t border-border">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-text-muted font-mono mb-4 block">
            work
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-text">
            Selected projects.
          </h2>
        </div>
        <p className="text-sm text-text-muted font-light max-w-xs">
          Each project solves a specific architectural and real-world constraint.
        </p>
      </div>

      <div className="divide-y divide-border border-y border-border">
        {PROJECTS.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="group block py-10 sm:py-12 transition-all duration-300 relative hover:pl-4 focus-visible:outline-none focus-visible:pl-4"
          >
            {/* Accent hover line indicator */}
            <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300" />

            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-medium text-text group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  {project.badge && (
                    <span className="px-2.5 py-0.5 text-xs font-mono rounded-full border border-accent/40 text-accent bg-accent/5">
                      {project.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm sm:text-base text-text-muted font-light leading-relaxed">
                  {project.tagline}
                </p>
              </div>

              <div className="flex items-center gap-6 text-xs sm:text-sm text-text-muted font-mono shrink-0">
                <div className="hidden sm:flex items-center gap-2">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="px-2 py-0.5 border border-border rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                <span>{project.timeline}</span>
                <ArrowUpRight className="w-5 h-5 text-text-muted group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
