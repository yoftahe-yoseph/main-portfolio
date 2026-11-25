'use client';

import React from 'react';
import Image from 'next/image';
import { PROFILE_PORTRAIT } from '@/lib/media';

interface ProfilePortraitProps {
  variant: 'editorial' | 'headshot';
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export default function ProfilePortrait({
  variant,
  className = '',
  priority = false,
  sizes,
}: ProfilePortraitProps) {
  const isEditorial = variant === 'editorial';

  return (
    <div
      className={`relative overflow-hidden bg-[#e5e5e3] ${className}`}
    >
      <Image
        src={PROFILE_PORTRAIT.src}
        alt={PROFILE_PORTRAIT.alt}
        fill
        sizes={
          sizes ||
          (isEditorial
            ? '(max-width: 1024px) 100vw, 42vw'
            : '(max-width: 768px) 96px, 112px')
        }
        className={
          isEditorial
            ? 'object-cover object-[47%_11%] scale-[1.48] origin-[47%_11%]'
            : 'object-cover object-[47%_11%] scale-[1.92] origin-[47%_12%]'
        }
        referrerPolicy="no-referrer"
        priority={priority}
      />
    </div>
  );
}
