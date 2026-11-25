'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X, ArrowUpRight, ArrowRight, Award } from 'lucide-react';
import type { Project } from '@/lib/types';
import ProjectVisual from './ProjectVisual';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-slate-500">
              {project.category} <span aria-hidden="true">·</span>{' '}
              <span className="font-mono tabular-nums">{project.year}</span>{' '}
              <span aria-hidden="true">·</span> {project.statusLabel}
            </p>
            <h2
              id="project-modal-title"
              className="font-display text-lg font-bold text-slate-900 truncate mt-0.5"
            >
              {project.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${project.title} details`}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto">
          <ProjectVisual
            imageKey={project.imageKey}
            alt={project.imageAlt}
            title={project.title}
            aspectClass="aspect-[16/9]"
          />

          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <p className="text-sm font-medium text-blue-600">{project.subtitle}</p>
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                {project.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <h3 className="font-display text-sm font-semibold text-slate-900">
                  Problem Context
                </h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                  {project.challenge}
                </p>
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-slate-900">
                  Engineered Solution
                </h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="font-display text-sm font-semibold text-slate-900">
                Architecture Notes
              </h3>
              <dl className="mt-3 space-y-3">
                {project.architecture.map((note) => (
                  <div
                    key={note.layer}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 text-sm"
                  >
                    <dt className="sm:col-span-4 font-medium text-slate-900">{note.layer}</dt>
                    <dd className="sm:col-span-8 text-slate-600 leading-relaxed">
                      {note.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="font-display text-sm font-semibold text-slate-900">
                Key Deliverables
              </h3>
              <ul className="mt-2.5 space-y-1.5 text-sm text-slate-600 list-disc pl-5">
                {project.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-500">Technology Stack</p>
              <p className="mt-1.5 text-sm text-slate-800">
                {project.techStack.join(' · ')}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/projects/${project.slug}`}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors whitespace-nowrap"
          >
            <span>Open full case study page</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>

          <div className="flex items-center gap-3">
            {project.certificate && (
              <a
                href={project.certificate.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                <Award className="w-4 h-4" aria-hidden="true" />
                <span>View Certificate</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                <span>Visit Live App</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
