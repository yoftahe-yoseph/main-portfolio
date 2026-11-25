export type ProjectCategory = 'Full-Stack' | 'Healthcare & Gov' | 'AI & Tooling';

export type ProjectImageKey =
  | 'hospital_hms'
  | 'menuvista_qr'
  | 'affin_marketplace'
  | 'mesob_rbac'
  | 'traffic_ai'
  | 'convertify_pdf';

export interface ProjectArchitectureNote {
  layer: string;
  detail: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  year: string;
  role: string;
  featured: boolean;
  summary: string;
  challenge: string;
  solution: string;
  impact: string;
  techStack: string[];
  deliverables: string[];
  architecture: ProjectArchitectureNote[];
  liveUrl?: string;
  repoUrl?: string;
  imageKey: ProjectImageKey;
  imageAlt: string;
  statusLabel: string;
  certificate?: {
    title: string;
    issuer: string;
    signatory: string;
    imageUrl: string;
    downloadName: string;
    vaultHref: string;
  };
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  engagement: string;
  summary: string;
  highlights: string[];
  technologies: string[];
  certificate?: {
    title: string;
    issuer: string;
    imageUrl: string;
    downloadName: string;
    vaultAnchor: string;
  };
}

export interface LeadershipRole {
  id: string;
  role: string;
  organization: string;
  scope: string;
  period: string;
  description: string;
  outcomes: string[];
}

export type CertificateStatus = 'pending' | 'attached';

export interface CertificateAttachment {
  type: 'file' | 'url';
  fileName?: string;
  storedFileName?: string;
  mimeType?: string;
  fileSize?: number;
  url?: string;
  uploadedAt: string;
}

export interface CertificateCardMetadata {
  variant: 'udacity' | 'cursor-hackathon';
  heading: string;
  subheading: string;
  recipient: string;
  awardDate: string;
  programLines?: string[];
  signatories: string[];
  footerNote?: string;
}

export interface CertificateRecord {
  id: string;
  title: string;
  category:
    | 'Internship Certificate'
    | 'Technical Certification'
    | 'Entrepreneurship & Leadership'
    | 'Community Credential';
  issuer: string;
  issueDate: string;
  credentialId: string;
  description: string;
  status: CertificateStatus;
  slotLabel: string;
  notes: string;
  attachment: CertificateAttachment | null;
  verificationUrl?: string;
  certificateCard?: CertificateCardMetadata;
  isDefault: boolean;
}

export interface ContactFormPayload {
  name: string;
  email: string;
  inquiryType: 'Engineering Role' | 'Project Collaboration' | 'Research & QA' | 'Speaking & Community';
  subject: string;
  message: string;
  website?: string;
}

export interface ContactSubmission extends Omit<ContactFormPayload, 'website'> {
  id: string;
  submittedAt: string;
}
