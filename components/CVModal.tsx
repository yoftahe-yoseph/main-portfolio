'use client';

import React, { useEffect } from 'react';
import { X, Printer, Download, FileText, ExternalLink } from 'lucide-react';
import { EXPERIENCE, LEADERSHIP_ROLES, PROFILE } from '@/lib/data/profile';
import { PROJECTS } from '@/lib/data/projects';
import { DEFAULT_CERTIFICATES } from '@/lib/data/certificates';
import { useSite } from './SiteContext';
import ProfilePortrait from './ProfilePortrait';

export default function CVModal() {
  const { cvOpen, closeCvModal } = useSite();

  useEffect(() => {
    if (!cvOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCvModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [cvOpen, closeCvModal]);

  if (!cvOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-modal-title"
      onClick={closeCvModal}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-4 no-print">
          <div>
            <h2 id="cv-modal-title" className="font-display text-base font-bold text-slate-900">
              Curriculum Vitae — {PROFILE.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Preview, print to PDF, or download a portable copy
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Print / Save PDF</span>
            </button>
            <a
              href="/api/cv?format=html"
              download="Yoftahe-Yoseph-CV.html"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Download HTML</span>
            </a>
            <a
              href="/api/cv?format=md"
              download="Yoftahe-Yoseph-CV.md"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Markdown</span>
            </a>
            <button
              type="button"
              onClick={closeCvModal}
              aria-label="Close CV preview"
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="overflow-y-auto px-6 sm:px-10 py-8 space-y-8 text-slate-800">
          {/* Header */}
          <div className="pb-6 border-b border-slate-200">
            <div className="flex items-start gap-4 sm:gap-5">
              <ProfilePortrait
                variant="headshot"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-slate-200/80 shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {PROFILE.name}
                </h3>
                <p className="text-sm font-medium text-blue-600 mt-1">{PROFILE.title}</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                  <span>{PROFILE.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>{PROFILE.email}</span>
                  <span aria-hidden="true">·</span>
                  <a
                    href={PROFILE.portfolioDomain}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <span>yoftu.netlify.app</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed max-w-3xl">
              {PROFILE.subheadline}
            </p>
          </div>

          {/* Education */}
          <section>
            <h4 className="font-display text-sm font-bold text-slate-900 pb-2 border-b border-slate-200 mb-3">
              Education
            </h4>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <p className="text-sm font-semibold text-slate-900">
                {PROFILE.education.degree} — {PROFILE.education.institution}
              </p>
              <p className="text-xs font-medium text-blue-600">
                {PROFILE.education.honors}
              </p>
            </div>
            <p className="text-xs text-slate-600 mt-1.5">
              Complementary Coursework: {PROFILE.education.complementaryCoursework.join(' · ')}
            </p>
          </section>

          {/* Experience */}
          <section>
            <h4 className="font-display text-sm font-bold text-slate-900 pb-2 border-b border-slate-200 mb-4">
              Experience
            </h4>
            <div className="space-y-5">
              {EXPERIENCE.map((item) => (
                <div key={item.id}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {item.role}
                    </p>
                    <p className="text-xs font-mono text-slate-500 tabular-nums">
                      {item.period}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.organization} · {item.location}
                  </p>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {item.summary}
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-600 list-disc pl-4">
                    {item.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Selected Projects */}
          <section>
            <h4 className="font-display text-sm font-bold text-slate-900 pb-2 border-b border-slate-200 mb-4">
              Selected Projects &amp; Systems
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PROJECTS.map((project) => (
                <div key={project.id} className="pb-3 border-b border-slate-100">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{project.title}</p>
                    <span className="text-xs font-mono text-slate-500 tabular-nums">{project.year}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {project.summary}
                  </p>
                  <p className="text-xs text-slate-500 mt-1.5">
                    {project.techStack.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Leadership & Certifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <section>
              <h4 className="font-display text-sm font-bold text-slate-900 pb-2 border-b border-slate-200 mb-3">
                Leadership &amp; Community
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600">
                {LEADERSHIP_ROLES.map((role) => (
                  <li key={role.id}>
                    <span className="font-semibold text-slate-900">{role.role}</span> — {role.organization} ({role.scope})
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h4 className="font-display text-sm font-bold text-slate-900 pb-2 border-b border-slate-200 mb-3">
                Certifications &amp; Credentials
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {DEFAULT_CERTIFICATES.map((cert) => (
                  <li key={cert.id}>
                    <span className="font-medium text-slate-900">{cert.title}</span>
                    <span className="text-slate-400"> · </span>
                    <span>{cert.category}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Core Stack */}
          <section>
            <h4 className="font-display text-sm font-bold text-slate-900 pb-2 border-b border-slate-200 mb-3">
              Technical Capabilities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              {PROFILE.skillGroups.map((group) => (
                <div key={group.category}>
                  <span className="font-semibold text-slate-900">{group.category}: </span>
                  <span>{group.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
