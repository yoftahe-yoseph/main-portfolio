import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { LEADERSHIP_ROLES, PROFILE } from '@/lib/data/profile';
import OpenCvButton from '@/components/OpenCvButton';
import ProfilePortrait from '@/components/ProfilePortrait';

export const metadata: Metadata = {
  title: 'About & Leadership — Yoftahe Yoseph',
  description:
    'Computer Science graduate with distinction blending software engineering, business & entrepreneurship coursework, HUCISA leadership, and UNESCO SDG 4 Youth Network advocacy.',
};

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Editorial Intro */}
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-200">
        <div className="lg:col-span-8">
          <p className="text-xs sm:text-sm font-medium text-blue-600">About &amp; Background</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            Engineering rigor paired with business clarity and community leadership.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            I am Yoftahe Yoseph, a Computer Science graduate (with distinction) building practical, security-minded full-stack web applications and AI-assisted workflows. Alongside software engineering, I completed formal coursework in business management, marketing principles, strategic planning, business communication, and entrepreneurship—allowing me to connect technical architecture directly with institutional and commercial value.
          </p>
        </div>

        <div className="lg:col-span-4 lg:flex lg:flex-col lg:justify-end">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-4">
              <ProfilePortrait
                variant="headshot"
                priority
                className="w-20 h-20 rounded-xl border border-slate-200/80 shrink-0"
              />
              <div className="min-w-0">
                <p className="font-display text-base font-bold text-slate-900">
                  {PROFILE.name}
                </p>
                <p className="text-xs font-medium text-blue-600 mt-0.5">
                  {PROFILE.education.honors}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {PROFILE.education.institution}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 space-y-1.5">
              <p className="text-xs font-semibold text-slate-900">
                {PROFILE.education.degree}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {PROFILE.education.complementaryCoursework.join(' · ')}
              </p>
            </div>
            <div>
              <OpenCvButton label="Preview Full CV" variant="link" />
            </div>
          </div>
        </div>
      </header>

      {/* Education & Multidisciplinary Foundation */}
      <section aria-labelledby="academic-heading" className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <p className="text-xs font-medium text-blue-600">Multidisciplinary Foundation</p>
          <h2
            id="academic-heading"
            className="mt-1 font-display text-2xl font-bold text-slate-900 tracking-tight"
          >
            Computer Science Meets Entrepreneurship
          </h2>
        </div>

        <div className="lg:col-span-8 space-y-5 text-sm sm:text-base text-slate-600 leading-relaxed">
          <p>{PROFILE.education.summary}</p>
          <p>
            Whether designing role-based dashboards for a primary hospital, shipping a 45-day inter-agency data exchange system at Mesob Center in Addis Ababa, or evaluating AI workflows and healthcare operations for a US-based remote team, I prioritize software that is dependable, maintainable, and immediately useful to real operators.
          </p>
          <div className="pt-4 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900">
                Core Computer Science
              </h3>
              <p className="mt-1.5 text-sm text-slate-600">
                Software engineering, web systems architecture, relational &amp; NoSQL databases, role-based access control, and applied AI modeling.
              </p>
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900">
                Business &amp; Strategy Coursework
              </h3>
              <p className="mt-1.5 text-sm text-slate-600">
                {PROFILE.education.complementaryCoursework.join(', ')}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Philosophy */}
      <section aria-labelledby="philosophy-heading" className="pt-12 border-t border-slate-200">
        <div className="mb-8">
          <p className="text-xs font-medium text-blue-600">How I Build</p>
          <h2
            id="philosophy-heading"
            className="mt-1 font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
          >
            Technical Philosophy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROFILE.philosophy.map((item) => (
            <div
              key={item.index}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7"
            >
              <p className="text-xs font-mono text-blue-600 font-medium tabular-nums">
                {item.index}.
              </p>
              <h3 className="mt-2 font-display text-lg font-bold text-slate-900 tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Community Leadership */}
      <section aria-labelledby="community-heading" className="pt-12 border-t border-slate-200">
        <div className="mb-8">
          <p className="text-xs font-medium text-blue-600">Community &amp; Education</p>
          <h2
            id="community-heading"
            className="mt-1 font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
          >
            Leading Student &amp; Global Education Communities
          </h2>
        </div>

        <div className="space-y-6">
          {LEADERSHIP_ROLES.map((role) => (
            <div
              key={role.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              <div className="lg:col-span-4">
                <p className="text-xs font-medium text-blue-600">{role.scope}</p>
                <h3 className="mt-1 font-display text-lg font-bold text-slate-900">
                  {role.role}
                </h3>
                <p className="mt-1 text-xs text-slate-500">{role.organization}</p>
              </div>
              <div className="lg:col-span-8">
                <p className="text-sm text-slate-600 leading-relaxed">{role.description}</p>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-600 list-disc pl-5">
                  {role.outcomes.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Stack Matrix */}
      <section aria-labelledby="skills-matrix-heading" className="pt-12 border-t border-slate-200">
        <div className="mb-8">
          <p className="text-xs font-medium text-blue-600">Capabilities</p>
          <h2
            id="skills-matrix-heading"
            className="mt-1 font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
          >
            Core Technical Stack
          </h2>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl divide-y divide-slate-100">
          {PROFILE.skillGroups.map((group) => (
            <div
              key={group.category}
              className="p-6 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-baseline"
            >
              <h3 className="md:col-span-4 font-display text-sm font-bold text-slate-900">
                {group.category}
              </h3>
              <p className="md:col-span-8 text-sm text-slate-600 leading-relaxed">
                {group.items.join(' · ')}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <span>Explore Shipped Projects</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <span>Contact Yoftahe</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
