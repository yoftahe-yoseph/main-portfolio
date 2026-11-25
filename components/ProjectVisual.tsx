'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, FileText, ArrowRightLeft, Activity } from 'lucide-react';
import { PROJECT_SCREENSHOTS } from '@/lib/media';
import type { ProjectImageKey } from '@/lib/types';

interface ProjectVisualProps {
  imageKey: ProjectImageKey;
  alt: string;
  title: string;
  aspectClass?: string;
  priority?: boolean;
}

export default function ProjectVisual({
  imageKey,
  alt,
  title,
  aspectClass = 'aspect-[4/3]',
  priority = false,
}: ProjectVisualProps) {
  const screenshot = PROJECT_SCREENSHOTS[imageKey];

  if (screenshot) {
    if (screenshot.presentation === 'mobile') {
      return (
        <div
          className={`relative w-full ${aspectClass} overflow-hidden bg-slate-100/90 p-3 sm:p-4 flex items-center justify-center border-b border-slate-200/70`}
        >
          <div className="relative h-full aspect-[377/592] rounded-[1.15rem] overflow-hidden border border-slate-300/90 shadow-md bg-white transition-transform duration-300 ease-out group-hover:scale-[1.02]">
            <Image
              src={screenshot.src}
              alt={alt}
              fill
              sizes="(max-width: 768px) 220px, 280px"
              className="object-cover object-top"
              referrerPolicy="no-referrer"
              priority={priority}
            />
          </div>
        </div>
      );
    }

    return (
      <div
        className={`relative w-full ${aspectClass} overflow-hidden bg-slate-100/90 p-3 sm:p-4 flex items-center justify-center border-b border-slate-200/70`}
      >
        <div className="w-full max-h-full rounded-xl overflow-hidden border border-slate-300/80 shadow-sm bg-white transition-transform duration-300 ease-out group-hover:scale-[1.015]">
          <Image
            src={screenshot.src}
            alt={alt}
            width={screenshot.width}
            height={screenshot.height}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 45vw"
            className="w-full h-auto block"
            referrerPolicy="no-referrer"
            priority={priority}
          />
        </div>
      </div>
    );
  }

  // Architectural schematic frames for systems without live public UI captures
  if (imageKey === 'mesob_rbac') {
    return (
      <div
        className={`relative w-full ${aspectClass} overflow-hidden bg-slate-50 flex flex-col justify-between p-6 border-b border-slate-200/70`}
        aria-label={alt}
      >
        <div className="flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Mesob Center · Addis Ababa</span>
          <ShieldCheck className="w-4 h-4 text-blue-600" aria-hidden="true" />
        </div>

        <div className="my-auto py-4">
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-white border border-slate-200 rounded-lg py-3 px-2">
              <p className="text-[11px] font-mono text-slate-400">Agency A</p>
              <p className="text-xs font-semibold text-slate-800 mt-1">Contributor</p>
            </div>
            <div className="bg-blue-600 text-white rounded-lg py-3 px-2 shadow-xs">
              <p className="text-[11px] font-mono text-blue-100">RBAC Core</p>
              <p className="text-xs font-semibold mt-1">Policy Gate</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg py-3 px-2">
              <p className="text-[11px] font-mono text-slate-400">Agency B</p>
              <p className="text-xs font-semibold text-slate-800 mt-1">Reviewer</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
            <span>Scoped Access</span>
            <span aria-hidden="true">·</span>
            <span>Audit Trail</span>
            <span aria-hidden="true">·</span>
            <span>45-Day Ship</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 truncate">{title}</p>
      </div>
    );
  }

  if (imageKey === 'traffic_ai') {
    return (
      <div
        className={`relative w-full ${aspectClass} overflow-hidden bg-slate-50 flex flex-col justify-between p-6 border-b border-slate-200/70`}
        aria-label={alt}
      >
        <div className="flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Applied AI · Decision Support</span>
          <Activity className="w-4 h-4 text-blue-600" aria-hidden="true" />
        </div>

        <div className="my-auto py-4">
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-white border border-slate-200 rounded-lg py-3 px-2">
              <p className="text-[11px] font-mono text-slate-400">Corridor N/S</p>
              <p className="text-xs font-semibold text-slate-800 mt-1">Queue Density</p>
            </div>
            <div className="bg-blue-600 text-white rounded-lg py-3 px-2 shadow-xs">
              <p className="text-[11px] font-mono text-blue-100">Phase Engine</p>
              <p className="text-xs font-semibold mt-1">Adaptive Split</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg py-3 px-2">
              <p className="text-[11px] font-mono text-slate-400">Corridor E/W</p>
              <p className="text-xs font-semibold text-slate-800 mt-1">Signal Timing</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
            <span>Congestion Scoring</span>
            <span aria-hidden="true">·</span>
            <span>Priority Logic</span>
            <span aria-hidden="true">·</span>
            <span>Operator View</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 truncate">{title}</p>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${aspectClass} overflow-hidden bg-slate-50 flex flex-col justify-between p-6 border-b border-slate-200/70`}
      aria-label={alt}
    >
      <div className="flex items-center justify-between text-xs font-mono text-slate-500">
        <span>FastAPI · PyMuPDF · python-docx</span>
        <FileText className="w-4 h-4 text-blue-600" aria-hidden="true" />
      </div>

      <div className="my-auto py-4">
        <div className="flex items-center justify-center gap-3">
          <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-center min-w-[84px]">
            <p className="text-xs font-mono font-semibold text-slate-900">.PDF</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Parse</p>
          </div>
          <ArrowRightLeft className="w-4 h-4 text-blue-600 shrink-0" aria-hidden="true" />
          <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-center min-w-[84px]">
            <p className="text-xs font-mono font-semibold text-blue-600">FastAPI</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Pipeline</p>
          </div>
          <ArrowRightLeft className="w-4 h-4 text-blue-600 shrink-0" aria-hidden="true" />
          <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-center min-w-[84px]">
            <p className="text-xs font-mono font-semibold text-slate-900">.DOCX</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Export</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 truncate">{title}</p>
    </div>
  );
}
