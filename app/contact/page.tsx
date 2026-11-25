import React from 'react';
import type { Metadata } from 'next';
import { ArrowUpRight, Mail, Globe, MapPin } from 'lucide-react';
import { PROFILE } from '@/lib/data/profile';
import { PROJECTS } from '@/lib/data/projects';
import ContactForm from '@/components/ContactForm';
import OpenCvButton from '@/components/OpenCvButton';
import ProfilePortrait from '@/components/ProfilePortrait';
import PortfolioLocationMap from '@/components/PortfolioLocationMap';
import SocialLinksList from '@/components/SocialLinksList';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact — Yoftahe Yoseph',
  description:
    'Get in touch with Yoftahe Yoseph regarding full-stack engineering roles, healthcare research & QA testing, or collaborative software projects.',
};

export default function ContactPage() {
  const liveProjects = PROJECTS.filter((p) => Boolean(p.liveUrl));
  const mapsApiKey = (
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.VITE_GOOGLE_MAPS_API_KEY ||
    ''
  ).trim();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <header className="max-w-3xl mb-12">
        <p className="text-xs sm:text-sm font-medium text-blue-600">Contact &amp; Inquiries</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
          Let&apos;s build something dependable together.
        </h1>
        <p className="mt-4 text-base text-slate-600 leading-relaxed">
          Reach out for full-stack software engineering roles, institutional web platforms, healthcare research and QA collaborations, or technology education initiatives.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

        <aside className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <ProfilePortrait
                variant="headshot"
                className="w-14 h-14 rounded-xl border border-slate-200/80 shrink-0"
              />
              <div className="min-w-0">
                <h2 className="font-display text-base font-bold text-slate-900 tracking-tight">
                  {PROFILE.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct Channels &amp; Availability
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-600 mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="font-medium text-slate-900 hover:text-blue-600 transition-colors break-all"
                  >
                    {PROFILE.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-blue-600 mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-slate-500">Portfolio Domain</p>
                  <a
                    href={PROFILE.portfolioDomain}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    <span>yoftu.netlify.app</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-600 mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-slate-500">Location &amp; Availability</p>
                  <p className="font-medium text-slate-900">{PROFILE.location}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <p className="text-xs font-semibold text-slate-700">Social &amp; Messaging</p>
              <SocialLinksList variant="cards" />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <OpenCvButton label="Preview & Download CV" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7">
            <h2 className="font-display text-base font-bold text-slate-900 tracking-tight">
              Live Deployed Systems
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Explore publicly accessible production deployments
            </p>

            <ul className="mt-4 space-y-3 text-sm">
              {liveProjects.map((project) => (
                <li key={project.id} className="pb-3 border-b border-slate-100 last:border-b-0 last:pb-0">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-2 text-slate-800 hover:text-blue-600 transition-colors"
                  >
                    <span className="font-medium">{project.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" aria-hidden="true" />
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{project.liveUrl}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <div className="mt-12">
        <PortfolioLocationMap apiKey={mapsApiKey} />
      </div>
    </div>
  );
}
