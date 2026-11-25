'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import { useSite } from './SiteContext';

interface OpenCvButtonProps {
  label?: string;
  variant?: 'secondary' | 'link';
}

export default function OpenCvButton({
  label = 'Preview CV',
  variant = 'secondary',
}: OpenCvButtonProps) {
  const { openCvModal } = useSite();

  if (variant === 'link') {
    return (
      <button
        type="button"
        onClick={openCvModal}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer whitespace-nowrap"
      >
        <FileText className="w-4 h-4" aria-hidden="true" />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openCvModal}
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer whitespace-nowrap"
    >
      <FileText className="w-4 h-4 text-slate-600" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
