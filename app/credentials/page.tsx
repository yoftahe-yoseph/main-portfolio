import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Award, ExternalLink, ArrowDown } from 'lucide-react';
import { EXPERIENCE, LEADERSHIP_ROLES } from '@/lib/data/profile';
import { readCertificates } from '@/lib/server-store';
import CertificatesVault from '@/components/CertificatesVault';
import OpenCvButton from '@/components/OpenCvButton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Experience & Certifications — Yoftahe Yoseph',
  description:
    'Career experience, Mesob Center internship, US healthcare research and QA evaluation, leadership roles, and interactive Certificates Vault.',
};

export default async function CredentialsPage() {
  const initialCertificates = await readCertificates();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 border-b border-slate-200">
        <div className="max-w-3xl">
          <p className="text-xs sm:text-sm font-medium text-blue-600">
            Experience, Leadership &amp; Verification
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            Track record across engineering, research, and technical leadership.
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            A structured record of institutional software delivery, remote healthcare research &amp; QA evaluation, campus technology leadership, and a live Certificates Vault ready for credential proof attachments.
          </p>
        </div>

        <OpenCvButton label="Preview & Download CV" />
      </header>

      {/* Experience Timeline */}
      <section aria-labelledby="experience-history-heading">
        <div className="mb-8">
          <p className="text-xs font-medium text-blue-600">Professional History</p>
          <h2
            id="experience-history-heading"
            className="mt-1 font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
          >
            Engineering &amp; Research Experience
          </h2>
        </div>

        <div className="space-y-6">
          {EXPERIENCE.map((item) => (
            <article
              key={item.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4">
                  <p className="text-xs font-mono text-blue-600 font-medium tabular-nums">
                    {item.period}
                  </p>
                  <h3 className="mt-1.5 font-display text-lg font-bold text-slate-900 tracking-tight">
                    {item.role}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {item.organization}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.location} <span aria-hidden="true">·</span> {item.engagement}
                  </p>
                </div>

                <div className="lg:col-span-8">
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {item.summary}
                  </p>

                  <ul className="mt-4 space-y-2 text-sm text-slate-600 list-disc pl-5">
                    {item.highlights.map((bullet) => (
                      <li key={bullet} className="leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500">
                    Focus Areas: <span className="text-slate-700">{item.technologies.join(' · ')}</span>
                  </p>

                  {item.certificate && (
                    <div className="mt-5 p-4 rounded-xl border border-slate-200/90 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center gap-4">
                      <a
                        href={item.certificate.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative w-full sm:w-32 aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0 block group"
                        aria-label={`Open full photo of ${item.certificate.title}`}
                      >
                        <Image
                          src={item.certificate.imageUrl}
                          alt={item.certificate.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 128px"
                          referrerPolicy="no-referrer"
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </a>

                      <div className="min-w-0 flex-1">
                        <p className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600">
                          <Award className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>Verified Internship Certificate</span>
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {item.certificate.title}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                          {item.certificate.issuer}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <a
                            href={item.certificate.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <span>Open Certificate Photo</span>
                            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                          </a>
                          <span className="text-slate-300" aria-hidden="true">·</span>
                          <a
                            href={item.certificate.vaultAnchor}
                            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                          >
                            <span>Inspect in Vault</span>
                            <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Leadership & Civic Impact */}
      <section aria-labelledby="leadership-roles-heading">
        <div className="mb-8">
          <p className="text-xs font-medium text-blue-600">Community &amp; Governance</p>
          <h2
            id="leadership-roles-heading"
            className="mt-1 font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
          >
            Leadership &amp; Youth Network Roles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LEADERSHIP_ROLES.map((role) => (
            <article
              key={role.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col"
            >
              <p className="text-xs text-slate-500">
                {role.scope} <span aria-hidden="true">·</span> {role.period}
              </p>
              <h3 className="mt-2 font-display text-lg font-bold text-slate-900 tracking-tight">
                {role.role}
              </h3>
              <p className="mt-1 text-xs font-medium text-blue-600">{role.organization}</p>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{role.description}</p>

              <ul className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600 list-disc pl-4">
                {role.outcomes.map((outcome) => (
                  <li key={outcome} className="leading-relaxed">
                    {outcome}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Interactive Certificates Vault */}
      <CertificatesVault initialCertificates={initialCertificates} />
    </div>
  );
}
