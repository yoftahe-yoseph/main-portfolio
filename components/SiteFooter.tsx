'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PROFILE } from '@/lib/data/profile';
import { useSite } from './SiteContext';
import SocialLinksList from './SocialLinksList';

export default function SiteFooter() {
  const { openCvModal } = useSite();

  return (
    <footer className="border-t border-slate-200 bg-white mt-24 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-100">
          <div className="md:col-span-5">
            <p className="font-display text-base font-bold text-slate-900">
              {PROFILE.name}
            </p>
            <p className="mt-2 text-sm text-slate-600 max-w-sm leading-relaxed">
              B.Sc. Computer Science (Distinction). Full-stack web engineer, AI &amp; healthcare research contributor, and former Head of HUCISA.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              {PROFILE.location}
            </p>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-xs font-semibold text-slate-900 tracking-tight mb-3">
              Navigation
            </h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-blue-600 transition-colors">
                  Projects &amp; Case Studies
                </Link>
              </li>
              <li>
                <Link href="/credentials" className="hover:text-blue-600 transition-colors">
                  Experience &amp; Certificates Vault
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors">
                  About &amp; Leadership
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-5">
            <div>
              <h2 className="text-xs font-semibold text-slate-900 tracking-tight mb-3">
                Direct Links
              </h2>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {PROFILE.email}
                  </a>
                </li>
                <li>
                  <a
                    href={PROFILE.portfolioDomain}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    <span>yoftu.netlify.app</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={openCvModal}
                    className="text-left text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
                  >
                    Preview &amp; Download CV
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-semibold text-slate-900 tracking-tight mb-2.5">
                Social &amp; Messaging
              </h2>
              <SocialLinksList variant="compact" />
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {PROFILE.name}. All rights reserved.</p>
          <p>Built with Next.js, TypeScript, and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
