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

      <main className="max-w-7xl mx-auto px-6 sm:px-10 pt-6 sm:pt-8 pb-16">
        {/* Back navigation */}
        <div className="mb-4 sm:mb-6">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>back to selected work</span>
          </Link>
        </div>

        {/* Hero header */}
        <div className="space-y-4 pb-6 hairline-b">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-[-0.04em] text-ink">
              {project.title}
            </h1>
            {project.badge && (
              <span className="px-3 py-0.5 text-xs font-mono rounded-full border border-accent/40 text-accent">
                {project.badge}
              </span>
            )}
          </div>

          <p className="text-base sm:text-lg text-muted font-normal max-w-3xl leading-relaxed">
            {project.tagline}
          </p>

          {/* Quick facts + Reactions unified strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4 hairline-t text-xs font-mono items-center">
            <div>
              <span className="text-muted block text-[11px] mb-0.5">Role</span>
              <span className="text-ink font-medium">{project.role}</span>
            </div>
            <div>
              <span className="text-muted block text-[11px] mb-0.5">Timeline</span>
              <span className="text-ink font-medium">{project.timeline}</span>
            </div>
            <div>
              <span className="text-muted block text-[11px] mb-0.5">Stack</span>
              <span className="text-ink font-medium">{project.technologies.slice(0, 3).join(', ')}</span>
            </div>
            <div>
              <span className="text-muted block text-[11px] mb-0.5">Source</span>
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
            <div className="col-span-2 sm:col-span-1 sm:text-right">
              <span className="text-muted block text-[11px] mb-1">Live Reactions</span>
              <ProjectReactions slug={project.slug} compact />
            </div>
          </div>
        </div>

        {/* Problem → Solution → Result (3-Column Responsive Cards - fits above fold) */}
        <div className="py-6 sm:py-8 hairline-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-lg border border-line bg-bg/60 space-y-2.5">
              <span className="text-xs uppercase tracking-widest text-muted font-mono block">
                01 / The problem
              </span>
              <p className="text-sm text-muted font-normal leading-relaxed">
                {project.problem}
              </p>
            </div>

            <div className="p-5 rounded-lg border border-line bg-bg/60 space-y-2.5">
              <span className="text-xs uppercase tracking-widest text-muted font-mono block">
                02 / The solution
              </span>
              <p className="text-sm text-muted font-normal leading-relaxed">
                {project.solution}
              </p>
            </div>

            <div className="p-5 rounded-lg border border-accent/40 bg-accent/[0.04] space-y-2.5">
              <span className="text-xs uppercase tracking-widest text-accent font-mono block font-medium">
                03 / The result
              </span>
              <p className="text-sm text-ink font-medium leading-relaxed">
                {project.result}
              </p>
            </div>
          </div>
        </div>

        {/* Architecture Diagram */}
        {project.architecture && (
          <div className="py-6 sm:py-8 hairline-b">
            <span className="text-xs uppercase tracking-widest text-muted font-mono block mb-2">
              Architecture flow
            </span>
            <p className="text-xs sm:text-sm text-muted mb-6 max-w-2xl">
              {project.architecture.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.architecture.nodes.map((node, i) => (
                <div
                  key={node.label}
                  className="p-4 sm:p-5 rounded border border-line bg-bg/50 space-y-1.5 relative"
                >
                  <span className="text-xs font-mono text-accent block">Step 0{i + 1}</span>
                  <h3 className="font-display text-base font-bold text-ink">{node.label}</h3>
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
          <div className="py-6 sm:py-8 hairline-b">
            <span className="text-xs uppercase tracking-widest text-muted font-mono block mb-4">
              Lessons learned
            </span>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl">
              {project.lessonsLearned.map((lesson, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-muted flex items-start gap-3 p-3 rounded border border-line/60 bg-bg/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span>{lesson}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Project Link */}
        <div className="pt-6 sm:pt-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-muted block mb-1">Next case study</span>
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group inline-flex items-center gap-3 text-2xl sm:text-4xl font-display font-bold text-ink hover:text-accent transition-colors"
            >
              <span>{nextProject.title}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
