'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, ExternalLink, X } from 'lucide-react';
import {
  MAPS_QUOTA_DOCS_URL,
  MAPS_QUOTA_EVENT,
  isMapsQuotaError,
} from '@/lib/maps-utils';

declare global {
  interface Window {
    gm_authFailure?: () => void;
  }
}

export default function MapsQuotaBanner() {
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const dispatchQuotaEvent = () => {
      window.dispatchEvent(new CustomEvent(MAPS_QUOTA_EVENT));
    };

    const handleQuotaEvent = () => {
      setQuotaExceeded(true);
      setDismissed(false);
    };

    window.addEventListener(MAPS_QUOTA_EVENT, handleQuotaEvent);

    // Tier 1a: Global Google Maps JS SDK auth/quota failure hook
    const previousAuthFailure = window.gm_authFailure;
    window.gm_authFailure = () => {
      dispatchQuotaEvent();
      if (typeof previousAuthFailure === 'function') {
        previousAuthFailure();
      }
    };

    // Tier 1b: Lightweight console.error tap for OverQuotaMapError / QuotaExceededError
    const originalConsoleError = console.error;
    console.error = (...args: unknown[]) => {
      try {
        const joined = args
          .map((arg) => (arg instanceof Error ? arg.message : String(arg)))
          .join(' ');
        if (isMapsQuotaError(joined)) {
          dispatchQuotaEvent();
        }
      } catch {
        // Ignore inspection failures
      }
      originalConsoleError.apply(console, args);
    };

    return () => {
      window.removeEventListener(MAPS_QUOTA_EVENT, handleQuotaEvent);
      window.gm_authFailure = previousAuthFailure;
      console.error = originalConsoleError;
    };
  }, []);

  if (!quotaExceeded || dismissed) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="sticky top-0 z-50 w-full bg-amber-50 border-b border-amber-200 px-4 py-3 text-amber-950"
    >
      <div className="max-w-6xl mx-auto flex items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-start sm:items-center gap-2.5">
          <AlertTriangle
            className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0"
            aria-hidden="true"
          />
          <p className="leading-relaxed">
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href={MAPS_QUOTA_DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-amber-950 underline underline-offset-2 hover:text-amber-800"
            >
              <span>maps developer site</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>{' '}
            for instructions to update your account.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss Google Maps quota notice"
          className="p-1 rounded-md text-amber-800 hover:bg-amber-100 transition-colors shrink-0"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
