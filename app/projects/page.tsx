import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PROJECTS } from '@/lib/data/projects';
import ProjectsExplorer from '@/components/ProjectsExplorer';

export const metadata: Metadata = {
  title: 'Projects & Case Studies — Yoftahe Yoseph',
  description:
    'Filterable showcase of full-stack web applications, hospital management platforms, QR hospitality tools, RBAC data exchange systems, and applied AI engineering.',
};

export default function ProjectsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-3xl mb-10">
        <p className="text-xs sm:text-sm font-medium text-blue-600">
          Projects &amp; Engineering Architecture
        </p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
          Full-stack applications and applied systems built for real workflows.
        </h1>
        <p className="mt-4 text-base text-slate-600 leading-relaxed">
          Each build reflects a focus on role-based security, responsive interfaces, and practical cloud architectures across Next.js, TypeScript, Python FastAPI, Firebase, Vercel, and Netlify.
        </p>
      </div>

      <ProjectsExplorer projects={PROJECTS} />

      <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-slate-600 max-w-xl">
          This portfolio catalog is driven by a typed, extensible project schema so new deployments, architecture notes, and screenshots can be appended cleanly over time.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap"
        >
          <span>Discuss a custom build</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
