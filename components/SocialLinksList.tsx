import React from 'react';
import { ArrowUpRight, Github, Instagram, MessageCircle, Send } from 'lucide-react';
import { PROFILE } from '@/lib/data/profile';

type SocialId = (typeof PROFILE.socialLinks)[number]['id'];

function SocialIcon({ id, className }: { id: SocialId; className?: string }) {
  switch (id) {
    case 'github':
      return <Github className={className} aria-hidden="true" />;
    case 'telegram':
      return <Send className={className} aria-hidden="true" />;
    case 'whatsapp':
      return <MessageCircle className={className} aria-hidden="true" />;
    case 'instagram':
      return <Instagram className={className} aria-hidden="true" />;
  }
}

interface SocialLinksListProps {
  variant?: 'cards' | 'compact';
}

export default function SocialLinksList({ variant = 'cards' }: SocialLinksListProps) {
  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center gap-2" aria-label="Social and messaging channels">
        {PROFILE.socialLinks.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${item.platform} (${item.handle})`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 transition-colors"
          >
            <SocialIcon id={item.id} className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{item.platform}</span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" aria-label="Social and messaging channels">
      {PROFILE.socialLinks.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Connect on ${item.platform} (${item.handle})`}
          className="group flex items-center justify-between gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-lg bg-white border border-slate-200/90 flex items-center justify-center text-slate-700 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors shrink-0">
              <SocialIcon id={item.id} className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                {item.platform}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{item.handle}</p>
            </div>
          </div>
          <ArrowUpRight
            className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 transition-colors"
            aria-hidden="true"
          />
        </a>
      ))}
    </div>
  );
}
