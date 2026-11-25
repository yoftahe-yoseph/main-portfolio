import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight, Award, Download, ExternalLink } from 'lucide-react';
import { PROJECTS } from '@/lib/data/projects';
import ProjectVisual from '@/components/ProjectVisual';

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) {
    return { title: 'Project Not Found — Yoftahe Yoseph' };
  }
  return {
    title: `${project.title} — Yoftahe Yoseph`,
    description: project.summary,
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const currentIndex = PROJECTS.findIndex((p) => p.slug === slug);
  if (currentIndex === -1) {
    notFound();
  }

  const project = PROJECTS[currentIndex];
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to all projects</span>
      </Link>

      <header className="mt-6 pb-8 border-b border-slate-200">
        <div className="text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-2">
          <span className="text-blue-600 font-medium">{project.category}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{project.year}</span>
          <span aria-hidden="true">·</span>
          <span>{project.role}</span>
          <span aria-hidden="true">·</span>
          <span>{project.statusLabel}</span>
        </div>

        <h1 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
          {project.title}
        </h1>
        <p className="mt-2 text-lg text-slate-700 font-medium">{project.subtitle}</p>
        <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-3xl">
          {project.summary}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <span>Open Live Application</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
          {project.certificate && (
            <a
              href={project.certificate.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <Award className="w-4 h-4" aria-hidden="true" />
              <span>View 45-Day Internship Certificate</span>
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <span>Ask About This Architecture</span>
          </Link>
        </div>
      </header>

      <div className="mt-8 rounded-2xl overflow-hidden border border-slate-200 bg-white">
        <ProjectVisual
          imageKey={project.imageKey}
          alt={project.imageAlt}
          title={project.title}
          aspectClass="aspect-[16/9]"
          priority
        />
      </div>

      {/* Problem / Solution / Outcome */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-200">
        <div>
          <h2 className="font-display text-base font-bold text-slate-900">01. Challenge</h2>
          <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{project.challenge}</p>
        </div>
        <div>
          <h2 className="font-display text-base font-bold text-slate-900">02. Solution</h2>
          <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{project.solution}</p>
        </div>
        <div>
          <h2 className="font-display text-base font-bold text-slate-900">03. Outcome</h2>
          <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{project.impact}</p>
        </div>
      </section>

      {/* Architecture Notes & Deliverables */}
      <section className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-200">
        <div className="lg:col-span-7">
          <h2 className="font-display text-xl font-bold text-slate-900 tracking-tight">
            System Architecture Notes
          </h2>
          <dl className="mt-5 space-y-5">
            {project.architecture.map((item) => (
              <div key={item.layer} className="pb-5 border-b border-slate-100 last:border-b-0 last:pb-0">
                <dt className="text-sm font-semibold text-slate-900">{item.layer}</dt>
                <dd className="mt-1.5 text-sm text-slate-600 leading-relaxed">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-5">
          <h2 className="font-display text-xl font-bold text-slate-900 tracking-tight">
            Core Deliverables
          </h2>
          <ul className="mt-5 space-y-2.5 text-sm text-slate-600 list-disc pl-5">
            {project.deliverables.map((item) => (
              <li key={item} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-xs font-semibold text-slate-900">Technology Stack</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {project.techStack.join(' · ')}
            </p>
          </div>
        </div>
      </section>

      {project.certificate && (
        <section
          aria-labelledby="project-certificate-heading"
          className="mt-12 pb-12 border-b border-slate-200"
        >
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <a
              href={project.certificate.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="lg:col-span-6 relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 block group"
              aria-label={`Open full-resolution photo of ${project.certificate.title}`}
            >
              <Image
                src={project.certificate.imageUrl}
                alt={project.certificate.title}
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                referrerPolicy="no-referrer"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </a>

            <div className="lg:col-span-6">
              <p className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600">
                <Award className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Verified Internship Credential</span>
              </p>
              <h2
                id="project-certificate-heading"
                className="mt-2 font-display text-2xl font-bold text-slate-900 tracking-tight"
              >
                {project.certificate.title}
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-700">
                {project.certificate.issuer}
              </p>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {project.certificate.signatory}. Awarded in recognition of completing the 45-day IT Internship at Mesob Center and delivering the inter-agency RBAC data-sharing system.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={project.certificate.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  <span>Open Full Certificate Photo</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
                <a
                  href={project.certificate.imageUrl}
                  download={project.certificate.downloadName}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Download Photo</span>
                </a>
                <Link
                  href={project.certificate.vaultHref}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
                >
                  <span>View in Certificates Vault</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Next Project Navigation */}
      <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500">Next Case Study</p>
          <Link
            href={`/projects/${nextProject.slug}`}
            className="mt-1 inline-flex items-center gap-2 font-display text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors"
          >
            <span>{nextProject.title}</span>
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>

        <Link
          href="/projects"
          className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors whitespace-nowrap"
        >
          View all {PROJECTS.length} systems
        </Link>
      </div>
    </div>
  );
}
