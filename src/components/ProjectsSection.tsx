"use client";

import React, { useState } from "react";
import { Project } from "@/types";
import { ExternalLink, Github, Sparkles, Layers, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { ProjectModal } from "./ProjectModal";

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const categories = ["All", "AI & ML", "Full Stack", "Systems & Cloud", "Frontend"];

  const filteredProjects = selectedCategory === "All"
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-24 relative bg-background/50 border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-mono font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Engineered Work</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Featured Systems & Projects
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mt-3 md:mt-0">
            Scalable distributed engines, interactive web applications, and autonomous AI pipelines.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-brand-primary text-white shadow-glow"
                  : "bg-surface-100 text-slate-400 hover:text-white hover:bg-surface-50 border border-surface-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between group cursor-pointer"
              onClick={() => setActiveProject(project)}
            >
              <div>
                {/* Top Badge Strip */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="px-3 py-1 rounded-md bg-surface-50 border border-surface-border text-brand-cyan text-xs font-mono font-semibold">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-amber/15 border border-brand-amber/30 text-amber-300 text-xs font-semibold">
                      Featured
                    </span>
                  )}
                </div>

                {/* Title & Tagline */}
                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-brand-primary transition-colors flex items-center justify-between gap-2 mb-2">
                  <span>{project.title}</span>
                  <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-brand-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>

                <p className="text-slate-300 text-sm mb-5 leading-relaxed font-normal">
                  {project.tagline}
                </p>

                {/* Metrics Badges */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6 p-3 rounded-xl bg-surface-300/80 border border-surface-border/60">
                    {project.metrics.map((m, idx) => (
                      <div key={idx} className="text-left">
                        <div className="text-xs text-slate-500 font-mono">{m.label}</div>
                        <div className="text-sm font-bold text-white font-mono">{m.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Technologies List & Action Links */}
              <div>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies.slice(0, 6).map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md bg-surface-100 text-slate-400 text-xs font-mono border border-surface-border/50"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 6 && (
                    <span className="px-2 py-1 rounded-md bg-surface-100 text-slate-500 text-xs font-mono">
                      +{project.technologies.length - 6} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-surface-border/50 text-sm">
                  <span className="text-xs text-brand-cyan font-mono group-hover:underline">
                    Click to view details & architecture &rarr;
                  </span>
                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors"
                        title="View Source Code"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-brand-cyan transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal View */}
      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </section>
  );
}
