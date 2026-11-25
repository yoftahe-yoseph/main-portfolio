'use client';

import React from 'react';
import Image from 'next/image';
import { Award, ShieldCheck } from 'lucide-react';
import type { CertificateRecord } from '@/lib/types';

interface CertificatePreviewFrameProps {
  certificate: CertificateRecord;
  size?: 'card' | 'modal';
}

export function hasRealCertificateImage(cert: CertificateRecord): boolean {
  const url = cert.attachment?.url;
  if (!url) return false;
  if (cert.attachment?.mimeType?.startsWith('image/')) return true;
  return /\.(png|jpe?g|webp)$/i.test(url);
}

export function hasVisualCertificatePreview(cert: CertificateRecord): boolean {
  return cert.status === 'attached' && (hasRealCertificateImage(cert) || Boolean(cert.certificateCard));
}

function isStaticPublicAsset(url: string): boolean {
  return url.startsWith('/assets/');
}

export default function CertificatePreviewFrame({
  certificate,
  size = 'card',
}: CertificatePreviewFrameProps) {
  const attachmentUrl = certificate.attachment?.url || '';
  const hasRealPhoto = hasRealCertificateImage(certificate);
  const isModal = size === 'modal';

  if (hasRealPhoto && attachmentUrl) {
    const isWideDigitalPng =
      certificate.attachment?.mimeType === 'image/png' || /\.png$/i.test(attachmentUrl);
    return (
      <div
        className={`relative w-full aspect-[4/3] overflow-hidden ${
          isWideDigitalPng ? 'bg-[#f8fafc]' : 'bg-slate-50'
        }`}
      >
        {isStaticPublicAsset(attachmentUrl) ? (
          <Image
            src={attachmentUrl}
            alt={`Official certificate photo for ${certificate.title}`}
            fill
            sizes={isModal ? '(max-width: 1024px) 95vw, 860px' : '(max-width: 768px) 100vw, 45vw'}
            referrerPolicy="no-referrer"
            className={
              isModal || isWideDigitalPng
                ? 'object-contain p-2 transition-transform duration-300 group-hover:scale-[1.01]'
                : 'object-cover transition-transform duration-300 group-hover:scale-[1.02]'
            }
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={attachmentUrl}
            alt={`Official certificate photo for ${certificate.title}`}
            className="w-full h-full object-contain bg-slate-50"
          />
        )}
      </div>
    );
  }

  const card = certificate.certificateCard;
  if (!card) return null;

  if (card.variant === 'udacity') {
    return (
      <div
        className={`relative w-full aspect-[4/3] bg-[#1a224d] ${
          isModal ? 'p-4 sm:p-6' : 'p-2.5 sm:p-3'
        } flex`}
      >
        <div
          className={`w-full h-full bg-[#f7f8fb] rounded-sm ${
            isModal ? 'p-6 sm:p-10' : 'p-4 sm:p-5'
          } flex flex-col justify-between text-left border border-slate-200/80`}
        >
          <div className="flex items-center justify-between gap-3">
            <span
              className={`font-mono tracking-wider uppercase font-semibold text-[#1a224d] ${
                isModal ? 'text-xs' : 'text-[10px]'
              }`}
            >
              5 Million Ethiopian Coders · Verified
            </span>
            <ShieldCheck
              className={`${isModal ? 'w-5 h-5' : 'w-4 h-4'} text-blue-600 shrink-0`}
              aria-hidden="true"
            />
          </div>

          <div className="my-auto py-1">
            <p className={`text-slate-500 ${isModal ? 'text-xs sm:text-sm' : 'text-[10px]'}`}>
              {card.subheading}
            </p>
            <p
              className={`mt-1 font-display font-bold text-slate-950 tracking-tight leading-tight ${
                isModal ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg'
              }`}
            >
              {card.heading}
            </p>
            <p className={`mt-2 text-slate-500 ${isModal ? 'text-xs' : 'text-[9px]'}`}>
              Awarded to
            </p>
            <p
              className={`font-display font-bold text-[#14378b] leading-tight ${
                isModal ? 'text-xl sm:text-2xl mt-0.5' : 'text-sm sm:text-base'
              }`}
            >
              {card.recipient}
            </p>
            <p
              className={`font-mono text-slate-600 tabular-nums ${
                isModal ? 'text-xs mt-1.5' : 'text-[10px] mt-0.5'
              }`}
            >
              {card.awardDate}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200/80 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p
                className={`font-display font-bold tracking-wider text-slate-900 ${
                  isModal ? 'text-sm' : 'text-[11px]'
                }`}
              >
                UDACITY
              </p>
              <p className={`text-slate-500 truncate ${isModal ? 'text-[11px]' : 'text-[9px]'}`}>
                Part of Accenture · ID: {certificate.credentialId}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className={`font-semibold text-slate-900 ${isModal ? 'text-xs' : 'text-[10px]'}`}>
                Kai Roemmelt
              </p>
              <p className={`text-slate-500 ${isModal ? 'text-[11px]' : 'text-[9px]'}`}>
                CEO, Udacity
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // cursor-hackathon variant
  return (
    <div
      className={`relative w-full aspect-[4/3] bg-[#06090a] ${
        isModal ? 'p-4 sm:p-6' : 'p-2.5 sm:p-3'
      } flex`}
    >
      <div
        className={`w-full h-full border border-emerald-400/70 bg-gradient-to-br from-[#071411] via-[#050809] to-[#081b16] ${
          isModal ? 'p-6 sm:p-9' : 'p-4'
        } flex flex-col justify-between text-center`}
      >
        <div className="flex flex-col items-center">
          <Award
            className={`${isModal ? 'w-6 h-6' : 'w-4 h-4'} text-emerald-300`}
            aria-hidden="true"
          />
          <p
            className={`mt-1.5 font-display font-bold tracking-wider uppercase text-emerald-300 leading-tight ${
              isModal ? 'text-xl sm:text-2xl' : 'text-xs sm:text-sm'
            }`}
          >
            Cursor Hackathon East Ethiopia 2026
          </p>
          <p
            className={`mt-1 tracking-widest uppercase text-slate-200 ${
              isModal ? 'text-xs' : 'text-[9px]'
            }`}
          >
            Certificate of Appreciation
          </p>
        </div>

        <div className="my-auto py-1">
          <p className={`text-slate-400 ${isModal ? 'text-xs' : 'text-[9px]'}`}>
            This certificate is awarded to
          </p>
          <p
            className={`mt-1 font-display font-semibold text-white pb-1 border-b border-emerald-400/60 inline-block px-4 ${
              isModal ? 'text-xl sm:text-2xl' : 'text-sm sm:text-base'
            }`}
          >
            {card.recipient}
          </p>
          <p
            className={`mt-2 text-slate-300 max-w-md mx-auto leading-relaxed ${
              isModal ? 'text-xs sm:text-sm' : 'text-[10px]'
            }`}
          >
            Organizer · Cursor Hackathon East Ethiopia 2026 (March 27–28, 2026)
          </p>
        </div>

        <div className="pt-2 border-t border-emerald-500/20 flex items-end justify-between gap-3 text-left">
          <p className={`text-slate-300 font-mono tabular-nums ${isModal ? 'text-xs' : 'text-[9px]'}`}>
            Awarded: {card.awardDate}
          </p>
          <div className="text-right">
            <p className={`font-semibold text-white ${isModal ? 'text-xs' : 'text-[10px]'}`}>
              Alpha Lencho
            </p>
            <p className={`text-emerald-300/90 ${isModal ? 'text-[11px]' : 'text-[9px]'}`}>
              Cursor Ambassador
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
