import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, ArrowRight } from 'lucide-react';
import { PROJECTS } from '@/data/portfolioData';
import { ProjectReactions } from '@/components/ProjectReactions';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const currentIndex = PROJECTS.findIndex((p) => p.slug === slug);
  if (currentIndex === -1) {
    notFound();
  }

  const project = PROJECTS[currentIndex];
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  return (
    <div className="min-h-screen bg-bg text-ink selection:bg-accent selection:text-white transition-colors duration-500">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 sm:px-10 pt-12 pb-24">
        {/* Back navigation */}
        <div className="mb-12">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>back to selected work</span>
          </Link>
        </div>

        {/* Hero header */}
        <div className="space-y-6 pb-16 hairline-b">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-4xl sm:text-7xl font-bold tracking-[-0.04em] text-ink">
              {project.title}
            </h1>
            {project.badge && (
              <span className="px-3 py-1 text-xs font-mono rounded-full border border-accent/40 text-accent">
                {project.badge}
              </span>
            )}
          </div>

          <p className="text-xl sm:text-2xl text-muted font-normal max-w-3xl leading-relaxed">
            {project.tagline}
          </p>

          {/* Quick facts grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 hairline-t text-xs font-mono">
            <div>
              <span className="text-muted block mb-1">Role</span>
              <span className="text-ink font-medium">{project.role}</span>
            </div>
            <div>
              <span className="text-muted block mb-1">Timeline</span>
              <span className="text-ink font-medium">{project.timeline}</span>
            </div>
            <div>
              <span className="text-muted block mb-1">Stack</span>
              <span className="text-ink font-medium">{project.technologies.slice(0, 3).join(', ')}</span>
            </div>
            <div>
              <span className="text-muted block mb-1">Source</span>
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline inline-flex items-center gap-1 font-medium"
                >
                  GitHub <ArrowUpRight className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-muted">—</span>
              )}
            </div>
          </div>

          {/* Project Reactions Bar */}
          <div className="pt-6 flex items-center gap-4">
            <span className="text-xs font-mono text-muted">React to this project:</span>
            <ProjectReactions slug={project.slug} />
          </div>
        </div>

        {/* Problem → Solution → Result */}
        <div className="py-20 space-y-20 hairline-b">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-4">
              <span className="text-xs uppercase tracking-widest text-muted font-mono block">
                01 / The problem
              </span>
            </div>
            <div className="md:col-span-8">
              <p className="text-base sm:text-lg text-muted font-normal leading-relaxed">
                {project.problem}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-4">
              <span className="text-xs uppercase tracking-widest text-muted font-mono block">
                02 / The solution
              </span>
            </div>
            <div className="md:col-span-8">
              <p className="text-base sm:text-lg text-muted font-normal leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-4">
              <span className="text-xs uppercase tracking-widest text-muted font-mono block">
                03 / The result
              </span>
            </div>
            <div className="md:col-span-8">
              <p className="text-base sm:text-lg text-ink font-medium leading-relaxed">
                {project.result}
              </p>
            </div>
          </div>
        </div>

        {/* Architecture Diagram */}
        {project.architecture && (
          <div className="py-20 hairline-b">
            <span className="text-xs uppercase tracking-widest text-muted font-mono block mb-4">
              Architecture flow
            </span>
            <p className="text-sm text-muted mb-10 max-w-xl">
              {project.architecture.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {project.architecture.nodes.map((node, i) => (
                <div
                  key={node.label}
                  className="p-6 rounded border border-line bg-bg/50 space-y-2 relative"
                >
                  <span className="text-xs font-mono text-accent block">Step 0{i + 1}</span>
                  <h3 className="font-display text-lg font-bold text-ink">{node.label}</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {node.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lessons Learned */}
        {project.lessonsLearned && (
          <div className="py-20 hairline-b">
            <span className="text-xs uppercase tracking-widest text-muted font-mono block mb-6">
              Lessons learned
            </span>
            <ul className="space-y-4 max-w-3xl">
              {project.lessonsLearned.map((lesson, idx) => (
                <li key={idx} className="text-sm sm:text-base text-muted flex items-start gap-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                  <span>{lesson}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Project Link */}
        <div className="pt-20">
          <span className="text-xs font-mono text-muted block mb-3">Next project</span>
          <Link
            href={`/projects/${nextProject.slug}`}
            className="group inline-flex items-center gap-4 text-3xl sm:text-5xl font-display font-bold text-ink hover:text-accent transition-colors"
          >
            <span>{nextProject.title}</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
