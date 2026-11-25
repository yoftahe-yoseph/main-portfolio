'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { SiteProvider } from './SiteContext';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import CVModal from './CVModal';
import MapsQuotaBanner from './MapsQuotaBanner';
import PortfolioChatbot from './PortfolioChatbot';

export default function PortfolioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SiteProvider>
      <div className="min-h-screen flex flex-col bg-[#fafafb] text-slate-900">
        <MapsQuotaBanner />
        <SiteHeader />
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1"
        >
          {children}
        </motion.main>
        <SiteFooter />
        <CVModal />
        <PortfolioChatbot />
      </div>
    </SiteProvider>
  );
}
