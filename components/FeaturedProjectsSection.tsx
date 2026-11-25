'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Maximize2 } from 'lucide-react';
import type { Project } from '@/lib/types';
import ProjectVisual from './ProjectVisual';
import ProjectDetailModal from './ProjectDetailModal';

interface FeaturedProjectsSectionProps {
  projects: Project[];
}

export default function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <article
            key={project.id}
            className="group bg-white border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col transition-colors duration-150 hover:border-slate-300"
          >
            <button
              type="button"
              onClick={() => setSelectedProject(project)}
              aria-label={`Preview ${project.title} case study`}
              className="block w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600"
            >
              <ProjectVisual
                imageKey={project.imageKey}
                alt={project.imageAlt}
                title={project.title}
                aspectClass="aspect-[4/3]"
              />
            </button>

            <div className="p-6 flex-1 flex flex-col">
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span>{project.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{project.year}</span>
                <span aria-hidden="true">·</span>
                <span>{project.statusLabel}</span>
              </div>

              <h3 className="mt-2 font-display text-xl font-bold text-slate-900 tracking-tight">
                <Link
                  href={`/projects/${project.slug}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {project.title}
                </Link>
              </h3>

              <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">
                {project.summary}
              </p>

              <p className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                {project.techStack.slice(0, 5).join(' · ')}
              </p>

              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Quick Preview</span>
                </button>

                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors whitespace-nowrap"
                  >
                    <span>Live Site</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                ) : (
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors whitespace-nowrap"
                  >
                    <span>Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
