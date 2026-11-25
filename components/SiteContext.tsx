'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface SiteContextValue {
  cvOpen: boolean;
  openCvModal: () => void;
  closeCvModal: () => void;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [cvOpen, setCvOpen] = useState(false);

  const openCvModal = useCallback(() => setCvOpen(true), []);
  const closeCvModal = useCallback(() => setCvOpen(false), []);

  return (
    <SiteContext.Provider value={{ cvOpen, openCvModal, closeCvModal }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error('useSite must be used inside SiteProvider');
  }
  return ctx;
}
