import type { ProjectImageKey } from './types';

export const PROFILE_PORTRAIT = {
  src: '/assets/aistudio/EVER1422_e144e82b.JPG',
  width: 4480,
  height: 6720,
  alt: 'Yoftahe Yoseph, Computer Science graduate and full-stack software engineer',
} as const;

export interface ProjectScreenshotMeta {
  src: string;
  width: number;
  height: number;
  presentation: 'desktop' | 'mobile';
}

export const PROJECT_SCREENSHOTS: Partial<Record<ProjectImageKey, ProjectScreenshotMeta>> = {
  hospital_hms: {
    src: '/assets/aistudio/Screenshot_2026-11-22_192614_69ca21ab.png',
    width: 1333,
    height: 623,
    presentation: 'desktop',
  },
  menuvista_qr: {
    src: '/assets/aistudio/Screenshot_2026-11-22_192843_2fb52448.png',
    width: 1342,
    height: 634,
    presentation: 'desktop',
  },
  affin_marketplace: {
    src: '/assets/aistudio/Screenshot_2026-11-22_193040_2b613936.png',
    width: 377,
    height: 592,
    presentation: 'mobile',
  },
};
