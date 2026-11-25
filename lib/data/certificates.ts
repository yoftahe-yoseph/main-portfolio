import type { CertificateRecord } from '../types';

export const MESOB_INTERNSHIP_CERT_IMAGE =
  '/assets/aistudio/photo_2026-06-24_08-11-41_187ff6e2.jpg';

export const HARAMAYA_ENTREPRENEURSHIP_CERT_IMAGE =
  '/assets/aistudio/photo_2026-07-29_15-18-55_24309f35.jpg';

export const UDACITY_PROGRAMMING_CERT_IMAGE =
  '/assets/aistudio/image_48c5d022.png';

export const DEFAULT_CERTIFICATES: CertificateRecord[] = [
  {
    id: 'cert-mesob-it-internship',
    title: '45-Day IT Internship Certificate — Mesob Center',
    category: 'Internship Certificate',
    issuer: 'Mesob Center · Federal Civil Service Commission (Addis Ababa)',
    issueDate: '45-Day Internship',
    credentialId: 'MESOB One Stop Shopping Service',
    description:
      'Official Certificate of Participation awarded to Yoftah Yoseph in recognition of successfully completing a 45-day IT Internship at Mesob Center, demonstrating dedication, professionalism, and valuable technical contributions.',
    status: 'attached',
    slotLabel: 'Official Certificate Attached',
    notes:
      'Stamped by Federal Civil Service Commission — MESOB One Stop Shopping Service and signed by Anteneh Mamo, Director General at Mesob Center.',
    attachment: {
      type: 'file',
      fileName: 'Mesob-Center-45-Day-IT-Internship-Certificate.jpg',
      mimeType: 'image/jpeg',
      url: MESOB_INTERNSHIP_CERT_IMAGE,
      uploadedAt: '2026-06-24T08:11:41.000Z',
    },
    isDefault: true,
  },
  {
    id: 'cert-ai-fundamentals',
    title: 'Artificial Intelligence Fundamentals',
    category: 'Technical Certification',
    issuer: 'Udacity (Part of Accenture) · 5 Million Ethiopian Coders',
    issueDate: 'Nov 17, 2024',
    credentialId: 'ec0535a2-a4d7-11ef-b66c-93034f2cd658',
    description:
      'Verified Certificate of Nanodegree Program Completion covering core artificial intelligence concepts, machine learning workflows, evaluation principles, and applied deployment.',
    status: 'attached',
    slotLabel: 'Verified Udacity Certificate',
    notes:
      'Signed by Kai Roemmelt, CEO of Udacity. Independently verifiable via official Udacity credential link.',
    attachment: {
      type: 'url',
      url: 'https://www.udacity.com/certificate/e/ec0535a2-a4d7-11ef-b66c-93034f2cd658',
      uploadedAt: '2024-11-17T00:00:00.000Z',
    },
    verificationUrl:
      'https://www.udacity.com/certificate/e/ec0535a2-a4d7-11ef-b66c-93034f2cd658',
    certificateCard: {
      variant: 'udacity',
      heading: 'Artificial Intelligence Fundamentals',
      subheading: 'Verified Certificate of Nanodegree Program Completion',
      recipient: 'Yoftahe Yoseph',
      awardDate: 'November 17, 2024',
      signatories: ['Kai Roemmelt · CEO, Udacity'],
      footerNote: 'UDACITY · Part of Accenture',
    },
    isDefault: true,
  },
  {
    id: 'cert-android-fundamentals',
    title: 'Android Developer Fundamentals',
    category: 'Technical Certification',
    issuer: 'Udacity (Part of Accenture) · 5 Million Ethiopian Coders',
    issueDate: 'Nov 17, 2024',
    credentialId: 'e9af688e-a4de-11ef-8822-1b38df692a20',
    description:
      'Verified Certificate of Nanodegree Program Completion covering Android application architecture, responsive mobile UI layouts, activity lifecycle management, and data persistence.',
    status: 'attached',
    slotLabel: 'Verified Udacity Certificate',
    notes:
      'Signed by Kai Roemmelt, CEO of Udacity. Independently verifiable via official Udacity credential link.',
    attachment: {
      type: 'url',
      url: 'https://www.udacity.com/certificate/e/e9af688e-a4de-11ef-8822-1b38df692a20',
      uploadedAt: '2024-11-17T00:00:00.000Z',
    },
    verificationUrl:
      'https://www.udacity.com/certificate/e/e9af688e-a4de-11ef-8822-1b38df692a20',
    certificateCard: {
      variant: 'udacity',
      heading: 'Android Developer Fundamentals',
      subheading: 'Verified Certificate of Nanodegree Program Completion',
      recipient: 'Yoftahe Yoseph',
      awardDate: 'November 17, 2024',
      signatories: ['Kai Roemmelt · CEO, Udacity'],
      footerNote: 'UDACITY · Part of Accenture',
    },
    isDefault: true,
  },
  {
    id: 'cert-programming-fundamentals',
    title: 'Programming Fundamentals',
    category: 'Technical Certification',
    issuer: 'Udacity (Part of Accenture) · 5 Million Ethiopian Coders',
    issueDate: 'Apr 30, 2025',
    credentialId: '55f5cc76-25f0-11f0-9ead-efab39a6cbb6',
    description:
      'Verified Certificate of Nanodegree Program Completion spanning structured problem solving, data structures, control flow, and clean programming foundations.',
    status: 'attached',
    slotLabel: 'Official Certificate Attached',
    notes:
      'Awarded April 30, 2025 by Udacity (Part of Accenture). Independently verifiable via official Udacity credential link.',
    attachment: {
      type: 'file',
      fileName: 'Udacity-Programming-Fundamentals-Certificate.png',
      mimeType: 'image/png',
      url: UDACITY_PROGRAMMING_CERT_IMAGE,
      uploadedAt: '2025-04-30T00:00:00.000Z',
    },
    verificationUrl:
      'https://www.udacity.com/certificate/e/55f5cc76-25f0-11f0-9ead-efab39a6cbb6',
    isDefault: true,
  },
  {
    id: 'cert-data-analysis-fundamentals',
    title: 'Data Analysis Fundamentals',
    category: 'Technical Certification',
    issuer: 'Udacity (Part of Accenture) · 5 Million Ethiopian Coders',
    issueDate: 'Nov 23, 2024',
    credentialId: '99d485c4-a9ce-11ef-ac9e-93657eb30908',
    description:
      'Verified Certificate of Nanodegree Program Completion focused on data cleaning, exploratory analysis, structured interpretation, and decision-oriented analytical reporting.',
    status: 'attached',
    slotLabel: 'Verified Udacity Certificate',
    notes:
      'Signed by Kai Roemmelt, CEO of Udacity. Independently verifiable via official Udacity credential link.',
    attachment: {
      type: 'url',
      url: 'https://www.udacity.com/certificate/e/99d485c4-a9ce-11ef-ac9e-93657eb30908',
      uploadedAt: '2024-11-23T00:00:00.000Z',
    },
    verificationUrl:
      'https://www.udacity.com/certificate/e/99d485c4-a9ce-11ef-ac9e-93657eb30908',
    certificateCard: {
      variant: 'udacity',
      heading: 'Data Analysis Fundamentals',
      subheading: 'Verified Certificate of Nanodegree Program Completion',
      recipient: 'Yoftahe Yoseph',
      awardDate: 'November 23, 2024',
      signatories: ['Kai Roemmelt · CEO, Udacity'],
      footerNote: 'UDACITY · Part of Accenture',
    },
    isDefault: true,
  },
  {
    id: 'cert-entrepreneurship-training',
    title: 'Entrepreneurship Training & Business Model Canvas',
    category: 'Entrepreneurship & Leadership',
    issuer: 'Haramaya University — Innovative & Business Idea Competition',
    issueDate: 'Apr 3, 2026',
    credentialId: 'Haramaya Univ. Incubation & Research',
    description:
      'Certificate of Completion for fulfilling all requirements of Entrepreneurship Training (Dec 27–28, 2025) and Business Model Canvas (Feb 2–4, 2026) under the Innovative and Business Idea Competition.',
    status: 'attached',
    slotLabel: 'Official Certificate Attached',
    notes:
      'Signed by Kidesena Sebesibe (Director for Entrepreneurship & Technology Incubation) and Dr. Yesihak Yusuf (Vice President for Research & Community Engagement), Haramaya University.',
    attachment: {
      type: 'file',
      fileName: 'Haramaya-University-Entrepreneurship-Certificate.jpg',
      mimeType: 'image/jpeg',
      url: HARAMAYA_ENTREPRENEURSHIP_CERT_IMAGE,
      uploadedAt: '2026-04-03T00:00:00.000Z',
    },
    isDefault: true,
  },
  {
    id: 'cred-haramaya-tech-organizer',
    title: 'Organizer — Cursor Hackathon East Ethiopia 2026',
    category: 'Community Credential',
    issuer: 'Cursor Hackathon East Ethiopia · Tech Events Organizer',
    issueDate: 'Mar 28, 2026',
    credentialId: 'Event Held March 27–28, 2026',
    description:
      'Certificate of Appreciation recognizing exceptional commitment, planning, and leadership as an Organizer of the Cursor Hackathon East Ethiopia 2026 alongside campus technology event programming.',
    status: 'attached',
    slotLabel: 'Verified Organizer Credential',
    notes:
      'Awarded on March 28, 2026 and signed by Alpha Lencho, Cursor Ambassador.',
    attachment: {
      type: 'file',
      fileName: 'Cursor-Hackathon-East-Ethiopia-2026-Organizer.png',
      uploadedAt: '2026-03-28T00:00:00.000Z',
    },
    certificateCard: {
      variant: 'cursor-hackathon',
      heading: 'Cursor Hackathon East Ethiopia 2026',
      subheading: 'Certificate of Appreciation · Organizer',
      recipient: 'Yoftahe Yoseph',
      awardDate: 'March 28, 2026',
      programLines: ['Organizer · Held March 27–28, 2026'],
      signatories: ['Alpha Lencho · Cursor Ambassador'],
      footerNote: 'East Ethiopia Hackathon Organizing Committee',
    },
    isDefault: true,
  },
];
