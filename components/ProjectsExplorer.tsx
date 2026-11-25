'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Search, Maximize2, X } from 'lucide-react';
import type { Project } from '@/lib/types';
import {
  filterProjects,
  getProjectCategoryCounts,
  type ProjectFilterOption,
} from '@/lib/portfolio-filters';
import ProjectVisual from './ProjectVisual';
import ProjectDetailModal from './ProjectDetailModal';

const FILTER_OPTIONS: ProjectFilterOption[] = [
  'All',
  'Full-Stack',
  'Healthcare & Gov',
  'AI & Tooling',
];

interface ProjectsExplorerProps {
  projects: Project[];
}

export default function ProjectsExplorer({ projects }: ProjectsExplorerProps) {
  const [activeCategory, setActiveCategory] = useState<ProjectFilterOption>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const counts = useMemo(() => getProjectCategoryCounts(projects), [projects]);

  const visibleProjects = useMemo(
    () => filterProjects(projects, activeCategory, searchQuery),
    [projects, activeCategory, searchQuery]
  );

  return (
    <div>
      {/* Filter & Search Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-8 border-b border-slate-200">
        <div
          role="tablist"
          aria-label="Filter projects by category"
          className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit"
        >
          {FILTER_OPTIONS.map((option) => {
            const active = activeCategory === option;
            return (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCategory(option)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {option}{' '}
                <span className="font-mono text-xs text-slate-400 tabular-nums ml-0.5">
                  ({counts[option]})
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <label htmlFor="project-search" className="sr-only">
            Search projects by name or technology
          </label>
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="project-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stack or system..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear project search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="mt-6 mb-6 flex items-center justify-between text-xs text-slate-500">
        <p data-testid="projects-count">
          Showing <span className="font-mono font-medium text-slate-900 tabular-nums">{visibleProjects.length}</span> of{' '}
          <span className="font-mono font-medium text-slate-900 tabular-nums">{projects.length}</span> engineering projects
        </p>
        {(activeCategory !== 'All' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Empty State */}
      {visibleProjects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <p className="font-display text-lg font-semibold text-slate-900">
            No matching projects found
          </p>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            Try clearing your search term or switching back to all categories to view every full-stack and AI system.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="mt-5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Show All Projects
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {visibleProjects.map((project, index) => (
            <article
              key={project.id}
              data-testid={`project-card-${project.slug}`}
              className="group bg-white border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col transition-colors duration-150 hover:border-slate-300"
            >
              <button
                type="button"
                onClick={() => setSelectedProject(project)}
                aria-label={`Open case study modal for ${project.title}`}
                className="block w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600"
              >
                <ProjectVisual
                  imageKey={project.imageKey}
                  alt={project.imageAlt}
                  title={project.title}
                  aspectClass="aspect-[16/10]"
                  priority={index < 2}
                />
              </button>

              <div className="p-6 sm:p-7 flex-1 flex flex-col">
                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                  <span>{project.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{project.year}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.role}</span>
                </div>

                <h2 className="mt-2 font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {project.title}
                  </Link>
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {project.subtitle}
                </p>

                <p className="mt-3 text-sm text-slate-600 leading-relaxed flex-1">
                  {project.summary}
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {project.techStack.join(' · ')}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Preview Architecture</span>
                    </button>

                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors whitespace-nowrap"
                    >
                      <span>Full Study</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </div>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors whitespace-nowrap"
                    >
                      <span>Live URL</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
