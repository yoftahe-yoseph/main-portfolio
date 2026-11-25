import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { EXPERIENCE, LEADERSHIP_ROLES, PROFILE } from '@/lib/data/profile';
import { PROJECTS } from '@/lib/data/projects';
import FeaturedProjectsSection from '@/components/FeaturedProjectsSection';
import OpenCvButton from '@/components/OpenCvButton';
import ProfilePortrait from '@/components/ProfilePortrait';

export default function HomePage() {
  const featuredProjects = PROJECTS.filter((project) => project.featured);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Split-Screen Editorial Hero */}
      <section className="pt-12 sm:pt-16 lg:pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between py-1">
            <div>
              <p className="text-xs sm:text-sm font-medium text-blue-600 tracking-tight">
                {PROFILE.kicker}
              </p>

              <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-[3.35rem] font-bold text-slate-900 tracking-tight leading-[1.08] max-w-2xl">
                {PROFILE.headline}
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                {PROFILE.subheadline}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/80">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  <span>View Projects</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>

                <OpenCvButton label="Preview CV" />

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors whitespace-nowrap"
                >
                  <span>Get in Touch</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>

              <p className="mt-5 text-xs text-slate-500">
                {PROFILE.location}{' '}
                <span aria-hidden="true">·</span>{' '}
                <a
                  href={PROFILE.portfolioDomain}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 hover:text-blue-600 underline underline-offset-4"
                >
                  yoftu.netlify.app
                </a>
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <figure className="h-full flex flex-col bg-white border border-slate-200/90 rounded-2xl overflow-hidden">
              <ProfilePortrait
                variant="editorial"
                priority
                className="w-full aspect-[4/4.2] lg:aspect-auto lg:flex-1 min-h-[300px]"
              />
              <figcaption className="px-5 py-3.5 border-t border-slate-100 bg-white flex items-center justify-between gap-4 text-xs text-slate-500">
                <span>Yoftahe Yoseph · B.Sc. CS (Distinction)</span>
                <span className="font-mono text-slate-400 tabular-nums">Addis Ababa</span>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Full-Width 4-Column Key Metrics Strip */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {PROFILE.metrics.map((metric) => (
            <div key={metric.label}>
              <p className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-mono tabular-nums">
                {metric.value}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{metric.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{metric.context}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-14 border-t border-slate-200/80" aria-labelledby="featured-work-heading">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-medium text-blue-600">Selected Engineering Work</p>
            <h2
              id="featured-work-heading"
              className="mt-1 font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
            >
              Production Full-Stack Systems
            </h2>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
          >
            <span>Explore all {PROJECTS.length} projects</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <FeaturedProjectsSection projects={featuredProjects} />
      </section>

      {/* Experience & Community Leadership Snapshot */}
      <section className="py-14 border-t border-slate-200/80" aria-labelledby="impact-heading">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6">
            <div className="flex items-baseline justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-medium text-blue-600">Applied Experience</p>
                <h2
                  id="impact-heading"
                  className="mt-1 font-display text-2xl font-bold text-slate-900 tracking-tight"
                >
                  Engineering, Research &amp; QA
                </h2>
              </div>
              <Link
                href="/credentials"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap"
              >
                Full timeline
              </Link>
            </div>

            <div className="space-y-6">
              {EXPERIENCE.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="pb-6 border-b border-slate-200/70 last:border-b-0 last:pb-0"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-base font-bold text-slate-900">
                      {item.role}
                    </h3>
                    <span className="text-xs font-mono text-slate-500 tabular-nums">
                      {item.period}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {item.organization} <span aria-hidden="true">·</span> {item.location}
                  </p>
                  <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="flex items-baseline justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-medium text-blue-600">Community &amp; Advocacy</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 tracking-tight">
                  Leadership &amp; Technical Impact
                </h2>
              </div>
              <Link
                href="/about"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap"
              >
                About me
              </Link>
            </div>

            <div className="space-y-6">
              {LEADERSHIP_ROLES.map((role) => (
                <div
                  key={role.id}
                  className="pb-6 border-b border-slate-200/70 last:border-b-0 last:pb-0"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-base font-bold text-slate-900">
                      {role.role}
                    </h3>
                    <span className="text-xs font-medium text-blue-600">{role.scope}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{role.organization}</p>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {role.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing Action Band */}
      <section className="py-12 border-t border-slate-200/80">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Need a full-stack engineer or technical research collaborator?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              Review verified credentials in the Certificates Vault, inspect system case studies, or reach out directly to discuss an engineering team role.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <span>Start a Conversation</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/credentials"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              <span>Certificates Vault</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
