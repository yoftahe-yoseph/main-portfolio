import type { ContactFormPayload } from './types';

export const ALLOWED_CERTIFICATE_MIME_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
]);

export const MAX_CERTIFICATE_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_INQUIRY_TYPES = new Set<ContactFormPayload['inquiryType']>([
  'Engineering Role',
  'Project Collaboration',
  'Research & QA',
  'Speaking & Community',
]);

export interface ValidationResult<T> {
  valid: boolean;
  data?: T;
  errors: Record<string, string>;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateSafeHttpUrl(rawUrl: string): { valid: boolean; normalized?: string; error?: string } {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { valid: false, error: 'Please enter a credential URL.' };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return {
        valid: false,
        error: 'Only http:// and https:// URLs are permitted.',
      };
    }
    return { valid: true, normalized: parsed.toString() };
  } catch {
    return {
      valid: false,
      error: 'Please enter a valid web URL starting with https://.',
    };
  }
}

export function validateCertificateFileMeta(
  fileName: string,
  mimeType: string,
  byteSize: number
): { valid: boolean; error?: string } {
  if (!fileName || !fileName.trim()) {
    return { valid: false, error: 'File name is required.' };
  }
  if (!ALLOWED_CERTIFICATE_MIME_TYPES.has(mimeType)) {
    return {
      valid: false,
      error: 'Unsupported file format. Upload a PDF, PNG, JPG, or WebP file.',
    };
  }
  if (byteSize <= 0) {
    return { valid: false, error: 'The selected file is empty.' };
  }
  if (byteSize > MAX_CERTIFICATE_FILE_BYTES) {
    return {
      valid: false,
      error: 'File size exceeds the 5 MB limit.',
    };
  }
  return { valid: true };
}

export function extensionForMimeType(mimeType: string): string {
  switch (mimeType) {
    case 'application/pdf':
      return '.pdf';
    case 'image/png':
      return '.png';
    case 'image/jpeg':
      return '.jpg';
    case 'image/webp':
      return '.webp';
    default:
      return '';
  }
}

export function mimeTypeForStoredFile(fileName: string): string | null {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  return null;
}

export function sanitizeStoredFileName(input: string): string {
  return input.replace(/[^a-zA-Z0-9._-]/g, '');
}

export function validateContactForm(input: Partial<ContactFormPayload>): ValidationResult<ContactFormPayload> {
  const errors: Record<string, string> = {};

  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const inquiryType =
    typeof input.inquiryType === 'string' && ALLOWED_INQUIRY_TYPES.has(input.inquiryType as ContactFormPayload['inquiryType'])
      ? (input.inquiryType as ContactFormPayload['inquiryType'])
      : null;
  const subject = typeof input.subject === 'string' ? input.subject.trim() : '';
  const message = typeof input.message === 'string' ? input.message.trim() : '';
  const website = typeof input.website === 'string' ? input.website.trim() : '';

  if (name.length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  } else if (name.length > 120) {
    errors.name = 'Name must be 120 characters or fewer.';
  }

  if (!email) {
    errors.email = 'Please enter your email address.';
  } else if (!EMAIL_PATTERN.test(email) || email.length > 180) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!inquiryType) {
    errors.inquiryType = 'Please choose an inquiry category.';
  }

  if (subject.length < 3) {
    errors.subject = 'Please provide a brief subject (at least 3 characters).';
  } else if (subject.length > 160) {
    errors.subject = 'Subject must be 160 characters or fewer.';
  }

  if (message.length < 15) {
    errors.message = 'Please share at least 15 characters so I have enough context to reply.';
  } else if (message.length > 3000) {
    errors.message = 'Message must be 3,000 characters or fewer.';
  }

  if (Object.keys(errors).length > 0 || !inquiryType) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    data: {
      name,
      email,
      inquiryType,
      subject,
      message,
      website,
    },
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
